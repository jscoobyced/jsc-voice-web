import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, vi } from 'vitest'

// create instance mocks
const startMock = vi.fn()
const stopMock = vi.fn()

vi.mock('../../service/playService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      startPlaying: startMock,
      stopPlaying: stopMock,
    })),
  }
})

// now import the component after mocking
import AudioRecorder from './audioRecorder'

beforeEach(() => {
  startMock.mockClear()
  stopMock.mockClear()
})

it('calls startPlaying and stopPlaying', async () => {
  const user = userEvent.setup()
  render(<AudioRecorder />)
  const btn = screen.getByRole('button', { name: /Start playing/i })
  await user.click(btn)
  expect(startMock).toHaveBeenCalled()
  const stopBtn = await screen.findByRole('button', { name: /Stop playing/i })
  await user.click(stopBtn)
  expect(stopMock).toHaveBeenCalled()
})
