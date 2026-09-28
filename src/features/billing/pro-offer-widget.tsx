import { useEffect, useId, useState, type CSSProperties, type PointerEvent } from 'react'

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

const MAX_TILT_DEG = 8

/** Tilts the card toward the pointer in 3D. Mouse only, and not at all under reduced motion. */
function useTilt() {
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null)

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width - 0.5
    const py = (event.clientY - box.top) / box.height - 0.5
    setTilt({ x: -py * MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 })
  }

  const style: CSSProperties = {
    transform: tilt ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` : 'perspective(900px)',
    transition: tilt ? 'transform 80ms ease-out' : 'transform 400ms ease-out',
  }
  return { style, onPointerMove, onPointerLeave: () => setTilt(null) }
}

type ProOfferCardProps = Omit<ProOfferWidgetProps, 'onDismiss'> & {
  readonly onDismiss?: () => void
  readonly titleId?: string
}

const OFFER_FEATURES = ['Unlimited Interview Help Copilot', 'Unlimited AI Auto Apply Jobs', '500+ Tailored Resume', '100+ Hrs Interview Preps'] as const

/** A switched-on toggle, drawn small: each feature is something the week turns on. */
function ToggleBullet() {
  return (
    <span aria-hidden="true" className="flex w-5 shrink-0 justify-end rounded-sm bg-accent p-px shadow-sm">
      <span className="h-2 w-2.5 rounded-sm bg-surface shadow-sm" />
    </span>
  )
}

function ProOfferCard({ onDismiss, onClaim, titleId, endsAt }: ProOfferCardProps) {
  const remaining = useCountdown(endsAt)

  return (
    <div className="relative isolate">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-wash-mint to-transparent" />
      <div className="relative h-52 overflow-hidden bg-accent px-6 pt-7 text-on-accent">
        <img src="/v3-assets/figma/dfy-widget-background.svg" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
        <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="absolute inset-x-0 top-9 mx-auto h-5 w-auto" />
        {onDismiss ? <button
          type="button"
          onClick={onDismiss}
          aria-label="Close Pro plan offer"
          className="absolute end-2 top-2 z-10 grid size-11 place-items-center rounded-soft text-on-accent transition-colors hover:bg-on-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button> : null}
        <div className="absolute inset-x-0 top-24 px-4 text-center font-gowun">
          <h2 id={titleId} className="text-[2rem] font-normal leading-10 tracking-[-0.18rem]">Special One-time Trial</h2>
          <p className="text-base leading-5 tracking-[-0.05rem]">Land 3x more interviews with Pro now</p>
        </div>
      </div>
      {/* The wave rides over the seam between the blue header and the white body. */}
      <img src="/v3-assets/figma/pro-offer-wave.svg" alt="" className="pointer-events-none relative -mt-5 block h-10 w-full" />
      <div className="px-6 sm:px-7">
        <div className="pb-3 pt-4 text-center">
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-ink">
            Try Pro for 7 days
            <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-bold text-accent-text">80% OFF</span>
          </p>
          <div className="mt-3 border-t border-border py-3">
            <p className="font-gowun text-5xl leading-none tracking-[-0.2rem]">
              <span className="text-ink-muted">Just</span> <span className="text-accent-text">$4.57</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted"><s>$22.85/week</s></p>
          </div>
        </div>
        <ul className="grid gap-3" aria-label="Included in the Pro week">
          {OFFER_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-lg leading-6 text-ink-muted sm:text-xl">
              <ToggleBullet />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-6 sm:px-7">
        <Button className="min-h-11 w-full text-sm" onClick={onClaim}>
          <span>Try 1 week for <strong className="font-bold">$4.57</strong></span>
          {/* The countdown ticks every second, so it is left out of the button's spoken name. */}
          <span aria-hidden="true" className="ms-1 tabular-nums opacity-80">Ends in {remaining}</span>
        </Button>
        <p className="mt-1.5 text-center text-xs leading-5 text-ink-muted">Then Pro at $99/month, billed monthly. Cancel anytime.</p>
      </div>
    </div>
  )
}

export type ProOfferPanelProps = {
  readonly onClaim: () => void
  readonly endsAt?: number
}

/** The same offer card, sitting in the flow of a page rather than pinned to a corner. */
export function ProOfferPanel({ onClaim, endsAt }: ProOfferPanelProps) {
  const tilt = useTilt()
  return (
    <section aria-label="Pro plan offer" {...tilt} className="mx-auto w-full max-w-md overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <ProOfferCard onClaim={onClaim} endsAt={endsAt} />
    </section>
  )
}

/** The offer as a card pinned to the corner of a page the visitor is already reading. */
export function ProOfferWidget({ onDismiss, onClaim, endsAt }: ProOfferWidgetProps) {
  const tilt = useTilt()
  return (
    <aside
      {...tilt}
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
      className="flex items-center justify-center gap-3 bg-surface-inverse px-4 py-1 text-sm text-surface"
    >
      <p className="min-w-0 truncate">
        <span className="hidden font-semibold sm:inline">Your special offer ends soon. </span>
        <span className="sm:hidden">Pro for 7 days, <span className="font-semibold">$4.57</span></span>
        <span className="hidden sm:inline">Try Pro for 7 days for $4.57, 80% off.</span>
      </p>
      <button
        type="button"
        onClick={onClaim}
        className="relative inline-flex min-h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-surface px-3 before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] text-sm font-semibold text-ink hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse sm:px-4"
      >
        <span aria-hidden="true" className="tabular-nums text-ink-muted"><span className="hidden sm:inline">Ends in </span>{remaining}</span>
        <span aria-hidden="true" className="hidden text-ink-muted sm:inline">|</span>
        Upgrade now
      </button>
    </aside>
  )
}
