import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
    </MemoryRouter>,
  )
}

describe('/v3/try/resume', () => {
  it('refuses a file it cannot read and says how to fix it', () => {
    renderAt('/v3/try/resume')
    const image = new File(['x'], 'headshot.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [image] } })
    expect(screen.getByRole('alert')).toHaveTextContent('Upload a PDF, DOC, DOCX or TXT file')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Let’s analyze your resume')
  })

  it('analyzes on its own page, scores, shows the rewrite, and asks for an account at download', async () => {
    vi.useFakeTimers()
    try {
      renderAt('/v3/try/resume')
      const resume = new File(['Darnell Smith'], 'darnell-smith-resume.pdf', { type: 'application/pdf' })
      fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [resume] } })
      fireEvent.click(screen.getByRole('button', { name: 'Analyze for free' }))

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analyzing your resume')
      expect(screen.getByRole('list')).toHaveTextContent('reading darnell-smith-resume.pdf…')
      expect(screen.getByText('(in progress)')).toBeInTheDocument()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(2200)
      })
    } finally {
      vi.useRealTimers()
    }

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Likely filtered out')
    fireEvent.click(screen.getByRole('button', { name: /See it fixed/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Download my resume' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create a free account to download it')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'darnell@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your resume is downloading')
  })

  it('opens the analyzing page straight from a shared link', () => {
    renderAt('/v3/try/resume?step=analyzing')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Analyzing your resume')
    expect(screen.getByRole('list')).toHaveTextContent('reading your resume…')
  })

  it('downloads straight away for someone signed in', () => {
    renderAt('/v3/try/resume?step=compare&session=signed-in')
    fireEvent.click(screen.getByRole('button', { name: 'Download my resume' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your resume is downloading')
  })
})
