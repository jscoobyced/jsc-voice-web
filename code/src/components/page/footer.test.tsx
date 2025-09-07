import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Footer from './footer'

describe('Footer', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('renders correctly', () => {
    // Mock time using vitest
    vi.setSystemTime(new Date('2021-01-01'))
    render(<Footer />)
    const footerElement = screen.getByText('© JScoobyCed - 2021')
    expect(footerElement).toBeInTheDocument()
  })
})
