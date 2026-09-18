import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

import type { AdminBroadcast, AudienceSegment, BroadcastChannel } from '@/contracts/admin-messaging.draft'
import { audienceSegmentLabels } from '@/contracts/admin-messaging.draft'
import {
  Button,
  Checkbox,
  DialogClose,
  RadioGroup,
  RadioGroupItem,
  TextField,
  cn,
} from '@/ui'
import { RichTextEditor } from '@/ui/rich-text-editor'

type ComposeStep = 1 | 2 | 3 | 4

type SendTiming = 'now' | 'scheduled' | 'daily' | 'custom'

type ComposeForm = {
  title: string
  body: string
  audience: AudienceSegment
  channel: BroadcastChannel
  sendTiming: SendTiming
  scheduledDate: string
}

type AdminMessagingComposeProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSave: (broadcast: AdminBroadcast) => void
}

const audienceOptions: readonly { readonly value: AudienceSegment; readonly label: string; readonly description: string }[] = [
  { value: 'all', label: 'All Users', description: 'Send to every registered user.' },
  { value: 'new-users', label: 'New Users (0–7 days)', description: 'Users who signed up in the last week.' },
  { value: 'unused-credits', label: 'Unused Credits', description: 'Users with credits who haven\'t used them.' },
  { value: 'used-not-subscribed', label: 'Used Credit, Not Subscribed', description: 'Tried a feature but hasn\'t upgraded.' },
  { value: 'renewed-30d', label: 'Renewed in Last 30 Days', description: 'Active subscribers who recently renewed.' },
  { value: 'custom', label: 'Custom Contacts', description: 'Search users or upload a CSV.' },
]

/* ── Mini calendar ────────────────────────────────────────────────────────── */

function MiniCalendar({ selected, onSelect }: { readonly selected: string; readonly onSelect: (date: string) => void }) {
  const [viewDate, setViewDate] = useState(() => {
    if (selected) {
      const d = new Date(selected)
      return { year: d.getFullYear(), month: d.getMonth() }
    }
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleString('en-US', { month: 'short', year: 'numeric' })
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay()
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  function prevMonth() {
    setViewDate((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 })
  }

  function nextMonth() {
    setViewDate((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 })
  }

  function formatDate(day: number) {
    return `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="w-full max-w-xs rounded-lg border border-border bg-surface p-3 shadow-panel">
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth} className="inline-flex size-7 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-subtle"><ChevronLeft className="size-4" /></button>
        <span className="text-sm font-semibold text-ink">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="inline-flex size-7 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-subtle"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="py-1 text-xs font-medium text-ink-muted">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} />
          const dateStr = formatDate(day)
          const isSelected = dateStr === selected
          const isToday = dateStr === todayStr
          const isPast = new Date(dateStr) < new Date(todayStr)
          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-full text-sm transition-colors',
                isPast && 'text-ink-muted/40 cursor-not-allowed',
                !isPast && !isSelected && 'text-ink hover:bg-surface-subtle',
                isSelected && 'bg-accent text-on-accent font-semibold',
                isToday && !isSelected && 'font-bold text-accent',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Step content renderers ──────────────────────────────────────────────── */

function StepContent({ form, setForm, touched }: { readonly form: ComposeForm; readonly setForm: React.Dispatch<React.SetStateAction<ComposeForm>>; readonly touched: boolean }) {
  const titleError = touched && !form.title.trim() ? 'Title is required.' : undefined

  return (
    <div className="grid gap-4">
      <TextField id="compose-title" label="Message Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} error={titleError} placeholder="e.g. Welcome to Jobwhisper" />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-ink">Body</label>
        <RichTextEditor value={form.body} onChange={(html) => setForm((prev) => ({ ...prev, body: html }))} placeholder="Write your broadcast message..." />
      </div>
    </div>
  )
}

function StepAudience({ form, setForm }: { readonly form: ComposeForm; readonly setForm: React.Dispatch<React.SetStateAction<ComposeForm>> }) {
  return (
    <RadioGroup value={form.audience} onValueChange={(v) => setForm((prev) => ({ ...prev, audience: v as AudienceSegment }))} label="Select audience">
      <div className="grid gap-3">
        {audienceOptions.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors',
              form.audience === opt.value ? 'border-accent bg-accent-subtle' : 'border-border hover:border-accent/40 hover:bg-surface-subtle',
            )}
          >
            <RadioGroupItem value={opt.value} itemLabel="" className="mt-0.5" />
            <div>
              <span className="text-sm font-semibold text-ink">{opt.label}</span>
              <p className="mt-0.5 text-xs text-ink-muted">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>
    </RadioGroup>
  )
}

function StepScheduling({ form, setForm }: { readonly form: ComposeForm; readonly setForm: React.Dispatch<React.SetStateAction<ComposeForm>> }) {
  const [openDropdown, setOpenDropdown] = useState(false)

  const timingLabel: Record<SendTiming, string> = {
    now: 'Now',
    scheduled: 'Scheduled',
    daily: 'Daily',
    custom: 'Custom...',
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ink-muted">Send to eligible users</p>

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span>{timingLabel[form.sendTiming]}</span>
          <svg className="size-4 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </button>

        {openDropdown && (
          <div className="absolute z-dropdown mt-1 w-full rounded-lg border border-border bg-surface shadow-panel">
            <div className="px-3 py-2 text-xs font-semibold text-ink-muted">One time notification</div>
            <button type="button" onClick={() => { setForm((prev) => ({ ...prev, sendTiming: 'now' })); setOpenDropdown(false) }} className={cn('flex w-full items-center px-3 py-2 text-sm hover:bg-surface-subtle', form.sendTiming === 'now' && 'bg-accent-subtle text-accent')}>
              Now
            </button>
            <button type="button" onClick={() => { setForm((prev) => ({ ...prev, sendTiming: 'scheduled' })); setOpenDropdown(false) }} className={cn('flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-surface-subtle', form.sendTiming === 'scheduled' && 'bg-accent-subtle text-accent')}>
              <span>Scheduled</span>
              <svg className="size-4 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <div className="border-t border-border" />
            <div className="px-3 py-2 text-xs font-semibold text-ink-muted">Recurring notifications</div>
            <button type="button" onClick={() => { setForm((prev) => ({ ...prev, sendTiming: 'daily' })); setOpenDropdown(false) }} className={cn('flex w-full items-center px-3 py-2 text-sm hover:bg-surface-subtle', form.sendTiming === 'daily' && 'bg-accent-subtle text-accent')}>
              Daily
            </button>
            <button type="button" onClick={() => { setForm((prev) => ({ ...prev, sendTiming: 'custom' })); setOpenDropdown(false) }} className={cn('flex w-full items-center px-3 py-2 text-sm hover:bg-surface-subtle', form.sendTiming === 'custom' && 'bg-accent-subtle text-accent')}>
              Custom...
            </button>
          </div>
        )}
      </div>

      {/* Calendar picker when scheduled */}
      {form.sendTiming === 'scheduled' && (
        <div className="mt-2">
          <MiniCalendar selected={form.scheduledDate} onSelect={(date) => setForm((prev) => ({ ...prev, scheduledDate: date }))} />
        </div>
      )}

      {/* Channel selection */}
      <div className="mt-2 border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium text-ink">Delivery channel</p>
        <div className="grid gap-3">
          {(['email', 'in-app', 'both'] as const).map((ch) => (
            <label key={ch} className={cn('flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors', form.channel === ch ? 'border-accent bg-accent-subtle' : 'border-border hover:border-accent/40')}>
              <Checkbox checked={form.channel === ch} onCheckedChange={() => setForm((prev) => ({ ...prev, channel: ch }))} label="" />
              <span className="text-sm font-medium text-ink capitalize">{ch === 'both' ? 'Email + In-App' : ch === 'in-app' ? 'In-App Notification' : 'Email'}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepReview({ form }: { readonly form: ComposeForm }) {
  const timingLabel: Record<SendTiming, string> = {
    now: 'Send immediately',
    scheduled: `Scheduled for ${form.scheduledDate || 'no date selected'}`,
    daily: 'Recurring daily',
    custom: 'Custom schedule',
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-border bg-surface-subtle p-4">
        <h3 className="text-sm font-semibold text-ink">Broadcast Summary</h3>
        <dl className="mt-2 grid gap-1.5 text-sm">
          <div className="flex gap-2"><dt className="text-ink-muted">Title:</dt><dd className="font-medium text-ink">{form.title}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-muted">Audience:</dt><dd className="font-medium text-ink">{audienceSegmentLabels[form.audience]}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-muted">Channel:</dt><dd className="font-medium text-ink capitalize">{form.channel === 'both' ? 'Email + In-App' : form.channel}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-muted">Schedule:</dt><dd className="font-medium text-ink">{timingLabel[form.sendTiming]}</dd></div>
        </dl>
      </div>
    </div>
  )
}

/* ── Vertical stepper step ───────────────────────────────────────────────── */

function VerticalStep({
  stepNum,
  status,
  label,
  subtitle,
  isLast,
  children,
  onGoTo,
}: {
  readonly stepNum: ComposeStep
  readonly status: 'complete' | 'active' | 'pending'
  readonly label: string
  readonly subtitle?: string
  readonly isLast: boolean
  readonly children?: React.ReactNode
  readonly onGoTo: (step: ComposeStep) => void
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => { if (status === 'complete') onGoTo(stepNum) }}
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors',
            status === 'complete' ? 'bg-positive text-on-accent cursor-pointer hover:opacity-80' : status === 'active' ? 'bg-accent text-on-accent ring-2 ring-focus ring-offset-2 ring-offset-surface' : 'bg-surface-subtle text-ink-muted border border-border',
          )}
          aria-label={`Step ${stepNum}: ${label}`}
        >
          {status === 'complete' ? <Check aria-hidden="true" className="size-4" /> : stepNum}
        </button>
        {!isLast && <span className={cn('mt-1 w-px flex-1 min-h-4', status === 'complete' ? 'bg-positive' : 'bg-border')} aria-hidden="true" />}
      </div>

      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="flex flex-col">
          <h3 className={cn('text-base font-semibold', status === 'active' ? 'text-ink' : 'text-ink-muted')}>{label}</h3>
          {subtitle && status !== 'active' && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
        </div>
        {status === 'active' && children}
      </div>
    </div>
  )
}

/* ── Main compose ────────────────────────────────────────────────────────── */

export function AdminMessagingCompose({ open, onOpenChange, onSave }: AdminMessagingComposeProps) {
  const [step, setStep] = useState<ComposeStep>(1)
  const [touched, setTouched] = useState(false)
  const [form, setForm] = useState<ComposeForm>({
    title: '',
    body: '',
    audience: 'all',
    channel: 'both',
    sendTiming: 'now',
    scheduledDate: '',
  })

  function reset() {
    setStep(1)
    setTouched(false)
    setForm({ title: '', body: '', audience: 'all', channel: 'both', sendTiming: 'now', scheduledDate: '' })
  }

  function handleClose(v: boolean) {
    if (!v) reset()
    onOpenChange(v)
  }

  function next() {
    if (step === 1) {
      setTouched(true)
      if (!form.title.trim()) return
    }
    if (step < 4) setStep((s) => (s + 1) as ComposeStep)
  }

  function send() {
    const broadcast: AdminBroadcast = {
      id: `bc-${Date.now()}`,
      title: form.title.trim(),
      body: form.body,
      audience: form.audience,
      channel: form.channel,
      status: form.sendTiming === 'now' ? 'sent' : 'scheduled',
      sentAt: form.sendTiming === 'now' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      scheduledAt: form.sendTiming === 'scheduled' ? form.scheduledDate : undefined,
      metrics: { delivered: 0, seen: 0, clicked: 0 },
    }
    onSave(broadcast)
    reset()
    onOpenChange(false)
  }

  function statusFor(s: ComposeStep): 'complete' | 'active' | 'pending' {
    if (s < step) return 'complete'
    if (s === step) return 'active'
    return 'pending'
  }

  const timingSubtitle: Record<SendTiming, string> = {
    now: 'Send now',
    scheduled: form.scheduledDate || 'Pick a date',
    daily: 'Recurring daily',
    custom: 'Custom',
  }

  return (
    <div className="grid gap-4">
      <VerticalStep stepNum={1} status={statusFor(1)} label="Content" onGoTo={setStep}>
        <div className="mt-4 grid gap-4">
          <StepContent form={form} setForm={setForm} touched={touched} />
          <div className="flex justify-start pt-2">
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      </VerticalStep>

      <VerticalStep stepNum={2} status={statusFor(2)} label="Target" subtitle={audienceSegmentLabels[form.audience]} onGoTo={setStep}>
        <div className="mt-4 grid gap-4">
          <StepAudience form={form} setForm={setForm} />
          <div className="flex justify-start pt-2">
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      </VerticalStep>

      <VerticalStep stepNum={3} status={statusFor(3)} label="Scheduling" subtitle={timingSubtitle[form.sendTiming]} onGoTo={setStep}>
        <div className="mt-4 grid gap-4">
          <StepScheduling form={form} setForm={setForm} />
          <div className="flex justify-start pt-2">
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      </VerticalStep>

      <VerticalStep stepNum={4} status={statusFor(4)} label="Review & Send" isLast onGoTo={setStep}>
        <div className="mt-4 grid gap-4">
          <StepReview form={form} />
          <div className="flex flex-wrap gap-2 pt-2">
            <DialogClose onClick={reset} className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button onClick={send}>{form.sendTiming === 'now' ? 'Send Broadcast' : 'Schedule Broadcast'}</Button>
          </div>
        </div>
      </VerticalStep>
    </div>
  )
}
