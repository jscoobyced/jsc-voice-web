import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PlayService from './playService'
import UpdateService from './updateService'

// mock speak data constants used by PlayService
vi.mock('../models/speak_data', () => ({
  SPEAK_DATA: {
    SPEAKING_VOLUME: 5,
    TOTAL_SPEAK_TIME: 1000,
    TOTAL_SILENT_TIME: 500,
    RETRY_TIME: 100,
  },
}))

// mock AudioWebSocket class (constructor returns an instance with spies)
const connectMock = vi.fn()
const disconnectMock = vi.fn()
const sendBlobMock = vi.fn()
vi.mock('./audioWebSocket', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        connect: connectMock,
        disconnect: disconnectMock,
        sendBlob: sendBlobMock,
      }
    }),
  }
})

// mock Recorder class (constructor returns instance spies)
const setCallbackMock = vi.fn()
const startRecordingMock = vi.fn().mockResolvedValue(undefined)
const stopRecordingMock = vi.fn()
const getVolumeMock = vi.fn()
vi.mock('./recorder', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        setCallback: setCallbackMock,
        startRecording: startRecordingMock,
        stopRecording: stopRecordingMock,
        getVolume: getVolumeMock,
      }
    }),
  }
})

// import the mocked constructor reference (use unknown cast for safe inspection)
import AudioWebSocketMock from './audioWebSocket'

describe('PlayService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    vi.clearAllMocks()
    // default getVolume to 0
    getVolumeMock.mockReturnValue(0)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('startPlaying sets up websocket, recorder callback and starts recording; subsequent startPlaying returns early', async () => {
    const updateService: Pick<
      UpdateService,
      'queueMessage' | 'startProcessing'
    > = {
      queueMessage: vi.fn(),
      startProcessing: vi.fn().mockResolvedValue(undefined),
    }

    const svc = new PlayService(updateService as unknown as UpdateService)

    // first startPlaying should call connect and startRecording and set callback
    await svc.startPlaying()

    // ensure the mocked AudioWebSocket constructor was used (function) and connect invoked
    expect(typeof AudioWebSocketMock).toBe('function')
    // access mock property in a type-safe manner
    const mocked = AudioWebSocketMock as unknown as { mock?: unknown }
    expect(mocked.mock).toBeDefined()

    expect(connectMock).toHaveBeenCalledWith(updateService.queueMessage)

    // recorder instance setCallback must be wired to websocket.sendBlob
    expect(setCallbackMock).toHaveBeenCalled()
    // startRecording called
    expect(startRecordingMock).toHaveBeenCalled()

    // calling startPlaying again should return early and not call startRecording a second time
    await svc.startPlaying()
    expect(startRecordingMock).toHaveBeenCalledTimes(1)
  })

  it('stopPlaying disconnects and stops recording and is safe when not playing', async () => {
    const updateService: Pick<
      UpdateService,
      'queueMessage' | 'startProcessing'
    > = {
      queueMessage: vi.fn(),
      startProcessing: vi.fn().mockResolvedValue(undefined),
    }

    const svc = new PlayService(updateService as unknown as UpdateService)

    // calling stopPlaying when not started should do nothing
    svc.stopPlaying()
    expect(disconnectMock).not.toHaveBeenCalled()
    expect(stopRecordingMock).not.toHaveBeenCalled()

    // start then stop
    await svc.startPlaying()
    svc.stopPlaying()

    expect(disconnectMock).toHaveBeenCalled()
    expect(stopRecordingMock).toHaveBeenCalledWith(false)
  })

  it('updateVolume stops recording and calls startProcessing (handles startProcessing rejection)', async () => {
    const updateService: Pick<
      UpdateService,
      'queueMessage' | 'startProcessing'
    > = {
      queueMessage: vi.fn(),
      startProcessing: vi.fn().mockRejectedValue(new Error('boom')),
    }
    const svc = new PlayService(updateService as unknown as UpdateService)

    // invoke updateVolume such that currentTime - startTime >= TOTAL_SPEAK_TIME
    // use internal private method via cast
    const now = Date.now()
    // call with startTime far in past
    await (
      svc as unknown as {
        updateVolume: (
          a: boolean,
          b: number,
          c: number,
          d: boolean,
        ) => Promise<void>
      }
    ).updateVolume(false, now - 2000, now - 2000, false)

    // stopRecording should have been called (hasSpoken false)
    expect(stopRecordingMock).toHaveBeenCalledWith(false)

    // startProcessing was called and rejected -> ensure rejection path logs error
    const spyErr = vi.spyOn(console, 'error').mockImplementation(() => {
      void 0
    })
    // call again to exercise .catch logging
    await (
      svc as unknown as {
        updateVolume: (
          a: boolean,
          b: number,
          c: number,
          d: boolean,
        ) => Promise<void>
      }
    ).updateVolume(false, now - 2000, now - 2000, false)
    expect(updateService.startProcessing).toHaveBeenCalled()
    expect(spyErr).toHaveBeenCalled()
    spyErr.mockRestore()
  })

  it('updateVolume schedules recursive checks when thresholds not met and respects SPEAKING_VOLUME', async () => {
    const updateService: Pick<
      UpdateService,
      'queueMessage' | 'startProcessing'
    > = {
      queueMessage: vi.fn(),
      startProcessing: vi.fn().mockResolvedValue(undefined),
    }
    const svc = new PlayService(updateService as unknown as UpdateService)

    // set getVolume to alternate values to exercise newIsSpeaking true path
    getVolumeMock.mockReturnValueOnce(10).mockReturnValueOnce(3)

    const startTime = Date.now()
    const startSpeakTime = startTime

    // call updateVolume where thresholds not met (currentTime - startTime small)
    await (
      svc as unknown as {
        updateVolume: (
          a: boolean,
          b: number,
          c: number,
          d: boolean,
        ) => Promise<void>
      }
    ).updateVolume(false, startTime, startSpeakTime, false)

    // first call will read volume once (mockReturnValueOnce -> 10)
    expect(getVolumeMock).toHaveBeenCalledTimes(1)

    // advance timers to run scheduled setTimeout handler (50ms)
    vi.advanceTimersByTime(50)
    // allow any microtasks
    await Promise.resolve()

    // second invocation should call getVolume again (mockReturnValueOnce -> 3)
    expect(getVolumeMock).toHaveBeenCalledTimes(2)
  })
})
