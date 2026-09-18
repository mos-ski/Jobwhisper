import { useState } from 'react'
import { ArrowLeft, Check, Upload, X } from 'lucide-react'

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

import { BroadcastPreview } from './broadcast-preview'

type ComposeStep = 1 | 2 | 3 | 4

type ComposeForm = {
  title: string
  body: string
  coverImage: string
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

function StepContent({ form, setForm, touched, setTouched }: { readonly form: ComposeForm; readonly setForm: React.Dispatch<React.SetStateAction<ComposeForm>>; readonly touched: boolean; readonly setTouched: (v: boolean) => void }) {
  const titleError = touched && !form.title.trim() ? 'Title is required.' : undefined

  return (
    <>
      <TextField id="compose-title" label="Message Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} error={titleError} placeholder="e.g. Welcome to Jobwhisper" />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-ink">Body</label>
        <RichTextEditor value={form.body} onChange={(html) => setForm((prev) => ({ ...prev, body: html }))} placeholder="Write your broadcast message..." />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-ink">Cover Image (optional)</label>
        {form.coverImage ? (
          <div className="relative inline-block w-fit overflow-hidden rounded-lg border border-border">
            <img src={form.coverImage} alt="Cover" className="h-32 object-cover" />
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))} className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70">
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex min-h-[5rem] cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm text-ink-muted hover:border-accent hover:text-accent transition-colors">
            <Upload aria-hidden="true" className="size-4" />
            Choose image
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setForm((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }))
            }} />
          </label>
        )}
      </div>
    </>
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
      <p className="text-sm text-ink-muted">Choose how this broadcast will be delivered. You can select both.</p>
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

export function AdminMessagingCompose({ open, onOpenChange, onSave }: AdminMessagingComposeProps) {
  const [step, setStep] = useState<ComposeStep>(1)
  const [touched, setTouched] = useState(false)
  const [form, setForm] = useState<ComposeForm>({
    title: '',
    body: '',
    coverImage: '',
    audience: 'all',
    channel: 'both',
  })

  function reset() {
    setStep(1)
    setTouched(false)
    setForm({ title: '', body: '', coverImage: '', audience: 'all', channel: 'both' })
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

  function prev() {
    if (step > 1) setStep((s) => (s - 1) as ComposeStep)
  }

  function send() {
    const broadcast: AdminBroadcast = {
      id: `bc-${Date.now()}`,
      title: form.title.trim(),
      body: form.body,
      coverImageUrl: form.coverImage || undefined,
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

  const stepLabels = ['Content', 'Audience', 'Channel', 'Review']

  return (
    <>
      {/* Step indicator */}
      <div className="flex items-center gap-2 px-1 pb-4">
        {stepLabels.map((label, i) => {
          const num = (i + 1) as ComposeStep
          const status = num < step ? 'complete' : num === step ? 'active' : 'pending'
          return (
            <div key={label} className="flex items-center gap-2">
              <span className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                status === 'complete' ? 'bg-positive text-on-accent' : status === 'active' ? 'bg-accent text-on-accent' : 'bg-surface-subtle text-ink-muted border border-border',
              )}>
                {status === 'complete' ? <Check aria-hidden="true" className="size-3.5" /> : num}
              </span>
              <span className={cn('text-xs font-medium', status === 'active' ? 'text-ink' : 'text-ink-muted')}>{label}</span>
              {i < stepLabels.length - 1 && <span className="mx-1 h-px w-4 bg-border" aria-hidden="true" />}
            </div>
          )
        })}
      </div>

      {/* Step form + preview */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button type="button" onClick={prev} className="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
          <div className="mt-2 grid gap-3">
            {step === 1 && <StepContent form={form} setForm={setForm} touched={touched} setTouched={setTouched} />}
            {step === 2 && <StepAudience form={form} setForm={setForm} />}
            {step === 3 && <StepChannel form={form} setForm={setForm} />}
            {step === 4 && (
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
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <div />
            <div className="flex flex-wrap gap-2">
              <DialogClose onClick={reset} className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
              {step < 4 ? (
                <Button onClick={next}>Next</Button>
              ) : (
                <Button onClick={send}>Send Broadcast</Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="flex flex-col items-center gap-3 lg:w-[26rem] lg:shrink-0 lg:border-l lg:border-border lg:ps-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Preview</p>
          <div className="w-full">
            <BroadcastPreview
              title={form.title}
              body={form.body}
              showEmail={form.channel === 'email' || form.channel === 'both'}
              showInApp={form.channel === 'in-app' || form.channel === 'both'}
            />
          </div>
        </div>
      </div>
    </>
  )
}
