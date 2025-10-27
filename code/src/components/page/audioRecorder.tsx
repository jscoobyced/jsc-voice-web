import React, { useEffect, useRef, useState } from 'react'
import AudioSocket from '../../service/audioWebSocket'
import { playBuffer } from '../../service/playAudio'
import Recorder from '../../service/recorder'
import CustomButton from '../elements/CustomButton'
import CustomContent from '../elements/CustomContent'

interface StoryResponse {
  type: string
  content: string
}

const SPEAKING_VOLUME = 190
const TOTAL_SPEAK_TIME = 10000
const TOTAL_SILENT_TIME = 3000
const START_PLAYING = 'Start playing'
const STOP_PLAYING = 'Stop playing'

const AudioRecorder: React.FC = () => {
  const [tellerMessage, setTellerMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [connect, setConnect] = useState(START_PLAYING)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCurrentlyRecording, setIsCurrentlyRecording] = useState(false)
  const [audioSocketService] = useState(new AudioSocket())
  const recorder = useRef(new Recorder())

  const updateMessage = (data: any) => {
    if (typeof data === 'string') {
      const response = JSON.parse(data) as StoryResponse
      if (response.type === 'teller') setTellerMessage(response.content)
      if (response.type === 'user') setUserMessage(response.content)
    } else {
      const blob = new Blob([data], { type: 'audio/wav' })
      playBuffer(blob, async () => await startRecord(true, false))
    }
  }

  const updateVolume = (
    isSpeaking = false,
    startTime = 0,
    startSpeakTime = 0,
    hasSpoken = false,
  ) => {
    const currentTime = new Date().getTime()
    if (
      currentTime - startTime >= TOTAL_SPEAK_TIME ||
      (!isSpeaking && currentTime - startSpeakTime > TOTAL_SILENT_TIME)
    ) {
      stopRecording(hasSpoken)
      return
    }
    const volume = recorder.current.getVolume()
    const newIsSpeaking = volume > SPEAKING_VOLUME
    const newHasSpoken = hasSpoken || newIsSpeaking
    const newStartSpeakTime = isSpeaking ? currentTime : startSpeakTime
    setTimeout(() => {
      updateVolume(newIsSpeaking, startTime, newStartSpeakTime, newHasSpoken)
    }, 50)
  }

  useEffect(() => {
    if (isCurrentlyRecording) {
      const currentTime = new Date().getTime()
      updateVolume(false, currentTime, currentTime)
    }
  }, [isCurrentlyRecording])

  const startRecord = async (
    isCurrentlyConnected = false,
    isCurrentlyPlaying = false,
  ) => {
    if (isCurrentlyConnected && !isCurrentlyPlaying) {
      setIsPlaying(true)
      await recorder.current.startRecording()
      setIsCurrentlyRecording(true)
    }
  }

  const stopRecording = (hasSpoken: boolean) => {
    setIsCurrentlyRecording(false)
    recorder.current.stopRecording(hasSpoken)
    if (!hasSpoken && connect == STOP_PLAYING) {
      setTimeout(() => {
        startRecord(isPlaying, false)
      }, 500)
    }
  }

  const startPlaying = async () => {
    if (!isPlaying) {
      audioSocketService.connect(updateMessage)
      recorder.current.setCallback(audioSocketService.sendBlob)
      setIsPlaying(true)
      setConnect(STOP_PLAYING)
      await startRecord(true, false)
      setUserMessage('Start your story by speaking into the microphone...')
    } else {
      audioSocketService.disconnect()
      setIsPlaying(false)
      setConnect(START_PLAYING)
    }
  }

  return (
    <>
      <div className="text-center justify-center">
        <CustomButton onClick={startPlaying}>{connect}</CustomButton>
      </div>
      <div className="flex flex-col text-center w-full items-center space-y-2 flex-1 h-full min-h-0">
        <CustomContent text={userMessage} />
        <CustomContent text={tellerMessage} isSmall={false} />
      </div>
    </>
  )
}

export default AudioRecorder
