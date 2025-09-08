import { vi } from 'vitest'

// Mock navigator.mediaDevices.getUserMedia
vi.stubGlobal('navigator', {
  mediaDevices: {
    getUserMedia: vi
      .fn()
      .mockResolvedValue(undefined as unknown as MediaStream),
  },
})

// Mock MediaRecorder
class MockMediaRecorder {
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  isRecording = false

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
    recorder.stopRecording()
    expect(recorder.isRecording).toBe(false)
  })

  it('calls sendData callback with recorded blob', async () => {
    const recorder = new Recorder()
    const mockSendData = vi.fn()
    recorder.setCallback(mockSendData)

    await recorder.startRecording()
    // Wait to ensure ondataavailable is called
    await new Promise((resolve) => setTimeout(resolve, 200))
    recorder.stopRecording()

    // Wait to ensure onstop is called
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(mockSendData).toHaveBeenCalled()
    const blobArg = mockSendData.mock.calls[0][0] as Blob
    expect(blobArg.type).toBe('audio/wav')
  })
})
