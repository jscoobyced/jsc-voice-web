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
      this.mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      this.mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        this.sendData(blob)
      }

      this.mediaRecorder.start()
      this.isRecording = true
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  stopRecording = () => {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
      this.isRecording = false
    }
  }
}

export default Recorder
