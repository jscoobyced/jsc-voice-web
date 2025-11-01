export const playBuffer = (blob: Blob, callback: () => Promise<void>) => {
  const audioContext = new AudioContext()
  const source = audioContext.createBufferSource()
  const reader = new FileReader()
  let hasBeenCalled = false
  reader.onloadend = async () => {
    const data = new Uint8Array(reader.result as ArrayBuffer)
    const audioBuffer = await audioContext.decodeAudioData(data.buffer)
    source.connect(audioContext.destination)
    source.start()
    source.buffer = audioBuffer
    source.onended = async () => {
      await audioContext.close()
      source.disconnect()
      if (!hasBeenCalled) {
        hasBeenCalled = true
        await callback()
      }
    }
  }
  reader.readAsArrayBuffer(blob)
}
