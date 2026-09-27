import { Clock, TriangleAlert } from 'lucide-react'

import type { FairUseFeature, FairUseSnapshot, FairUseUnit } from '@/contracts/fair-use.draft'
import { cn, NoticeCard, ProgressBar } from '@/ui'

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
const featureCopy: Readonly<Record<FairUseFeature, { readonly noun: string }>> = {
  interview: { noun: 'stretch' },
  'resume-builder': { noun: 'sitting' },
  'auto-apply': { noun: 'run' },
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
          {policy.unit === 'minutes'
            ? `${formatFairUseAmount(Math.min(used, policy.stretchLimit), policy.unit)} of ${formatFairUseAmount(policy.stretchLimit, policy.unit)}`
            : `${Math.min(used, policy.stretchLimit)} of ${formatFairUseAmount(policy.stretchLimit, policy.unit)}`}{' '}
          in this {featureCopy[policy.feature].noun}
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

export type FairUseNoticeProps = {
  readonly snapshot: FairUseSnapshot
  readonly featureName: string
  readonly onAction?: () => void
  readonly className?: string
}

/**
 * The card form of the meter, for a phone: what is left, when it comes back, and one
 * full-width button. The meter's progress bar earns its space on a wide screen beside the
 * work; on a phone the sentence and the button are the whole of it.
 */
export function FairUseNotice({ snapshot, featureName, onAction, className }: FairUseNoticeProps) {
  const { policy, used, state } = snapshot
  const spent = state === 'cooling-down'
  const remaining = Math.max(0, policy.stretchLimit - used)
  const noun = featureCopy[policy.feature].noun

  return (
    <NoticeCard
      tone="neutral"
      className={className}
      title={spent ? `${featureName} is resting` : 'Approaching your limit'}
      description={
        spent
          ? `Back${snapshot.resumesAtLabel ? ` at ${snapshot.resumesAtLabel}` : ''}${snapshot.cooldownRemainingLabel ? `, in ${snapshot.cooldownRemainingLabel}` : ''}.`
          : `${formatFairUseAmount(remaining, policy.unit)} left in this ${noun}.`
      }
      action={policy.topUpUnlocks ? { label: 'Keep going now', onClick: onAction } : undefined}
    />
  )
}

