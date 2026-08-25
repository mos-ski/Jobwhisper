import { useState } from 'react'
import { Check } from 'lucide-react'

import { cn } from './cn'
import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from './dialog'

export type AddFundsDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly currentBalance: number
  readonly quickAmounts: readonly number[]
  readonly formatAmount: (value: number) => string
  readonly onAddFunds: (amount: number) => void
  readonly title?: string
  readonly description?: string
}

export function AddFundsDialog({
  open,
  onOpenChange,
  currentBalance,
  quickAmounts,
  formatAmount,
  onAddFunds,
  title = 'Add Funds',
  description = 'Add to your balance to keep going. It stays on your account until you spend it.',
}: AddFundsDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customValue, setCustomValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [addedAmount, setAddedAmount] = useState(0)

  const customAmount = customValue ? Number(customValue) : null
  const activeAmount = customAmount ?? selectedAmount
  const canSubmit = status === 'idle' && !!activeAmount && activeAmount > 0

  function reset() {
    setSelectedAmount(null)
    setCustomValue('')
    setStatus('idle')
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) reset()
  }

  function handleSubmit() {
    if (!activeAmount || activeAmount <= 0) return
    setStatus('processing')
    window.setTimeout(() => {
      setAddedAmount(activeAmount)
      onAddFunds(activeAmount)
      setStatus('success')
    }, 800)
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
              <DialogTitle>{formatAmount(addedAmount)} added</DialogTitle>
              <DialogDescription>Your new balance is {formatAmount(currentBalance + addedAmount)}.</DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <p className="mt-3 text-sm text-ink-muted">
              Current balance: <span className="font-semibold text-ink">{formatAmount(currentBalance)}</span>
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomValue('')
                  }}
                  disabled={status === 'processing'}
                  className={cn(
                    'flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                    selectedAmount === amount && !customValue
                      ? 'border-accent bg-accent-subtle text-accent shadow-control'
                      : 'border-input bg-surface text-ink-muted hover:border-border hover:text-ink',
                  )}
                >
                  {formatAmount(amount)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="add-funds-custom" className="text-xs font-medium text-ink-muted">
                Or enter a custom amount
              </label>
              <input
                id="add-funds-custom"
                type="number"
                min={1}
                step="1"
                inputMode="numeric"
                value={customValue}
                onChange={(event) => {
                  setCustomValue(event.target.value)
                  setSelectedAmount(null)
                }}
                disabled={status === 'processing'}
                placeholder="0"
                className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'processing' ? 'Adding funds…' : activeAmount ? `Add ${formatAmount(activeAmount)}` : 'Add funds'}
            </button>
          </>
        )}
      </DialogPopup>
    </Dialog>
  )
}
