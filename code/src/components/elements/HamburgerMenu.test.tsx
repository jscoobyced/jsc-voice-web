import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HamburgerMenu from './HamburgerMenu'

describe('HamburgerMenu', () => {
  it('toggles menu open/closed and shows menu items', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    const { container } = render(
      <HamburgerMenu onNavigate={onNavigate} className="extra-class" />,
    )

    // initial: only toggle button exists, menu not shown
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByRole('menu')).toBeNull()

    const toggleBtn = buttons[0]
    await user.click(toggleBtn)

    // after click menu should be visible with items
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Play/i })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /How to use/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /Sign-in|Sign-off/i }),
    ).toBeInTheDocument()

    // click Play -> onNavigate called and menu closes
    await user.click(screen.getByRole('menuitem', { name: /Play/i }))
    expect(onNavigate).toHaveBeenCalledWith('play')
    expect(screen.queryByRole('menu')).toBeNull()

    // verify className was applied to container root
    const rootDiv = container.firstElementChild as HTMLElement
    expect(rootDiv.className).toContain('extra-class')
    expect(rootDiv.className).toContain('fixed')
    expect(rootDiv.className).toContain('right-5')
  })

  it('toggles signedIn state when auth item clicked and calls onNavigate each time', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    render(<HamburgerMenu onNavigate={onNavigate} />)

    // open menu, click auth -> should show "Sign-in" initially
    const toggleBtn = screen.getAllByRole('button')[0]
    await user.click(toggleBtn)

    const authButton1 = screen.getByRole('menuitem', { name: /Sign-in/i })
    await user.click(authButton1)
    expect(onNavigate).toHaveBeenCalledWith('auth')
    // menu closes after navigation
    expect(screen.queryByRole('menu')).toBeNull()

    // open again to see the toggled label "Sign-off"
    await user.click(toggleBtn)
    const authButton2 = screen.getByRole('menuitem', { name: /Sign-off/i })
    await user.click(authButton2)
    expect(onNavigate).toHaveBeenCalledWith('auth')
    // called twice total
    expect(onNavigate).toHaveBeenCalledTimes(2)
  })

  it('works without onNavigate (no crash) and still closes menu after click', async () => {
    const user = userEvent.setup()

    render(<HamburgerMenu />)

    const toggleBtn = screen.getAllByRole('button')[0]
    await user.click(toggleBtn)

    // menu shown
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // click Play without onNavigate - should simply close menu and not throw
    await user.click(screen.getByRole('menuitem', { name: /Play/i }))
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
