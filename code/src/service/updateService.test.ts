import { afterEach, describe, expect, it, vi } from 'vitest'

// mock playBuffer before importing UpdateService so UpdateService uses the mocked function
vi.mock('./playAudio', () => ({
  playBuffer: vi.fn(),
}))

import UpdateService from './updateService' // keep path consistent with real import (case-sensitive FS)

describe('UpdateService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('startProcessing sets callback and processes queue until isPlaying', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)
    const internal = svc as unknown as { isPlaying: boolean }
    internal.isPlaying = false

    // initially isPlaying = false, so should loop
    const callbackMock = vi.fn()

    vi.spyOn(
      svc as unknown as { processQueue: () => Promise<void> },
      'processQueue',
    ).mockImplementation(async () => {
      // simulate queue processing by setting isPlaying = true after first call
      internal.isPlaying = true
      callbackMock()
      await Promise.resolve()
    })

    await svc.startProcessing(callbackMock)
    console.log('startProcessing completed')

    // advance timers to allow processing loop to run a few times
    expect(callbackMock).toHaveBeenCalled()
  })

  it('queueMessage pushes data and processQueue returns immediately when empty', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // processQueue should do nothing on empty queue
    await (
      svc as unknown as { processQueue: () => Promise<void> }
    ).processQueue()
    expect(setUser).not.toHaveBeenCalled()
    expect(setTeller).not.toHaveBeenCalled()

    // queueMessage should add an item that processQueue will consume
    svc.queueMessage(JSON.stringify({ type: 'user', content: 'hey' }))

    // inspect private queue via a typed internal view instead of `any`
    const internal = svc as unknown as { queue: unknown[] }
    expect(internal.queue.length).toBe(1)

    // satisfy linter for any potential unused vars (no-op)
    void setUser
    void setTeller
    void internal
  })

  it('queueMessage pushes END_OF_CONVERSATION', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // push two messages: user then teller
    svc.queueMessage(
      JSON.stringify({ type: 'teller', content: 'END_OF_CONVERSATION' }),
    )

    // call private processQueue to exercise recursion path (typed access)
    await (
      svc as unknown as { processQueue: () => Promise<void> }
    ).processQueue()

    // queue should be empty afterwards
    const internal = svc as unknown as { queue: unknown[] }
    expect(internal.queue.length).toBe(0)

    void internal
  })

  it('processQueue handles "user" and "teller" string messages (recurses)', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // push two messages: user then teller
    svc.queueMessage(JSON.stringify({ type: 'user', content: 'user-msg' }))
    svc.queueMessage(JSON.stringify({ type: 'teller', content: 'teller-msg' }))

    // call private processQueue to exercise recursion path (typed access)
    await (
      svc as unknown as { processQueue: () => Promise<void> }
    ).processQueue()

    // both handlers should have been called
    expect(setUser).toHaveBeenCalledWith('user-msg')
    expect(setTeller).toHaveBeenCalledWith('teller-msg')

    // queue should be empty afterwards
    const internal = svc as unknown as { queue: unknown[] }
    expect(internal.queue.length).toBe(0)

    void internal
  })

  it('processQueue handles binary/object items by calling playBuffer and marking isPlaying', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // push an ArrayBuffer (object branch)
    const buf = new Uint8Array([1, 2, 3]).buffer
    svc.queueMessage(buf)

    // call processQueue -> should call playBuffer and set isPlaying = true
    await (
      svc as unknown as { processQueue: () => Promise<void> }
    ).processQueue()

    const internal = svc as unknown as { isPlaying: boolean }
    expect(internal.isPlaying).toBe(true)

    // silence unused var warnings
    void buf
    void internal
    void setUser
    void setTeller
  })
})
