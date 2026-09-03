import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Settings } from 'lucide-react'

import { CopilotTranscriptPanel } from '@/features/copilot/interview-copilot-view'
import { settingsProfile } from '@/mocks/account'
import { authPlanFixtures, billingSnapshot } from '@/mocks/billing'
import { copilotInterviewTranscript, copilotLiveSession } from '@/mocks/copilot'
import { Avatar, Badge, Button, cn, Dialog, DialogClose, DialogPopup, DialogTitle } from '@/ui'

function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

type SessionSettingsTab = 'live' | 'window' | 'session'

const SCROLL_SPEED_LABELS: Record<number, string> = { 1: 'Slow', 2: 'Normal', 3: 'Fast' }
const APPEARANCE_OPTIONS = [
  { value: 'clear', label: 'Clear', description: 'Solid surfaces' },
  { value: 'tinted', label: 'Tinted', description: 'Blurred translucent surfaces' },
] as const

function LiveToggle({ checked, onChange, label }: { readonly checked: boolean; readonly onChange: (value: boolean) => void; readonly label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors', checked ? 'bg-positive' : 'bg-white/15')}
    >
      <span className={cn('block size-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  )
}

function SettingRow({ title, description, control }: { readonly title: string; readonly description?: string; readonly control: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-white/50">{description}</p> : null}
      </div>
      {control}
    </div>
  )
}

function SessionSettingsTabButton({ active, onClick, children }: { readonly active: boolean; readonly onClick: () => void; readonly children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors sm:w-full',
        active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

function SessionSettingsModal({
  open,
  onOpenChange,
  autoScroll,
  setAutoScroll,
  scrollSpeed,
  setScrollSpeed,
  fontSize,
  setFontSize,
  responseMode,
  setResponseMode,
  stealthMode,
  setStealthMode,
  appearance,
  setAppearance,
  alwaysOnTop,
  setAlwaysOnTop,
  meetingDetect,
  setMeetingDetect,
  onSignOut,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly autoScroll: boolean
  readonly setAutoScroll: (value: boolean) => void
  readonly scrollSpeed: number
  readonly setScrollSpeed: (value: number) => void
  readonly fontSize: number
  readonly setFontSize: (value: number) => void
  readonly responseMode: 'auto' | 'manual'
  readonly setResponseMode: (mode: 'auto' | 'manual') => void
  readonly stealthMode: boolean
  readonly setStealthMode: (value: boolean) => void
  readonly appearance: 'clear' | 'tinted'
  readonly setAppearance: (value: 'clear' | 'tinted') => void
  readonly alwaysOnTop: boolean
  readonly setAlwaysOnTop: (value: boolean) => void
  readonly meetingDetect: boolean
  readonly setMeetingDetect: (value: boolean) => void
  readonly onSignOut: () => void
}) {
  const [tab, setTab] = useState<SessionSettingsTab>('live')
  const activePlan = billingSnapshot.status === 'ready' ? billingSnapshot.plan : undefined
  const planName = authPlanFixtures.find((plan) => plan.id === activePlan)?.name ?? 'Free'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="Session settings" className="border-live-border bg-live-panel text-white before:bg-white/20 sm:max-w-lg">
        <DialogClose className="text-white/50 hover:text-white" />
        <DialogTitle className="text-lg font-semibold text-white">Settings</DialogTitle>
        <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto sm:max-h-[28rem] sm:flex-row sm:gap-0">
          <nav className="flex shrink-0 gap-1 overflow-x-auto sm:w-40 sm:flex-col sm:gap-0 sm:border-r sm:border-live-border sm:pe-4">
            <SessionSettingsTabButton active={tab === 'live'} onClick={() => setTab('live')}>
              Live Controls
            </SessionSettingsTabButton>
            <SessionSettingsTabButton active={tab === 'window'} onClick={() => setTab('window')}>
              Window
            </SessionSettingsTabButton>
            <SessionSettingsTabButton active={tab === 'session'} onClick={() => setTab('session')}>
              Session
            </SessionSettingsTabButton>
          </nav>

          <div className="flex-1 sm:ps-6">
            {tab === 'live' ? (
              <div className="grid gap-5">
                <SettingRow
                  title="Auto-scroll"
                  description="Follows the latest response; scroll up to pause"
                  control={<LiveToggle checked={autoScroll} onChange={setAutoScroll} label="Toggle auto-scroll" />}
                />
                <SettingRow
                  title="Auto-scroll speed"
                  description="How quickly new responses move into view"
                  control={
                    <select
                      value={scrollSpeed}
                      onChange={(event) => setScrollSpeed(Number(event.target.value))}
                      className="rounded-lg border border-live-control-border bg-white/5 px-3 py-1.5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {[1, 2, 3].map((speed) => (
                        <option key={speed} value={speed} className="bg-[#0d1929] text-white">
                          {SCROLL_SPEED_LABELS[speed]}
                        </option>
                      ))}
                    </select>
                  }
                />
                <SettingRow
                  title="Font size"
                  description="Transcript and AI response text"
                  control={
                    <select
                      value={fontSize}
                      onChange={(event) => setFontSize(Number(event.target.value))}
                      className="rounded-lg border border-live-control-border bg-white/5 px-3 py-1.5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {[12, 14, 16, 18].map((size) => (
                        <option key={size} value={size} className="bg-[#0d1929] text-white">
                          {size}px
                        </option>
                      ))}
                    </select>
                  }
                />
                <SettingRow
                  title="Response"
                  description={responseMode === 'auto' ? 'Answers automatically' : 'Press Space to answer'}
                  control={
                    <div className="flex rounded-lg border border-live-control-border">
                      <button
                        type="button"
                        onClick={() => setResponseMode('auto')}
                        className={cn('rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors', responseMode === 'auto' ? 'bg-accent text-on-accent' : 'text-white/50 hover:text-white')}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseMode('manual')}
                        className={cn('rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors', responseMode === 'manual' ? 'bg-accent text-on-accent' : 'text-white/50 hover:text-white')}
                      >
                        Manual
                      </button>
                    </div>
                  }
                />
              </div>
            ) : null}

            {tab === 'window' ? (
              <div className="grid gap-5">
                <SettingRow
                  title="Stealth Mode"
                  description="Hides Copilot from screen share"
                  control={<LiveToggle checked={stealthMode} onChange={setStealthMode} label="Toggle stealth mode" />}
                />
                <div>
                  <p className="text-sm font-medium text-white">Appearance</p>
                  <p className="mt-0.5 text-xs text-white/50">Choose solid Clear panels or translucent Tinted panels</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {APPEARANCE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={appearance === option.value}
                        onClick={() => setAppearance(option.value)}
                        className={cn(
                          'rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                          appearance === option.value ? 'border-accent bg-accent/10' : 'border-live-control-border bg-white/5 hover:border-white/30',
                        )}
                      >
                        <span className="flex items-center justify-between text-sm font-medium text-white">
                          {option.label}
                          {appearance === option.value ? <Check aria-hidden="true" className="size-3.5 text-accent" /> : null}
                        </span>
                        <span className="mt-0.5 block text-xs text-white/50">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <SettingRow
                  title="Always on Top"
                  description="Keeps Copilot above all other windows"
                  control={<LiveToggle checked={alwaysOnTop} onChange={setAlwaysOnTop} label="Toggle always on top" />}
                />
                <SettingRow
                  title="Meeting Detect"
                  description="Notify me when a meeting app is active"
                  control={<LiveToggle checked={meetingDetect} onChange={setMeetingDetect} label="Toggle meeting detect" />}
                />
              </div>
            ) : null}

            {tab === 'session' ? (
              <div className="grid gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Role</span>
                  <span className="text-sm font-medium text-white">{copilotLiveSession.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Resume</span>
                  <span className="text-sm font-medium text-white">Jobwhisper Resume</span>
                </div>
                <div className="border-t border-live-border pt-4">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-live-control-border px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    Reset — show setup next time
                  </button>
                </div>

                <div className="flex items-center gap-3 border-t border-live-border pt-5">
                  <Avatar name={`${settingsProfile.firstName} ${settingsProfile.lastName}`} size="md" className="bg-white/10 text-white" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {settingsProfile.firstName} {settingsProfile.lastName}
                    </p>
                    <p className="truncate text-xs text-white/50">{settingsProfile.email}</p>
                  </div>
                  <Badge size="sm" className="border-accent/30 bg-accent/15 text-accent">
                    {planName}
                  </Badge>
                </div>
                <Button variant="secondary" className="border-live-control-border bg-transparent text-white hover:bg-white/5" onClick={onSignOut}>
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

export function DesktopSessionView() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activityLabel, setActivityLabel] = useState(copilotLiveSession.activityLabel)
  const [meetingDetect, setMeetingDetect] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [scrollSpeed, setScrollSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(14)
  const [responseMode, setResponseMode] = useState<'auto' | 'manual'>('auto')
  const [stealthMode, setStealthMode] = useState(false)
  const [appearance, setAppearance] = useState<'clear' | 'tinted'>('tinted')
  const [alwaysOnTop, setAlwaysOnTop] = useState(true)

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex h-full min-h-[520px] flex-col bg-live-workspace text-white">
      <header className="flex min-h-[57px] shrink-0 items-center justify-between border-b border-white/10 bg-live-header px-5 py-3">
        <div className="flex items-center gap-3">
          <ArrowLeft aria-hidden="true" className="size-4 text-white/60" />
          <h1 className="truncate text-sm font-medium leading-5">{copilotLiveSession.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-sm font-medium leading-5 text-slate-300">{formatElapsed(seconds)}</span>
          <button
            type="button"
            onClick={() => navigate('/desktop/complete')}
            className="inline-flex min-h-[30px] items-center rounded-lg bg-[#ef4444] px-4 text-sm font-semibold text-white"
          >
            End Session
          </button>
        </div>
      </header>

      <div className="flex min-h-9 shrink-0 items-center justify-between bg-live-strip px-5">
        <div className="flex items-center gap-4">
          <span className="flex items-end gap-[3px]" aria-label={copilotLiveSession.signalLabel}>
            <span className="h-[5px] w-[3px] rounded bg-[#4ade80]" />
            <span className="h-2 w-[3px] rounded bg-[#4ade80]" />
            <span className="h-[11px] w-[3px] rounded bg-[#4ade80]" />
            <span className="h-3.5 w-[3px] rounded bg-[#4ade80]" />
          </span>
          <span className="text-sm font-medium leading-5 text-[#4ade80]">{copilotLiveSession.signalLabel}</span>
          <span className="text-sm italic leading-5 text-slate-400">{activityLabel}</span>
        </div>
        <button type="button" onClick={() => setSettingsOpen(true)} className="flex items-center gap-3 text-sm font-medium text-white">
          <Settings aria-hidden="true" className="size-4" />
          Settings
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#1e2d45] bg-[#0d1929]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[#1e2d45] px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Response
              <span className="size-2 rounded-full bg-[#ef4444]" />
            </span>
          </div>
          <CopilotTranscriptPanel
            bank={copilotInterviewTranscript}
            responseMode="manual"
            fontSize={14}
            onActivityChange={setActivityLabel}
            manualHint="Press Space to start the simulation…"
          />
        </div>
      </div>

      <SessionSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        fontSize={fontSize}
        setFontSize={setFontSize}
        responseMode={responseMode}
        setResponseMode={setResponseMode}
        stealthMode={stealthMode}
        setStealthMode={setStealthMode}
        appearance={appearance}
        setAppearance={setAppearance}
        alwaysOnTop={alwaysOnTop}
        setAlwaysOnTop={setAlwaysOnTop}
        meetingDetect={meetingDetect}
        setMeetingDetect={setMeetingDetect}
        onSignOut={() => navigate('/desktop')}
      />
    </div>
  )
}
