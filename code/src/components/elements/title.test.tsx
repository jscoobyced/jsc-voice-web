import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Title from './title'

describe('Title', () => {
  it('Display the Title', () => {
    render(<Title />)
    const title = screen.getByRole('heading')
    expect(title).toBeInTheDocument()
  })
})
