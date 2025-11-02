import { beforeEach, vi } from 'vitest'

// mock playBuffer before importing UpdateService so UpdateService uses the mocked function
vi.mock('./playAudio')

import UpdateService from './updateService'

describe('UpdateService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('queueMessage pushes data and processQueue returns immediately when empty', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // processQueue should do nothing on empty queue
    await (svc as any).processQueue()
    expect(setUser).not.toHaveBeenCalled()
    expect(setTeller).not.toHaveBeenCalled()

    // queueMessage should add an item that processQueue will consume
    svc.queueMessage(JSON.stringify({ type: 'user', content: 'hey' }))
    // inspect private queue to ensure item added
    expect((svc as any).queue.length).toBe(1)
  })

  it('processQueue handles "user" and "teller" string messages (recurses)', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // push two messages: user then teller
    svc.queueMessage(JSON.stringify({ type: 'user', content: 'user-msg' }))
    svc.queueMessage(JSON.stringify({ type: 'teller', content: 'teller-msg' }))

    // call private processQueue to exercise recursion path
    await (svc as any).processQueue()

    // both handlers should have been called
    expect(setUser).toHaveBeenCalledWith('user-msg')
    expect(setTeller).toHaveBeenCalledWith('teller-msg')

    // queue should be empty afterwards
    expect((svc as any).queue.length).toBe(0)
  })

  it('processQueue handles binary/object items by calling playBuffer and marking isPlaying', async () => {
    const setUser = vi.fn()
    const setTeller = vi.fn()
    const svc = new UpdateService(setUser, setTeller)

    // push an ArrayBuffer (object branch)
    const buf = new Uint8Array([1, 2, 3]).buffer
    svc.queueMessage(buf)

    // call processQueue -> should call playBuffer and set isPlaying = true
    await (svc as any).processQueue()
    expect((svc as any).isPlaying).toBe(true)
  })
})
