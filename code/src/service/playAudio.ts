export const playBuffer = (blob: Blob) => {
  const audioContext = new AudioContext()
  const source = audioContext.createBufferSource()
  const reader = new FileReader()
  reader.onloadend = async () => {
    const data = new Uint8Array(reader.result as ArrayBuffer)
    const audioBuffer = await audioContext.decodeAudioData(data.buffer)
    source.connect(audioContext.destination)
    source.start()
    source.buffer = audioBuffer
  }
  reader.readAsArrayBuffer(blob)
}
