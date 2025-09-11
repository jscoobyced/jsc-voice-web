class Recorder {
  mediaRecorder: MediaRecorder | null = null
  isRecording = false
  sendData = (blob: Blob) => {
    void blob
  }

  setCallback = (sendData: (blob: Blob) => void) => {
    this.sendData = sendData
  }

  startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // Most supported by all browsers
        audioBitsPerSecond: 16000 * 4, // 16kHz * 4 bits = 64kbps
      })
      const chunks: Blob[] = []
      this.mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      this.mediaRecorder.onstop = () => {
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

  stopRecording = () => {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
      this.mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop()
      })
      this.isRecording = false
    }
  }
}

export default Recorder
