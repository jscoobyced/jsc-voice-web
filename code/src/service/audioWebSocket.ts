import io from 'socket.io-client'
import { getApplicationData } from './applicationData'

export interface ServerMessage {
  type: number
  data: string | ArrayBufferLike[]
}

const audioSocket = () => {
  const serverUrl = getApplicationData().serverWebSocket
  const socket = io(serverUrl)

  socket.on('message', (data: ServerMessage) => {
    console.log('Received message:', data)
  })

  const sendMessage = (type: number, data: string | ArrayBufferLike[]) => {
    socket.emit('message', { type: type, data: data })
  }

  return {
    sendMessage,
  }
}

export default audioSocket
