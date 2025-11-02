import React, { useRef, useState } from 'react'
import PlayService from '../../service/playService'
import UpdateService from '../../service/updateService'
import CustomButton from '../elements/CustomButton'
import CustomContent from '../elements/CustomContent'

const START_PLAYING = 'Start playing'
const STOP_PLAYING = 'Stop playing'

const AudioRecorder: React.FC = () => {
  const [tellerMessage, setTellerMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [connect, setConnect] = useState(START_PLAYING)
  const [isPlaying, setIsPlaying] = useState(false)
  const playService = useRef(
    new PlayService(new UpdateService(setUserMessage, setTellerMessage)),
  ).current

  const startPlaying = async () => {
    if (!isPlaying) {
      await playService.startPlaying()
      setIsPlaying(true)
      setConnect(STOP_PLAYING)
      setUserMessage('Start your story by speaking into the microphone...')
      setTellerMessage('')
    } else {
      playService.stopPlaying()
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
