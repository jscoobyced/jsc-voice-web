import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, vi } from 'vitest'

let playBufferMock: any

vi.mock('../../models/speak_data', () => {
  return {
    SPEAK_DATA: {
      SPEAKING_VOLUME: 5,
      TOTAL_SPEAK_TIME: 5,
      TOTAL_SILENT_TIME: 5,
      RETRY_TIME: 10,
    },
  }
})

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
const mockGetVolume = vi.fn()

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
        getVolume: mockGetVolume,
      }
    }),
  }
})

const mockSendBlob = vi.fn()
const mockDisconnect = vi.fn()
const mockConnect = vi
  .fn()
  .mockImplementation((callback: (data: string | ArrayBuffer) => void) => {
    callbackMethod = callback
  })

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

// Now import the component under test after mocks are defined
import AudioRecorder from './audioRecorder'

describe('AudioRecorder component', () => {
  beforeEach(async () => {
    // reset mocks and timers
    vi.resetModules()

    // Import the mocked module after resetModules so we can capture the mocked function instance
    const mod = await import('../../service/playAudio')
    playBufferMock = mod.playBuffer
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('starts playing: connects socket, sets callback, starts recorder and sets user message', async () => {
    render(<AudioRecorder />)
    const user = userEvent.setup()

    // start playing to set connect to STOP_PLAYING and start initial recording
    const playButton = screen.getByRole('button')
    await user.click(playButton)

    // AudioSocket instance should have been created and connected
    expect(mockConnect).toHaveBeenCalled()

    // Recorder instance should have been created and startRecording invoked
    expect(mockStartRecording).toHaveBeenCalled()

    // Custom message set after starting playing
    expect(
      await screen.findByText(
        /Start your story by speaking into the microphone.../i,
      ),
    ).toBeInTheDocument()
  })

  it('handles string messages updating teller and user content', async () => {
    render(<AudioRecorder />)
    const user = userEvent.setup()

    // start playing to set connect to STOP_PLAYING and start initial recording
    const playButton = screen.getByRole('button')
    await user.click(playButton)

    // Simulate a teller message
    const tellerMsg = JSON.stringify({
      type: 'teller',
      content: 'Hello from teller',
    })

    act(() => {
      // Invoke the callback to simulate incoming message
      callbackMethod(tellerMsg)
    })

    // Check that teller message is updated in the UI
    expect(await screen.findByText(/Hello from teller/i)).toBeInTheDocument()

    // Simulate a user message
    const userMsg = JSON.stringify({
      type: 'user',
      content: 'Hello from user',
    })

    act(() => {
      // Invoke the callback to simulate incoming message
      callbackMethod(userMsg)
    })

    // Check that user message is updated in the UI
    expect(await screen.findByText(/Hello from user/i)).toBeInTheDocument()
  })

  it('handles binary/audio messages via playBuffer and restarts recording after playback', async () => {
    render(<AudioRecorder />)
    const user = userEvent.setup()

    // start playing to set connect to STOP_PLAYING and start initial recording
    const playButton = screen.getByRole('button')
    await user.click(playButton)

    act(() => {
      // Invoke the callback to simulate incoming binary message
      callbackMethod(mockBlob)
    })

    // playBuffer should have been called with the blob
    expect(playBufferMock).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.any(Function),
    )

    // Simulate the playback completion callback to restart recording
    const playbackCallback = playBufferMock.mock
      .calls[0][1] as () => Promise<void>
    await act(async () => {
      await playbackCallback()
    })

    // Recorder's startRecording should have been called again after playback
    expect(mockStartRecording).toHaveBeenCalledTimes(2)
  })

  it('stops playing: disconnects socket and stops recorder', async () => {
    render(<AudioRecorder />)
    const user = userEvent.setup()

    // start playing to set connect to STOP_PLAYING and start initial recording
    const playButton = screen.getByRole('button')
    await user.click(playButton)

    // Now click again to stop playing
    await user.click(playButton)

    // AudioSocket disconnect should have been called
    expect(mockDisconnect).toHaveBeenCalled()

    // Recorder's stopRecording should have been called
    expect(mockStopRecording).toHaveBeenCalled()
  })
})
