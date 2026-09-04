import { useState } from 'react'
import { Check } from 'lucide-react'

import { Button, Checkbox, cn, Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from '@/ui'

export type AddCreditsDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  /** Feature name only, e.g. "Interview Copilot" — the dialog builds the full "X credits are valid 12 months" line around it. */
  readonly description: string
  /** e.g. 10 for $0.10/credit, 100 for $1/credit — see PRICING.md §3. */
  readonly centsPerCredit: number
  readonly minimumDollars: number
  readonly presetDollars: readonly number[]
  readonly currentBalanceCredits: number
  readonly autoReloadHint: string
  readonly onPurchase: (credits: number) => void
}

function creditsForDollars(dollars: number, centsPerCredit: number): number {
  return Math.round((dollars * 100) / centsPerCredit)
}

function isWholeCreditAmount(dollars: number, centsPerCredit: number): boolean {
  return Math.round(dollars * 100) % centsPerCredit === 0
}

export function AddCreditsDialog({
  open,
  onOpenChange,
  title,
  description,
  centsPerCredit,
  minimumDollars,
  presetDollars,
  currentBalanceCredits,
  autoReloadHint,
  onPurchase,
}: AddCreditsDialogProps) {
  const [selectedDollars, setSelectedDollars] = useState<number | null>(null)
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [autoReload, setAutoReload] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const [balanceBeforePurchase, setBalanceBeforePurchase] = useState(0)

  const customDollars = customValue ? Number(customValue) : null
  const activeDollars = showCustom ? customDollars : selectedDollars
  const meetsMinimum = activeDollars !== null && activeDollars >= minimumDollars
  const wholeCredits = activeDollars !== null && isWholeCreditAmount(activeDollars, centsPerCredit)
  const amountValid = meetsMinimum && wholeCredits
  const canSubmit = status === 'idle' && activeDollars !== null && activeDollars > 0 && amountValid

  function reset() {
    setSelectedDollars(null)
    setShowCustom(false)
    setCustomValue('')
    setAutoReload(false)
    setStatus('idle')
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) reset()
  }

  function handleSubmit() {
    if (!activeDollars || !canSubmit) return
    setStatus('processing')
    setBalanceBeforePurchase(currentBalanceCredits)
    window.setTimeout(() => {
      const credits = creditsForDollars(activeDollars, centsPerCredit)
      setPurchasedCredits(credits)
      onPurchase(credits)
      setStatus('success')
    }, 800)
  }

  let activeError: string | null = null
  if (activeDollars !== null && activeDollars > 0 && !amountValid) {
    activeError = !meetsMinimum
      ? `$${minimumDollars} minimum`
      : `Enter an amount divisible by $${(centsPerCredit / 100).toFixed(2)}`
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup aria-label={title}>
        <DialogClose />
        {status === 'success' ? (
          <div className="grid gap-4 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-positive-surface text-positive">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <div>
              <DialogTitle className="font-gowun">{purchasedCredits} credits added</DialogTitle>
              <DialogDescription>Your new balance is {balanceBeforePurchase + purchasedCredits} credits.</DialogDescription>
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogTitle className="font-gowun">{title}</DialogTitle>
            <DialogDescription>
              {description} credits are valid 12 months.{' '}
              <a href="/v3/billing/usage" className="font-semibold text-accent-text underline underline-offset-4 hover:text-accent">
                View rate card
              </a>
            </DialogDescription>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presetDollars.map((dollars) => {
                const isSelected = selectedDollars === dollars && !showCustom
                return (
                  <button
                    key={dollars}
                    type="button"
                    onClick={() => {
                      setSelectedDollars(dollars)
                      setShowCustom(false)
                      setCustomValue('')
                    }}
                    disabled={status === 'processing'}
                    className={cn(
                      'flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      isSelected ? 'border-accent bg-accent-subtle shadow-control' : 'border-input bg-surface hover:border-border',
                    )}
                  >
                    <span className="text-lg font-bold text-ink">${dollars}</span>
                    <span className="text-xs text-ink-muted">{creditsForDollars(dollars, centsPerCredit)} credits</span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => {
                  setShowCustom(true)
                  setSelectedDollars(null)
                }}
                disabled={status === 'processing'}
                className={cn(
                  'flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  showCustom ? 'border-accent bg-accent-subtle shadow-control' : 'border-input bg-surface hover:border-border',
                )}
              >
                <span className="text-sm font-semibold text-ink">Other</span>
              </button>
            </div>

            {showCustom ? (
              <div className="mt-3">
                <label htmlFor="add-credits-custom" className="text-xs font-medium text-ink-muted">
                  Amount in USD
                </label>
                <input
                  id="add-credits-custom"
                  type="number"
                  min={minimumDollars}
                  step="0.01"
                  inputMode="decimal"
                  value={customValue}
                  onChange={(event) => setCustomValue(event.target.value)}
                  disabled={status === 'processing'}
                  placeholder={String(minimumDollars)}
                  className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
                />
                {activeError ? (
                  <p className="mt-2 text-sm font-medium text-danger">{activeError}</p>
                ) : wholeCredits && meetsMinimum ? (
                  <p className="mt-2 text-sm text-ink-muted">
                    ${activeDollars} &rarr; <span className="font-semibold text-ink">{creditsForDollars(activeDollars!, centsPerCredit)} credits</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            <label className="mt-4 flex items-start gap-3 border-t border-border pt-4">
              <Checkbox checked={autoReload} onCheckedChange={(checked) => setAutoReload(checked === true)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-semibold text-ink">Auto-reload</span>
                <span className="block text-sm text-ink-muted">{autoReloadHint}</span>
              </span>
            </label>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">Current balance: <span className="font-semibold text-ink">{currentBalanceCredits} credits</span></p>
              <Button disabled={!canSubmit} onClick={handleSubmit}>
                {status === 'processing' ? 'Processing…' : 'Continue to checkout'}
              </Button>
            </div>
          </>
        )}
      </DialogPopup>
    </Dialog>
  )
}
