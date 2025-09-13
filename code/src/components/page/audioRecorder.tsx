import React, { useEffect, useRef, useState } from 'react'
import AudioSocket from '../../service/audioWebSocket'
import { playBuffer } from '../../service/playAudio'
import Recorder from '../../service/recorder'

interface StoryResponse {
  type: string
  content: string
}

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [tellerMessage, setTellerMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const audioSocketService = new AudioSocket()
  const recorder = useRef(new Recorder())

  const updateMessage = (data: any) => {
    if (typeof data === 'string') {
      const response = JSON.parse(data) as StoryResponse
      if (response.type === 'teller') setTellerMessage(response.content)
      if (response.type === 'user') setUserMessage(response.content)
    } else {
      const blob = new Blob([data], { type: 'audio/wav' })
      playBuffer(blob)
    }
  }

  useEffect(() => {
    audioSocketService.connect(updateMessage)
    recorder.current.setCallback(audioSocketService.sendBlob)
  }, [])

  const startRecord = async () => {
    await recorder.current.startRecording()
    setIsRecording(true)
  }

  const stopRecording = () => {
    recorder.current.stopRecording()
    setIsRecording(false)
  }

  return (
    <>
      <div className="text-center">
        <button
          className="p-10 m-5"
          onClick={startRecord}
          disabled={isRecording}
        >
          Record
        </button>
        <button
          className="p-10 m-5"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop
        </button>
        <div className="pt-4">
          Status: {isRecording ? 'Recording...' : 'Idle'}
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
