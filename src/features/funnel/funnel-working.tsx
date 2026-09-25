import { LoaderCircle } from 'lucide-react'

import { FunnelTitle } from './funnel-shell'

export type FunnelWorkingProps = {
  readonly title: string
  /** What is being checked, in the order it happens. */
  readonly checks: readonly string[]
}

export function FunnelWorking({ title, checks }: FunnelWorkingProps) {
  return (
    <div role="status" data-slot="funnel-working" className="grid gap-8">
      <FunnelTitle>{title}</FunnelTitle>
      <ul className="grid gap-4">
        {checks.map((check) => (
          <li key={check} className="flex items-center gap-3 text-lg text-ink">
            <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin text-accent-text motion-reduce:animate-none" />
            {check}
          </li>
        ))}
      </ul>
    </div>
  )
}
