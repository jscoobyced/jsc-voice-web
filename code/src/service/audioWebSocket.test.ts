import { afterEach, beforeEach, vi } from 'vitest'
import * as applicationDataModule from './applicationData'
import AudioWebSocket from './audioWebSocket'

// Fake WebSocket to capture constructor args and calls
class FakeWebSocket {
  static OPEN = 1
  static CLOSED = 3
  static instances: FakeWebSocket[] = []

  url: string
  readyState: number = FakeWebSocket.CLOSED
  send = vi.fn()
  close = vi.fn()
  onopen?: (ev: any) => void
  onclose?: (ev: any) => void
  onmessage?: (ev: any) => void

  constructor(url: string) {
    this.url = url
    console.log(`FakeWebSocket created with URL: ${url}`)
    FakeWebSocket.instances.push(this)
  }
}

// Simple FileReader mock that schedules onloadend as microtask
class MockFileReader {
  result: ArrayBuffer | null = null
  onloadend?: () => void

  readAsArrayBuffer(_blob: Blob) {
    // schedule microtask so caller can assign onloadend synchronously afterwards
    Promise.resolve().then(() => {
      // create a small ArrayBuffer result for the test
      this.result = new Uint8Array([9, 8, 7]).buffer
      this.onloadend && this.onloadend()
    })
  }
}

describe('AudioWebSocket', () => {
  beforeEach(() => {
    // ensure fresh module evaluation per test
    FakeWebSocket.instances = []
    // install globals
    ;(global as any).WebSocket = FakeWebSocket as any
    ;(global as any).FileReader = MockFileReader as any
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
  })

  it('uses application data to build server URL and calls connect/onmessage callback with string', async () => {
    // mock applicationData to provide custom server details
    vi.spyOn(applicationDataModule, 'getApplicationData').mockReturnValue({
      webSocketServer: 'myserver.local',
      webSocketScheme: 'wss',
      webSocketPort: 1234,
      webSocketPath: '/audio',
      appVersion: 'v1.2.3',
    })

    const ws = new AudioWebSocket()
    const cb = vi.fn()
    ws.connect(cb)

    // the FakeWebSocket should have been constructed with the expected URL
    expect(FakeWebSocket.instances.length).toBe(1)
    const created = FakeWebSocket.instances[0]
    expect(created.url).toBe('wss://myserver.local:1234/audio')

    // simulate message with string payload
    created.onmessage && created.onmessage({ data: 'hello' })
    expect(cb).toHaveBeenCalledWith('hello')
  })

  it('passes ArrayBuffer messages to callback', async () => {
    const ws = new AudioWebSocket()
    const cb = vi.fn()
    ws.connect(cb)

    const created = FakeWebSocket.instances[0]
    const buf = new Uint8Array([1, 2, 3]).buffer
    created.onmessage && created.onmessage({ data: buf })
    expect(cb).toHaveBeenCalledWith(buf)
  })

  it('disconnect closes the socket', async () => {
    const ws = new AudioWebSocket()
    ws.connect()
    const created = FakeWebSocket.instances[0]
    expect(created.close).not.toHaveBeenCalled()
    ws.disconnect()
    expect(created.close).toHaveBeenCalled()
  })

  it('sendMessage logs error when socket not open, rejects empty string, and sends when open', async () => {
    const consoleErr = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ws = new AudioWebSocket()
    ws.connect()
    const created = FakeWebSocket.instances[0]

    // socket not open -> error
    ws.sendMessage('hi')
    expect(consoleErr).toHaveBeenCalledWith(
      expect.stringContaining('WebSocket is not open.'),
      expect.anything(),
      expect.anything(),
    )
    consoleErr.mockReset()

    // set socket to OPEN and test empty string rejection
    created.readyState = FakeWebSocket.OPEN
    ws.sendMessage('')
    expect(consoleErr).toHaveBeenCalledWith('Cannot send empty string data')
    consoleErr.mockReset()

    // valid send
    ws.sendMessage('abc')
    expect(created.send).toHaveBeenCalledWith('abc')

    consoleErr.mockRestore()
  })

  it('sendBlob logs when socket not open, logs when empty blob, and sends converted data when good', async () => {
    const consoleErr = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ws = new AudioWebSocket()
    ws.connect()
    const created = FakeWebSocket.instances[0]

    // not open
    const smallBlob = new Blob([new Uint8Array([1])])
    ws.sendBlob(smallBlob)
    expect(consoleErr).toHaveBeenCalledWith(
      expect.stringContaining('WebSocket is not open.'),
      expect.anything(),
      expect.anything(),
    )
    consoleErr.mockReset()

    // open but empty blob
    created.readyState = FakeWebSocket.OPEN
    const emptyBlob = new Blob([])
    ws.sendBlob(emptyBlob)
    expect(consoleErr).toHaveBeenCalledWith('Cannot send empty blob data')
    consoleErr.mockReset()

    // open and valid blob -> should convert and send Uint8Array
    const blob = new Blob([new Uint8Array([10, 20, 30])])
    ws.sendBlob(blob)

    // wait a microtask for MockFileReader to invoke onloadend
    await Promise.resolve()

    expect(created.send).toHaveBeenCalled()
    const sentArg = created.send.mock.calls[0][0]
    expect(sentArg).toBeInstanceOf(Uint8Array)
    expect(Array.from(sentArg as Uint8Array)).toEqual([9, 8, 7]) // MockFileReader returns this buffer
    consoleErr.mockRestore()
  })
})
