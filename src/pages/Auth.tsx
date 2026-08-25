import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, EyeOff, Headphones, HelpCircle, Mail, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'

type AuthMode = 'choice' | 'email' | 'password' | 'sent' | 'login' | 'forgot'

function AuthShell({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b px-4 py-3 md:h-20 md:px-16">
        <LightforthLogo className="h-8" />
        <a
          href="https://help.lightforth.ai"
          target="_blank"
          rel="noreferrer"
          className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-primary/50 px-4 text-sm font-semibold text-primary hover:bg-blue-50 sm:px-5"
        >
          <span className="hidden sm:inline">Get Help</span>
          <Headphones className="h-4 w-4" />
        </a>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 md:pt-32">{children}</main>

      {showFooter && (
        <footer className="flex flex-col items-center justify-between gap-3 px-4 py-5 text-sm font-medium text-muted-foreground sm:flex-row md:px-16">
          <span>© Lightforth AI 2026</span>
          <a href="mailto:support@lightforth.org" className="flex items-center gap-2 hover:text-primary">
            <Mail className="h-4 w-4" />
            support@lightforth.org
          </a>
        </footer>
      )}
    </div>
  )
}

function GoogleMark() {
  return <span className="text-xl font-black text-[#4285F4]">G</span>
}

function LinkedInMark() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A66C2] text-sm font-bold text-white">
      in
    </span>
  )
}

function AuthButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-4 rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </button>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed left-4 right-4 top-20 z-50 flex min-h-12 items-center gap-3 rounded-xl bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white shadow-lg sm:left-auto sm:right-8 sm:top-24 sm:w-auto sm:px-5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
        <Check className="h-3.5 w-3.5" />
      </span>
      {message}
      <button onClick={onClose} aria-label="Dismiss message">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function Field({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  helper,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (value: string) => void
  helper?: boolean
}) {
  return (
    <label className="block">
      <span className="lf-label mb-2 block">{label}</span>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="lf-input h-11 pr-10"
        />
        {type === 'password' && <EyeOff className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        {helper && (
          <HelpCircle className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
      </div>
    </label>
  )
}

export default function Auth() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app'
  const routeMode = location.pathname.includes('forgot-password') ? 'forgot' : null
  const initialMode = useMemo<AuthMode>(() => routeMode ?? 'choice', [routeMode])

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [referral, setReferral] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accepted, setAccepted] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const handleLogin = async () => {
    await login('demo-token')
    navigate(from, { replace: true })
  }

  const handleEmailContinue = () => {
    if (!email.trim()) return
    setToast('Verification link sent to your email')
    setMode('password')
  }

  const handlePasswordContinue = () => {
    if (!password || password !== confirmPassword) return
    setMode('sent')
  }

  const handleForgot = () => {
    if (!email.trim()) return
    setToast('A reset link has been sent to your email')
  }

  if (mode === 'sent') {
    return (
      <AuthShell showFooter={false}>
        <section className="w-full max-w-[600px] bg-white px-4 py-8 text-center sm:px-10">
          <div className="mx-auto mb-6 flex h-24 w-24 rotate-[-14deg] items-center justify-center rounded-2xl bg-slate-50">
            <Mail className="h-14 w-14 text-slate-100" />
            <span className="absolute right-2 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              1
            </span>
          </div>
          <h1 className="lf-page-title">We sent an email!</h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">
            Please verify your account by clicking on the link sent to your email to access your dashboard!
          </p>
          <Button className="mt-8 h-11 w-full max-w-sm" onClick={() => setMode('login')}>
            Go to Login
          </Button>
        </section>
      </AuthShell>
    )
  }

  if (mode === 'forgot') {
    return (
      <AuthShell>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        <section className="w-full max-w-sm bg-white">
          <h1 className="lf-page-title">Forgot password?</h1>
          <p className="mt-5 text-base font-medium leading-6 text-slate-600">
            Don't worry, we can help you get back in.
            <br />
            Enter your email address.
          </p>
          <div className="mt-8">
            <Field label="Email" placeholder="Enter your email address" value={email} onChange={setEmail} />
          </div>
          <Button className="mt-7 h-11 w-full" onClick={handleForgot}>Reset Password</Button>
          <p className="mt-6 text-center text-sm font-semibold text-foreground">
            Remember?{' '}
            <button className="text-primary hover:underline" onClick={() => setMode('login')}>
              Log in
            </button>
          </p>
        </section>
      </AuthShell>
    )
  }

  if (mode === 'login') {
    return (
      <AuthShell showFooter={false}>
        <section className="w-full max-w-[520px] bg-white px-0 py-8 sm:px-8">
          <h1 className="lf-page-title">Log in</h1>
          <p className="mt-3 text-sm text-slate-600">Welcome back. Continue your job search with Lightforth.</p>
          <div className="mt-7 space-y-4">
            <Field label="Email" placeholder="Enter your email" value={email} onChange={setEmail} />
            <Field label="Password" placeholder="Enter password" type="password" value={password} onChange={setPassword} />
          </div>
          <div className="mt-3 text-right">
            <button className="text-sm font-semibold text-primary hover:underline" onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </div>
          <Button className="mt-5 h-11 w-full" onClick={handleLogin}>Log in</Button>
          <div className="mt-4 space-y-3">
            <AuthButton onClick={handleLogin}><GoogleMark /> Continue with Gmail</AuthButton>
            <AuthButton onClick={handleLogin}><LinkedInMark /> Continue with LinkedIn</AuthButton>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600">
            New to Lightforth?{' '}
            <button className="font-semibold text-primary hover:underline" onClick={() => setMode('choice')}>
              Create account
            </button>
          </p>
        </section>
      </AuthShell>
    )
  }

  if (mode === 'email') {
    return (
      <AuthShell showFooter={false}>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        <section className="relative w-full max-w-[560px] bg-white px-0 py-8 sm:px-8">
          <h1 className="lf-page-title">Create an account</h1>
          <p className="mt-4 text-sm text-slate-600">Enter your email address to begin.</p>
          <div className="mt-5 space-y-4">
            <Field label="Email" placeholder="Enter your email" value={email} onChange={setEmail} />
            <div className="relative">
              <Field label="Referral code" placeholder="Enter referral code" value={referral} onChange={setReferral} helper />
              <div className="absolute left-[55%] top-0 hidden w-72 rounded-lg border border-blue-100 bg-slate-50 p-5 text-xs leading-5 text-slate-500 shadow-lg md:block">
                Enter the referral code given to you by your referral or check your email for the code.
              </div>
            </div>
          </div>
          <label className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600 sm:gap-3">
            <input className="h-5 w-5 rounded accent-primary" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            By signing up, you agree with Lightforth's
            <a className="font-semibold text-primary underline" href="#">Terms & Conditions</a>
          </label>
          <Button className="mt-6 h-11 w-full" onClick={handleEmailContinue} disabled={!accepted}>Continue</Button>
          <div className="mt-4 space-y-3">
            <AuthButton onClick={handleEmailContinue}><GoogleMark /> Continue with Gmail</AuthButton>
            <AuthButton onClick={handleEmailContinue}><LinkedInMark /> Continue with LinkedIn</AuthButton>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button className="font-semibold text-primary hover:underline" onClick={() => setMode('login')}>
              Log in
            </button>
          </p>
        </section>
      </AuthShell>
    )
  }

  if (mode === 'password') {
    return (
      <AuthShell showFooter={false}>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        <section className="w-full max-w-[560px] bg-white px-0 py-8 sm:px-8">
          <h1 className="lf-page-title">Create an account</h1>
          <p className="mt-4 text-sm text-slate-600">Enter your email address to begin.</p>
          <div className="mt-5 space-y-6">
            <Field label="Password" placeholder="Enter password" type="password" value={password} onChange={setPassword} />
            <Field label="Confirm Password" placeholder="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          </div>
          <Button className="mt-7 h-11 w-full" onClick={handlePasswordContinue}>Continue</Button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button className="font-semibold text-violet-700 hover:underline" onClick={() => setMode('login')}>
              Log in
            </button>
          </p>
        </section>
      </AuthShell>
    )
  }

  return (
    <AuthShell showFooter={false}>
      <section className="w-full max-w-[700px] bg-white px-0 py-8 sm:px-8">
        <h1 className="lf-page-title">Create an account</h1>
        <p className="mt-5 text-base text-foreground">
          By continuing you agree to our{' '}
          <a href="#" className="underline underline-offset-2">terms of service</a> and{' '}
          <a href="#" className="underline underline-offset-2">privacy policy</a>.
        </p>
        <div className="mt-5 space-y-2">
          <AuthButton onClick={() => setMode('email')}><GoogleMark /> Continue with Gmail</AuthButton>
          <AuthButton onClick={() => setMode('email')}><LinkedInMark /> Continue with LinkedIn</AuthButton>
        </div>
        <button
          className={cn('mx-auto mt-6 block text-sm font-semibold text-slate-700 hover:text-primary')}
          onClick={() => setMode('email')}
        >
          Continue with Email
        </button>
      </section>
    </AuthShell>
  )
}
