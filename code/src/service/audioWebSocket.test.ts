import { vi } from 'vitest'
import AudioSocket from './audioWebSocket'

vi.mock('./applicationData', () => ({
  getApplicationData: () => ({
    appVersion: 'v0.0.0',
    webSocketServer: 'localhost',
    webSocketPort: 6789,
    webSocketPath: '/audio',
  }),
}))

vi.mock('./playAudio', () => ({
  playBuffer: (blob: Blob) => {
    void blob
  },
}))

// Mock the WebSocket class
let readyState = 1
vi.stubGlobal(
  'WebSocket',
  class {
    static OPEN = 1
    readyState = readyState
    url: string
    onopen: ((this: WebSocket, ev: Event) => void) | null = null
    onmessage: ((this: WebSocket, ev: MessageEvent) => void) | null = null

    constructor(url: string) {
      this.url = url
    }

    send(data: string | Uint8Array | Blob) {
      void data
      // do nothing
    }

    close() {
      // do nothing
    }
  },
)

describe('AudioSocket - success', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should send text message', () => {
    const expected = 'test data'
    const audioWebSocket = new AudioSocket()
    audioWebSocket.connect()
    audioWebSocket.sendMessage(expected)
    audioWebSocket.disconnect()
  })

  it('should send blob message', () => {
    const expected = new Blob(['test'], { type: 'text/plain' })
    const audioWebSocket = new AudioSocket()
    audioWebSocket.connect()
    audioWebSocket.sendBlob(expected)
  })
})

describe('audioWebSocket - empty message', () => {
  let mockedConsoleError: ReturnType<typeof vi.spyOn>
  let mockedConsoleLog: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.resetAllMocks()
    mockedConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // do nothing
    })
    mockedConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {
      // do nothing
    })
  })

  afterEach(() => {
    mockedConsoleError.mockRestore()
    mockedConsoleLog.mockRestore()
  })

  it('should not send empty text message', () => {
    const expected = ''
    const audioWebSocket = new AudioSocket()
    audioWebSocket.connect()
    audioWebSocket.sendMessage(expected)
    expect(mockedConsoleError).toHaveBeenCalledTimes(1)
  })

  it('should not send empty binary message', () => {
    const audioWebSocket = new AudioSocket()
    audioWebSocket.connect()
    audioWebSocket.sendBlob(new Blob())
    expect(mockedConsoleError).toHaveBeenCalledTimes(1)
  })

  it('should not send message if socket is not open', () => {
    readyState = 0
    const expected = 'Hello'
    const audioWebSocket = new AudioSocket()
    audioWebSocket.connect()
    audioWebSocket.sendMessage(expected)
    audioWebSocket.sendBlob(new Blob())
    expect(mockedConsoleError).toHaveBeenCalledTimes(2)
    readyState = 1
  })
})
