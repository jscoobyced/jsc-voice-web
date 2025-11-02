import { vi } from 'vitest'
import { playBuffer } from './playAudio'

let realFileReader: typeof FileReader | undefined
let realAudioContext: typeof AudioContext | undefined

// types for fake source and fake audio context instances
interface FakeSource {
  connect: ReturnType<typeof vi.fn>
  start: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  buffer: unknown
  onended: (() => Promise<void>) | undefined
  triggerOnEnded?: () => Promise<void>
}

const createFakeSource = (): FakeSource => {
  const source: FakeSource = {
    connect: vi.fn(),
    start: vi.fn(),
    disconnect: vi.fn(),
    buffer: undefined,
    onended: undefined,
  }
  source.triggerOnEnded = async () => {
    if (typeof source.onended === 'function') {
      // call onended and await in case it is async

      await source.onended()
    }
  }
  return source
}

const audioContextInstances: {
  destination: unknown
  close: ReturnType<typeof vi.fn>
  createBufferSource: ReturnType<typeof vi.fn>
  decodeAudioData: ReturnType<typeof vi.fn>
}[] = []

class FakeAudioContext {
  destination = { dest: true }
  constructor() {
    audioContextInstances.push(this)
  }

  close = vi.fn(async () => Promise.resolve())
  createBufferSource = vi.fn(() => createFakeSource())
  decodeAudioData = vi.fn(async (_buf: ArrayBuffer) => {
    void _buf
    return Promise.resolve({} as unknown as AudioBuffer)
  })
}

const fileReaderInstances: {
  result: ArrayBuffer | null
  onloadend: (() => void) | null
  readAsArrayBuffer: ReturnType<typeof vi.fn>
}[] = []

class FakeFileReader {
  result: ArrayBuffer | null = null
  onloadend: (() => void) | null = null

  constructor() {
    fileReaderInstances.push(this)
  }

  readAsArrayBuffer = vi.fn(async (_: Blob) => {
    await Promise.resolve().then(() => {
      void _
      this.result = new Uint8Array([9, 8, 7]).buffer
      this.onloadend?.()
    })
  })
}

beforeAll(() => {
  // save real globals
  realFileReader = (globalThis as unknown as { FileReader?: typeof FileReader })
    .FileReader
  realAudioContext = (
    globalThis as unknown as { AudioContext?: typeof AudioContext }
  ).AudioContext

  // install fakes
  ;(globalThis as unknown as Record<string, unknown>).AudioContext =
    FakeAudioContext as unknown as typeof AudioContext
  ;(globalThis as unknown as Record<string, unknown>).FileReader =
    FakeFileReader as unknown as typeof FileReader
})

afterAll(() => {
  // restore real globals
  if (realFileReader) {
    ;(globalThis as unknown as Record<string, unknown>).FileReader =
      realFileReader
  } else {
    delete (globalThis as unknown as Record<string, unknown>).FileReader
  }

  if (realAudioContext) {
    ;(globalThis as unknown as Record<string, unknown>).AudioContext =
      realAudioContext
  } else {
    delete (globalThis as unknown as Record<string, unknown>).AudioContext
  }
})

describe('playBuffer', () => {
  beforeEach(() => {
    fileReaderInstances.length = 0
    audioContextInstances.length = 0
    vi.clearAllMocks()
  })

  it('reads blob, decodes audio, starts source, and calls callback once when ended', async () => {
    const cb = vi.fn(async () => Promise.resolve())

    const blob = new Blob([new Uint8Array([1, 2, 3])])
    playBuffer(blob, cb)

    // allow FileReader.onloadend microtask to run
    await Promise.resolve()

    expect(fileReaderInstances.length).toBeGreaterThan(0)
    expect(fileReaderInstances[0].readAsArrayBuffer).toHaveBeenCalled()

    // allow decodeAudioData promise to resolve
    await Promise.resolve()

    expect(audioContextInstances.length).toBeGreaterThan(0)
    const audioContextInstance = audioContextInstances[0]
    expect(audioContextInstance.decodeAudioData).toHaveBeenCalled()
    expect(audioContextInstance.createBufferSource).toHaveBeenCalled()
  })
})
