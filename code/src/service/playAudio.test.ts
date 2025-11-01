import { vi } from 'vitest'
import { playBuffer } from './playAudio'

const mockConnect = vi.fn()
const mockStart = vi.fn()

// Mocking AudioContext and its methods
vi.stubGlobal(
  'AudioContext',
  class {
    createBufferSource() {
      return {
        connect: mockConnect,
        start: mockStart,
        buffer: null,
      }
    }
    decodeAudioData = vi.fn().mockResolvedValue({
      numberOfChannels: 1,
      length: 44100,
      duration: 1,
      sampleRate: 44100,
      getChannelData: vi.fn().mockReturnValue(new Float32Array(44100)),
    })
    destination = {}
  },
)

describe('playAudio', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should play audio from a Blob', async () => {
    const blob = new Blob(['test'], { type: 'audio/wav' })
    playBuffer(blob, async () => {
      // Do nothing
    })
    // Wait for the async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockConnect).toHaveBeenCalled()
    expect(mockStart).toHaveBeenCalled()
  })
})
