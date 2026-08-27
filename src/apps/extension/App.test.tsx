import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('extension App', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the sign-in screen and moves to the popup shell after signing in', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)

    expect(await screen.findByRole('tab', { name: 'Run' })).toBeInTheDocument()
  })

  it('returns to sign-in after signing out', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)
    await screen.findByRole('tab', { name: 'Run' })

    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()
  })
})
