import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AudioRecorder from './audioRecorder'

const mockSetCallback = vi.fn()
const mockStartRecording = vi.fn().mockResolvedValue(undefined)
const mockStopRecording = vi.fn()

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

const mockConnect = vi.fn()
const mockSendBlob = vi.fn()

vi.mock('../../service/audioWebSocket', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        connect: mockConnect,
        sendBlob: mockSendBlob,
      }
    }),
  }
})

describe('Recorded component', () => {
  it('can start and stop recording', async () => {
    render(<AudioRecorder />)
    expect(mockConnect).toHaveBeenCalled()
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
  })
})
