import { useState, type ReactNode } from 'react'
import { AppWindow, BarChart3, Code2, CreditCard, ExternalLink, Gift, Maximize2, Mic, MonitorUp, Plug, SlidersHorizontal, User, Users, Video } from 'lucide-react'

import type { DesktopAppearance, DesktopCredits, DesktopSessionKind, DesktopSessionSummary } from '@/contracts/desktop.draft'
import { Avatar, Button, Dialog, DialogClose, DialogPopup, DialogTitle, Switch, cn } from '@/ui'

export type DesktopSettingsSection = 'general' | 'interview' | 'coding' | 'meeting' | 'billing' | 'usage' | 'window' | 'account' | 'connectors'

export type DesktopTheme = 'system' | 'light' | 'dark'

export type DesktopSettingsDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  /** From `?settings=`. */
  readonly section: DesktopSettingsSection
  readonly onSectionChange: (section: DesktopSettingsSection) => void
  /** Set during a live session: the section for that session's kind notes that changes apply to it. */
  readonly liveKind?: DesktopSessionKind
  readonly theme: DesktopTheme
  readonly onThemeChange: (theme: DesktopTheme) => void
  /** Controlled so the live overlay window matches what this row says. */
  readonly appearance: DesktopAppearance
  readonly onAppearanceChange: (appearance: DesktopAppearance) => void
  /** The same switch as the title bar — the two never disagree. */
  readonly stealth: boolean
  readonly onToggleStealth: () => void
  readonly user: { readonly fullName: string; readonly email: string }
  readonly credits: DesktopCredits
  readonly planLabel: string
  readonly planNote: string
  readonly sessions: readonly DesktopSessionSummary[]
  readonly version: string
  readonly platform: string
  readonly calendarConnected: boolean
  readonly onConnectCalendar: () => void
  readonly onAddCredits: () => void
  readonly onOpenBilling: () => void
  readonly onOpenWhatsNew: () => void
  readonly onSignOut: () => void
}

const SECTIONS: readonly { readonly id: DesktopSettingsSection; readonly label: string; readonly icon: typeof User }[] = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'interview', label: 'Interview', icon: Users },
  { id: 'coding', label: 'Coding', icon: Code2 },
  { id: 'meeting', label: 'Meeting', icon: Video },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'usage', label: 'Usage', icon: BarChart3 },
  { id: 'window', label: 'Window', icon: AppWindow },
  { id: 'account', label: 'Account', icon: User },
  { id: 'connectors', label: 'Connectors', icon: Plug },
]

const KIND_LABELS: Record<DesktopSessionKind, string> = { interview: 'Interview', coding: 'Coding', meeting: 'Meeting' }
const when = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

function Card({ title, description, action, children }: { readonly title: string; readonly description?: string; readonly action?: ReactNode; readonly children: ReactNode }) {
  return (
    <section className="rounded-panel border border-border bg-surface">
      <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="divide-y divide-border px-6">{children}</div>
    </section>
  )
}

function Row({ title, description, control, icon, children }: { readonly title: string; readonly description?: string; readonly control?: ReactNode; readonly icon?: ReactNode; readonly children?: ReactNode }) {
  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          {icon ? <span aria-hidden="true" className="mt-0.5 text-ink-muted">{icon}</span> : null}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{title}</p>
            {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
          </div>
        </div>
        {control}
      </div>
      {children}
    </div>
  )
}

function Segmented<T extends string>({ label, options, value, onChange }: { readonly label: string; readonly options: readonly { readonly value: T; readonly label: string }[]; readonly value: T; readonly onChange: (value: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full border border-border bg-surface-subtle p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn('min-h-8 rounded-full px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', value === option.value ? 'bg-accent font-semibold text-on-accent' : 'text-ink')}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function Keys({ keys }: { readonly keys: readonly string[] }) {
  return (
    <span className="flex gap-1">
      {keys.map((key) => <kbd key={key} className="grid min-h-7 min-w-7 place-items-center rounded-md border border-border bg-surface px-1.5 font-sans text-xs text-ink">{key}</kbd>)}
    </span>
  )
}

const RESPONSE_EXAMPLE = ['We lost the checkout service for four hours the week before launch, so I took the incident myself.', 'I capped the retry storm at the gateway, and we were back inside our latency budget by morning.']

function ResponsesCard({ appliesNote }: { readonly appliesNote: string }) {
  const [pace, setPace] = useState<'auto' | 'manual'>('auto')
  const [type, setType] = useState<'default' | 'headlines' | 'coaching'>('default')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  return (
    <Card title="Responses" description="How the copilot answers while a session is running.">
      <Row title="Response pace" description={pace === 'auto' ? 'Answers automatically.' : 'Waits for the capture key or Get answer.'} control={<Segmented label="Response pace" value={pace} onChange={setPace} options={[{ value: 'auto', label: 'Auto' }, { value: 'manual', label: 'Manual' }]} />} />
      <Row title="Response type" description={appliesNote} control={<Segmented label="Response type" value={type} onChange={setType} options={[{ value: 'default', label: 'Default' }, { value: 'headlines', label: 'Headlines' }, { value: 'coaching', label: 'Coaching' }]} />}>
        <div className="mt-3 rounded-lg bg-surface-subtle p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{type} looks like</p>
          {RESPONSE_EXAMPLE.map((line) => <p key={line} className="mt-1.5 text-sm text-ink">{line}</p>)}
        </div>
      </Row>
      <Row title="Response length" description={appliesNote} control={<Segmented label="Response length" value={length} onChange={setLength} options={[{ value: 'short', label: 'Short' }, { value: 'medium', label: 'Medium' }, { value: 'long', label: 'Long' }]} />} />
    </Card>
  )
}

function CaptureKeyCard() {
  return (
    <Card title="Manual answering" description="Only used while the response pace is set to Manual.">
      <Row
        title="Capture key"
        description="Press it during a live session and Copilot answers the last question."
        control={
          <div className="grid max-w-60 gap-1">
            <label>
              <span className="sr-only">Capture key</span>
              <input defaultValue="Space" className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" />
            </label>
            <p className="text-xs text-ink-muted">Space only works while this window is focused. Add &#8997; or &#8984; to trigger from any app.</p>
          </div>
        }
      />
    </Card>
  )
}

export function DesktopSettingsDialog(props: DesktopSettingsDialogProps) {
  const { open, onOpenChange, section, onSectionChange, liveKind, theme, onThemeChange, appearance, onAppearanceChange, stealth, onToggleStealth, user, credits, planLabel, planNote, sessions, version, platform, calendarConnected, onConnectCalendar, onAddCredits, onOpenBilling, onOpenWhatsNew, onSignOut } = props
  const [meetingDetection, setMeetingDetection] = useState(true)
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [autoScroll, setAutoScroll] = useState(true)
  const [captureMode, setCaptureMode] = useState<'auto' | 'manual'>('auto')
  const [answerStyle, setAnswerStyle] = useState<'direct' | 'pointers'>('direct')
  const [autoCopy, setAutoCopy] = useState(true)
  const [othersTranscript, setOthersTranscript] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const applies = (kind: DesktopSessionKind) => (liveKind === kind ? `Applies to a running ${KIND_LABELS[kind]} session` : 'Applies from the next answer on.')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="p-0 sm:h-[min(44rem,calc(100vh-4rem))] sm:max-w-5xl">
        <div className="grid h-full sm:grid-cols-[14rem_1fr]">
          <nav aria-label="Settings" className="border-b border-border bg-surface-subtle p-4 sm:border-b-0 sm:border-e">
            <DialogTitle className="px-2 pb-4 pt-2 text-lg font-semibold">Settings</DialogTitle>
            <ul className="flex gap-1 overflow-x-auto sm:grid">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={section === id ? 'page' : undefined}
                    onClick={() => onSectionChange(id)}
                    className={cn('flex min-h-10 w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', section === id ? 'bg-accent-subtle font-semibold text-accent-text' : 'text-ink hover:bg-surface')}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid min-h-0 content-start gap-5 overflow-y-auto p-6 pe-14">
            {section === 'general' ? (
              <>
                <Card title="Permissions" description="Jobwhisper only uses these while a session is live.">
                  <Row icon={<MonitorUp className="size-5" />} title="Screen recording" description="Reads the question in front of you during a session." control={<span className="flex items-center gap-3"><span className="text-sm text-positive">Granted</span><Button variant="secondary" size="sm">Re-check</Button></span>} />
                  <Row icon={<Mic className="size-5" />} title="Microphone" description="Hears the conversation and transcribes it live." control={<span className="flex items-center gap-3"><span className="text-sm text-positive">Granted</span><Button variant="secondary" size="sm">Re-check</Button></span>} />
                  <Row
                    title="Input source"
                    description="Which microphone the live call opens."
                    control={
                      <label>
                        <span className="sr-only">Input source</span>
                        <select className="min-h-10 rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <option>System default</option>
                          <option>MacBook Pro Microphone</option>
                          <option>AirPods Pro</option>
                        </select>
                      </label>
                    }
                  />
                </Card>
                <Card title="Desktop">
                  <Row title="Stealth mode" description="Invisible in screenshots, recordings and screen shares. You still see everything. Turns on automatically before every session starts." control={<Switch checked={stealth} onCheckedChange={onToggleStealth} aria-label="Stealth mode" />} />
                  <Row title="Meeting detection" description="Get a nudge to start a session when a call starts: Zoom, Teams, Webex, Slack huddles, and Google Meet or Zoom in your browser." control={<Switch checked={meetingDetection} onCheckedChange={setMeetingDetection} aria-label="Meeting detection" />} />
                </Card>
                <Card title="Keyboard shortcuts" description="These work during a live call. ⌘ is Ctrl on Windows and Linux.">
                  <Row title="Ask &ldquo;What should I say?&rdquo;" control={<Keys keys={['⌘', '↵']} />} />
                  <Row title="Mute or unmute your microphone" control={<Keys keys={['⌘', '⇧', 'M']} />} />
                  <Row title="Open or close the AI chat panel" control={<Keys keys={['⌘', '⇧', 'B']} />} />
                  <Row title="Toggle clear mode" control={<Keys keys={['⌘', '⇧', 'T']} />} />
                  <Row title="Hide or show Jobwhisper" control={<Keys keys={['⌘', '\\']} />} />
                  <Row title="Capture the screen (manual answering)" description="Rebind it under each session type's Manual answering." control={<Keys keys={['Space']} />} />
                </Card>
                <Card title="Reading" description="How every live call reads. Both apply at once, mid-session.">
                  <Row title="Text size" description="The transcript, the answer cards, the chat and the coding panel." control={<Segmented label="Text size" value={textSize} onChange={setTextSize} options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]} />} />
                  <Row title="Auto-scroll" description="Keep the newest answer in view as the session runs." control={<Switch checked={autoScroll} onCheckedChange={setAutoScroll} aria-label="Auto-scroll" />} />
                </Card>
              </>
            ) : null}

            {section === 'interview' ? (
              <>
                <ResponsesCard appliesNote={applies('interview')} />
                <CaptureKeyCard />
              </>
            ) : null}

            {section === 'coding' ? (
              <>
                <Card title="Screen capture" description="How a coding session reads the challenge in front of you.">
                  <Row title="Capture mode" description="Auto keeps reading and answers each new question; Manual reads only when you press Capture now." control={<Segmented label="Capture mode" value={captureMode} onChange={setCaptureMode} options={[{ value: 'auto', label: 'Auto' }, { value: 'manual', label: 'Manual' }]} />} />
                </Card>
                <Card title="Answers" description="What lands in the panel when a question is answered.">
                  <Row title="Answer style" description={applies('coding')} control={<Segmented label="Answer style" value={answerStyle} onChange={setAnswerStyle} options={[{ value: 'direct', label: 'Direct answer' }, { value: 'pointers', label: 'Pointers only' }]} />}>
                    <div className="mt-3 rounded-lg bg-surface-subtle p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{answerStyle === 'direct' ? 'Direct answer' : 'Pointers only'} looks like</p>
                      <p className="mt-1.5 text-sm text-ink">{answerStyle === 'direct' ? 'Sliding window with a map of each character’s last index.' : 'Think about what you need to remember as the window grows.'}</p>
                      <p className="mt-1 text-sm text-ink">{answerStyle === 'direct' ? 'Move the left edge past any repeat; O(n) time, O(k) space.' : 'When a character repeats, where should the window start?'}</p>
                    </div>
                  </Row>
                  <Row title="Auto-copy coding answers" description="The code is on your clipboard as soon as an answer finishes, so you only have to paste." control={<Switch checked={autoCopy} onCheckedChange={setAutoCopy} aria-label="Auto-copy coding answers" />} />
                </Card>
                <CaptureKeyCard />
              </>
            ) : null}

            {section === 'meeting' ? (
              <>
                <ResponsesCard appliesNote={applies('meeting')} />
                <Card title="Transcript" description="What the live call shows of the other side of the room.">
                  <Row title="Show the others&rsquo; transcript" description="Off shows only Copilot&rsquo;s answers." control={<Switch checked={othersTranscript} onCheckedChange={setOthersTranscript} aria-label="Show the others' transcript" />} />
                </Card>
              </>
            ) : null}

            {section === 'billing' ? (
              <>
                <Card title="Credits" description="One pool, spent by every Jobwhisper feature.">
                  <Row title="Balance" description={`${credits.periodAllowance.toLocaleString('en-US')} granted this period · ${credits.spentAllTime.toLocaleString('en-US')} spent all time`} control={<span className="text-sm text-ink">{credits.balance.toLocaleString('en-US')} credits</span>} />
                  <Row title="Add credits" description="Top up without leaving the app." control={<Button variant="secondary" size="sm" onClick={onAddCredits}>Add credits</Button>} />
                </Card>
                <Card title="Plan">
                  <Row title="Current plan" description={planNote} control={<span className="text-sm text-ink">{planLabel}</span>} />
                  <Row title="Manage subscription" description="Compare plans and change yours on the web." control={<Button variant="secondary" size="sm" onClick={onOpenBilling}>Open billing <ExternalLink aria-hidden="true" className="size-4" /></Button>} />
                </Card>
              </>
            ) : null}

            {section === 'usage' ? (
              <>
                <Card title="Copilot usage">
                  <Row title="Credits left" description="What is left to spend on sessions." control={<span className="text-sm text-ink">{credits.balance.toLocaleString('en-US')} credits</span>} />
                  <Row title="Spent all time" description="Across every feature." control={<span className="text-sm text-ink">{credits.spentAllTime.toLocaleString('en-US')} credits</span>} />
                  <Row title="Copilot" control={<span className="text-sm text-ink">{Math.round((credits.usedThisPeriod / credits.periodAllowance) * 100)}% used</span>}>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-subtle"><div className="h-full rounded-full bg-accent" style={{ width: `${(credits.usedThisPeriod / credits.periodAllowance) * 100}%` }} /></div>
                    <p className="mt-2 text-sm text-ink-muted">{credits.usedThisPeriod.toLocaleString('en-US')} of {credits.periodAllowance.toLocaleString('en-US')} credits this period</p>
                  </Row>
                </Card>
                <Card title="Recent sessions" description="Your most recent copilot sessions.">
                  {sessions.length === 0 ? <p className="py-4 text-sm text-ink-muted">No sessions yet.</p> : sessions.map((session) => (
                    <Row key={session.id} title={session.title} description={[KIND_LABELS[session.kind], session.company, when.format(new Date(session.startedAt))].filter(Boolean).join(' · ')} control={<span className="text-sm text-ink">{session.durationMinutes} min</span>} />
                  ))}
                </Card>
              </>
            ) : null}

            {section === 'window' ? (
              <>
                <Card title="Appearance">
                  <Row title="Theme" description="System follows your computer's own light or dark setting." control={<Segmented label="Theme" value={theme} onChange={onThemeChange} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />} />
                  <Row title="Window appearance" description="Clear makes the mini reply window transparent over the call; Solid fills it. Other screens stay solid." control={<Segmented label="Window appearance" value={appearance} onChange={onAppearanceChange} options={[{ value: 'solid', label: 'Solid' }, { value: 'clear', label: 'Clear' }]} />} />
                </Card>
                <Card title="Window">
                  <Row title="Size" description="Expand this window to fill your screen." control={<Button variant="secondary" size="sm" leadingIcon={<Maximize2 aria-hidden="true" className="size-4" />}>Maximize</Button>} />
                </Card>
                <Card title="Desktop">
                  <Row title="Always on top" description="Keep Jobwhisper above every other window, full-screen calls included." control={<Switch checked={alwaysOnTop} onCheckedChange={setAlwaysOnTop} aria-label="Always on top" />} />
                </Card>
                <Card title="About" action={<button type="button" onClick={onOpenWhatsNew} className="inline-flex min-h-9 items-center gap-1.5 rounded-md text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Gift aria-hidden="true" className="size-4" />What&rsquo;s New</button>}>
                  <Row title="Platform" control={<span className="text-sm text-ink">{platform}</span>} />
                  <Row title="Version" control={<span className="flex items-center gap-3 text-sm text-ink">{version}<span className="text-ink-muted">Up to date</span><Button variant="secondary" size="sm">Check for updates</Button></span>} />
                </Card>
              </>
            ) : null}

            {section === 'account' ? (
              <Card title="Account">
                <Row
                  icon={<Avatar name={user.fullName} size="md" />}
                  title={user.fullName}
                  description={user.email}
                  control={<Button variant="secondary" size="sm" onClick={onSignOut}>Log out</Button>}
                />
              </Card>
            ) : null}

            {section === 'connectors' ? (
              <Card title="Google Calendar">
                <Row
                  title={calendarConnected ? 'Connected' : 'Not connected'}
                  description="See your meetings and get a nudge before each one. Opens in your browser."
                  control={calendarConnected ? <span className="text-sm text-positive">Connected</span> : <Button size="sm" onClick={onConnectCalendar}>Connect</Button>}
                />
              </Card>
            ) : null}
          </div>
        </div>
        <DialogClose aria-label="Close settings" className="end-3 top-3" />
      </DialogPopup>
    </Dialog>
  )
}
