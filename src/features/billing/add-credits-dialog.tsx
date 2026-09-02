import { useState } from 'react'
import { Check } from 'lucide-react'

import { Button, cn, Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from '@/ui'

export type AddCreditsDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  readonly description: string
  /** e.g. 10 for $0.10/credit, 100 for $1/credit — see PRICING.md §3. */
  readonly centsPerCredit: number
  readonly minimumDollars: number
  readonly presetDollars: readonly number[]
  readonly currentBalanceCredits: number
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
  onPurchase,
}: AddCreditsDialogProps) {
  const [selectedDollars, setSelectedDollars] = useState<number | null>(null)
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const [balanceBeforePurchase, setBalanceBeforePurchase] = useState(0)

  const customDollars = customValue ? Number(customValue) : null
  const activeDollars = showCustom ? customDollars : selectedDollars
  const meetsMinimum = activeDollars !== null && activeDollars >= minimumDollars
  const wholeCredits = activeDollars !== null && isWholeCreditAmount(activeDollars, centsPerCredit)
  const amountValid = meetsMinimum && wholeCredits
  const canSubmit = status === 'idle' && activeDollars !== null && activeDollars > 0 && amountValid
  const previewCredits = amountValid && activeDollars !== null ? creditsForDollars(activeDollars, centsPerCredit) : null

  function reset() {
    setSelectedDollars(null)
    setShowCustom(false)
    setCustomValue('')
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
              <DialogTitle>{purchasedCredits} credits added</DialogTitle>
              <DialogDescription>Your new balance is {balanceBeforePurchase + purchasedCredits} credits.</DialogDescription>
            </div>
            <Button className="w-full" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <p className="mt-3 text-sm text-ink-muted">
              Current balance: <span className="font-semibold text-ink">{currentBalanceCredits} credits</span>
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {presetDollars.map((dollars) => (
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
                    'flex min-h-11 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                    selectedDollars === dollars && !showCustom
                      ? 'border-accent bg-accent-subtle text-accent shadow-control'
                      : 'border-input bg-surface text-ink-muted hover:border-border hover:text-ink',
                  )}
                >
                  ${dollars}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setShowCustom(true)
                  setSelectedDollars(null)
                }}
                disabled={status === 'processing'}
                className={cn(
                  'flex min-h-11 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                  showCustom
                    ? 'border-accent bg-accent-subtle text-accent shadow-control'
                    : 'border-input bg-surface text-ink-muted hover:border-border hover:text-ink',
                )}
              >
                Other
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
              </div>
            ) : null}
            {activeError ? (
              <p className="mt-3 text-sm font-medium text-danger">{activeError}</p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                {previewCredits !== null ? (
                  <>
                    ${activeDollars} &rarr; <span className="font-semibold text-ink">{previewCredits} credits</span>
                  </>
                ) : (
                  `$${minimumDollars} minimum purchase`
                )}
              </p>
            )}
            <Button className="mt-4 w-full" disabled={!canSubmit} onClick={handleSubmit}>
              {status === 'processing' ? 'Adding credits…' : activeDollars ? `Add $${activeDollars}` : 'Add credits'}
            </Button>
          </>
        )}
      </DialogPopup>
    </Dialog>
  )
}
