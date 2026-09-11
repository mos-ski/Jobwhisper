import { useEffect, useState } from 'react'

import { Button } from '@/ui'

export type ProOfferWidgetProps = {
  readonly onDismiss: () => void
  readonly onClaim: () => void
}

export function ProOfferWidget({ onDismiss, onClaim }: ProOfferWidgetProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60)
  const offerFeatures = ['Unlimited Auto Apply', '60Hrs Interview Copilot Session', '1000+ Resume Messages', '40Hrs Interview Preps']

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((value) => Math.max(value - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0')
  const seconds = (secondsRemaining % 60).toString().padStart(2, '0')

  return (
    <aside
      role="region"
      aria-label="Pro plan offer"
      className="fixed bottom-4 end-4 z-sticky w-[min(27rem,calc(100vw-2rem))] overflow-hidden rounded-panel border border-border bg-surface shadow-panel animate-ease-in-bottom motion-reduce:animate-none"
    >
      <div className="relative h-52 overflow-hidden bg-accent px-6 pt-7 text-on-accent">
        <img src="/v3-assets/figma/dfy-widget-background.svg" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
        <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="absolute inset-x-0 top-7 mx-auto h-6 w-auto" />
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close Pro plan offer"
          className="absolute end-2 top-2 grid size-11 place-items-center rounded-soft text-on-accent transition-colors hover:bg-on-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button>
        <div className="absolute inset-x-0 top-24 text-center font-gowun leading-tight">
          <h2 className="text-4xl font-normal tracking-[-0.2rem]">First Month Pro Offer</h2>
          <p className="mt-1 text-2xl tracking-[-0.08rem]">Get 60% off your first month</p>
          <p className="mt-2 text-sm font-rethink tracking-normal" aria-live="polite">Offer ends in {minutes}:{seconds}</p>
        </div>
      </div>
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-end gap-2 font-gowun leading-none whitespace-nowrap">
          <span className="text-4xl text-ink-muted line-through">$99</span>
          <span className="text-4xl text-accent">$39.60</span>
          <span className="pb-1 text-lg text-ink">/Month</span>
        </div>
        <ul className="mt-5 grid gap-3 text-base leading-6 text-ink-muted">
          {offerFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span aria-hidden="true" className="flex h-3 w-5 items-center justify-end rounded-sm bg-accent p-0.5">
                <span className="block h-2 w-2 rounded-sm bg-surface" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-6 w-full" onClick={onClaim}>Take offer now!</Button>
      </div>
    </aside>
  )
}
