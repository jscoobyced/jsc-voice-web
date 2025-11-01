import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MenuButton from './MenuButton'

describe('MenuButton', () => {
  it('renders children and default attributes', async () => {
    const user = userEvent.setup()
    render(<MenuButton>Hi</MenuButton>)

    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Hi')
    // default type should be "button"
    expect(btn).toHaveAttribute('type', 'button')
    // default classes from base should be present
    expect(btn.className).toContain('w-full')
    // clicking without onClick does not throw
    await user.click(btn)
  })

  it('applies role, custom type, merges className and calls onClick when enabled', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    render(
      <MenuButton
        role="menuitem"
        type="submit"
        className="extra-class"
        onClick={handler}
      >
        Go
      </MenuButton>,
    )

    const btn = screen.getByRole('menuitem', { name: /Go/i })
    expect(btn).toHaveAttribute('type', 'submit')
    expect(btn.className).toContain('extra-class')
    expect(btn.className).toContain('w-full')
    await user.click(btn)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(btn).not.toBeDisabled()
  })

  it('does not call onClick when disabled and still renders children', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    render(
      <MenuButton disabled onClick={handler}>
        CantClick
      </MenuButton>,
    )

    const btn = screen.getByRole('button', { name: /CantClick/i })
    expect(btn).toBeDisabled()
    await user.click(btn)
    expect(handler).not.toHaveBeenCalled()
  })

  it('supports async onClick handlers (returns a Promise) and still invokes them', async () => {
    const user = userEvent.setup()
    const handler = vi.fn(async () => {
      await Promise.resolve('ok')
    })
    render(<MenuButton onClick={handler}>Async</MenuButton>)

    const btn = screen.getByRole('button', { name: /Async/i })
    await user.click(btn)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
