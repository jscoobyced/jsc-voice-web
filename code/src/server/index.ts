import { WebSocket, WebSocketServer } from 'ws'

const port = 6789

export interface IWebSocketServer {
  ws?: WebSocket
}

export const WSServer = () => {
  const start = (): IWebSocketServer => {
    const wss = new WebSocketServer({ port, path: '/audio' })
    const server: IWebSocketServer = {
      ws: undefined,
    }

    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected to WebSocket server')
      ws.onmessage = (event: WebSocket.MessageEvent) => {
        console.log('WebSocket server received message:', event.type)
        event.target.send(event.data)
      }

      ws.on('close', () => {
        console.log('Client disconnected from WebSocket server')
      })
      server.ws = ws
    })

    console.log(`WebSocket server started on port ${port.toString()}`)
    return server
  }

  const stop = (server: IWebSocketServer) => {
    server.ws?.close()
  }

  return { start, stop }
}

const s = WSServer()
s.start()
