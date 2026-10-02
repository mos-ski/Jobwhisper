import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowLeft, Camera, Check, ChevronDown, MoreHorizontal, CornerDownRight, EyeOff, GripVertical, Image as ImageIcon, MessageSquare, Mic, MicOff, Minimize2, Plus, Send, Settings, X } from 'lucide-react'

import type { DesktopActivity, DesktopAnswerRun, DesktopChatMessage, DesktopConnection, DesktopResponseLength, DesktopTranscriptEntry } from '@/contracts/desktop.draft'
import { Dialog, DialogClose, DialogPopup, DialogTitle, Menu, MenuContent, MenuItem, MenuTrigger, Popover, PopoverContent, PopoverTrigger, Skeleton, cn } from '@/ui'

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
  /** Desktop only: external microphones get a picker; the browser session keeps its plain mute button. */
  readonly microphoneSources?: readonly string[]
  readonly microphoneSource?: string
  readonly onMicrophoneSourceChange?: (source: string) => void
  /** Desktop only: stealth and the floating overlay have no meaning in a browser tab. */
  readonly stealth?: boolean
  readonly onToggleStealth?: () => void
  readonly onCapture: () => void
  readonly onCompact?: () => void
  /** The web session leaves by a back arrow; the desktop window has its own chrome. */
  readonly onBack?: () => void
  /** A limit or balance notice, shown under the toolbar. */
  readonly notice?: ReactNode
  readonly loading?: boolean
  /** The call being shared, shown above the AI chat in the browser; the desktop app is beside the call instead. */
  readonly screenPreview?: { readonly src: string; readonly label: string }
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

const pill = 'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-ink shadow-control'
const iconButton = 'grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-ink shadow-control hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

export function AnswerText({ runs }: { readonly runs: readonly DesktopAnswerRun[] }) {
  return (
    <>
      {runs.map((run, index) => (run.emphasis ? <strong key={index} className="font-normal text-accent-text">{run.text}</strong> : <span key={index}>{run.text}</span>))}
    </>
  )
}

function MicrophoneSources({ sources, source, onPick, className }: { readonly sources: readonly string[]; readonly source: string; readonly onPick: (source: string) => void; readonly className?: string }) {
  return (
    <div role="radiogroup" aria-label="Microphone source" className={cn('grid gap-1', className)}>
      {sources.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          aria-checked={source === item}
          onClick={() => onPick(item)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-start text-sm font-medium text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span className="truncate">{item}</span>
          {source === item ? <Check aria-hidden="true" className="size-4 shrink-0 text-accent-text" /> : null}
        </button>
      ))}
    </div>
  )
}

export function DesktopSessionView(props: DesktopSessionViewProps) {
  const { title, connection, activity, elapsedLabel, length, onLengthChange, transcript, chat, onAsk, micOn, onToggleMic, microphoneSources, microphoneSource, onMicrophoneSourceChange, stealth, onToggleStealth, onCapture, onCompact, onBack, notice, loading = false, screenPreview, onOpenSettings, onEnd, modelLabel, creditsUsed, minutesLeftLabel } = props
  const [chatOpen, setChatOpen] = useState(true)
  // Phones show one pane at a time; from md up both sit side by side.
  const [phonePane, setPhonePane] = useState<'interview' | 'chat'>('interview')
  const [controlsOpen, setControlsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [atLatest, setAtLatest] = useState(true)
  // Staged for the next AI chat message; cleared when it is sent.
  const [attachment, setAttachment] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const sources = microphoneSources ?? []
  const source = microphoneSource ?? sources[0] ?? ''
  const pickable = Boolean(onMicrophoneSourceChange) && sources.length > 0

  useEffect(() => {
    const list = listRef.current
    if (list && atLatest) list.scrollTop = list.scrollHeight
  }, [transcript, atLatest])

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    onAsk(value)
    setDraft('')
    setAttachment(null)
  }

  const capture = () => {
    setAttachment(`Screenshot · ${elapsedLabel}`)
    onCapture()
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {onBack ? (
          <button type="button" aria-label="Leave the session" onClick={onBack} className={iconButton}>
            <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          </button>
        ) : null}
        <div className={cn(pill, 'min-w-0 shrink ps-2')}>
          <GripVertical aria-hidden="true" className="hidden size-4 shrink-0 text-ink-muted sm:block" />
          <span aria-hidden="true" className="flex items-end gap-0.5">
            {[2, 3, 4].map((height) => <span key={height} className="w-1 rounded-sm bg-positive" style={{ height: height * 3 }} />)}
          </span>
          <span className="truncate font-semibold">{title}</span>
        </div>
        <span role="status" aria-label={CONNECTION[connection].label} className={cn(pill, 'hidden px-3 sm:inline-flex sm:px-4')}>
          <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', CONNECTION[connection].dot)} />
          <span aria-hidden="true" className="hidden sm:inline">{CONNECTION[connection].label}</span>
        </span>
        {/* On a phone the controls fold into one menu; the timer moves to the status line. */}
        <button type="button" aria-label="Session controls" onClick={() => setControlsOpen(true)} className={cn(iconButton, 'ms-auto sm:hidden')}>
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </button>
        <Dialog open={controlsOpen} onOpenChange={setControlsOpen}>
          <DialogPopup className="sm:hidden">
            <DialogTitle className="text-base font-semibold">Session controls</DialogTitle>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
              <span aria-hidden="true" className={cn('size-2 rounded-full', CONNECTION[connection].dot)} />
              {CONNECTION[connection].label}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Answer length</p>
            <div role="radiogroup" aria-label="Answer length" className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-surface-subtle p-1">
              {LENGTHS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={length === option}
                  onClick={() => onLengthChange(option)}
                  className={cn('min-h-12 rounded-lg text-sm font-semibold capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', length === option ? 'bg-accent text-on-accent' : 'text-ink')}
                >
                  {option}
                </button>
              ))}
            </div>
            {pickable ? (
              <>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Microphone source</p>
                <MicrophoneSources sources={sources} source={source} onPick={(item) => onMicrophoneSourceChange?.(item)} className="mt-2" />
              </>
            ) : null}
            <ul className="mt-4 grid gap-1">
              {[
                { label: micOn ? 'Mute microphone' : 'Unmute microphone', icon: micOn ? Mic : MicOff, onClick: onToggleMic },
                { label: 'Capture the screen', icon: Camera, onClick: capture },
                ...(onToggleStealth ? [{ label: stealth ? 'Turn stealth off' : 'Turn stealth on', icon: EyeOff, onClick: onToggleStealth }] : []),
                ...(onCompact ? [{ label: 'Shrink to the overlay', icon: Minimize2, onClick: onCompact }] : []),
                { label: 'Settings', icon: Settings, onClick: onOpenSettings },
              ].map(({ label, icon: Icon, onClick }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      setControlsOpen(false)
                      onClick()
                    }}
                    className="flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-start text-base font-medium text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <Icon aria-hidden="true" className="size-5 text-ink-muted" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setControlsOpen(false)
                onEnd()
              }}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-danger text-base font-semibold text-on-danger hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              End Session
            </button>
            <DialogClose aria-label="Close session controls" />
          </DialogPopup>
        </Dialog>
        <div className="ms-auto hidden flex-wrap items-center gap-2 sm:flex">
          <div role="radiogroup" aria-label="Answer length" className="flex shrink-0 rounded-full border border-border bg-surface p-1 shadow-control">
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
          {pickable ? (
            <Popover>
              <PopoverTrigger aria-label={`Microphone, ${source}${micOn ? '' : ', muted'}`} className={iconButton}>
                {micOn ? <Mic aria-hidden="true" className="size-4" /> : <MicOff aria-hidden="true" className="size-4 text-danger" />}
                <ChevronDown aria-hidden="true" className="size-3 text-ink-muted" />
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="w-72">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Microphone source</p>
                <MicrophoneSources sources={sources} source={source} onPick={(item) => onMicrophoneSourceChange?.(item)} className="mt-2" />
                <button
                  type="button"
                  onClick={onToggleMic}
                  className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-lg border border-input px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {micOn ? <MicOff aria-hidden="true" className="size-4 text-danger" /> : <Mic aria-hidden="true" className="size-4" />}
                  {micOn ? 'Mute microphone' : 'Unmute microphone'}
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <button type="button" aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!micOn} onClick={onToggleMic} className={iconButton}>
              {micOn ? <Mic aria-hidden="true" className="size-4" /> : <MicOff aria-hidden="true" className="size-4 text-danger" />}
            </button>
          )}
          <button type="button" aria-label={chatOpen ? 'Hide the AI chat' : 'Show the AI chat'} aria-pressed={chatOpen} onClick={() => setChatOpen((open) => !open)} className={cn(iconButton, 'hidden md:grid')}>
            <MessageSquare aria-hidden="true" className="size-4" />
          </button>
          <button type="button" aria-label="Capture the screen and answer" onClick={capture} className={iconButton}>
            <Camera aria-hidden="true" className="size-4" />
          </button>
          {onToggleStealth ? (
            <button type="button" aria-label={stealth ? 'Stealth mode on' : 'Stealth mode off'} aria-pressed={Boolean(stealth)} onClick={onToggleStealth} className={cn(iconButton, stealth && 'border-accent text-accent-text')}>
              <EyeOff aria-hidden="true" className="size-4" />
            </button>
          ) : null}
          {onCompact ? (
            <button type="button" aria-label="Shrink to the overlay" onClick={onCompact} className={iconButton}>
              <Minimize2 aria-hidden="true" className="size-4" />
            </button>
          ) : null}
          <button type="button" aria-label="Settings" onClick={onOpenSettings} className={iconButton}>
            <Settings aria-hidden="true" className="size-4" />
          </button>
        </div>
        <button type="button" onClick={onEnd} className="hidden min-h-10 shrink-0 items-center rounded-full bg-danger px-5 text-sm font-semibold text-on-danger hover:bg-danger-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
          End Session
        </button>
      </div>

      <p aria-live="polite" className="flex items-center gap-1.5 px-1 text-sm text-ink-muted">
        {ACTIVITY[activity]}
        {activity === 'thinking' ? <span aria-hidden="true" className="tracking-widest motion-safe:animate-pulse">&bull;&bull;&bull;</span> : null}
        <span className="ms-auto font-semibold tabular-nums text-ink sm:hidden">{elapsedLabel}</span>
      </p>
      {notice}
      <div role="tablist" aria-label="Session panes" className="grid grid-cols-2 border-b border-border md:hidden">
        {(['interview', 'chat'] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            role="tab"
            aria-selected={phonePane === pane}
            onClick={() => setPhonePane(pane)}
            className={cn('-mb-px inline-flex min-h-11 items-center justify-center border-b-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', phonePane === pane ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted')}
          >
            {pane === 'interview' ? 'Interview' : 'AI chat'}
          </button>
        ))}
      </div>

      <div className={cn('grid min-h-0 flex-1 gap-3', (chatOpen || screenPreview) && 'md:grid-cols-[3fr_2fr]')}>
        <section aria-label="Live transcript" className={cn('relative min-h-0 rounded-panel border border-border bg-surface', phonePane !== 'interview' && 'hidden md:block')}>
          <div
            ref={listRef}
            onScroll={(event) => {
              const el = event.currentTarget
              setAtLatest(el.scrollHeight - el.scrollTop - el.clientHeight < 40)
            }}
            className="h-full overflow-y-auto px-6"
          >
            {loading ? (
              <div role="status" aria-busy="true" aria-label="Loading copilot session" className="grid gap-4 py-6">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-24" />)}</div>
            ) : transcript.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">Press Space, or Get answer, and Copilot answers the interviewer&rsquo;s last question.</p>
            ) : (
              <ol className="divide-y divide-border">
                {transcript.map((entry) => (
                  <li
                    key={entry.id}
                    tabIndex={0}
                    // Hovering, focusing or tapping an answer stops the scroll so it can be read in place.
                    onMouseEnter={() => setAtLatest(false)}
                    onFocus={() => setAtLatest(false)}
                    onClick={() => setAtLatest(false)}
                    className={cn(
                      'rounded-lg py-4 hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      // The answer carries a faint shade at rest so it reads as tappable on touch, where hover does not exist.
                      entry.kind === 'answer' && 'bg-surface-subtle/40',
                    )}
                  >
                    {entry.kind === 'interviewer' ? (
                      <>
                        <p className="text-xs font-semibold text-ink-muted">{entry.speaker ?? 'Interviewer'}</p>
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

        {chatOpen || screenPreview || phonePane === 'chat' ? (
        <div className={cn('min-h-0 flex-col gap-3', phonePane === 'chat' ? 'flex' : 'hidden md:flex')}>
        {screenPreview ? (
          <section aria-labelledby="session-screen" className="hidden shrink-0 overflow-hidden rounded-panel border border-border bg-surface md:block">
            <h2 id="session-screen" className="flex min-h-11 items-center border-b border-border px-4 text-sm font-semibold text-ink">{screenPreview.label}</h2>
            <img src={screenPreview.src} alt={`Your shared screen: ${screenPreview.label}`} className="aspect-video max-h-[40vh] w-full bg-surface-inverse object-cover" />
          </section>
        ) : null}
        {chatOpen || phonePane === 'chat' ? (
          <section aria-label="AI chat" className={cn('min-h-0 flex-1 flex-col rounded-panel border border-border bg-surface', chatOpen ? 'flex' : 'flex md:hidden')}>
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
              {attachment ? (
                <div className="flex items-center gap-2 rounded-lg border border-input bg-surface px-3 py-2">
                  <ImageIcon aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{attachment}</span>
                  <button type="button" aria-label="Remove screenshot" onClick={() => setAttachment(null)} className="grid size-7 shrink-0 place-items-center rounded-md text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <X aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              ) : null}
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
        ) : null}
      </div>
    </div>
  )
}
