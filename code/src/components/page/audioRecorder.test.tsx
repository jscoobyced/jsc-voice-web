import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, vi } from 'vitest'

// create instance mocks
const startMock = vi.fn()
const stopMock = vi.fn()

vi.mock('../../service/playService', () => {
  class MockPlayService {
    startPlaying = startMock
    stopPlaying = stopMock
    continuePlaying = vi.fn()
    constructor(/* keep same signature if needed */) {}
  }
  return { default: MockPlayService }
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
  const btn = screen.getByRole('button')
  await user.click(btn)
  expect(startMock).toHaveBeenCalled()
  const stopBtn = await screen.findByRole('button')
  await user.click(stopBtn)
  expect(stopMock).toHaveBeenCalled()
})
