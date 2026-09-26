import { useEffect, useId, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'

import type { FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button, cn } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelQuestionProps = {
  readonly question: FunnelQuestionData
  readonly value: string
  readonly onChange: (value: string) => void
  /** e.g. "Question 3 of 10". */
  readonly eyebrow?: string
  /**
   * Called a moment after a choice is picked, or when a typed answer is submitted with Enter.
   * Omit it (e.g. while offline) and answers only select.
   */
  readonly onAutoAdvance?: () => void
}

const LETTERS = 'ABCDEFGHIJ'
// Long enough to see the choice land, short enough to feel like one motion.
const ADVANCE_DELAY_MS = 320

const tile = 'group flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-start transition-colors duration-normal ease-default hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus motion-reduce:transition-none sm:px-5 sm:py-4'
const key = 'flex size-8 shrink-0 items-center justify-center rounded-lg border border-input text-sm font-semibold text-ink-muted transition-colors duration-normal group-has-[:checked]:border-accent group-has-[:checked]:bg-accent group-has-[:checked]:text-on-accent motion-reduce:transition-none'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  if (target instanceof HTMLInputElement) return target.type !== 'radio'
  return target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
}

export function FunnelQuestion({ question, value, onChange, eyebrow, onAutoAdvance }: FunnelQuestionProps) {
  const headingId = useId()
  const [picked, setPicked] = useState(0)
  const choices = question.kind === 'options' ? question.options.map((option) => option.label) : question.kind === 'pills' ? question.choices : []

  function choose(choice: string) {
    onChange(choice)
    setPicked((count) => count + 1)
  }

  useEffect(() => {
    if (picked === 0 || !onAutoAdvance) return
    const timer = window.setTimeout(onAutoAdvance, ADVANCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [picked])

  // Letter keys pick an answer, the way the badges on each tile suggest.
  useEffect(() => {
    if (choices.length === 0) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return
      const index = LETTERS.indexOf(event.key.toUpperCase())
      const choice = index >= 0 ? choices[index] : undefined
      if (choice === undefined) return
      event.preventDefault()
      choose(choice)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [question.id])

  if (question.kind === 'text') {
    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (value.trim() && onAutoAdvance) onAutoAdvance()
    }
    return (
      <form data-slot="funnel-question" data-kind="text" onSubmit={submit} className="grid gap-8">
        <FunnelTitle id={headingId} eyebrow={eyebrow}>{question.ask}</FunnelTitle>
        <input
          aria-labelledby={headingId}
          autoFocus
          value={value}
          placeholder={question.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-14 w-full rounded-2xl border border-input bg-surface px-5 text-center text-xl text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
        />
        <p className="text-center text-sm text-ink-muted">Press Enter to continue</p>
      </form>
    )
  }

  return (
    <div data-slot="funnel-question" data-kind={question.kind} className="grid gap-8">
      <FunnelTitle id={headingId} eyebrow={eyebrow}>{question.ask}</FunnelTitle>
      <fieldset aria-labelledby={headingId} className={question.kind === 'pills' ? 'flex flex-wrap justify-center gap-2' : 'grid gap-3'}>
        {question.kind === 'options'
          ? question.options.map((option, index) => (
              <label key={option.label} className={tile}>
                <input type="radio" name={question.id} value={option.label} checked={value === option.label} onChange={() => choose(option.label)} className="sr-only" />
                <span aria-hidden="true" className={key}>{LETTERS[index]}</span>
                <span className="grid gap-0.5">
                  <span className="text-base font-semibold text-ink sm:text-lg">{option.label}</span>
                  {option.hint ? <span className="text-sm leading-6 text-ink-muted">{option.hint}</span> : null}
                </span>
              </label>
            ))
          : question.choices.map((choice, index) => (
              <label
                key={choice}
                className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface pe-5 ps-2 text-base font-medium text-ink transition-colors duration-normal ease-default hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus motion-reduce:transition-none"
              >
                <input type="radio" name={question.id} value={choice} checked={value === choice} onChange={() => choose(choice)} className="sr-only" />
                <span aria-hidden="true" className={cn(key, 'size-7 rounded-full text-xs')}>
                  {value === choice ? <Check data-testid="funnel-pill-check" className="size-4" /> : LETTERS[index]}
                </span>
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
      <span className="ms-auto text-sm tabular-nums text-ink-muted">{position + 1} of {total}</span>
      <Button size="lg" onClick={onContinue} disabled={!canContinue}>{position >= total - 1 ? 'Finish' : 'Continue'}</Button>
    </>
  )
}
