import { useState, type ReactNode } from 'react'
import { MoveHorizontal } from 'lucide-react'

export type ResumeCompareProps = {
  /** The page as it was, under the wipe. */
  readonly before: ReactNode
  /** The page as it is now, revealed from the left as the handle moves right. */
  readonly after: ReactNode
  readonly beforeLabel: string
  readonly afterLabel: string
  /** The range input's name, e.g. "Show the Jobwhisper version". */
  readonly sliderLabel: string
  /** Spoken value for a reveal percentage; defaults to "N% of <afterLabel> shown". */
  readonly describe?: (reveal: number) => string
  /** Controlled reveal (0–100); leave both unset to let the slider hold its own. */
  readonly reveal?: number
  readonly onRevealChange?: (reveal: number) => void
}

/**
 * Two renders of a resume stacked in one cell, with the newer one wiped in from the left.
 * Both pages are visual only (each template carries its own h1), so callers give screen
 * readers the changes another way.
 */
export function ResumeCompare({ before, after, beforeLabel, afterLabel, sliderLabel, describe, reveal: controlled, onRevealChange }: ResumeCompareProps) {
  const [own, setOwn] = useState(50)
  const reveal = controlled ?? own
  const setReveal = (value: number) => {
    setOwn(value)
    onRevealChange?.(value)
  }
  const valueText = describe
    ? describe(reveal)
    : reveal >= 100
      ? `${afterLabel} fully shown`
      : reveal <= 0
        ? `${beforeLabel} fully shown`
        : `${reveal}% of ${afterLabel} shown`

  return (
    <div className="relative mx-auto grid w-full max-w-[44rem] overflow-hidden rounded-xl shadow-panel has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
      <div aria-hidden="true" className="col-start-1 row-start-1">
        {before}
      </div>
      <div aria-hidden="true" className="col-start-1 row-start-1" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
        {after}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent" style={{ left: `${reveal}%` }}>
        <span className="absolute left-1/2 top-[min(50%,14rem)] flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-on-accent shadow-panel">
          <MoveHorizontal className="size-5" />
        </span>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">{afterLabel}</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 rounded-full bg-surface-inverse px-2.5 py-0.5 text-xs font-semibold text-surface">{beforeLabel}</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={reveal}
        onChange={(event) => setReveal(Number(event.target.value))}
        aria-label={sliderLabel}
        aria-valuetext={valueText}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
