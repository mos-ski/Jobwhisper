import { useState } from 'react'
import { Check } from 'lucide-react'

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

type ComposeForm = {
  title: string
  body: string
  audience: AudienceSegment
  channel: BroadcastChannel
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

const stepMeta: readonly { readonly label: string; readonly subtitle?: string }[] = [
  { label: 'Content' },
  { label: 'Target' },
  { label: 'Scheduling', subtitle: 'Send now' },
  { label: 'Review & Send' },
]

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

function StepChannel({ form, setForm }: { readonly form: ComposeForm; readonly setForm: React.Dispatch<React.SetStateAction<ComposeForm>> }) {
  const emailChecked = form.channel === 'email' || form.channel === 'both'
  const inAppChecked = form.channel === 'in-app' || form.channel === 'both'

  function toggle(channel: 'email' | 'in-app') {
    setForm((prev) => {
      const email = channel === 'email' ? !emailChecked : emailChecked
      const inApp = channel === 'in-app' ? !inAppChecked : inAppChecked
      if (email && inApp) return { ...prev, channel: 'both' }
      if (email) return { ...prev, channel: 'email' }
      if (inApp) return { ...prev, channel: 'in-app' }
      return prev
    })
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ink-muted">Choose how this broadcast will be delivered.</p>
      <label className={cn('flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors', emailChecked ? 'border-accent bg-accent-subtle' : 'border-border hover:border-accent/40')}>
        <Checkbox checked={emailChecked} onCheckedChange={() => toggle('email')} label="" />
        <div>
          <span className="text-sm font-semibold text-ink">Email</span>
          <p className="mt-0.5 text-xs text-ink-muted">Send as an email to the selected audience.</p>
        </div>
      </label>
      <label className={cn('flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors', inAppChecked ? 'border-accent bg-accent-subtle' : 'border-border hover:border-accent/40')}>
        <Checkbox checked={inAppChecked} onCheckedChange={() => toggle('in-app')} label="" />
        <div>
          <span className="text-sm font-semibold text-ink">In-App Notification</span>
          <p className="mt-0.5 text-xs text-ink-muted">Show as a notification inside the app.</p>
        </div>
      </label>
    </div>
  )
}

function StepReview({ form }: { readonly form: ComposeForm }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-border bg-surface-subtle p-4">
        <h3 className="text-sm font-semibold text-ink">Broadcast Summary</h3>
        <dl className="mt-2 grid gap-1.5 text-sm">
          <div className="flex gap-2"><dt className="text-ink-muted">Title:</dt><dd className="font-medium text-ink">{form.title}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-muted">Audience:</dt><dd className="font-medium text-ink">{audienceSegmentLabels[form.audience]}</dd></div>
          <div className="flex gap-2"><dt className="text-ink-muted">Channel:</dt><dd className="font-medium text-ink capitalize">{form.channel}</dd></div>
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
      {/* Timeline rail */}
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

      {/* Step body */}
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
  })

  function reset() {
    setStep(1)
    setTouched(false)
    setForm({ title: '', body: '', audience: 'all', channel: 'both' })
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
      status: 'sent',
      sentAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

        <VerticalStep stepNum={2} status={statusFor(2)} label="Target" subtitle={`${audienceSegmentLabels[form.audience]}`} onGoTo={setStep}>
          <div className="mt-4 grid gap-4">
            <StepAudience form={form} setForm={setForm} />
            <div className="flex justify-start pt-2">
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        </VerticalStep>

        <VerticalStep stepNum={3} status={statusFor(3)} label="Scheduling" subtitle={form.channel === 'both' ? 'Email + In-App' : form.channel === 'email' ? 'Email only' : 'In-App only'} onGoTo={setStep}>
          <div className="mt-4 grid gap-4">
            <StepChannel form={form} setForm={setForm} />
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
              <Button onClick={send}>Send Broadcast</Button>
            </div>
          </div>
        </VerticalStep>
      </div>
  )
}
