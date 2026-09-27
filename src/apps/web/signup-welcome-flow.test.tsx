import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { WebRoutes } from './routes'

function Where() {
  const location = useLocation()
  return <output data-testid="where">{location.pathname + location.search}</output>
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <WebRoutes />
      <Where />
    </MemoryRouter>,
  )
}

describe('After sign-up', () => {
  it('goes to profile setup, not the pricing page', async () => {
    const user = userEvent.setup()
    renderAt('/v3/auth/create-account')
    await user.click(screen.getByRole('button', { name: 'Sign up with Google' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/v3/onboarding/profile')
  })

  it('takes a returning user from sign-in straight to the dashboard', async () => {
    const user = userEvent.setup()
    renderAt('/v3/auth/sign-in')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/v3/app')
  })

  it('opens the first-month offer in the centre of the dashboard, once', async () => {
    const user = userEvent.setup()
    renderAt('/v3/app?welcome=1')
    expect(await screen.findByRole('dialog', { name: 'Special One-time Trial' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close Pro plan offer' }))
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/v3\/app\?offer=banner$/)
  })

  it('keeps the deal as a top banner after the offer is closed', async () => {
    const user = userEvent.setup()
    renderAt('/v3/app?welcome=1')
    await user.click(await screen.findByRole('button', { name: 'Close Pro plan offer' }))

    const banner = screen.getByRole('region', { name: 'Pro trial offer' })
    expect(banner).toHaveTextContent('Try Pro for 7 days for $1.39, 94% off')
    await user.click(screen.getByRole('button', { name: 'Upgrade now' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/v3/billing?plan=pro&offer=welcome-60')
  })

  it('shows no offer on an ordinary dashboard visit', () => {
    renderAt('/v3/app')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Pro trial offer' })).not.toBeInTheDocument()
  })

  it('claims the offer into billing', async () => {
    renderAt('/v3/app?welcome=1')
    fireEvent.click(await screen.findByRole('button', { name: 'Try 1 week for $1.39' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/v3/billing?plan=pro&offer=welcome-60')
  })
})
