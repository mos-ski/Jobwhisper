import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { autoApplyFunnelQuestions } from '@/mocks/funnel'
import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
    </MemoryRouter>,
  )
}

describe('/v3/try/auto-apply', () => {
  it('asks every matching question, shows the matches, and gates the apply', () => {
    renderAt('/v3/try/auto-apply')

    const resume = new File(['Darnell Smith'], 'darnell-smith-resume.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/Your resume/), { target: { files: [resume] } })

    for (const question of autoApplyFunnelQuestions) {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(question.ask)
      if (question.kind === 'range') {
        fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
      } else if (question.kind === 'text') {
        fireEvent.change(screen.getByRole('combobox', { name: question.ask }), { target: { value: 'Customer Success Manager' } })
        fireEvent.click(screen.getByRole('button', { name: /^(Continue|Finish)$/ }))
      } else {
        const first = question.kind === 'options' ? question.options[0]?.label : question.choices[0]
        fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${(first ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }))
      }
    }
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('8 jobs we’d apply to for you')

    fireEvent.click(screen.getByRole('button', { name: 'Apply to all 8' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign up and your agent applies for you')
  })

  it('sends a signed-in visitor straight to the real Auto Apply review', () => {
    renderAt('/v3/try/auto-apply?step=matches&session=signed-in')
    fireEvent.click(screen.getByRole('button', { name: 'Apply to all 8' }))
    expect(screen.queryByText('Sign up and your agent applies for you.')).not.toBeInTheDocument()
  })
})
