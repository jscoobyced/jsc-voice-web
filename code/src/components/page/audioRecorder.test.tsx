import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AudioRecorder from './audioRecorder'

let callbackMethod: (data: string | ArrayBuffer) => void
const mockUserText = '{"type": "user", "content": "test mock data"}'
const mockTellerText = '{"type": "teller", "content": "test mock data"}'
const mockBlob = new ArrayBuffer(5)
const mockSetCallback = vi.fn()
const mockStartRecording = vi.fn().mockResolvedValue(undefined)
const mockStopRecording = vi.fn().mockImplementation(() => {
  callbackMethod(mockUserText)
  callbackMethod(mockTellerText)
  callbackMethod(mockBlob)
})

vi.mock('../../service/playAudio', () => {
  return {
    playBuffer: vi.fn(),
  }
})

vi.mock('../../service/recorder', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        setCallback: mockSetCallback,
        startRecording: mockStartRecording,
        stopRecording: mockStopRecording,
      }
    }),
  }
})

const mockConnect = vi
  .fn()
  .mockImplementation((callback: (data: string | ArrayBuffer) => void) => {
    callbackMethod = callback
  })

const mockSendBlob = vi.fn()
const mockDisconnect = vi.fn()

vi.mock('../../service/audioWebSocket', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        connect: mockConnect,
        sendBlob: mockSendBlob,
        disconnect: mockDisconnect,
      }
    }),
  }
})

describe('Recorded component', () => {
  it('can start and stop recording', async () => {
    render(<AudioRecorder />)
    const connectButton = screen.getByRole('button', { name: 'Connect' })
    expect(connectButton).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(connectButton)
    })
    expect(mockConnect).toHaveBeenCalled()
    const disconnectButton = screen.getByRole('button', { name: 'Disconnect' })
    expect(disconnectButton).toBeInTheDocument()
    const recordButton = screen.getByRole('button', { name: 'Record' })
    expect(recordButton).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(recordButton)
    })
    expect(mockSetCallback).toHaveBeenCalledWith(mockSendBlob)
    expect(mockStartRecording).toHaveBeenCalled()
    const stopButton = screen.getByRole('button', { name: 'Stop' })
    expect(stopButton).toBeInTheDocument()
    fireEvent.click(stopButton)
    expect(mockStopRecording).toHaveBeenCalled()
    await act(async () => {
      fireEvent.click(disconnectButton)
    })
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
