import { useState } from 'react'
import { Check } from 'lucide-react'

import type { AutoApplyProfileSnapshot } from '@/features/auto-apply/auto-apply-view'
import { ProfileIncompleteBanner, getMissingProfileFields } from '@/features/auto-apply/auto-apply-view'
import { Button, Checkbox, cn, Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, RadioGroup, RadioGroupItem, TextField } from '@/ui'

export type DfySignupPackage = {
  readonly id: 'dfy-small' | 'dfy-large'
  readonly guaranteeLabel: string
  readonly priceLabel: string
}

export type DfySignupLead = {
  readonly packageId: DfySignupPackage['id']
  readonly excludedCompanies: string
  readonly shareSalaryExpectations: boolean
  readonly contactPreference: 'email' | 'phone' | 'either'
  readonly contactNote: string
  readonly paymentMethodLabel: string
}

export type DfySignupDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly pkg: DfySignupPackage
  readonly profile: AutoApplyProfileSnapshot
  readonly setupHref: string
  readonly savedCard: { readonly label: string; readonly expiryLabel: string }
  readonly onComplete: (lead: DfySignupLead) => void
}

type Step = 'gate' | 'questions' | 'terms' | 'payment' | 'confirmation'

const STEPPER: readonly { readonly step: Step; readonly label: string }[] = [
  { step: 'questions', label: 'Questions' },
  { step: 'terms', label: 'Agreement' },
  { step: 'payment', label: 'Payment' },
]

function StepIndicator({ step, guaranteeLabel }: { readonly step: Step; readonly guaranteeLabel: string }) {
  const activeIndex = STEPPER.findIndex((entry) => entry.step === step)
  if (activeIndex === -1) return null

  return (
    <div className="mb-4 grid gap-2.5">
      <p className="inline-flex w-fit items-center gap-1.5 bg-positive-surface px-2.5 py-1 text-xs font-semibold text-positive">
        <Check aria-hidden="true" className="size-3.5" />
        We guarantee: {guaranteeLabel}
      </p>
      <ol className="flex items-center gap-2" aria-label="Signup progress">
        {STEPPER.map((entry, index) => (
          <li key={entry.step} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold',
                index < activeIndex ? 'bg-positive-surface text-positive' : index === activeIndex ? 'bg-accent text-on-accent' : 'bg-surface-subtle text-ink-muted',
              )}
            >
              {index < activeIndex ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
            </span>
            <span className={cn('text-xs font-medium', index === activeIndex ? 'text-ink' : 'text-ink-muted')}>{entry.label}</span>
            {index < STEPPER.length - 1 ? <span aria-hidden="true" className="h-px flex-1 bg-border" /> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

function TermsBlock() {
  return (
    <div className="max-h-48 overflow-y-auto border border-border bg-surface-subtle p-3 text-xs leading-5 text-ink-muted [scrollbar-width:thin]">
      <p className="font-semibold text-ink">Done-For-You Service Agreement</p>
      <ul className="mt-2 grid gap-2 ps-4 list-disc">
        <li>Your package guarantees a fixed number of interviews landed through applications a Jobwhisper success manager submits on your behalf. This is a one-time purchase, not a subscription — your Jobwhisper access continues until we deliver the guarantee, however long that takes.</li>
        <li>We keep applying on your behalf until the guaranteed interview count is reached — a posting closing or you not being selected doesn&rsquo;t count against it.</li>
        <li>Your success manager will reach out within 2 business days of signup to schedule your onboarding call.</li>
        <li>Refunds: full refund if no applications have been submitted yet; prorated against interviews delivered after that.</li>
        <li>You can update your target roles, locations, and resume in Auto-Apply setup at any time — your success manager uses whatever is current there.</li>
      </ul>
    </div>
  )
}

export function DfySignupDialog({ open, onOpenChange, pkg, profile, setupHref, savedCard, onComplete }: DfySignupDialogProps) {
  const missingFields = getMissingProfileFields(profile)
  const [step, setStep] = useState<Step>(missingFields.length > 0 ? 'gate' : 'questions')
  const [excludedCompanies, setExcludedCompanies] = useState('')
  const [shareSalary, setShareSalary] = useState<'yes' | 'no'>('yes')
  const [contactPreference, setContactPreference] = useState<'email' | 'phone' | 'either'>('email')
  const [contactNote, setContactNote] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [paymentChoice, setPaymentChoice] = useState<'saved' | 'new'>('saved')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing'>('idle')

  function reset() {
    setStep(missingFields.length > 0 ? 'gate' : 'questions')
    setExcludedCompanies('')
    setShareSalary('yes')
    setContactPreference('email')
    setContactNote('')
    setAgreedToTerms(false)
    setPaymentChoice('saved')
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
    setStatus('idle')
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) reset()
  }

  const newCardValid = paymentChoice === 'saved' || (cardNumber.trim().length >= 12 && cardExpiry.trim().length >= 4 && cardCvc.trim().length >= 3)

  function handlePay() {
    if (!newCardValid) return
    setStatus('processing')
    window.setTimeout(() => {
      onComplete({
        packageId: pkg.id,
        excludedCompanies,
        shareSalaryExpectations: shareSalary === 'yes',
        contactPreference,
        contactNote,
        paymentMethodLabel: paymentChoice === 'saved' ? savedCard.label : `Card ending ${cardNumber.slice(-4)}`,
      })
      setStatus('idle')
      setStep('confirmation')
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup aria-label="Sign up for Done-For-You">
        <DialogClose />

        {step === 'gate' ? (
          <>
            <DialogTitle className="font-gowun">Sign up for Done-For-You</DialogTitle>
            <DialogDescription>Your success manager needs a complete profile before they can submit applications on your behalf.</DialogDescription>
            <div className="mt-4">
              <ProfileIncompleteBanner
                profile={profile}
                setupHref={setupHref}
                description="Your success manager needs these before we can start submitting applications on your behalf."
              />
            </div>
            <Button className="mt-2 w-full" onClick={() => { window.location.href = setupHref }}>
              Complete your profile
            </Button>
          </>
        ) : null}

        {step === 'questions' ? (
          <>
            <StepIndicator step={step} guaranteeLabel={pkg.guaranteeLabel} />
            <DialogTitle className="font-gowun">A few questions</DialogTitle>
            <DialogDescription>{pkg.guaranteeLabel} · {pkg.priceLabel}. We already have your target roles and locations from Auto-Apply setup.</DialogDescription>

            <div className="mt-4 grid gap-4">
              <TextField
                id="dfy-excluded-companies"
                label="Any companies you don't want us to apply to?"
                placeholder="e.g. current employer, a company under NDA"
                value={excludedCompanies}
                onChange={(event) => setExcludedCompanies(event.target.value)}
              />

              <div>
                <p className="text-sm font-medium text-ink">If an employer asks about salary expectations, can we share the range from your profile?</p>
                <RadioGroup value={shareSalary} onValueChange={(value) => setShareSalary(value as 'yes' | 'no')} className="mt-2 flex gap-4">
                  <RadioGroupItem value="yes" itemLabel="Yes, share it" />
                  <RadioGroupItem value="no" itemLabel="No, check with me first" />
                </RadioGroup>
              </div>

              <div>
                <p className="text-sm font-medium text-ink">How should your success manager reach you?</p>
                <RadioGroup value={contactPreference} onValueChange={(value) => setContactPreference(value as 'email' | 'phone' | 'either')} className="mt-2 flex flex-wrap gap-4">
                  <RadioGroupItem value="email" itemLabel="Email" />
                  <RadioGroupItem value="phone" itemLabel="Phone" />
                  <RadioGroupItem value="either" itemLabel="Either" />
                </RadioGroup>
              </div>

              <TextField
                id="dfy-contact-note"
                label="Best time or timezone to reach you (optional)"
                placeholder="e.g. weekday afternoons, PT"
                value={contactNote}
                onChange={(event) => setContactNote(event.target.value)}
              />
            </div>

            <Button className="mt-4 w-full" onClick={() => setStep('terms')}>
              Continue
            </Button>
          </>
        ) : null}

        {step === 'terms' ? (
          <>
            <StepIndicator step={step} guaranteeLabel={pkg.guaranteeLabel} />
            <DialogTitle className="font-gowun">Service agreement</DialogTitle>
            <DialogDescription>Read and accept before we set up your onboarding call.</DialogDescription>

            <div className="mt-4 grid gap-4">
              <TermsBlock />
              <label className="flex items-start gap-3 border-t border-border pt-4">
                <Checkbox checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked === true)} className="mt-0.5" />
                <span className="text-sm text-ink">I have read and agree to the Done-For-You Service Agreement above.</span>
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => setStep('questions')}>Back</Button>
              <Button className="flex-1" disabled={!agreedToTerms} onClick={() => setStep('payment')}>
                Continue to payment
              </Button>
            </div>
          </>
        ) : null}

        {step === 'payment' ? (
          <>
            <StepIndicator step={step} guaranteeLabel={pkg.guaranteeLabel} />
            <DialogTitle className="font-gowun">Payment</DialogTitle>
            <DialogDescription>{pkg.guaranteeLabel} · {pkg.priceLabel}</DialogDescription>

            <RadioGroup value={paymentChoice} onValueChange={(value) => setPaymentChoice(value as 'saved' | 'new')} className="mt-4 gap-3">
              <label className={cn('flex items-center gap-3 border p-3', paymentChoice === 'saved' ? 'border-accent bg-accent-subtle' : 'border-input')}>
                <RadioGroupItem value="saved" />
                <span className="text-sm">
                  <span className="block font-semibold text-ink">{savedCard.label}</span>
                  <span className="block text-ink-muted">Expires {savedCard.expiryLabel}</span>
                </span>
              </label>
              <label className={cn('flex items-center gap-3 border p-3', paymentChoice === 'new' ? 'border-accent bg-accent-subtle' : 'border-input')}>
                <RadioGroupItem value="new" />
                <span className="text-sm font-semibold text-ink">Add a new card</span>
              </label>
            </RadioGroup>

            {paymentChoice === 'new' ? (
              <div className="mt-3 grid gap-3">
                <TextField id="dfy-card-number" label="Card number" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <TextField id="dfy-card-expiry" label="Expiry" placeholder="MM/YY" value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} />
                  <TextField id="dfy-card-cvc" label="CVC" placeholder="123" value={cardCvc} onChange={(event) => setCardCvc(event.target.value)} />
                </div>
                <p className="text-xs text-ink-muted">Mock checkout — no real card is charged.</p>
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => setStep('terms')}>Back</Button>
              <Button className="flex-1" disabled={!newCardValid || status === 'processing'} onClick={handlePay}>
                {status === 'processing' ? 'Processing…' : `Complete purchase — ${pkg.priceLabel}`}
              </Button>
            </div>
          </>
        ) : null}

        {step === 'confirmation' ? (
          <div className="grid gap-4 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-positive-surface text-positive">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <div>
              <DialogTitle className="font-gowun">You're all set</DialogTitle>
              <DialogDescription>A success manager will review your profile and reach out within 2 business days to schedule your onboarding call.</DialogDescription>
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        ) : null}
      </DialogPopup>
    </Dialog>
  )
}
