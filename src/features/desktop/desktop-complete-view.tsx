import { ThumbsDown, ThumbsUp } from 'lucide-react'

import type { DesktopSessionKind } from '@/contracts/desktop.draft'
import { JobwhisperIcon, cn } from '@/ui'

export type DesktopCompleteViewProps = {
  readonly kind: DesktopSessionKind
  readonly feedback: 'up' | 'down' | null
  readonly onFeedback: (value: 'up' | 'down') => void
  readonly onHome: () => void
}

const TITLES: Record<DesktopSessionKind, string> = { interview: 'Your interview is complete!', coding: 'Your coding session is complete!', meeting: 'Your meeting is complete!' }

export function DesktopCompleteView({ kind, feedback, onFeedback, onHome }: DesktopCompleteViewProps) {
  return (
    <div className="grid min-h-full place-items-center px-6 py-10 text-center">
      <div className="grid justify-items-center gap-5">
        <JobwhisperIcon className="h-8 w-10 text-on-accent" />
        <h1 className="font-gowun text-4xl text-on-accent">{TITLES[kind]}</h1>
        <p className="text-sm text-on-accent">Your report is on its way. This can take a moment.</p>
        <div className="mt-2 flex items-center gap-4 rounded-2xl bg-surface px-6 py-5 text-ink">
          {feedback ? (
            <p role="status" className="text-sm font-semibold">Thanks, that helps us tune Copilot.</p>
          ) : (
            <>
              <p className="text-sm font-semibold">How was this session?</p>
              {(['up', 'down'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={value === 'up' ? 'It went well' : 'It could be better'}
                  onClick={() => onFeedback(value)}
                  className={cn('grid size-12 place-items-center rounded-xl border border-border hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus')}
                >
                  {value === 'up' ? <ThumbsUp aria-hidden="true" className="size-5" /> : <ThumbsDown aria-hidden="true" className="size-5" />}
                </button>
              ))}
            </>
          )}
        </div>
        <button type="button" onClick={onHome} className="min-h-11 rounded-md px-3 text-sm font-semibold text-on-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-accent">Back to home</button>
      </div>
    </div>
  )
}
