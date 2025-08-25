import { vi } from 'vitest'
import { defaultContext } from './AppContext'

vi.mock('react', () => ({
  createContext: vi.fn(() => {}),
}))

describe('AppContext', () => {
  it('should have default id', () => {
    expect(defaultContext.id).toBe('defaultId')
  })
})
