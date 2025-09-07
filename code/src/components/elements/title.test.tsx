import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Title from './title'

describe('Title', () => {
  it('Display the Title', () => {
    const titleText = 'Hello, World!'
    render(<Title title={titleText} />)
    const title = screen.getByRole('heading', { name: titleText })
    expect(title).toBeInTheDocument()
  })
})
