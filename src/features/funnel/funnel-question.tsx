import { useEffect, useId, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { Check, CircleCheck } from 'lucide-react'

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
  /** The `"<id>.checks"` answer for text questions with checkbox rows; absent means unset. */
  readonly checksValue?: string
  readonly onChecksChange?: (value: string) => void
  /** The `"<id>.unit"` answer for range questions with a unit toggle; absent picks the first unit. */
  readonly unitValue?: string
  readonly onUnitChange?: (value: string) => void
  /** Wired for range questions with a `skipLabel`: clears the answer and moves on. */
  readonly onSkip?: () => void
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

type QuestionFrameProps = {
  readonly question: FunnelQuestionData
  readonly headingId: string
  readonly eyebrow?: string
  readonly children: ReactNode
}

/** Heading (with optional lede) over the answer controls, with the question's helper banner underneath. */
function QuestionFrame({ question, headingId, eyebrow, children }: QuestionFrameProps) {
  return (
    <div data-slot="funnel-question" data-kind={question.kind} className="grid gap-8">
      <div className="grid gap-3">
        <FunnelTitle id={headingId} eyebrow={eyebrow}>{question.ask}</FunnelTitle>
        {question.note ? <p data-slot="funnel-question-note" className="text-center text-base leading-7 text-ink-muted">{question.note}</p> : null}
      </div>
      {children}
      {question.banner ? (
        <p data-slot="funnel-question-banner" className="mx-auto flex max-w-xl items-start gap-2 rounded-2xl bg-surface-subtle px-4 py-3 text-start text-sm leading-6 text-ink">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-positive" />
          <span>{question.banner}</span>
        </p>
      ) : null}
    </div>
  )
}

export function FunnelQuestion({ question, value, onChange, eyebrow, onAutoAdvance, checksValue, onChecksChange, unitValue, onUnitChange, onSkip }: FunnelQuestionProps) {
  const headingId = useId()
  const [expanded, setExpanded] = useState(false)
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
      <QuestionFrame question={question} headingId={headingId} eyebrow={eyebrow}>
        <RangeAnswer
          min={question.min}
          max={question.max}
          step={question.step}
          defaultRange={question.defaultRange}
          value={value}
          onChange={onChange}
          unitToggle={question.unitToggle}
          unit={unitValue}
          onUnitChange={onUnitChange}
          skipLabel={question.skipLabel}
          onSkip={onSkip}
        />
      </QuestionFrame>
    )
  }

  if (question.kind === 'text') {
    const checks = question.checks ?? []
    const checkedLabels = checksValue === undefined ? (question.checksDefault ? [...checks] : []) : checksValue.split('|').filter(Boolean)
    return (
      <QuestionFrame question={question} headingId={headingId} eyebrow={eyebrow}>
        <TextAnswer labelledBy={headingId} placeholder={question.placeholder} suggestions={question.suggestions ?? []} value={value} onChange={onChange} onAutoAdvance={onAutoAdvance} />
        {checks.length > 0 ? (
          <fieldset className="mx-auto grid w-full max-w-xl">
            <legend className="sr-only">Anything else about your search</legend>
            {checks.map((label) => (
              <label key={label} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-start text-base text-ink hover:bg-surface-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
                <input
                  type="checkbox"
                  checked={checkedLabels.includes(label)}
                  onChange={() => {
                    const next = checkedLabels.includes(label) ? checkedLabels.filter((item) => item !== label) : [...checkedLabels, label]
                    onChecksChange?.(next.join('|'))
                  }}
                  className="size-5 shrink-0 accent-accent"
                />
                {label}
              </label>
            ))}
          </fieldset>
        ) : null}
      </QuestionFrame>
    )
  }

  if (question.kind === 'multi') {
    const selected = value ? value.split('|').filter(Boolean) : []
    const collapsedAt = question.collapsedCount
    // A choice picked while expanded keeps the list open, so Show less never hides a selection.
    const beyond = collapsedAt === undefined ? false : question.choices.slice(collapsedAt).some((choice) => selected.includes(choice))
    const showAll = collapsedAt === undefined || expanded || beyond
    const visible = showAll ? question.choices : question.choices.slice(0, collapsedAt)
    return (
      <QuestionFrame question={question} headingId={headingId} eyebrow={eyebrow}>
        <fieldset aria-labelledby={headingId} className="flex flex-wrap justify-center gap-2">
          {visible.map((choice) => {
            const checked = selected.includes(choice)
            const disabled = !checked && selected.length >= question.maxSelections
            return (
              <label key={choice} className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface pe-5 ps-2 text-base font-medium text-ink hover:border-ink-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
                <input type="checkbox" name={question.id} value={choice} checked={checked} disabled={disabled} onChange={() => {
                  const next = checked ? selected.filter((item) => item !== choice) : [...selected, choice]
                  onChange(next.join('|'))
                }} className="sr-only" />
                <span aria-hidden="true" className={cn(key, 'size-7 rounded-full text-xs')}>{checked ? <Check data-testid="funnel-multi-check" className="size-4" /> : '+'}</span>
                {choice}
              </label>
            )
          })}
        </fieldset>
        {collapsedAt !== undefined && !beyond ? (
          <div className="flex justify-center">
            <button
              type="button"
              aria-expanded={showAll}
              onClick={() => setExpanded((wasExpanded) => !wasExpanded)}
              className="min-h-11 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-accent-text hover:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {showAll ? 'Show less' : 'See More'}
            </button>
          </div>
        ) : null}
        <p className="text-center text-sm text-ink-muted">Choose up to {question.maxSelections}.</p>
      </QuestionFrame>
    )
  }

  return (
    <QuestionFrame question={question} headingId={headingId} eyebrow={eyebrow}>
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
    </QuestionFrame>
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
  readonly unitToggle?: readonly [string, string]
  readonly unit?: string
  readonly onUnitChange?: (value: string) => void
  readonly skipLabel?: string
  readonly onSkip?: () => void
}

/** A year of full-time work, used to show the same salary as an hourly figure. */
const HOURS_PER_YEAR = 2080

function RangeAnswer({ min, max, step, defaultRange, value, onChange, unitToggle, unit, onUnitChange, skipLabel, onSkip }: RangeAnswerProps) {
  const [low, high] = parseRange(value, defaultRange)
  const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const activeUnit = unit ?? unitToggle?.[0]
  const hourly = activeUnit !== undefined && unitToggle !== undefined && activeUnit === unitToggle[1]
  const label = (amount: number) => (hourly ? `$${Math.round(amount / HOURS_PER_YEAR)}/hr` : formatThousands(amount, max))

  // A slider always has an answer, so the default counts as one and Continue is ready straight away.
  useEffect(() => {
    if (!value) onChange(`${defaultRange[0]}-${defaultRange[1]}`)
  }, [])

  return (
    <div className="grid gap-8">
      <p className="text-center font-gowun text-4xl font-bold leading-none text-ink tabular-nums sm:text-5xl" aria-live="polite">
        {label(low)} <span className="text-2xl font-normal text-ink-muted">to</span> {label(high)}
      </p>
      {unitToggle ? (
        <div role="group" aria-label="Show salary" className="mx-auto flex rounded-full border border-border bg-surface p-1">
          {unitToggle.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={activeUnit === option}
              onClick={() => onUnitChange?.(option)}
              className={cn('min-h-11 rounded-full px-5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', activeUnit === option ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink')}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
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
        formatValueText={(amount) => (hourly ? `${dollars.format(Math.round(amount / HOURS_PER_YEAR))}${amount >= max ? ' or more' : ''} an hour` : `${dollars.format(amount)}${amount >= max ? ' or more' : ''} a year`)}
        minLabel={label(min)}
        maxLabel={label(max)}
        className="px-2"
      />
      <p className="text-center text-sm text-ink-muted">{hourly ? `Based on ${HOURS_PER_YEAR.toLocaleString('en-US')} hours a year, before bonus or equity.` : 'Base salary a year, before bonus or equity.'}</p>
      {skipLabel && onSkip ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              onChange('')
              onSkip()
            }}
            className="min-h-11 rounded-md text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {skipLabel}
          </button>
        </div>
      ) : null}
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
  /** Overrides the default Continue/Finish label, e.g. "Find Your Next Remote Job!". */
  readonly continueLabel?: string
}

export function FunnelQuestionFooter({ position, total, canContinue, showContinue, onBack, onContinue, continueLabel }: FunnelQuestionFooterProps) {
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onBack}>Back</Button>
      <span className="ms-auto text-sm tabular-nums text-ink-muted">{position + 1} of {total}</span>
      {showContinue ? <Button size="lg" onClick={onContinue} disabled={!canContinue}>{continueLabel ?? (position >= total - 1 ? 'Finish' : 'Continue')}</Button> : null}
    </>
  )
}
