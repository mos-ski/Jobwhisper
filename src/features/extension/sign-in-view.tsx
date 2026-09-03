import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button, JobwhisperIcon, TextField } from '@/ui'

export type ExtensionSignInViewProps = {
  readonly onSignIn: () => void
}

export function ExtensionSignInView({ onSignIn }: ExtensionSignInViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'signing-in'>('idle')

  const canSubmit = email.trim().length > 0 && password.length > 0 && status === 'idle'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setStatus('signing-in')
    window.setTimeout(() => {
      onSignIn()
    }, 600)
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-canvas px-6 py-10 text-center">
      <JobwhisperIcon className="size-10 text-brand-mark" />
      <div>
        <h1 className="font-gowun text-lg font-semibold text-ink">Sign in to Jobwhisper</h1>
        <p className="mt-1 text-sm text-ink-muted">This signs in the extension only. Your other devices stay as they are.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid w-full gap-3 text-left">
        <TextField
          id="extension-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />
        <div className="relative">
          <TextField
            id="extension-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-9 text-ink-muted hover:text-ink"
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
        <Button type="submit" disabled={!canSubmit} loading={status === 'signing-in'}>
          Sign In
        </Button>
      </form>
    </div>
  )
}
