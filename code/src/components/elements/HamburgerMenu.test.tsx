import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HamburgerMenu from './HamburgerMenu'

afterEach(() => {
  // ensure DOM cleaned between tests
  document.body.innerHTML = ''
})

describe('HamburgerMenu', () => {
  it('renders toggle button and no menu by default, applies className', () => {
    const { container } = render(<HamburgerMenu className="extra-class" />)

    const root = container.firstElementChild as HTMLElement
    expect(root).toBeTruthy()
    expect(root.className).toContain('extra-class')
    expect(root.className).toContain('fixed')
    // menu not visible initially
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens menu, shows items, clicking Play calls onNavigate and closes menu', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<HamburgerMenu onNavigate={onNavigate} />)

    // toggle open
    const toggle = screen.getAllByRole('button')[0]
    await user.click(toggle)

    // menu and items visible
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Play/i })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /How to use/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /Sign-in|Sign-off/i }),
    ).toBeInTheDocument()

    // click Play -> navigate called and menu closes
    await user.click(screen.getByRole('menuitem', { name: /Play/i }))
    expect(onNavigate).toHaveBeenCalledWith('play')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('auth button toggles signedIn state and calls onNavigate each time', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<HamburgerMenu onNavigate={onNavigate} />)

    const toggle = screen.getAllByRole('button')[0]
    // open and click auth (Sign-in)
    await user.click(toggle)
    const auth1 = screen.getByRole('menuitem', { name: /Sign-in/i })
    await user.click(auth1)
    expect(onNavigate).toHaveBeenCalledWith('auth')
    expect(screen.queryByRole('menu')).toBeNull()

    // open again and expect label to change to Sign-off
    await user.click(toggle)
    const auth2 = screen.getByRole('menuitem', { name: /Sign-off/i })
    await user.click(auth2)
    expect(onNavigate).toHaveBeenCalledWith('auth')
    expect(onNavigate).toHaveBeenCalledTimes(2)
  })

  it('works without onNavigate and still closes menu after item click', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu />)

    const toggle = screen.getAllByRole('button')[0]
    await user.click(toggle)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // click Play with no onNavigate should simply close the menu (no throw)
    await user.click(screen.getByRole('menuitem', { name: /Play/i }))
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('can navigate to How to use', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<HamburgerMenu onNavigate={onNavigate} />)

    const toggle = screen.getAllByRole('button')[0]
    await user.click(toggle)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(screen.getByRole('menuitem', { name: /How to use/i }))
    expect(onNavigate).toHaveBeenCalledWith('howto')
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
