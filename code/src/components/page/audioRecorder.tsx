import React, { useEffect, useRef, useState } from 'react'
import AudioSocket from '../../service/audioWebSocket'
import { playBuffer } from '../../service/playAudio'
import Recorder from '../../service/recorder'

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
  const [connect, setConnect] = useState('Connect')
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
      setConnect('Disconnect')
    } else {
      audioSocketService.disconnect()
      setIsConnected(false)
      setConnect('Connect')
    }
  }

  return (
    <>
      <div className="text-center">
        <button className="p-10 m-5" onClick={doConnect}>
          {connect}
        </button>
        <button
          className="p-10 m-5"
          onClick={async () => await startRecord(isConnected, isPlaying)}
          disabled={isCurrentlyRecording}
        >
          Record
        </button>
        <button
          className="p-10 m-5"
          onClick={stopPlaying}
          disabled={!isPlaying}
        >
          Stop
        </button>
        <div className="pt-4">
          Status: {isCurrentlyRecording ? 'Recording' : 'Idle'}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <pre className="pt-4 font-mono w-1/2 whitespace-normal bg-cyan-950 p-5">
          {userMessage ? userMessage : ''}
        </pre>
      </div>
      <div className="flex justify-center items-center">
        <pre className="pt-4 font-mono w-1/2 whitespace-pre-wrap bg-cyan-950 p-5">
          {tellerMessage ? tellerMessage : ''}
        </pre>
      </div>
    </>
  )
}

export default AudioRecorder
