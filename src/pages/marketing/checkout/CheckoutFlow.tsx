import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

export interface LineItem {
  label: string
  amount: string
}

export interface CheckoutResult {
  email: string
  password: string
  fullName: string
  companyName?: string
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="lf-input"
      />
    </div>
  )
}

/**
 * This site's own sign-up + mock-payment flow — deliberately separate from the
 * main web app's real `/auth` (this prototype branch has no relationship to
 * that account system). Two steps: create account, then pay.
 */
export function CheckoutFlow({
  productLabel,
  lineItems,
  totalLabel,
  payButtonLabel,
  accentClassName,
  collectCompany = false,
  onComplete,
  onCancel,
}: {
  productLabel: string
  lineItems: LineItem[]
  totalLabel: string
  payButtonLabel: string
  accentClassName?: string
  collectCompany?: boolean
  onComplete: (result: CheckoutResult) => void
  onCancel: () => void
}) {
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const formValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    (!collectCompany || companyName.trim().length > 0)
  const cardValid = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvc.trim().length > 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <LightforthLogo to="/" />
          <button
            onClick={() => (step === 'payment' ? setStep('form') : onCancel())}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {step === 'form' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step 1 of 2</p>
              <h1 className="mt-2 text-xl font-bold text-slate-900">Create your account</h1>
              <p className="mt-1 text-sm text-slate-500">For {productLabel}</p>
              <div className="mt-6 space-y-4">
                {collectCompany && (
                  <Field label="Company name" value={companyName} onChange={setCompanyName} placeholder="Acme Inc." />
                )}
                <Field label={collectCompany ? 'Your name' : 'Full name'} value={fullName} onChange={setFullName} placeholder="Jane Doe" />
                <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              </div>
              <Button size="lg" className="mt-7 w-full" disabled={!formValid} onClick={() => setStep('payment')}>
                Continue to payment
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step 2 of 2</p>
              <h1 className="mt-2 text-xl font-bold text-slate-900">Payment</h1>
              <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4">
                {lineItems.map(li => (
                  <div key={li.label} className="flex justify-between text-sm text-slate-600">
                    <span>{li.label}</span>
                    <span className="font-semibold text-slate-900">{li.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Total due today</span>
                  <span>{totalLabel}</span>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <Field label="Card number" value={cardNumber} onChange={setCardNumber} placeholder="4242 4242 4242 4242" />
                <div className="flex gap-3">
                  <Field label="Expiry" value={expiry} onChange={setExpiry} placeholder="MM/YY" />
                  <Field label="CVC" value={cvc} onChange={setCvc} placeholder="123" />
                </div>
              </div>
              <Button
                size="lg"
                className={`mt-7 w-full ${accentClassName ?? ''}`}
                disabled={!cardValid}
                onClick={() => onComplete({ email, password, fullName, companyName: collectCompany ? companyName : undefined })}
              >
                {payButtonLabel}
              </Button>
              <p className="mt-3 text-center text-[11px] text-slate-400">Mock checkout — no real card is charged.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
