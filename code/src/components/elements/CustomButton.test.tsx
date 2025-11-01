import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, vi } from 'vitest'

vi.mock('../../service/coloredText', () => ({
  // the component imports `randomColorPerLetter as randomColorPerWord`
  randomColorPerLetter: vi.fn((s: string) => `colored:${s}`),
}))

import { randomColorPerLetter } from '../../service/coloredText'
import CustomButton from './CustomButton'

afterEach(() => {
  vi.resetAllMocks()
})

describe('CustomButton', () => {
  it('renders transformed children using randomColorPerLetter and merges className', async () => {
    // ensure mock returns a recognizable value
    ;(randomColorPerLetter as unknown as any).mockImplementationOnce(
      (s: string) => `**${s}**`,
    )

    render(
      <CustomButton className="extra-class" onClick={() => {}}>
        Hello
      </CustomButton>,
    )

    const btn = screen.getByRole('button')
    // transformed content should be rendered
    expect(btn).toHaveTextContent('**Hello**')
    // the helper should be called with the original children string
    expect(randomColorPerLetter).toHaveBeenCalledWith('Hello')
    // custom class should be merged with base classes (check a known base token)
    expect(btn.className).toContain('extra-class')
    expect(btn.className).toContain('bg-amber-100')
  })

  it('calls onClick when clicked and not disabled', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    ;(randomColorPerLetter as unknown as any).mockReturnValue('X')

    render(<CustomButton onClick={handler}>ClickMe</CustomButton>)

    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    ;(randomColorPerLetter as unknown as any).mockReturnValue('X')

    render(
      <CustomButton onClick={handler} disabled>
        NoClick
      </CustomButton>,
    )

    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(handler).not.toHaveBeenCalled()
    // still renders transformed content
    expect(btn).toHaveTextContent('X')
  })

  it('uses provided type prop and defaults to button when omitted', () => {
    ;(randomColorPerLetter as unknown as any).mockReturnValue('Y')

    const { rerender } = render(
      <CustomButton type="submit" onClick={() => {}}>
        Submit
      </CustomButton>,
    )

    let btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('type', 'submit')

    // when type omitted, default should be "button"
    rerender(<CustomButton onClick={() => {}}>Default</CustomButton>)
    btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('type', 'button')
  })
})
