import { getApplicationData } from './applicationData'

class AudioWebSocket {
  private socket?: WebSocket

  connect = (callback?: (data: string | ArrayBuffer) => void) => {
    this.socket = new WebSocket(this.buildServerUrl())

    this.socket.onopen = (event: Event) => {
      console.log('WebSocket connection:', event.type)
    }

    this.socket.onclose = (event: Event) => {
      console.log('WebSocket connection:', event.type)
    }

    this.socket.onmessage = (event: MessageEvent) => {
      const data: string | ArrayBuffer = event.data as string | ArrayBuffer
      if (callback) {
        callback(data)
      }
    }
  }

  disconnect = () => {
    this.socket?.close()
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
    if (typeof data === 'string') {
      if (data.length === 0) {
        console.error('Cannot send empty string data')
        return
      } else {
        this.socket.send(data)
      }
    }
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

  private buildServerUrl = (): string => {
    console.log(
      'Building WebSocket URL with application data:',
      getApplicationData(),
    )
    return getApplicationData().webSocketServer
      ? `${getApplicationData().webSocketScheme}://${getApplicationData().webSocketServer}:${getApplicationData().webSocketPort.toString()}${getApplicationData().webSocketPath}`
      : 'ws://localhost:6789/audio'
  }

  private convertBlob = (
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

export default AudioWebSocket
