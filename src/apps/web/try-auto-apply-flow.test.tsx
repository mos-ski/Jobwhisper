import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { autoApplyFunnelQuestions } from '@/mocks/funnel'
import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
    </MemoryRouter>,
  )
}

const CONTINUE = /^(Continue|Finish|Find Your Next Remote Job!)$/

describe('/v3/try/auto-apply', () => {
  it('keeps the landing focused on importing a resume', () => {
    renderAt('/v3/try/auto-apply')

    expect(screen.getByRole('heading', { name: /Get Your First Job Interview\s*in as Little as 15 Days, or Don’t Pay\./ })).toBeInTheDocument()
    expect(screen.getByLabelText('Your resume')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The #1 Site for Remote jobs' })).toBeInTheDocument()
    expect(screen.getByText('Trusted by 2M+ job seekers')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Higher Quality Listings' })).toBeInTheDocument()
    expect(screen.queryByText('AI Resume Builder')).not.toBeInTheDocument()
  })

  it('asks every matching question, searches on its own page, shows the matches, and gates the apply', async () => {
    vi.useFakeTimers()
    try {
      renderAt('/v3/try/auto-apply')

      const resume = new File(['Darnell Smith'], 'darnell-smith-resume.pdf', { type: 'application/pdf' })
      fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [resume] } })
      expect(screen.getByText('darnell-smith-resume.pdf')).toBeInTheDocument()
      fireEvent.click(screen.getAllByRole('button', { name: 'Start Your Remote Job Search Now!' })[0])

      for (const question of autoApplyFunnelQuestions) {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(question.ask)
        if (question.kind === 'range') {
          fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
        } else if (question.kind === 'text') {
          fireEvent.change(screen.getByRole('combobox', { name: question.ask }), { target: { value: 'Customer Success Manager' } })
          fireEvent.click(screen.getByRole('button', { name: CONTINUE }))
        } else if (question.kind === 'multi') {
          fireEvent.click(screen.getByRole('checkbox', { name: new RegExp(`^${(question.choices[0] ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }))
          fireEvent.click(screen.getByRole('button', { name: CONTINUE }))
        } else {
          const first = question.kind === 'options' ? question.options[0]?.label : question.choices[0]
          fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${(first ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }))
        }
      }

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Finding the best remote & flexible jobs for you')
      expect(screen.getByRole('list')).toHaveTextContent('reading your answers…')
      expect(screen.getByText('12,480')).toBeInTheDocument()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000)
      })
    } finally {
      vi.useRealTimers()
    }

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('10 jobs we’d apply to for you')

    fireEvent.click(screen.getByRole('button', { name: 'Apply to all 10' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign up and your agent applies for you')
  })

  it('opens the searching page straight from a shared link', () => {
    renderAt('/v3/try/auto-apply?step=searching')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Finding the best remote & flexible jobs for you')
    expect(screen.getByRole('list')).toHaveTextContent('reading your answers…')
    expect(screen.getByText('12,480')).toBeInTheDocument()
    expect(screen.getByText('3,478')).toBeInTheDocument()
  })

  it('sends a signed-in visitor straight to the real Auto Apply review', () => {
    renderAt('/v3/try/auto-apply?step=matches&session=signed-in')
    fireEvent.click(screen.getByRole('button', { name: 'Apply to all 10' }))
    expect(screen.queryByText('Sign up and your agent applies for you.')).not.toBeInTheDocument()
  })
})
