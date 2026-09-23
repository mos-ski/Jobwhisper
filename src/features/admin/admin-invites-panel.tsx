import { useState } from 'react'
import { Copy, Link2, Mail, Plus } from 'lucide-react'

import type {
  AdminInvite,
  AdminInviteCreditProduct,
  AdminInviteDelivery,
  AdminInviteDraft,
  AdminInviteGrant,
  AdminInvitesSummary,
  AdminInviteStatus,
} from '@/contracts/admin-invites.draft'
import type { AdminConfigPlanId } from '@/contracts/admin-configuration.draft'
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  EmptyState,
  SelectField,
  TextField,
  cn,
} from '@/ui'

type GrantKind = AdminInviteGrant['kind']

const statusMeta: Readonly<Record<AdminInviteStatus, { readonly label: string; readonly variant: 'positive' | 'warning' | 'danger' | 'neutral' }>> = {
  pending: { label: 'Open', variant: 'warning' },
  accepted: { label: 'Accepted', variant: 'positive' },
  expired: { label: 'Expired', variant: 'neutral' },
  revoked: { label: 'Revoked', variant: 'danger' },
}

const planOptions: readonly { readonly value: AdminConfigPlanId; readonly label: string; readonly cycleNoun: string }[] = [
  { value: 'starter', label: 'Starter', cycleNoun: 'week' },
  { value: 'pro', label: 'Pro', cycleNoun: 'month' },
  { value: 'premium', label: 'Premium', cycleNoun: 'month' },
]

const creditProductOptions: readonly { readonly value: AdminInviteCreditProduct; readonly label: string; readonly unit: string }[] = [
  { value: 'interview', label: 'Interview', unit: 'minutes of Prep or Copilot' },
  { value: 'auto-apply', label: 'Auto Apply', unit: 'successful applications' },
  { value: 'resume-builder', label: 'Resume Builder', unit: 'AI prompts' },
]

const numberFormatter = new Intl.NumberFormat('en-US')
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

function cycleNoun(planId: AdminConfigPlanId): string {
  return planOptions.find((option) => option.value === planId)?.cycleNoun ?? 'month'
}

/** The one place a grant becomes words, so the dialog preview and a saved row agree. */
export function describeGrant(grant: AdminInviteGrant): string {
  if (grant.kind === 'none') return 'No grant'
  if (grant.kind === 'plan') {
    const plan = planOptions.find((option) => option.value === grant.planId)
    const noun = cycleNoun(grant.planId)
    return grant.cycles === 1
      ? `${plan?.label ?? grant.planId}, first ${noun} covered`
      : `${plan?.label ?? grant.planId}, first ${grant.cycles} ${noun}s covered`
  }
  const product = creditProductOptions.find((option) => option.value === grant.product)
  return `${numberFormatter.format(grant.amount)} ${product?.label ?? grant.product} credits`
}

function DeliveryIcon({ delivery }: { readonly delivery: AdminInviteDelivery }) {
  return delivery === 'email'
    ? <Mail aria-hidden="true" className="size-4 text-ink-muted" />
    : <Link2 aria-hidden="true" className="size-4 text-ink-muted" />
}

export type AdminInvitesPanelProps = {
  readonly invites: readonly AdminInvite[]
  readonly summary: AdminInvitesSummary
  readonly onCreateInvite?: (draft: AdminInviteDraft) => void
  readonly onRevokeInvite?: (inviteId: string) => void
  /** Whether this admin may issue invites at all — `admin:users:manage`. */
  readonly canInvite: boolean
}

export function AdminInvitesPanel({ invites, summary, onCreateInvite, onRevokeInvite, canInvite }: AdminInvitesPanelProps) {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copyLink(invite: AdminInvite) {
    try {
      await navigator.clipboard?.writeText(invite.url)
      setCopiedId(invite.id)
      setNotice(`Invite link copied. Anyone who opens it lands with: ${invite.grantLabel}.`)
    } catch {
      // A blocked clipboard is not an error worth a dialog: the URL is on screen to copy by hand.
      setNotice('Could not reach the clipboard. The link is in the row, ready to copy by hand.')
    }
  }

  return (
    <section className="grid gap-4" aria-label="Invites">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Open invites" value={numberFormatter.format(summary.pending)} detail="Links and emails still accepting new accounts" />
        <SummaryTile label="Accepted this month" value={numberFormatter.format(summary.acceptedThisMonth)} detail="Accounts created through an invite" />
        <SummaryTile
          label="Committed if all claimed"
          value={usdFormatter.format(summary.committedValueCents / 100)}
          detail="What the open grants are worth at list price"
        />
      </div>

      <div className="overflow-hidden rounded-sm border border-border bg-surface shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-gowun text-lg font-bold text-ink">Invites</h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              Bring someone in by email, or hand out a link. Either can arrive with a plan or a credit balance already
              in the account; once it runs out they pay like anyone else.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} disabled={!canInvite} leadingIcon={<Plus aria-hidden="true" />}>
            New invite
          </Button>
        </div>

        {!canInvite ? (
          <p className="border-b border-border bg-surface-subtle px-5 py-3 text-sm text-ink-muted">
            Issuing invites needs the <span className="font-medium text-ink">Manage users</span> permission.
          </p>
        ) : null}

        {notice ? (
          <p role="status" className="border-b border-border bg-accent-subtle px-5 py-3 text-sm text-accent-text">
            {notice}
          </p>
        ) : null}

        {invites.length === 0 ? (
          <div className="px-5 py-10">
            <EmptyState
              title="No invites yet"
              description="Invite one person by email, or generate a link for a whole cohort and attach a plan to it."
              action={canInvite ? <Button onClick={() => setOpen(true)}>New invite</Button> : undefined}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <caption className="sr-only">Every invite, what it grants, and how many accounts it has created</caption>
              <thead>
                <tr className="border-b border-border">
                  {['Invite', 'Grant', 'Accepted', 'Expires', 'Status', ''].map((heading, index) => (
                    <th
                      key={heading || `actions-${index}`}
                      scope="col"
                      className="px-5 py-2.5 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      {heading || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const meta = statusMeta[invite.status]
                  const live = invite.status === 'pending'
                  return (
                    <tr key={invite.id} className="border-b border-border align-top last:border-b-0">
                      <th scope="row" className="px-5 py-4 text-start font-medium text-ink">
                        <span className="flex items-center gap-2">
                          <DeliveryIcon delivery={invite.delivery} />
                          {invite.email ?? invite.url.replace(/^https?:\/\//, '')}
                        </span>
                        {invite.note ? (
                          <span className="mt-1 block text-xs font-normal leading-5 text-ink-muted">{invite.note}</span>
                        ) : null}
                      </th>
                      <td className="px-5 py-4 text-ink">{invite.grantLabel}</td>
                      <td className="px-5 py-4 text-ink-muted">
                        {numberFormatter.format(invite.acceptedCount)}
                        {invite.uses.kind === 'limited' ? ` of ${numberFormatter.format(invite.uses.max)}` : ' · no cap'}
                      </td>
                      <td className="px-5 py-4 text-ink-muted">{invite.expiresLabel || 'No expiry'}</td>
                      <td className="px-5 py-4">
                        <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            leadingIcon={<Copy aria-hidden="true" />}
                            aria-label={`Copy the invite link for ${invite.email ?? invite.id}`}
                            onClick={() => void copyLink(invite)}
                          >
                            {copiedId === invite.id ? 'Copied' : 'Copy link'}
                          </Button>
                          {live && canInvite ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              aria-label={`Revoke the invite for ${invite.email ?? invite.id}`}
                              onClick={() => {
                                onRevokeInvite?.(invite.id)
                                setNotice('Invite revoked. The link stops working immediately; accounts already created keep what they were given.')
                              }}
                            >
                              Revoke
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewInviteDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={(draft) => {
          onCreateInvite?.(draft)
          setOpen(false)
          setNotice(
            draft.delivery === 'email'
              ? `Invite sent to ${draft.email}, carrying: ${describeGrant(draft.grant)}.`
              : `Invite link created, carrying: ${describeGrant(draft.grant)}. Copy it from the top row.`,
          )
        }}
      />
    </section>
  )
}

function SummaryTile({ label, value, detail }: { readonly label: string; readonly value: string; readonly detail: string }) {
  return (
    <div className="rounded-sm border border-border bg-surface px-5 py-4 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 font-gowun text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-ink-muted">{detail}</p>
    </div>
  )
}

function NewInviteDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onCreate: (draft: AdminInviteDraft) => void
}) {
  const [delivery, setDelivery] = useState<AdminInviteDelivery>('link')
  const [email, setEmail] = useState('')
  const [grantKind, setGrantKind] = useState<GrantKind>('plan')
  const [planId, setPlanId] = useState<AdminConfigPlanId>('pro')
  const [cycles, setCycles] = useState('1')
  const [product, setProduct] = useState<AdminInviteCreditProduct>('interview')
  const [amount, setAmount] = useState('500')
  const [capped, setCapped] = useState(true)
  const [maxUses, setMaxUses] = useState('100')
  const [expiresOn, setExpiresOn] = useState('')
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const wholeCycles = /^\d{1,3}$/.test(cycles) && Number(cycles) > 0
  const wholeAmount = /^\d{1,7}$/.test(amount) && Number(amount) > 0
  const wholeUses = /^\d{1,6}$/.test(maxUses) && Number(maxUses) > 0

  const emailError = touched && delivery === 'email' && !emailValid ? 'Enter the address the invite should go to.' : undefined
  const cyclesError = touched && grantKind === 'plan' && !wholeCycles ? 'Enter a whole number of cycles, at least 1.' : undefined
  const amountError = touched && grantKind === 'credits' && !wholeAmount ? 'Enter a whole number of credits, at least 1.' : undefined
  const usesError = touched && delivery === 'link' && capped && !wholeUses ? 'Enter a whole number of uses, at least 1.' : undefined

  const grant: AdminInviteGrant =
    grantKind === 'none'
      ? { kind: 'none' }
      : grantKind === 'plan'
        ? { kind: 'plan', planId, cycles: Number(wholeCycles ? cycles : 1) }
        : { kind: 'credits', product, amount: Number(wholeAmount ? amount : 0) }

  const valid =
    (delivery === 'email' ? emailValid : !capped || wholeUses) &&
    (grantKind !== 'plan' || wholeCycles) &&
    (grantKind !== 'credits' || wholeAmount)

  function submit() {
    setTouched(true)
    if (!valid) return
    onCreate({
      delivery,
      email: delivery === 'email' ? email.trim() : '',
      grant,
      // An email invite is one person by definition; only a link can be handed around.
      uses: delivery === 'email' ? { kind: 'limited', max: 1 } : capped ? { kind: 'limited', max: Number(maxUses) } : { kind: 'unlimited' },
      expiresOn,
      note: note.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="New invite" className="sm:max-w-xl">
        <DialogClose aria-label="Close without creating an invite" />
        <DialogTitle>New invite</DialogTitle>
        <DialogDescription>
          Send it to one address, or create a link to hand out. Whatever you attach is in the account the moment it is
          accepted, and they start paying when it runs out.
        </DialogDescription>

        <div className="mt-5 grid gap-5">
          <Choice
            legend="How it reaches them"
            name="invite-delivery"
            value={delivery}
            options={[
              { value: 'link', label: 'A link I hand out' },
              { value: 'email', label: 'An email to one person' },
            ]}
            onChange={(value) => setDelivery(value as AdminInviteDelivery)}
          />

          {delivery === 'email' ? (
            <TextField
              id="invite-email"
              label="Email address"
              type="email"
              value={email}
              error={emailError}
              autoComplete="off"
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : (
            <div className="grid gap-3">
              <Checkbox label="Cap how many accounts this link can create" checked={capped} onCheckedChange={setCapped} />
              {capped ? (
                <TextField
                  id="invite-uses"
                  label="Maximum accounts"
                  inputMode="numeric"
                  value={maxUses}
                  error={usesError}
                  onChange={(event) => setMaxUses(event.target.value)}
                />
              ) : (
                <p className="text-xs leading-5 text-ink-muted">
                  Anyone with the link can join until it expires or you revoke it. Worth a cap on anything posted publicly.
                </p>
              )}
            </div>
          )}

          <Choice
            legend="What lands in the account"
            name="invite-grant"
            value={grantKind}
            options={[
              { value: 'plan', label: 'A plan' },
              { value: 'credits', label: 'Credits' },
              { value: 'none', label: 'Nothing' },
            ]}
            onChange={(value) => setGrantKind(value as GrantKind)}
          />

          {grantKind === 'plan' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                id="invite-plan"
                label="Plan"
                value={planId}
                options={planOptions.map((option) => ({ value: option.value, label: option.label }))}
                onValueChange={(value) => setPlanId(value as AdminConfigPlanId)}
              />
              <TextField
                id="invite-cycles"
                label={`${cycleNoun(planId) === 'week' ? 'Weeks' : 'Months'} covered`}
                inputMode="numeric"
                value={cycles}
                error={cyclesError}
                onChange={(event) => setCycles(event.target.value)}
              />
            </div>
          ) : null}

          {grantKind === 'credits' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                id="invite-product"
                label="Credit type"
                value={product}
                options={creditProductOptions.map((option) => ({ value: option.value, label: option.label }))}
                onValueChange={(value) => setProduct(value as AdminInviteCreditProduct)}
              />
              <TextField
                id="invite-amount"
                label="Credits"
                inputMode="numeric"
                value={amount}
                error={amountError}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              id="invite-expires"
              label="Expires on"
              type="date"
              value={expiresOn}
              onChange={(event) => setExpiresOn(event.target.value)}
            />
            <TextField
              id="invite-note"
              label="Note, for your own records"
              value={note}
              placeholder="Careers week cohort"
              autoComplete="off"
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <p className="rounded-soft border border-border bg-surface-subtle px-4 py-3 text-sm leading-6 text-ink-muted">
            {delivery === 'email'
              ? 'One person arrives with '
              : capped
                ? `Up to ${wholeUses ? numberFormatter.format(Number(maxUses)) : '—'} accounts arrive with `
                : 'Anyone with the link arrives with '}
            <span className="font-medium text-ink">{describeGrant(grant)}</span>
            {grantKind === 'credits'
              ? `, spendable on ${creditProductOptions.find((option) => option.value === product)?.unit}.`
              : grantKind === 'plan'
                ? `, renewing at the ${planOptions.find((option) => option.value === planId)?.label} price afterwards.`
                : '.'}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" size="lg" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="lg" onClick={submit}>
            {delivery === 'email' ? 'Send invite' : 'Create link'}
          </Button>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

/** A radio row that reads as a segmented control, used for the two either/or questions. */
function Choice({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  readonly legend: string
  readonly name: string
  readonly value: string
  readonly options: readonly { readonly value: string; readonly label: string }[]
  readonly onChange: (value: string) => void
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-soft border px-3 text-sm font-medium',
              value === option.value ? 'border-accent bg-accent-subtle text-accent-text' : 'border-input bg-surface text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="size-4 accent-accent"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
