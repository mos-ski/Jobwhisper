import { Maximize2, Mic, MicOff } from 'lucide-react'

import type { DesktopAnswerRun, DesktopAppearance, DesktopConnection } from '@/contracts/desktop.draft'
import { JobwhisperIcon, cn } from '@/ui'

import { AnswerText } from './desktop-session-view'

export type DesktopOverlayViewProps = {
  readonly connection: DesktopConnection
  readonly elapsedLabel: string
  /** The newest answer; absent while Copilot is still listening. */
  readonly answer?: { readonly question: string; readonly runs: readonly DesktopAnswerRun[] }
  readonly micOn: boolean
  readonly onToggleMic: () => void
  readonly onExpand: () => void
  readonly onEnd: () => void
  readonly onDismiss: () => void
  /** Follows Settings → Window appearance: clear floats the bar over the call. */
  readonly appearance?: DesktopAppearance
}

const CONNECTION_LABEL: Record<DesktopConnection, string> = { connected: 'Connected', fair: 'Fair connection', unstable: 'Unstable connection' }

/** The compact bar that floats over the call, with the latest answer under it. */
export function DesktopOverlayView({ connection, elapsedLabel, answer, micOn, onToggleMic, onExpand, onEnd, onDismiss, appearance = 'solid' }: DesktopOverlayViewProps) {
  return (
    <div className={cn('w-[26rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border text-ink shadow-panel', appearance === 'clear' ? 'bg-surface/75 backdrop-blur-md' : 'bg-surface')}>
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <JobwhisperIcon className="h-4 w-5 shrink-0 text-accent" />
        <span className="text-sm font-semibold">Jobwhisper</span>
        <span className={cn('truncate text-xs', connection === 'connected' ? 'text-ink-muted' : 'text-danger')}>{CONNECTION_LABEL[connection]}</span>
        <span className="ms-auto text-sm tabular-nums">{elapsedLabel}</span>
        <button type="button" aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!micOn} onClick={onToggleMic} className="grid size-9 place-items-center rounded-full hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {micOn ? <Mic aria-hidden="true" className="size-4" /> : <MicOff aria-hidden="true" className="size-4 text-danger" />}
        </button>
        <button type="button" aria-label="Open the full window" onClick={onExpand} className="grid size-9 place-items-center rounded-full hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Maximize2 aria-hidden="true" className="size-4" />
        </button>
        <button type="button" onClick={onEnd} className="inline-flex min-h-9 items-center rounded-full bg-danger px-3 text-xs font-semibold text-on-danger hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">End</button>
      </div>
      <div aria-live="polite" className="px-4 py-3">
        {answer ? (
          <>
            <p className="text-sm font-semibold text-accent-text">{answer.question}</p>
            <p className="mt-1.5 text-sm leading-6"><AnswerText runs={answer.runs} /></p>
            <button type="button" onClick={onDismiss} className="mt-2 min-h-9 rounded-md text-xs font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Dismiss</button>
          </>
        ) : (
          <p className="text-sm text-ink-muted">Listening&hellip; the next answer appears here.</p>
        )}
      </div>
    </div>
  )
}
