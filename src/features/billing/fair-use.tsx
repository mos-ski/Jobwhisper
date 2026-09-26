import { Clock, TriangleAlert, Zap } from 'lucide-react'

import type { FairUseFeature, FairUseSnapshot, FairUseUnit } from '@/contracts/fair-use.draft'
import { Button, cn, Dialog, DialogDescription, DialogPopup, DialogTitle, formatUsd, ProgressBar } from '@/ui'

/**
 * Minutes read as time, everything else reads as a count. A 135-minute stretch shown as
 * "135 minutes" makes someone do the division mid-interview.
 */
export function formatFairUseAmount(value: number, unit: FairUseUnit): string {
  if (unit !== 'minutes') {
    const word = unit === 'prompts' ? 'prompt' : 'application'
    return `${value.toLocaleString('en-US')} ${value === 1 ? word : `${word}s`}`
  }
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  if (hours === 0) return `${minutes} min`
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

/**
 * What a stretch is called, and what the reassurance is worth saying, per feature. A resume
 * sitting has no call to still be on and no transcript to keep, so it cannot borrow the
 * interview's words.
 */
const featureCopy: Readonly<Record<FairUseFeature, {
  readonly noun: string
  readonly unlockTitle: string
  readonly kept: string
}>> = {
  interview: {
    noun: 'stretch',
    unlockTitle: 'Still on the call? Carry on now',
    kept: 'Nothing is lost. Your notes, transcript and recording stay where they are.',
  },
  'resume-builder': {
    noun: 'sitting',
    unlockTitle: 'Need to finish this resume? Carry on now',
    kept: 'Nothing is lost. Your resume and every change you accepted stay as they are.',
  },
  'auto-apply': {
    noun: 'run',
    unlockTitle: 'Need the next batch sooner? Start it now',
    kept: 'Nothing is lost. Every application already sent keeps its place and its status.',
  },
}

export type FairUseMeterProps = {
  readonly snapshot: FairUseSnapshot
  /** What the meter is measuring, in the product's words, e.g. "Interview Copilot". */
  readonly featureName: string
  readonly className?: string
}

/**
 * The always-visible half of fair use. The wall only feels fair if it was visible on the way
 * in, so this sits in the running session rather than appearing with the dialog.
 */
export function FairUseMeter({ snapshot, featureName, className }: FairUseMeterProps) {
  const { policy, used, state } = snapshot
  const remaining = Math.max(0, policy.stretchLimit - used)
  const color = state === 'cooling-down' ? 'danger' : state === 'nearing-limit' ? 'warning' : 'accent'

  return (
    <div
      data-slot="fair-use-meter"
      data-state={state}
      className={cn('grid gap-2 rounded-soft border border-border bg-surface p-3', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-medium text-ink">
          {formatFairUseAmount(Math.min(used, policy.stretchLimit), policy.unit)} of{' '}
          {formatFairUseAmount(policy.stretchLimit, policy.unit)} in this {featureCopy[policy.feature].noun}
        </p>
        <p className="text-xs text-ink-muted">{featureName}</p>
      </div>
      <ProgressBar
        value={Math.min(used, policy.stretchLimit)}
        max={policy.stretchLimit}
        size="sm"
        color={color}
        label={`${featureName} fair-use stretch`}
      />
      {state === 'cooling-down' ? (
        <p className="flex items-start gap-2 text-xs leading-5 text-ink" role="status">
          <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Stretch finished. {featureName} opens again
            {snapshot.resumesAtLabel ? ` at ${snapshot.resumesAtLabel}` : ''}
            {snapshot.cooldownRemainingLabel ? `, in ${snapshot.cooldownRemainingLabel}` : ''}.
          </span>
        </p>
      ) : state === 'nearing-limit' ? (
        <p className="flex items-start gap-2 text-xs leading-5 text-ink" role="status">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            {formatFairUseAmount(remaining, policy.unit)} left before {featureName} rests for{' '}
            {policy.cooldownHours === 1 ? 'an hour' : `${policy.cooldownHours} hours`}.
          </span>
        </p>
      ) : (
        <p className="text-xs leading-5 text-ink-muted">
          Unlimited across your plan. One {featureCopy[policy.feature].noun} runs to{' '}
          {formatFairUseAmount(policy.stretchLimit, policy.unit)}, then rests for{' '}
          {policy.cooldownHours === 1 ? 'an hour' : `${policy.cooldownHours} hours`}.
        </p>
      )}
    </div>
  )
}

export type FairUseLimitDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly snapshot: FairUseSnapshot
  /** What just stopped, in the product's words, e.g. "Interview Copilot". */
  readonly featureName: string
  /** Called when the person buys past the cooldown. Absent offer means no button is shown. */
  readonly onUnlock?: () => void
}

/**
 * The wall itself, and the one place the cooldown is sold past. It is deliberately not
 * dismissible into nothing: the close action says what waiting means, so the choice reads as
 * wait or pay rather than as an error someone has to get around.
 */
export function FairUseLimitDialog({ open, onOpenChange, snapshot, featureName, onUnlock }: FairUseLimitDialogProps) {
  const { policy, unlockOffer } = snapshot
  const canUnlock = policy.topUpUnlocks && unlockOffer !== undefined
  const copy = featureCopy[policy.feature]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup data-slot="fair-use-limit-dialog" className="max-w-md">
        <DialogTitle>
          Your {formatFairUseAmount(policy.stretchLimit, policy.unit)} {copy.noun} is up
        </DialogTitle>
        <DialogDescription>
          {featureName} is unlimited on your plan, but one uninterrupted {copy.noun} runs to{' '}
          {formatFairUseAmount(policy.stretchLimit, policy.unit)}. It opens again
          {snapshot.resumesAtLabel ? ` at ${snapshot.resumesAtLabel}` : ''}
          {snapshot.cooldownRemainingLabel ? `, in ${snapshot.cooldownRemainingLabel}` : ''}.
        </DialogDescription>

        <div className="mt-4 grid gap-3">
          <div className="flex items-start gap-3 rounded-soft border border-border bg-surface-subtle p-3">
            <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-muted" />
            <div>
              <p className="text-sm font-medium text-ink">
                Free again in {snapshot.cooldownRemainingLabel ?? `${policy.cooldownHours} hours`}
              </p>
              <p className="mt-1 text-xs leading-5 text-ink-muted">{copy.kept}</p>
            </div>
          </div>

          {canUnlock ? (
            <div className="flex items-start gap-3 rounded-soft border border-accent bg-accent-subtle p-3">
              <Zap aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-text" />
              <div>
                <p className="text-sm font-medium text-accent-text">{copy.unlockTitle}</p>
                <p className="mt-1 text-xs leading-5 text-accent-text">
                  {unlockOffer.label} for {formatUsd(unlockOffer.priceCents)} starts a fresh {copy.noun} immediately.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs leading-5 text-ink-muted">
              This one cannot be bought past — the cooldown is what keeps the plan unlimited for everyone on it.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {snapshot.resumesAtLabel ? `Wait until ${snapshot.resumesAtLabel}` : 'Wait it out'}
          </Button>
          {canUnlock ? (
            <Button variant="primary" onClick={onUnlock}>
              Add {formatUsd(unlockOffer.priceCents)} and keep going
            </Button>
          ) : null}
        </div>
      </DialogPopup>
    </Dialog>
  )
}
