import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { creditsFunnelQuestions } from '@/mocks/funnel'
import { WebRoutes } from './routes'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('/v3/try/credits', () => {
  it('walks the quiz, reveals the credits, then asks for an account before the card', () => {
    vi.useFakeTimers()
    renderAt('/v3/try/credits')

    for (const question of creditsFunnelQuestions) {
      if (question.kind === 'text') {
        fireEvent.change(screen.getByRole('textbox', { name: question.ask }), { target: { value: 'Senior Product Designer' } })
      } else {
        const first = question.kind === 'options' ? question.options[0]?.label : question.choices[0]
        fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${first}`) }))
      }
      fireEvent.click(screen.getByRole('button', { name: /^(Continue|Finish)$/ }))
    }

    expect(screen.getByText('Putting your setup together.')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1500) })

    fireEvent.click(screen.getByRole('button', { name: 'Claim my 500 credits' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create your account')

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'darnell@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('$0 today')).toBeInTheDocument()
  })

  it('skips the account step for someone already signed in', () => {
    renderAt('/v3/try/credits?step=reward&session=signed-in')
    fireEvent.click(screen.getByRole('button', { name: 'Claim my 500 credits' }))
    expect(screen.getByText('$0 today')).toBeInTheDocument()
  })
})
