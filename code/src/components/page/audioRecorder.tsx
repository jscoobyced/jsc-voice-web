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

const AudioRecorder: React.FC = () => {
  const [tellerMessage, setTellerMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [connect, setConnect] = useState('Start playing')
  const [isConnected, setIsConnected] = useState(false)
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
  ) => {
    const currentTime = new Date().getTime()
    if (
      currentTime - startTime >= TOTAL_SPEAK_TIME ||
      (!isSpeaking && currentTime - startSpeakTime > TOTAL_SILENT_TIME)
    ) {
      stopRecording()
      return
    }
    const volume = recorder.current.getVolume()
    const newIsSpeaking = volume > SPEAKING_VOLUME
    const newStartSpeakTime = isSpeaking ? currentTime : startSpeakTime
    setTimeout(() => {
      updateVolume(newIsSpeaking, startTime, newStartSpeakTime)
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

  const stopRecording = () => {
    setIsPlaying(false)
    setIsCurrentlyRecording(false)
    recorder.current.stopRecording()
  }

  const stopPlaying = () => {
    setIsPlaying(false)
  }

  const doConnect = () => {
    if (!isConnected) {
      audioSocketService.connect(updateMessage)
      recorder.current.setCallback(audioSocketService.sendBlob)
      setIsConnected(true)
      setConnect('Stop playing')
    } else {
      audioSocketService.disconnect()
      setIsConnected(false)
      setConnect('Start playing')
    }
  }

  return (
    <>
      <div className="text-center">
        <CustomButton onClick={doConnect}>{connect} 🔌</CustomButton>
        <CustomButton
          onClick={async () => await startRecord(isConnected, isPlaying)}
          disabled={isCurrentlyRecording || !isConnected || isPlaying}
        >
          Record 🎙️
        </CustomButton>
        <CustomButton
          onClick={stopPlaying}
          disabled={!isPlaying || !isConnected}
        >
          Stop Recording ⏹️
        </CustomButton>
        <span className="block mb-2 font-mono">
          {!isConnected
            ? 'Disconnected 🚫'
            : isCurrentlyRecording
              ? 'Recording 🎤'
              : 'Idle 😴'}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center text-center w-full space-y-2">
        <CustomContent text={userMessage} />
        <CustomContent text={tellerMessage} />
      </div>
    </>
  )
}

export default AudioRecorder
