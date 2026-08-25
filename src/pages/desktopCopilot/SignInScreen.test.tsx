// src/pages/desktopCopilot/SignInScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SignInScreen } from './SignInScreen'
import { setAccount } from './mockAccounts'

describe('SignInScreen', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to a welcome screen offering sign-up methods and a sign-in link, with email listed first', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} onSignUp={() => {}} />)
    expect(screen.getByText('Welcome to Lightforth Copilot')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button').map(b => b.textContent ?? '')
    const emailIdx = buttons.findIndex(t => t.includes('Continue with Email'))
    const googleIdx = buttons.findIndex(t => t.includes('Continue with Google'))
    const linkedinIdx = buttons.findIndex(t => t.includes('Continue with LinkedIn'))
    expect(emailIdx).toBeGreaterThanOrEqual(0)
    expect(emailIdx).toBeLessThan(googleIdx)
    expect(googleIdx).toBeLessThan(linkedinIdx)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('sends every sign-up method (Email, Google, LinkedIn) to the website instead of creating an account in-app', () => {
    const onSignUp = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} onSignUp={onSignUp} />)
    fireEvent.click(screen.getByText('Continue with Email'))
    expect(onSignUp).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByText('Continue with Google'))
    fireEvent.click(screen.getByText('Continue with LinkedIn'))
    expect(onSignUp).toHaveBeenCalledTimes(3)
  })

  it('switches to sign-in mode (email + password, no confirm password) when "Sign in" is clicked', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} onSignUp={() => {}} />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Confirm your password')).not.toBeInTheDocument()
  })

  it('calls onContinue with a fallback "regular" account when signing in with an email that has no account on record (validation removed — any credentials work)', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} onSignUp={() => {}} />)
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'nobody@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({
      email: 'nobody@example.com',
      track: 'regular-signin',
      existingAccount: { accountType: 'regular' },
    })
  })

  it('calls onContinue with track "regular-signin" and the existing account when signing in with a recognized email', () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} onSignUp={() => {}} />)
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({
      email: 'me@example.com',
      track: 'regular-signin',
      existingAccount: { accountType: 'regular', planId: 'premium' },
    })
  })

  it('calls onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    render(<SignInScreen onBack={onBack} onContinue={() => {}} onSignUp={() => {}} />)
    fireEvent.click(screen.getByTitle('Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('skips straight to sign-in mode (no welcome screen) when prefillEmail is set', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} onSignUp={() => {}} prefillEmail="returning@example.com" />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toHaveValue('returning@example.com')
  })
})
