import { vi } from 'vitest'

// Mock navigator.mediaDevices.getUserMedia
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: vi
      .fn()
      .mockResolvedValue(undefined as unknown as MediaStream),
  },
})

vi.stubGlobal(
  'MediaStream',
  class MediaStream {
    getTracks() {
      return []
    }
  },
)

vi.stubGlobal(
  'AudioContext',
  class AudioContext {
    createMediaStreamSource = (stream: MediaStream) => {
      void stream
      return {
        connect(anaylser: AnalyserNode) {
          void anaylser
        },
      }
    }
    createAnalyser = () => {
      class Analyser {
        fftSize = 128
        frequencyBinCount = 64
        disconnect = () => {
          // Do nothing
        }
        getByteFrequencyData = (dataArray: Uint8Array) => {
          for (let i = 0; i < dataArray.length; i++) {
            dataArray[i] = Math.floor(Math.random() * 256) // Random values between 0-255
          }
        }
      }
      return new Analyser()
    }
  },
)

// Mock MediaRecorder
class MockMediaRecorder {
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  isRecording = false
  stream?: MediaStream = new MediaStream()

  constructor(stream: MediaStream) {
    void stream
  }

  start() {
    this.isRecording = true
    // Simulate data available after starting
    setTimeout(() => {
      if (this.ondataavailable) {
        this.ondataavailable({} as BlobEvent)
      }
    }, 100)
  }

  stop() {
    this.isRecording = false
    if (this.onstop) {
      this.onstop()
    }
  }
}

vi.stubGlobal('MediaRecorder', MockMediaRecorder)

// Import the Recorder class after mocking
import Recorder from './recorder'

// Basic test to ensure the testing setup works

describe('recorder', () => {
  it('can start recording', async () => {
    const recorder = new Recorder()
    expect(recorder.isRecording).toBe(false)
    await recorder.startRecording()
    expect(recorder.isRecording).toBe(true)
    recorder.stopRecording(true)
    expect(recorder.isRecording).toBe(false)
  })

  it('calls sendData callback with recorded blob', async () => {
    const recorder = new Recorder()
    const mockSendData = vi.fn()
    recorder.setCallback(mockSendData)

    await recorder.startRecording()
    // Wait to ensure ondataavailable is called
    await new Promise((resolve) => setTimeout(resolve, 200))
    recorder.stopRecording(true)

    // Wait to ensure onstop is called
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockSendData).toHaveBeenCalled()
    const blobArg = mockSendData.mock.calls[0][0] as Blob
    expect(blobArg.type).toBe('audio/webm')
  })

  it('does not crash when and exception occurs', () => {
    const expectedError = Error('Expected error')
    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: () => {
          throw expectedError
        },
      },
    })
    const recorder = new Recorder()
    const mockSendData = vi.fn()
    recorder.setCallback(mockSendData)

    // Assert
    expect(async () => {
      await recorder.startRecording()
    }).not.toThrow(
      Error(`Error accessing microphone: ${expectedError.message}`),
    )
  })

  it('getVolume returns max frequency data', async () => {
    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: () => {
          return new Promise<MediaStream>((resolve) => {
            resolve(new MediaStream())
          })
        },
      },
    })
    const recorder = new Recorder()
    const mockSendData = vi.fn()
    recorder.setCallback(mockSendData)

    await recorder.startRecording()

    // Simulate analyser being set
    const volume = recorder.getVolume()
    expect(volume).toBeGreaterThanOrEqual(0)
    expect(volume).toBeLessThanOrEqual(255)

    recorder.stopRecording(true)
  })

  it('getVolume returns -1 when analyser is not set', () => {
    const recorder = new Recorder()
    const volume = recorder.getVolume()
    expect(volume).toBe(-1)
  })
})
