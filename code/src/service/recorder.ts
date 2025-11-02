class Recorder {
  mediaRecorder: MediaRecorder | null = null
  isRecording = false
  analyser: AnalyserNode | null = null
  hasSpoken = false

  sendData = (blob: Blob) => {
    void blob
  }

  setCallback = (sendData: (blob: Blob) => void) => {
    this.sendData = sendData
  }

  getVolume = () => {
    if (!this.analyser) return -1
    const binCount = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(binCount)
    this.analyser.getByteFrequencyData(dataArray)

    return Math.max(...dataArray)
  }

  startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // Most supported by all browsers
        audioBitsPerSecond: 16000 * 4, // 16kHz * 4 bits = 64kbps
      })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      this.analyser = audioContext.createAnalyser()
      source.connect(this.analyser)
      this.analyser.fftSize = 128
      const chunks: Blob[] = []
      this.mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      this.mediaRecorder.onstop = () => {
        if (!this.hasSpoken) {
          this.sendData(new Blob(['0'], { type: 'audio/webm' }))
          return
        }
        const blob = new Blob(chunks, { type: 'audio/webm' })
        this.sendData(blob)
      }

      this.mediaRecorder.start()
      this.isRecording = true
    } catch (err) {
      const error = err as Error
      console.error('Error accessing microphone:', error.message)
    }
  }

  stopRecording = (hasSpoken: boolean) => {
    this.hasSpoken = hasSpoken
    if (this.mediaRecorder && this.isRecording) {
      this.analyser?.disconnect()
      this.mediaRecorder.stop()
      this.mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop()
      })
      this.isRecording = false
    }
  }
}

export default Recorder
