import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Camera, CornerDownRight, EyeOff, GripVertical, MessageSquare, Mic, MicOff, Minimize2, Plus, Send, Settings } from 'lucide-react'

import type { DesktopActivity, DesktopAnswerRun, DesktopChatMessage, DesktopConnection, DesktopResponseLength, DesktopTranscriptEntry } from '@/contracts/desktop.draft'
import { Menu, MenuContent, MenuItem, MenuTrigger, Popover, PopoverContent, PopoverTrigger, cn } from '@/ui'

export type DesktopSessionViewProps = {
  /** e.g. "Product Manager · Guwe". */
  readonly title: string
  readonly connection: DesktopConnection
  readonly activity: DesktopActivity
  readonly elapsedLabel: string
  readonly length: DesktopResponseLength
  readonly onLengthChange: (length: DesktopResponseLength) => void
  readonly transcript: readonly DesktopTranscriptEntry[]
  readonly chat: readonly DesktopChatMessage[]
  readonly onAsk: (text: string) => void
  readonly micOn: boolean
  readonly onToggleMic: () => void
  readonly stealth: boolean
  readonly onToggleStealth: () => void
  readonly onCapture: () => void
  readonly onCompact: () => void
  readonly onOpenSettings: () => void
  readonly onEnd: () => void
  readonly modelLabel: string
  /** Share of this session's credits already spent, 0 to 1. */
  readonly creditsUsed: number
  readonly minutesLeftLabel: string
}

const CONNECTION: Record<DesktopConnection, { readonly label: string; readonly dot: string }> = {
  connected: { label: 'Connected', dot: 'bg-positive' },
  fair: { label: 'Fair connection', dot: 'bg-warning' },
  unstable: { label: 'Unstable connection', dot: 'bg-danger' },
}
const ACTIVITY: Record<DesktopActivity, string> = { listening: 'Listening…', thinking: 'Thinking', answering: 'Answering…' }
const LENGTHS: readonly DesktopResponseLength[] = ['short', 'medium', 'long']
const TRY_ASKING = ['Summarize what I just said', 'What should I ask them?'] as const

const pill = 'inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-ink shadow-control'
const iconButton = 'grid size-10 place-items-center rounded-full border border-border bg-surface text-ink shadow-control hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

export function AnswerText({ runs }: { readonly runs: readonly DesktopAnswerRun[] }) {
  return (
    <>
      {runs.map((run, index) => (run.emphasis ? <strong key={index} className="font-normal text-accent-text">{run.text}</strong> : <span key={index}>{run.text}</span>))}
    </>
  )
}

export function DesktopSessionView(props: DesktopSessionViewProps) {
  const { title, connection, activity, elapsedLabel, length, onLengthChange, transcript, chat, onAsk, micOn, onToggleMic, stealth, onToggleStealth, onCapture, onCompact, onOpenSettings, onEnd, modelLabel, creditsUsed, minutesLeftLabel } = props
  const [chatOpen, setChatOpen] = useState(true)
  const [draft, setDraft] = useState('')
  const [atLatest, setAtLatest] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list && atLatest) list.scrollTop = list.scrollHeight
  }, [transcript, atLatest])

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    onAsk(value)
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className={cn(pill, 'ps-2')}>
          <GripVertical aria-hidden="true" className="size-4 text-ink-muted" />
          <span aria-hidden="true" className="flex items-end gap-0.5">
            {[2, 3, 4].map((height) => <span key={height} className="w-1 rounded-sm bg-positive" style={{ height: height * 3 }} />)}
          </span>
          <span className="font-semibold">{title}</span>
        </div>
        <span role="status" className={pill}>
          <span aria-hidden="true" className={cn('size-2 rounded-full', CONNECTION[connection].dot)} />
          {CONNECTION[connection].label}
        </span>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <div role="radiogroup" aria-label="Answer length" className="flex rounded-full border border-border bg-surface p-1 shadow-control">
            {LENGTHS.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={length === option}
                onClick={() => onLengthChange(option)}
                className={cn('min-h-8 rounded-full px-3 text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', length === option ? 'bg-accent font-semibold text-on-accent' : 'text-ink')}
              >
                {option}
              </button>
            ))}
          </div>
          <span className={cn(pill, 'font-semibold tabular-nums')} aria-label={`Elapsed ${elapsedLabel}`}>{elapsedLabel}</span>
          <button type="button" aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!micOn} onClick={onToggleMic} className={iconButton}>
            {micOn ? <Mic aria-hidden="true" className="size-4" /> : <MicOff aria-hidden="true" className="size-4 text-danger" />}
          </button>
          <button type="button" aria-label={chatOpen ? 'Hide the AI chat' : 'Show the AI chat'} aria-pressed={chatOpen} onClick={() => setChatOpen((open) => !open)} className={iconButton}>
            <MessageSquare aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Capture the screen and answer" onClick={onCapture} className={iconButton}>
            <Camera aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label={stealth ? 'Stealth mode on' : 'Stealth mode off'} aria-pressed={stealth} onClick={onToggleStealth} className={cn(iconButton, stealth && 'border-accent text-accent-text')}>
            <EyeOff aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Shrink to the overlay" onClick={onCompact} className={iconButton}>
            <Minimize2 aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Settings" onClick={onOpenSettings} className={iconButton}>
            <Settings aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={onEnd} className="inline-flex min-h-10 items-center rounded-full bg-danger px-5 text-sm font-semibold text-on-danger hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            End Session
          </button>
        </div>
      </div>

      <p aria-live="polite" className="flex items-center gap-1.5 px-1 text-sm text-ink-muted">
        {ACTIVITY[activity]}
        {activity === 'thinking' ? <span aria-hidden="true" className="tracking-widest motion-safe:animate-pulse">&bull;&bull;&bull;</span> : null}
      </p>

      <div className={cn('grid min-h-0 flex-1 gap-3', chatOpen && 'md:grid-cols-[3fr_2fr]')}>
        <section aria-label="Live transcript" className="relative min-h-0 rounded-panel border border-border bg-surface">
          <div
            ref={listRef}
            onScroll={(event) => {
              const el = event.currentTarget
              setAtLatest(el.scrollHeight - el.scrollTop - el.clientHeight < 40)
            }}
            className="h-full overflow-y-auto px-6"
          >
            {transcript.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">Press Space, or Get answer, and Copilot answers the interviewer&rsquo;s last question.</p>
            ) : (
              <ol className="divide-y divide-border">
                {transcript.map((entry) => (
                  <li key={entry.id} className="py-4">
                    {entry.kind === 'interviewer' ? (
                      <>
                        <p className="text-xs font-semibold text-ink-muted">Interviewer</p>
                        <p className="mt-1 text-base text-ink">
                          {entry.text}
                          {entry.partial ? <span aria-hidden="true" className="ms-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-accent motion-safe:animate-pulse" /> : null}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex rounded-md bg-accent-subtle px-2 py-0.5 text-xs font-semibold text-accent-text">WhisperAI</span>
                        <p className="mt-2 text-sm font-semibold text-ink">{entry.question}</p>
                        <p className="mt-2 font-gowun text-lg leading-8 text-ink"><AnswerText runs={entry.runs} /></p>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
          {!atLatest ? (
            <button
              type="button"
              onClick={() => setAtLatest(true)}
              className="absolute bottom-4 left-1/2 inline-flex min-h-9 -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-ink shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Jump to latest
              <ArrowDown aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </section>

        {chatOpen ? (
          <section aria-label="AI chat" className="flex min-h-0 flex-col rounded-panel border border-border bg-surface">
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {chat.length === 0 ? (
                <>
                  <p className="text-sm text-ink-muted">Ask anything about the conversation so far.</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">Try asking</p>
                  <ul className="mt-2 grid gap-1">
                    {TRY_ASKING.map((prompt) => (
                      <li key={prompt}>
                        <button type="button" onClick={() => send(prompt)} className="flex min-h-10 items-center gap-2 rounded-md text-sm text-ink hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <CornerDownRight aria-hidden="true" className="size-4 text-ink-muted" />
                          {prompt}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <ol className="grid gap-3">
                  {chat.map((message) => (
                    <li key={message.id} className={cn('rounded-xl p-4', message.author === 'you' ? 'bg-surface-subtle' : 'bg-accent-subtle')}>
                      <p className="text-xs font-semibold text-ink-muted">{message.author === 'you' ? 'You' : 'Copilot'}</p>
                      <p className={cn('mt-1 text-ink', message.author === 'copilot' ? 'font-gowun text-base leading-7' : 'text-base')}>{message.text}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <form
              className="grid gap-2 border-t border-border p-3"
              onSubmit={(event) => {
                event.preventDefault()
                send(draft)
              }}
            >
              <div className="flex items-center gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Ask a follow-up</span>
                  <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a follow-up…" className="min-h-11 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" />
                </label>
                <button type="submit" aria-label="Send" disabled={!draft.trim()} className="grid size-11 place-items-center rounded-lg text-ink-muted hover:text-ink disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Send aria-hidden="true" className="size-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Menu>
                  <MenuTrigger aria-label="Quick asks" className="grid size-9 place-items-center rounded-lg border border-border text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <Plus aria-hidden="true" className="size-4" />
                  </MenuTrigger>
                  <MenuContent align="start" side="top">
                    <MenuItem onClick={() => send('What should I say?')}>What should I say?</MenuItem>
                    <MenuItem onClick={() => send('Recap')}>Recap</MenuItem>
                  </MenuContent>
                </Menu>
                <span className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-sm font-semibold text-ink">Auto</span>
                <Popover>
                  <PopoverTrigger className="ms-auto inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    {modelLabel}
                    <span aria-hidden="true" className="size-5 rounded-full border-2 border-border" style={{ background: `conic-gradient(var(--lf-accent) ${creditsUsed * 360}deg, transparent 0)` }} />
                    <span className="sr-only">, session credits</span>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-72">
                    <p className="font-semibold text-ink">Session credits</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-subtle"><div className="h-full rounded-full bg-accent" style={{ width: `${creditsUsed * 100}%` }} /></div>
                    <p className="mt-2 flex justify-between text-sm text-ink-muted"><span>{Math.round(creditsUsed * 100)}% used</span><span className="font-semibold text-ink">{Math.round((1 - creditsUsed) * 100)}% left</span></p>
                    <p className="mt-2 text-sm text-ink-muted">{minutesLeftLabel}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </div>
  )
}
