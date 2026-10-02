import { render, screen } from '@testing-library/react'

import { RichText } from './rich-text'

describe('RichText', () => {
  it('renders **bold** markers as bold spans', () => {
    render(<RichText text="Lead with **measurable outcomes** early." />)
    const bold = screen.getByText('measurable outcomes')
    expect(bold.tagName).toBe('STRONG')
    expect(screen.getByText(/Lead with/)).toBeInTheDocument()
    expect(screen.getByText(/early\./)).toBeInTheDocument()
  })

  it('keeps unmatched markers literal instead of stripping them', () => {
    render(<RichText text="Costs **$10 today" />)
    expect(screen.getByText('Costs **$10 today')).toBeInTheDocument()
    expect(document.querySelector('strong')).toBeNull()
  })

  it('handles plain text and empty strings', () => {
    const { rerender } = render(<RichText text="No markers here" />)
    expect(screen.getByText('No markers here')).toBeInTheDocument()
    rerender(<RichText text="" />)
    expect(document.querySelector('strong')).toBeNull()
  })
})
