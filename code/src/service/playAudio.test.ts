import { vi } from 'vitest'

let realFileReader: FileReader
let realAudioContext: AudioContext

// Fake audioBuffer returned by decodeAudioData
const fakeAudioBuffer = { decoded: true }

// Fake source implementation
const createFakeSource = () => {
  const source: any = {
    connect: vi.fn(),
    start: vi.fn(),
    disconnect: vi.fn(),
    buffer: undefined,
    onended: undefined as any,
    // helper to simulate the end of playback
    triggerOnEnded: async function () {
      if (typeof this.onended === 'function') {
        await this.onended()
      }
    },
  }
  return source
}

const audioContextInstances: any[] = []

// Fake AudioContext
class FakeAudioContext {
  constructor() {
    // record instance so tests can assert on instance methods
    audioContextInstances.push(this)
  }
  destination = { dest: true }
  lastBuffer?: any
  close = vi.fn(async () => Promise.resolve())
  createBufferSource = vi.fn(() => {
    const s = createFakeSource()
    return s
  })
  decodeAudioData = vi.fn(async (_buf: ArrayBuffer) => {
    // return fake audio buffer
    return Promise.resolve(fakeAudioBuffer as unknown as AudioBuffer)
  })
}
;(global as any).AudioContext = FakeAudioContext as any

// Fake FileReader that triggers onloadend as microtask
const fileReaderInstances: any[] = []

class FakeFileReader {
  result: ArrayBuffer | null = null
  onloadend: (() => void) | null = null
  constructor() {
    // record instance so tests can assert on instance methods
    fileReaderInstances.push(this)
  }
  readAsArrayBuffer = vi.fn((blob: Blob) => {
    void blob // unused parameter
    // set result and invoke onloadend in microtask
    Promise.resolve().then(() => {
      this.result = new Uint8Array([9, 8, 7]).buffer
      this.onloadend && this.onloadend()
    })
  })
}
;(global as any).FileReader = FakeFileReader as any

import { playBuffer } from './playAudio'

describe('playBuffer', () => {
  beforeAll(() => {
    // Save real implementations
    realFileReader = (global as any).FileReader
    realAudioContext = (global as any).AudioContext
  })

  afterAll(() => {
    // Restore real implementations
    ;(global as any).FileReader = realFileReader
    ;(global as any).AudioContext = realAudioContext
  })

  it('reads blob, decodes audio, starts source, and calls callback once when ended', async () => {
    const cb = vi.fn(async () => Promise.resolve())

    const blob = new Blob([new Uint8Array([1, 2, 3])])
    // call playBuffer
    playBuffer(blob, cb)

    // allow FileReader.onloadend microtask to run
    await Promise.resolve()

    // At this point, an instance should have been created and its readAsArrayBuffer called
    expect(fileReaderInstances.length).toBeGreaterThan(0)
    expect(fileReaderInstances[0].readAsArrayBuffer).toHaveBeenCalled()

    // Allow decodeAudioData promise to resolve
    await Promise.resolve()

    // An AudioContext and source should have been created, and decodeAudioData called
    const audioContextInstance = audioContextInstances[0]
    expect(audioContextInstance.decodeAudioData).toHaveBeenCalled()
    expect(audioContextInstance.createBufferSource).toHaveBeenCalled()
  })
})
