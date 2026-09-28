import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/ui'

import { PlanAmount, PlanCard } from './plan-card'
import type { CreditProduct } from './pricing-products'

const wholeDollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const withCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const money = { format: (value: number) => (Number.isInteger(value) ? wholeDollars : withCents).format(value) }

function packLabel(product: CreditProduct, dollars: number): string {
  const units = Math.round(dollars / product.rate)
  return `${units.toLocaleString('en-US')} ${units === 1 ? product.unitNoun.one : product.unitNoun.many}`
}

/** Figma 1206:4291's filled bolt, softer-cornered than lucide's Zap. */
function LightningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[1.125rem] shrink-0 fill-current text-ink-muted">
      <path d="M14.24 8.45a.46.46 0 0 0-.3-.32l-3.44-.5.87-4.84a.46.46 0 0 0-.24-.49.5.5 0 0 0-.57.09L3.88 9.14a.44.44 0 0 0-.12.41c.02.07.06.14.1.2.06.05.12.1.2.12l3.44.5-.87 4.84c-.02.1 0 .2.04.28.04.09.11.16.2.2a.5.5 0 0 0 .57-.08l6.68-6.75a.44.44 0 0 0 .12-.41Z" />
    </svg>
  )
}

export type CreditPackPickerProps = {
  readonly product: CreditProduct
  /** The chosen pack, in dollars. */
  readonly value: number
  readonly onChange: (dollars: number) => void
}

/** Which pack to buy: what it gets you, with its price beneath, opening in place under the price. */
export function CreditPackPicker({ product, value, onChange }: CreditPackPickerProps) {
  const [open, setOpen] = useState(false)
  const listId = useId()

  return (
    <div className="grid gap-1" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-border bg-surface-subtle px-2.5 text-start text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <LightningIcon />
        <span className="min-w-0 flex-1 truncate">{packLabel(product, value)}</span>
        <span className="sr-only">, change pack</span>
        <ChevronDown aria-hidden="true" className={cn('size-3.5 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
      </button>
      {open ? (
        <fieldset id={listId} className="overflow-hidden rounded-lg border border-border bg-surface">
          <legend className="sr-only">{product.name} credit pack</legend>
          {product.packs.map((dollars) => (
            <label key={dollars} className={cn('flex min-h-14 cursor-pointer items-start gap-3 px-3 py-2.5', value === dollars ? 'bg-surface-subtle' : 'hover:bg-surface-subtle')}>
              <input
                type="radio"
                name={listId}
                checked={value === dollars}
                onChange={() => {
                  onChange(dollars)
                  setOpen(false)
                }}
                className="mt-0.5 size-4 shrink-0 accent-[var(--lf-accent)]"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">{packLabel(product, dollars)}</span>
                <span className="block text-xs text-ink-muted">{money.format(dollars)}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}
    </div>
  )
}

export type CreditProductCardProps = {
  readonly product: CreditProduct
  readonly ctaLabel: string
  readonly onBuy?: (productId: string, dollars: number) => void
}

/** A pay-as-you-go card whose price follows the pack chosen in its picker. */
export function CreditProductCard({ product, ctaLabel, onBuy }: CreditProductCardProps) {
  const [dollars, setDollars] = useState(product.packs[0] ?? 10)
  return (
    <PlanCard
      name={product.name}
      tagline={product.tagline}
      amount={<PlanAmount>{money.format(dollars)}</PlanAmount>}
      unit="one time"
      priceNote={`${money.format(product.rate)} ${product.rateUnit}`}
      picker={<CreditPackPicker product={product} value={dollars} onChange={setDollars} />}
      terms={product.terms}
      features={product.features}
      ctaLabel={ctaLabel}
      onCta={onBuy ? () => onBuy(product.id, dollars) : undefined}
      plan={product.wash}
    />
  )
}
