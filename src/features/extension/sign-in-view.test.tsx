import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionSignInView } from './sign-in-view'

describe('ExtensionSignInView', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the heading and device-scope helper text', () => {
    render(<ExtensionSignInView onSignIn={() => {}} />)
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()
    expect(screen.getByText('This signs in the extension only. Your other devices stay as they are.')).toBeInTheDocument()
  })

  it('disables Sign In until both fields have a value', async () => {
    const user = userEvent.setup({ delay: null })
    render(<ExtensionSignInView onSignIn={() => {}} />)
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled()
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled()
    await user.type(screen.getByLabelText('Password'), 'password123')
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled()
  })

  it('calls onSignIn after submitting', async () => {
    const onSignIn = vi.fn()
    const user = userEvent.setup({ delay: null })
    render(<ExtensionSignInView onSignIn={onSignIn} />)
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)
    expect(onSignIn).toHaveBeenCalledTimes(1)
  })
})
