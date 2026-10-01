import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(<MemoryRouter initialEntries={[path]}><WebRoutes /></MemoryRouter>)
}

describe('/v3/try/copilot', () => {
  it('walks from role to resume, interview stage, and the Pro offer', () => {
    renderAt('/v3/try/copilot')

    expect(screen.getByRole('heading', { name: /Pass Your Next Interview/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Ace my Interview' }))
    expect(screen.getByRole('heading', { name: 'Tell us what job title(s) you have in mind.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Product Manager' }))
    expect(screen.getByRole('button', { name: 'Remove Product Manager' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('heading', { name: 'Upload a resume, so we can tell you how to prepare' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Your resume'), { target: { files: [new File(['resume'], 'resume.pdf', { type: 'application/pdf' })] } })

    expect(screen.getByRole('heading', { name: 'What interview stage are you preparing for?' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Technical Stage/ }))

    expect(screen.getByRole('heading', { name: /You are set!/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start my 7 days for $10' })).toBeInTheDocument()
  })

  it('supports direct review of every Figma screen', () => {
    const { unmount } = render(<MemoryRouter initialEntries={['/v3/try/copilot?step=upload']}><WebRoutes /></MemoryRouter>)
    expect(screen.getByText('Your resume')).toBeInTheDocument()
    unmount()

    renderAt('/v3/try/copilot?step=offer')
    expect(screen.getByText('Unlimited Interview Copilot')).toBeInTheDocument()
  })
})
