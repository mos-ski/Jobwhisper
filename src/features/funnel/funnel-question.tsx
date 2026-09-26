import { useEffect, useId, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Check } from 'lucide-react'

import type { FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button, cn, Slider } from '@/ui'
import { FunnelTitle } from './funnel-shell'

export type FunnelQuestionProps = {
  readonly question: FunnelQuestionData
  readonly value: string
  readonly onChange: (value: string) => void
  /** A short line above the question. */
  readonly eyebrow?: string
  /**
   * Called as soon as a choice is picked, or when a typed answer is submitted with Enter.
   * Omit it (e.g. while offline) and answers only select.
   */
  readonly onAutoAdvance?: () => void
}

const LETTERS = 'ABCDEFGHIJ'

const tile = 'group flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-start hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus sm:px-5 sm:py-4'
const key = 'flex size-8 shrink-0 items-center justify-center rounded-lg border border-input text-sm font-semibold text-ink-muted group-has-[:checked]:border-accent group-has-[:checked]:bg-accent group-has-[:checked]:text-on-accent'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  if (target instanceof HTMLInputElement) return target.type !== 'radio'
  return target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
}

export function FunnelQuestion({ question, value, onChange, eyebrow, onAutoAdvance }: FunnelQuestionProps) {
  const headingId = useId()
  const choices = question.kind === 'options' ? question.options.map((option) => option.label) : question.kind === 'pills' ? question.choices : []

  function choose(choice: string) {
    onChange(choice)
    onAutoAdvance?.()
  }

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

  if (question.kind === 'range') {
    return (
      <div data-slot="funnel-question" data-kind="range" className="grid gap-8">
        <FunnelTitle id={headingId} eyebrow={eyebrow}>{question.ask}</FunnelTitle>
        <RangeAnswer min={question.min} max={question.max} step={question.step} defaultRange={question.defaultRange} value={value} onChange={onChange} />
      </div>
    )
  }

  if (question.kind === 'text') {
    return (
      <div data-slot="funnel-question" data-kind="text" className="grid gap-8">
        <FunnelTitle id={headingId} eyebrow={eyebrow}>{question.ask}</FunnelTitle>
        <TextAnswer labelledBy={headingId} placeholder={question.placeholder} suggestions={question.suggestions ?? []} value={value} onChange={onChange} onAutoAdvance={onAutoAdvance} />
      </div>
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
                className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface pe-5 ps-2 text-base font-medium text-ink hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus"
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

function formatThousands(amount: number, max: number): string {
  return `$${Math.round(amount / 1000)}k${amount >= max ? '+' : ''}`
}

function parseRange(value: string, fallback: readonly [number, number]): [number, number] {
  const [low, high] = value.split('-').map(Number)
  return low !== undefined && high !== undefined && Number.isFinite(low) && Number.isFinite(high) ? [low, high] : [fallback[0], fallback[1]]
}

type RangeAnswerProps = {
  readonly min: number
  readonly max: number
  readonly step: number
  readonly defaultRange: readonly [number, number]
  readonly value: string
  readonly onChange: (value: string) => void
}

function RangeAnswer({ min, max, step, defaultRange, value, onChange }: RangeAnswerProps) {
  const [low, high] = parseRange(value, defaultRange)
  const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  // A slider always has an answer, so the default counts as one and Continue is ready straight away.
  useEffect(() => {
    if (!value) onChange(`${defaultRange[0]}-${defaultRange[1]}`)
  }, [])

  return (
    <div className="grid gap-8">
      <p className="text-center font-gowun text-4xl font-bold leading-none text-ink tabular-nums sm:text-5xl" aria-live="polite">
        {formatThousands(low, max)} <span className="text-2xl font-normal text-ink-muted">to</span> {formatThousands(high, max)}
      </p>
      <Slider
        value={[low, high]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => {
          const [nextLow, nextHigh] = next
          if (nextLow !== undefined && nextHigh !== undefined) onChange(`${nextLow}-${nextHigh}`)
        }}
        thumbLabels={['Minimum salary', 'Maximum salary']}
        formatValueText={(amount) => `${dollars.format(amount)}${amount >= max ? ' or more' : ''} a year`}
        minLabel={formatThousands(min, max)}
        maxLabel={formatThousands(max, max)}
        className="px-2"
      />
      <p className="text-center text-sm text-ink-muted">Base salary a year, before bonus or equity.</p>
    </div>
  )
}

const MAX_MATCHES = 8
const CHIP_COUNT = 6

function matchesFor(suggestions: readonly string[], value: string): readonly string[] {
  const query = value.trim().toLowerCase()
  if (!query) return []
  const hits = suggestions.filter((item) => item.toLowerCase().includes(query) && item.toLowerCase() !== query)
  // Titles that start with what was typed read as the closest answers, so they lead.
  return [...hits.filter((item) => item.toLowerCase().startsWith(query)), ...hits.filter((item) => !item.toLowerCase().startsWith(query))].slice(0, MAX_MATCHES)
}

function Highlighted({ text, query }: { readonly text: string; readonly query: string }) {
  const start = text.toLowerCase().indexOf(query.trim().toLowerCase())
  if (start < 0 || !query.trim()) return <>{text}</>
  const end = start + query.trim().length
  return <>{text.slice(0, start)}<strong className="font-semibold text-ink">{text.slice(start, end)}</strong>{text.slice(end)}</>
}

type TextAnswerProps = {
  readonly labelledBy: string
  readonly placeholder: string
  readonly suggestions: readonly string[]
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onAutoAdvance?: () => void
}

function TextAnswer({ labelledBy, placeholder, suggestions, value, onChange, onAutoAdvance }: TextAnswerProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const matches = matchesFor(suggestions, value)
  const showList = open && matches.length > 0
  const chips = suggestions.slice(0, CHIP_COUNT)

  function pick(choice: string) {
    onChange(choice)
    setOpen(false)
    setActive(-1)
    onAutoAdvance?.()
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value.trim() && onAutoAdvance) onAutoAdvance()
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && matches.length > 0) {
      event.preventDefault()
      setOpen(true)
      setActive((index) => Math.min(index + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp' && showList) {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, -1))
    } else if (event.key === 'Enter' && showList && active >= 0) {
      const choice = matches[active]
      if (choice === undefined) return
      event.preventDefault()
      pick(choice)
    } else if (event.key === 'Escape' && showList) {
      // Close the list only; without this the shell would read Escape as "leave the funnel".
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="relative">
        <input
          role="combobox"
          aria-labelledby={labelledBy}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-h-14 w-full rounded-2xl border border-input bg-surface px-5 text-center text-xl text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
        />
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          hidden={!showList}
          className="absolute inset-x-0 top-full z-dropdown mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border bg-surface py-2 shadow-panel"
        >
          {matches.map((match, index) => (
            <li
              key={match}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // Keeps focus in the input so the list does not close before the click lands.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(match)}
              onMouseEnter={() => setActive(index)}
              className={cn('flex min-h-11 cursor-pointer items-center px-5 text-base text-ink-muted', index === active && 'bg-accent-subtle text-ink')}
            >
              <span><Highlighted text={match} query={value} /></span>
            </li>
          ))}
        </ul>
      </div>
      {chips.length > 0 ? (
        <div className="grid gap-3">
          <p className="text-center text-sm text-ink-muted">Popular picks</p>
          <div className="flex flex-wrap justify-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => pick(chip)}
                className={cn('inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', value === chip ? 'border-accent bg-accent-subtle text-ink' : 'border-border bg-surface text-ink hover:border-ink-muted')}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="text-center text-sm text-ink-muted">Or type your own and press Enter</p>
    </form>
  )
}

export type FunnelQuestionFooterProps = {
  /** Zero-based. */
  readonly position: number
  readonly total: number
  readonly canContinue: boolean
  /** Only typed answers need a Continue button; picked answers and files move on by themselves. */
  readonly showContinue: boolean
  readonly onBack: () => void
  readonly onContinue: () => void
}

export function FunnelQuestionFooter({ position, total, canContinue, showContinue, onBack, onContinue }: FunnelQuestionFooterProps) {
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onBack}>Back</Button>
      <span className="ms-auto text-sm tabular-nums text-ink-muted">{position + 1} of {total}</span>
      {showContinue ? <Button size="lg" onClick={onContinue} disabled={!canContinue}>{position >= total - 1 ? 'Finish' : 'Continue'}</Button> : null}
    </>
  )
}
