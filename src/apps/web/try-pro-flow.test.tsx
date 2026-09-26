import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { trialFunnelQuestions } from '@/mocks/funnel'
import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
    </MemoryRouter>,
  )
}

describe('/v3/try/pro', () => {
  it('walks the quiz, reveals the free week, then asks for an account before the card', () => {
    renderAt('/v3/try/pro')

    for (const question of trialFunnelQuestions) {
      if (question.kind === 'text') {
        fireEvent.change(screen.getByRole('combobox', { name: question.ask }), { target: { value: 'Senior Product Designer' } })
        fireEvent.click(screen.getByRole('button', { name: /^(Continue|Finish)$/ }))
      } else {
        const first = question.kind === 'options' ? question.options[0]?.label : question.choices[0]
        fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${first}`) }))
      }
    }

    fireEvent.click(screen.getByRole('button', { name: 'Claim my free week' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create your account')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'darnell@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('$0 today')).toBeInTheDocument()
  })

  it('skips the account step for someone already signed in', () => {
    renderAt('/v3/try/pro?step=reward&session=signed-in')
    fireEvent.click(screen.getByRole('button', { name: 'Claim my free week' }))
    expect(screen.getByText('$0 today')).toBeInTheDocument()
  })
})
