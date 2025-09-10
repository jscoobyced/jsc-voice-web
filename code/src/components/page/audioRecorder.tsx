import React, { useEffect, useRef, useState } from 'react'
import AudioSocket from '../../service/audioWebSocket'
import { playBuffer } from '../../service/playAudio'
import Recorder from '../../service/recorder'

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [message, setMessage] = useState('')
  const audioSocketService = new AudioSocket()
  const recorder = useRef(new Recorder())

  const updateMessage = (data: any) => {
    if (typeof data === 'string') {
      setMessage(data)
    } else {
      setMessage('Response received')
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
    <div>
      <button onClick={startRecord} disabled={isRecording}>
        Record
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      <div className="pt-4">
        Status: {isRecording ? 'Recording...' : 'Idle'}
      </div>
      <div className="pt-4">
        {message ? `Message received: ${message}` : ''}
      </div>
    </div>
  )
}

export default AudioRecorder
