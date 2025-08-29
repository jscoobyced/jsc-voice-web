import { vi } from 'vitest'
import audioSocket from './audioWebSocket'

describe('audioWebSocket', () => {
  vi.mock('./applicationData', () => ({
    getApplicationData: () => ({
      serverWebSocket: 'http://localhost:3000',
    }),
  }))

  const emitMock = vi.fn()

  vi.mock('socket.io-client', () => {
    const io = vi.fn(() => ({
      on: vi.fn(),
      emit: emitMock,
      disconnect: vi.fn(),
    }))
    return {
      default: io,
    }
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should create a socket and handle messages', () => {
    const audioWs = audioSocket()
    expect(audioWs).toHaveProperty('sendMessage')
    audioWs.sendMessage(1, 'test data')
    expect(emitMock).toHaveBeenCalledWith('message', {
      type: 1,
      data: 'test data',
    })
  })
})
