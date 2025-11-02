import { SPEAK_DATA } from '../models/speak_data'
import AudioWebSocket from './audioWebSocket'
import Recorder from './recorder'
import UpdateService from './updateService'

export default class PlayService {
  private isPlaying = false
  private audioSocketService = new AudioWebSocket()
  private recorder = new Recorder()

  constructor(private updateService: UpdateService) {}

  startPlaying = async () => {
    if (this.isPlaying) return
    this.isPlaying = true
    this.audioSocketService.connect(this.updateService.queueMessage)
    this.recorder.setCallback(this.audioSocketService.sendBlob)
    await this.continuePlaying()
  }

  continuePlaying = async () => {
    await this.recorder.startRecording()
    const currentTime = new Date().getTime()
    this.updateVolume(false, currentTime, currentTime, false)
  }

  stopPlaying = () => {
    this.audioSocketService.disconnect()
    this.recorder.stopRecording(false)
    this.isPlaying = false
  }

  private updateVolume = (
    isSpeaking = false,
    startTime = 0,
    startSpeakTime = 0,
    hasSpoken = false,
  ) => {
    const currentTime = new Date().getTime()
    if (
      currentTime - startTime >= SPEAK_DATA.TOTAL_SPEAK_TIME ||
      (!isSpeaking &&
        currentTime - startSpeakTime > SPEAK_DATA.TOTAL_SILENT_TIME)
    ) {
      this.recorder.stopRecording(hasSpoken)
      this.updateService
        .startProcessing(this.continuePlaying)
        .catch((err: unknown) => {
          console.error('startProcessing failed', err)
        })
      return
    }
    const volume = this.recorder.getVolume()
    const newIsSpeaking = volume > SPEAK_DATA.SPEAKING_VOLUME
    const newHasSpoken = hasSpoken || newIsSpeaking
    const newStartSpeakTime = isSpeaking ? currentTime : startSpeakTime
    setTimeout(() => {
      this.updateVolume(
        newIsSpeaking,
        startTime,
        newStartSpeakTime,
        newHasSpoken,
      )
    }, 50)
  }
}
