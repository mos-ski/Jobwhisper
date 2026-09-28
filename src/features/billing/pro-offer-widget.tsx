import { useEffect, useId, useState } from 'react'

import { Button, Dialog, DialogPopup } from '@/ui'

export type ProOfferWidgetProps = {
  readonly onDismiss: () => void
  readonly onClaim: () => void
  /** When the offer expires, as epoch milliseconds. Pass the same value to every surface so they count down together. Defaults to an hour from first render. */
  readonly endsAt?: number
}

const OFFER_WINDOW_MS = 60 * 60 * 1000

function useCountdown(endsAt: number | undefined): string {
  const [deadline] = useState(() => endsAt ?? Date.now() + OFFER_WINDOW_MS)
  const target = endsAt ?? deadline
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const secondsRemaining = Math.max(Math.ceil((target - now) / 1000), 0)
  const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0')
  const seconds = (secondsRemaining % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

type ProOfferCardProps = Omit<ProOfferWidgetProps, 'onDismiss'> & {
  readonly onDismiss?: () => void
  readonly titleId?: string
}

function ProOfferCard({ onDismiss, onClaim, titleId, endsAt }: ProOfferCardProps) {
  const remaining = useCountdown(endsAt)

  return (
    <>
      <div className="relative h-52 overflow-hidden bg-accent px-6 pt-7 text-on-accent">
        <img src="/v3-assets/figma/dfy-widget-background.svg" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
        <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="absolute inset-x-0 top-7 mx-auto h-6 w-auto" />
        {onDismiss ? <button
          type="button"
          onClick={onDismiss}
          aria-label="Close Pro plan offer"
          className="absolute end-2 top-2 grid size-11 place-items-center rounded-soft text-on-accent transition-colors hover:bg-on-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button> : null}
        <div className="absolute inset-x-0 top-20 text-center font-gowun leading-tight">
          <h2 id={titleId} className="text-4xl font-normal tracking-[-0.2rem]">Special One-time Trial</h2>
          <p className="mt-2 text-xl tracking-[-0.06rem]">Land 3x more interviews with Pro now</p>
        </div>
      </div>
      <div className="px-6 pb-6 pt-6 sm:px-7">
        <div className="rounded-2xl border-2 border-dashed border-border text-center">
          <div className="px-4 pb-4 pt-5">
            <p className="flex flex-wrap items-center justify-center gap-2 text-base font-semibold text-ink">
              Try Pro for 7 days
              <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-sm font-bold text-accent-text">94% OFF</span>
            </p>
            <p className="mt-2 font-gowun text-5xl leading-none text-ink">Just <span className="font-bold text-accent">$1.39</span></p>
            <p className="mt-2 text-lg text-ink-muted"><s>$22.85/week</s></p>
          </div>
        </div>
        <Button className="mt-5 min-h-12 w-full text-base" onClick={onClaim}>
          Try 1 week for $1.39
          {/* The countdown ticks every second, so it is left out of the button's spoken name. */}
          <span aria-hidden="true" className="ms-1 tabular-nums opacity-80">Ends in {remaining}</span>
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-ink-muted">Then Pro at $99/month, billed monthly. Cancel anytime.</p>
      </div>
    </>
  )
}

export type ProOfferPanelProps = {
  readonly onClaim: () => void
  readonly endsAt?: number
}

/** The same offer card, sitting in the flow of a page rather than pinned to a corner. */
export function ProOfferPanel({ onClaim, endsAt }: ProOfferPanelProps) {
  return (
    <section aria-label="Pro plan offer" className="mx-auto w-full max-w-md overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <ProOfferCard onClaim={onClaim} endsAt={endsAt} />
    </section>
  )
}

/** The offer as a card pinned to the corner of a page the visitor is already reading. */
export function ProOfferWidget({ onDismiss, onClaim, endsAt }: ProOfferWidgetProps) {
  return (
    <aside
      role="region"
      aria-label="Pro plan offer"
      className="fixed bottom-4 end-4 z-sticky w-[min(27rem,calc(100vw-2rem))] overflow-hidden rounded-panel border border-border bg-surface shadow-panel animate-ease-in-bottom motion-reduce:animate-none"
    >
      <ProOfferCard onDismiss={onDismiss} onClaim={onClaim} endsAt={endsAt} />
    </aside>
  )
}

export type ProOfferDialogProps = ProOfferWidgetProps & {
  readonly open: boolean
}

/** The same offer, centred over the page as a modal, e.g. on the dashboard straight after sign-up. */
export function ProOfferDialog({ open, onDismiss, onClaim, endsAt }: ProOfferDialogProps) {
  const titleId = useId()
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onDismiss() }}>
      <DialogPopup aria-labelledby={titleId} className="overflow-hidden p-0 pb-0 sm:max-w-md sm:pb-0">
        <ProOfferCard onDismiss={onDismiss} onClaim={onClaim} titleId={titleId} endsAt={endsAt} />
      </DialogPopup>
    </Dialog>
  )
}

export type ProOfferBannerProps = {
  readonly onClaim: () => void
  /** Same deadline as the dialog, so closing the dialog does not reset the clock. */
  readonly endsAt?: number
}

/** The offer as a bar across the top of the page, kept after someone closes the dialog. */
export function ProOfferBanner({ onClaim, endsAt }: ProOfferBannerProps) {
  const remaining = useCountdown(endsAt)
  return (
    <aside
      role="region"
      aria-label="Pro trial offer"
      data-slot="pro-offer-banner"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-surface-inverse px-4 py-2.5 text-center text-sm text-surface"
    >
      <p>
        <span className="font-semibold">Your special offer ends soon.</span> Try Pro for 7 days for $1.39, 94% off.
      </p>
      <button
        type="button"
        onClick={onClaim}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold text-ink hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse"
      >
        <span aria-hidden="true" className="tabular-nums text-ink-muted">Ends in {remaining}</span>
        <span aria-hidden="true" className="text-ink-muted">|</span>
        Upgrade now
      </button>
    </aside>
  )
}
