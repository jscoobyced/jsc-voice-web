import { playBuffer } from './playAudio'

interface StoryResponse {
  type: string
  content: string
}

export default class UpdateService {
  private queue: (string | ArrayBuffer)[] = []
  private isPlaying = false
  private callback: (() => Promise<void>) | null = null

  constructor(
    private setUserMessage: (message: string) => void,
    private setTellerMessage: (message: string) => void,
  ) {}

  queueMessage = (data: string | ArrayBuffer) => {
    this.queue.push(data)
  }

  startProcessing = async (callback?: () => Promise<void>) => {
    if (callback) this.callback = callback
    while (!this.isPlaying) {
      await this.processQueue()
      console.log('Processing queue, isPlaying:', this.isPlaying)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  private processQueue = async () => {
    const data = this.queue.shift()
    if (!data) return
    if (typeof data === 'string') {
      const storyResponse: StoryResponse = JSON.parse(data) as StoryResponse
      if (storyResponse.type === 'user')
        this.setUserMessage(storyResponse.content)
      else if (storyResponse.type === 'teller') {
        if (storyResponse.content === 'END_OF_CONVERSATION') {
          await this.callback?.()
          return
        }
        this.setTellerMessage(storyResponse.content)
      }
      await this.processQueue()
    } else if (typeof data === 'object') {
      this.isPlaying = true
      playBuffer(new Blob([data], { type: 'audio/webm' }), async () => {
        // Audio playback finished
        this.isPlaying = false
        await this.startProcessing()
      })
    }
  }
}
