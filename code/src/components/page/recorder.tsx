import React, { useRef, useState } from 'react'
import AudioSocket from '../../service/audioWebSocket'
import Recorder from '../../service/recorder'

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const audioSocketService = new AudioSocket()
  const recorder = useRef(new Recorder())

  const startRecord = async () => {
    audioSocketService.connect()
    recorder.current.setCallback(audioSocketService.sendBlob)
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
    </div>
  )
}

export default AudioRecorder
