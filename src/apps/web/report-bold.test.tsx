import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(<MemoryRouter initialEntries={[path]}><WebRoutes /></MemoryRouter>)
}

describe('report system messages', () => {
  it('renders copilot report bold markers instead of raw asterisks', async () => {
    renderAt('/v3/interview-copilot/report')

    const bold = await screen.findByText('Strong product thinking')
    expect(bold.tagName).toBe('STRONG')
    expect(screen.getByText('measurable outcomes').tagName).toBe('STRONG')
    expect(screen.queryByText(/\*\*Strong/)).not.toBeInTheDocument()
  })

  it('renders interview report bold markers in scorecard items and notes', async () => {
    renderAt('/v3/interview-prep/report')

    expect((await screen.findByText('strong raw material')).tagName).toBe('STRONG')
    // Once in the summary, once in the scorecard item.
    expect(screen.getAllByText('concrete example earlier').length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByRole('tab', { name: 'Interview Details' }))
    expect(screen.getByText('Metrics were credible.').tagName).toBe('STRONG')
  })
})
