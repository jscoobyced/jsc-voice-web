import { getApplicationData } from './applicationData'
import { playBuffer } from './playAudio'

export interface ServerMessage {
  type: number
  data: string | ArrayBufferLike[]
}

class AudioSocket {
  serverUrl = getApplicationData().webSocketServer
    ? `ws://${getApplicationData().webSocketServer}:${getApplicationData().webSocketPort.toString()}${getApplicationData().webSocketPath}`
    : 'ws://localhost:6789/audio'
  socket?: WebSocket

  connect = () => {
    this.socket = new WebSocket(this.serverUrl)

    this.socket.onopen = (event: Event) => {
      console.log('WebSocket connection opened:', event.type)
    }

    this.socket.onmessage = (event: MessageEvent) => {
      const blob = new Blob([event.data], { type: 'audio/wav' })
      playBuffer(blob)
    }
  }

  sendMessage = (data: string | Uint8Array) => {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error(
        'WebSocket is not open.',
        this.socket?.readyState,
        WebSocket.OPEN,
      )
      return
    }
    if (typeof data === 'string' && data.length === 0) {
      console.error('Cannot send empty string data')
      return
    }
    if (data instanceof Uint8Array && data.length === 0) {
      console.error('Cannot send empty array data')
      return
    }
    this.socket.send(data)
  }

  sendBlob = (data: Blob) => {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error(
        'WebSocket is not open.',
        this.socket?.readyState,
        WebSocket.OPEN,
      )
      return
    }
    if (data.size === 0) {
      console.error('Cannot send empty blob data')
      return
    }
    if (data instanceof Blob) {
      this.convertBlob(data, (convertedData) => {
        this.socket?.send(convertedData)
      })
      return
    }
  }

  convertBlob = (
    blob: Blob,
    callback: (data: Uint8Array<ArrayBuffer>) => void,
  ) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onloadend = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer)
      callback(data)
    }
  }
}

export default AudioSocket
