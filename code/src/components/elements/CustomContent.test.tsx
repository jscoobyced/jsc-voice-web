import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CustomContent from './CustomContent'

describe('CustomContent', () => {
  it('renders the small default container when no props are provided', () => {
    const { container } = render(<CustomContent />)

    const wrapper = container.querySelector('div')
    const p = container.querySelector('p')

    expect(wrapper).toBeTruthy()
    expect(p).toBeTruthy()

    // smallHeight should be applied
    expect(wrapper!.className).toContain('w-5/6')
    expect(wrapper!.className).toContain('md:w-1/2')
    expect(wrapper!.className).toContain('h-24')
    expect(wrapper!.className).toContain('sm:h-16')
    expect(wrapper!.className).toContain('my-2')

    // paragraph has expected styling classes
    expect(p!.className).toContain('bg-amber-100')
    expect(p!.className).toContain('font-mono')

    // default text is empty
    expect(p!.textContent).toBe('')
  })

  it('renders the large variant and displays provided text', () => {
    const { container } = render(
      <CustomContent isSmall={false} text="Hello, hero!" />,
    )

    // content text should be visible via semantic query
    expect(screen.getByText('Hello, hero!')).toBeInTheDocument()

    // wrapper should include the largeHeight classes
    const wrapper = container.querySelector('div')
    const p = container.querySelector('p')

    expect(wrapper).toBeTruthy()
    expect(p).toBeTruthy()

    // check for large-height classes on the first container div found
    expect(wrapper!.className).toContain('w-5/6')
    expect(wrapper!.className).toContain('md:w-1/2')
    expect(wrapper!.className).toContain('h-84')
    expect(wrapper!.className).toContain('sm:h-56')
  })

  it('renders an explicit empty string text prop as empty content', () => {
    const { container } = render(<CustomContent text="" isSmall />)

    const p = container.querySelector('p')
    expect(p).toBeTruthy()
    expect(p!.textContent).toBe('')
  })
})
