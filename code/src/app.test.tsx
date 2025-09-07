import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './app'

const expectedHeader = 'Hello, World!'
const expectedFooter = 'Bye, World!'

vi.mock('./components/page/header', () => ({
  default: () => <div>{expectedHeader}</div>,
}))

vi.mock('./components/page/footer', () => ({
  default: () => <footer>{expectedFooter}</footer>,
}))

describe('App component', () => {
  it('renders correctly', () => {
    render(<App />)
    expect(screen.getByText(expectedHeader)).toBeInTheDocument()
    expect(screen.getByText(expectedFooter)).toBeInTheDocument()
  })
})
