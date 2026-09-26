import { useEffect, useState } from 'react'
import { CircleCheck, LoaderCircle } from 'lucide-react'

import { cn } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelWorkingProps = {
  readonly title: string
  /** What is being checked, in the order it happens. */
  readonly checks: readonly string[]
  /** Time each check takes on screen. Defaults to 450ms. */
  readonly stepMs?: number
}

export function FunnelWorking({ title, checks, stepMs = 450 }: FunnelWorkingProps) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (done >= checks.length) return
    const timer = window.setTimeout(() => setDone((count) => count + 1), stepMs)
    return () => window.clearTimeout(timer)
  }, [done, checks.length, stepMs])

  return (
    <div role="status" data-slot="funnel-working" className="grid gap-10">
      <FunnelTitle>{title}</FunnelTitle>
      <ol className="mx-auto grid w-full max-w-sm gap-4">
        {checks.map((check, index) => {
          const state = index < done ? 'done' : index === done ? 'active' : 'waiting'
          return (
            <li key={check} data-state={state} className={cn('flex items-center gap-3 text-lg transition-colors duration-normal motion-reduce:transition-none', state === 'waiting' ? 'text-ink-muted' : 'text-ink')}>
              {state === 'done' ? <CircleCheck aria-hidden="true" className="size-6 shrink-0 text-positive" /> : null}
              {state === 'active' ? <LoaderCircle aria-hidden="true" className="size-6 shrink-0 animate-spin text-accent-text motion-reduce:animate-none" /> : null}
              {state === 'waiting' ? <span aria-hidden="true" className="size-6 shrink-0 rounded-full border-2 border-border" /> : null}
              <span>{check}</span>
              {state === 'done' ? <span className="sr-only">, done</span> : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
