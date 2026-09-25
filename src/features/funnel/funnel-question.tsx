import { useId } from 'react'
import { Check } from 'lucide-react'

import type { FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelQuestionProps = {
  readonly question: FunnelQuestionData
  readonly value: string
  readonly onChange: (value: string) => void
}

export function FunnelQuestion({ question, value, onChange }: FunnelQuestionProps) {
  const headingId = useId()

  if (question.kind === 'text') {
    return (
      <div data-slot="funnel-question" data-kind="text">
        <FunnelTitle id={headingId}>{question.ask}</FunnelTitle>
        <input
          aria-labelledby={headingId}
          autoFocus
          value={value}
          placeholder={question.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="mt-8 min-h-12 w-full rounded-lg border border-input bg-surface px-4 text-lg text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
        />
      </div>
    )
  }

  return (
    <div data-slot="funnel-question" data-kind={question.kind}>
      <FunnelTitle id={headingId}>{question.ask}</FunnelTitle>
      <fieldset aria-labelledby={headingId} className={question.kind === 'pills' ? 'mt-8 flex flex-wrap gap-2' : 'mt-8 grid gap-3'}>
        {question.kind === 'options'
          ? question.options.map((option) => (
              <label
                key={option.label}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors duration-normal ease-default hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus motion-reduce:transition-none"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.label}
                  checked={value === option.label}
                  onChange={() => onChange(option.label)}
                  className="mt-1 size-4 shrink-0 accent-accent focus-visible:outline-none"
                />
                <span className="grid gap-0.5">
                  <span className="font-semibold text-ink">{option.label}</span>
                  {option.hint ? <span className="text-sm leading-6 text-ink-muted">{option.hint}</span> : null}
                </span>
              </label>
            ))
          : question.choices.map((choice) => (
              <label
                key={choice}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors duration-normal ease-default hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus motion-reduce:transition-none"
              >
                <input type="radio" name={question.id} value={choice} checked={value === choice} onChange={() => onChange(choice)} className="sr-only" />
                {value === choice ? <Check data-testid="funnel-pill-check" aria-hidden="true" className="size-4 text-accent-text" /> : null}
                {choice}
              </label>
            ))}
      </fieldset>
    </div>
  )
}

export type FunnelQuestionFooterProps = {
  /** Zero-based. */
  readonly position: number
  readonly total: number
  readonly canContinue: boolean
  readonly onBack: () => void
  readonly onContinue: () => void
}

export function FunnelQuestionFooter({ position, total, canContinue, onBack, onContinue }: FunnelQuestionFooterProps) {
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onBack}>Back</Button>
      <span className="ms-auto text-sm text-ink-muted">{position + 1} of {total}</span>
      <Button size="lg" onClick={onContinue} disabled={!canContinue}>{position >= total - 1 ? 'Finish' : 'Continue'}</Button>
    </>
  )
}
