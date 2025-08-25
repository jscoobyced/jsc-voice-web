import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './app'

const expected = 'Hello, World!'

vi.mock('./components/header', () => ({
  default: () => <div>{expected}</div>,
}))

describe('App component', () => {
  it('renders correctly', () => {
    render(<App />)
    expect(screen.getByText(expected)).toBeInTheDocument()
  })
})
