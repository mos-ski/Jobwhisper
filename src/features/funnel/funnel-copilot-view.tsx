import { useState } from 'react'
import { Plus, ShieldCheck, X } from 'lucide-react'

import { ProOfferPanel, type ProOfferCopy } from '@/features/billing/pro-offer-widget'
import { MarketingDemo } from '@/features/marketing/marketing-demo'
import { JobwhisperMark } from '@/ui'
import { FunnelUpload } from './funnel-upload'

export type FunnelCopilotStep = 'landing' | 'role' | 'upload' | 'stage' | 'offer'
export type CopilotInterviewStage = 'General/Introductory' | 'Technical Stage' | 'Final Interview'
export type FunnelCopilotDateOption = {
  readonly value: string
  readonly weekday: string
  readonly month: string
  readonly day: string
}

export type FunnelCopilotViewProps = {
  readonly step: FunnelCopilotStep
  readonly titles: readonly string[]
  readonly fileName?: string
  readonly uploadError?: string
  readonly selectedStage?: CopilotInterviewStage
  readonly dates: readonly FunnelCopilotDateOption[]
  readonly selectedDate: string
  readonly onDateChange: (value: string) => void
  readonly onLandingContinue: () => void
  readonly onTitlesChange: (titles: readonly string[]) => void
  readonly onRoleContinue: () => void
  readonly onFile: (file: File) => void
  readonly onUploadContinue: () => void
  readonly onStageSelect: (stage: CopilotInterviewStage) => void
  readonly onStartTrial: () => void
}

const ROLE_SUGGESTIONS = ['Product Manager', 'Software Engineer', 'Customer Success Manager', 'Data Analyst', 'Product Designer', 'Marketing Manager'] as const
const TITLE_LIMIT = 5
const STAGES: readonly { readonly title: CopilotInterviewStage; readonly image: string; readonly body: string }[] = [
  { title: 'General/Introductory', image: '/funnel/copilot/stage-general.png', body: 'Prepare for introductions, motivation questions, and the story behind your experience.' },
  { title: 'Technical Stage', image: '/funnel/copilot/stage-technical.png', body: 'Practice the role-specific questions that test how you think, decide, and execute.' },
  { title: 'Final Interview', image: '/funnel/copilot/stage-final.png', body: 'Rehearse the high-stakes conversation that turns strong performance into an offer.' },
] as const
const COPILOT_OFFER: ProOfferCopy = {
  heading: '7 days of Pro for $10',
  subheading: 'Cancel anytime before it renews',
  badge: '56% OFF',
  price: '$10',
  comparisonPrice: '$22.78 for 7 days',
  features: ['Unlimited Interview Copilot', 'Unlimited AI Auto Apply Jobs', '500+ Tailored Resumes', '100+ Hrs Interview Preps'],
  action: 'Start my 7 days for $10',
}

function FunnelHeader() {
  return (
    <a href="/" aria-label="Jobwhisper home" className="mx-auto flex min-h-11 w-fit items-center rounded-[22px] bg-landing-nav px-6 py-1.5 text-surface shadow-announcement focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <JobwhisperMark className="h-6 w-auto" />
    </a>
  )
}

function PrivacyNote() {
  return (
    <p className="mx-auto mt-14 flex max-w-5xl items-start gap-2 text-xs leading-5 text-pretty text-ink-muted sm:mt-16">
      <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      Jobwhisper is SOC 2 certified and never sells your data. Learn more in our <a href="/terms" className="underline underline-offset-2">Terms</a> &amp; <a href="/privacy" className="underline underline-offset-2">Privacy</a>.
    </p>
  )
}

export function FunnelCopilotView(props: FunnelCopilotViewProps) {
  return (
    <main data-slot="copilot-funnel" data-step={props.step} data-theme="light" className="min-h-dvh bg-surface px-4 pb-20 pt-10 text-ink sm:px-6 sm:pt-12">
      <FunnelHeader />
      {props.step === 'landing' ? <LandingStep {...props} /> : null}
      {props.step === 'role' ? <RoleStep {...props} /> : null}
      {props.step === 'upload' ? <UploadStep {...props} /> : null}
      {props.step === 'stage' ? <StageStep {...props} /> : null}
      {props.step === 'offer' ? <OfferStep onStartTrial={props.onStartTrial} /> : null}
    </main>
  )
}

function LandingStep({ dates, selectedDate, onDateChange, onLandingContinue }: FunnelCopilotViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center pt-16 text-center sm:pt-20">
      <section aria-labelledby="copilot-landing-title" className="flex min-h-[calc(100dvh-30rem)] max-w-4xl flex-col items-center justify-center">
        <h1 id="copilot-landing-title" className="text-balance font-gowun text-4xl font-bold leading-none tracking-[-3.01px] text-landing-ink sm:text-6xl">
          Pass Your <span className="text-landing-bg">Next Interview.</span>
          <span className="block">Land the Job. Or Don’t Pay!</span>
        </h1>
        <p className="mt-9 max-w-3xl text-base leading-7 text-pretty text-landing-muted sm:text-xl sm:leading-8">Jobwhisper Copilot listens to the question and drafts a tailored answer in real time using your resume and the job description. Stay present in the conversation instead of memorizing scripts or searching for what to say.</p>
        <fieldset className="mt-12 w-full max-w-3xl">
          <legend className="mb-6 text-lg font-medium text-landing-ink">When is your next interview?</legend>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {dates.map((date) => (
              <button key={date.value} type="button" aria-pressed={selectedDate === date.value} onClick={() => onDateChange(date.value)} className="grid min-h-20 place-items-center rounded-panel border border-border bg-surface px-2 py-3 text-ink transition duration-fast hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus aria-pressed:border-accent aria-pressed:bg-accent-subtle aria-pressed:text-accent-text active:scale-[0.96]">
                <span className="text-xs font-medium">{date.weekday}</span>
                <span className="text-lg font-semibold">{date.day}</span>
                <span className="text-xs opacity-70">{date.month}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <label htmlFor="copilot-interview-date" className="sr-only">Select a Date</label>
        <input id="copilot-interview-date" type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} className="mt-5 min-h-12 w-full max-w-md rounded-panel border border-input bg-surface px-5 text-center text-base text-ink shadow-control outline-none focus-visible:ring-2 focus-visible:ring-focus" />
        <button type="button" onClick={onLandingContinue} className="mt-7 min-h-[72px] rounded-full bg-accent px-8 text-[26px] font-medium tracking-[-0.1523px] text-on-accent transition duration-normal hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus active:scale-[0.96]">Ace my Interview</button>
      </section>
      <MarketingDemo className="mt-28 max-w-[1510px]" />
    </div>
  )
}

function RoleStep({ titles, onTitlesChange, onRoleContinue }: FunnelCopilotViewProps) {
  const [draft, setDraft] = useState('')
  const full = titles.length >= TITLE_LIMIT

  function normalize(raw: string): string {
    return raw.trim().replace(/\s+/g, ' ')
  }

  function add(raw: string): void {
    const next = normalize(raw)
    setDraft('')
    if (!next || full) return
    if (titles.some((title) => title.toLowerCase() === next.toLowerCase())) return
    onTitlesChange([...titles, next])
  }

  function remove(title: string): void {
    onTitlesChange(titles.filter((existing) => existing.toLowerCase() !== title.toLowerCase()))
  }

  function toggle(title: string): void {
    if (titles.some((existing) => existing.toLowerCase() === title.toLowerCase())) remove(title)
    else add(title)
  }

  return (
    <section aria-labelledby="copilot-role-title" className="mx-auto flex w-full max-w-5xl flex-col items-center pt-16 text-center sm:pt-20">
      <h1 id="copilot-role-title" className="max-w-4xl text-balance font-gowun text-4xl font-bold leading-none tracking-[-3.01px] text-landing-ink sm:text-6xl">
        Tell us what job title(s) you have in mind.
      </h1>
      <form className="mt-12 grid w-full max-w-xl justify-items-center gap-6" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="copilot-titles" className="sr-only">Job titles</label>
        <input
          id="copilot-titles"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              add(draft)
            }
          }}
          placeholder="Add up to 5 job titles"
          disabled={full}
          className="min-h-14 w-full rounded-panel border border-input bg-surface px-5 text-left text-base text-ink shadow-control outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:bg-surface-subtle"
        />
        {titles.length > 0 ? (
          <ul aria-label="Selected job titles" className="flex flex-wrap justify-center gap-2">
            {titles.map((title) => (
              <li key={title.toLowerCase()} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-accent bg-accent-subtle ps-3 pe-1 text-sm font-medium text-ink">
                {title}
                <button type="button" aria-label={`Remove ${title}`} onClick={() => remove(title)} className="grid size-7 place-items-center rounded-full text-ink-muted transition-colors duration-fast hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm text-ink-muted">Select more job titles to get more results.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {ROLE_SUGGESTIONS.map((suggestion) => {
            const selected = titles.some((title) => title.toLowerCase() === suggestion.toLowerCase())
            return (
              <button
                key={suggestion}
                type="button"
                aria-pressed={selected}
                disabled={full && !selected}
                onClick={() => toggle(suggestion)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors duration-fast hover:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus aria-pressed:border-accent aria-pressed:bg-accent-subtle aria-pressed:text-accent-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suggestion}
                {!selected ? <Plus aria-hidden="true" className="size-3.5" /> : null}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={onRoleContinue} disabled={titles.length === 0} className="mt-2 min-h-11 rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition duration-fast disabled:bg-muted disabled:text-ink-muted active:scale-[0.96]">
          Continue
        </button>
      </form>
      <PrivacyNote />
    </section>
  )
}

function UploadStep({ fileName, uploadError, onFile, onUploadContinue }: FunnelCopilotViewProps) {
  return (
    <section aria-labelledby="copilot-upload-title" className="mx-auto flex w-full max-w-6xl flex-col items-center pt-12 sm:pt-16">
      <h1 id="copilot-upload-title" className="max-w-3xl text-balance text-center font-gowun text-4xl font-bold leading-none tracking-[-3.01px] text-landing-ink sm:text-6xl">Upload a resume, so we can tell you how to prepare</h1>
      <div className="mt-14 w-full max-w-5xl">
        <FunnelUpload fileName={fileName} error={uploadError} onFile={onFile} />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <button type="button" onClick={() => onFile(new File(['Jobwhisper sample resume'], 'sample-resume.pdf', { type: 'application/pdf' }))} className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium transition-colors duration-fast hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Use sample resume</button>
        <button type="button" disabled={!fileName} onClick={onUploadContinue} className="inline-flex min-h-11 items-center rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition duration-fast disabled:bg-muted disabled:text-ink-muted active:scale-[0.96]">Continue</button>
      </div>
      <PrivacyNote />
    </section>
  )
}

function StageStep({ selectedStage, onStageSelect }: FunnelCopilotViewProps) {
  return (
    <section aria-labelledby="copilot-stage-title" className="mx-auto flex w-full max-w-6xl flex-col items-center pt-12 sm:pt-16">
      <h1 id="copilot-stage-title" className="max-w-3xl text-balance text-center font-gowun text-4xl font-bold leading-none tracking-[-3.01px] text-landing-ink sm:text-6xl">What interview stage are you preparing for?</h1>
      <div className="mt-14 grid w-full gap-5 md:grid-cols-3">
        {STAGES.map((stage) => (
          <button key={stage.title} type="button" aria-pressed={selectedStage === stage.title} onClick={() => onStageSelect(stage.title)} className="grid min-h-64 justify-items-center gap-4 rounded-panel border border-transparent bg-surface-subtle p-7 text-center transition duration-fast hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus aria-pressed:border-accent aria-pressed:bg-accent-subtle active:scale-[0.96]">
            <img src={stage.image} alt="" className="h-24 w-28 object-contain" />
            <span className="font-semibold text-ink">{stage.title}</span>
            <span className="text-sm leading-6 text-pretty text-ink-muted">{stage.body}</span>
          </button>
        ))}
      </div>
      <p className="mt-14 text-lg font-medium text-ink">Our users have landed roles in these companies</p>
      <div className="mt-10 grid w-full grid-cols-2 items-center gap-px overflow-hidden rounded-panel bg-border sm:grid-cols-3" aria-label="Companies using Jobwhisper">
        {['Adidas', 'Asana', 'ElevenLabs', 'Zendesk', 'Workday', 'NVIDIA'].map((company, index) => <div key={company} className="grid min-h-28 place-items-center bg-surface p-6"><img src={`/funnel/copilot/brand-${index + 1}.svg`} alt={company} className="max-h-10 max-w-36" /></div>)}
      </div>
    </section>
  )
}

function OfferStep({ onStartTrial }: { readonly onStartTrial: () => void }) {
  return (
    <section aria-labelledby="copilot-offer-title" className="mx-auto flex w-full max-w-4xl flex-col items-center pt-12 text-center sm:pt-16">
      <h1 id="copilot-offer-title" className="max-w-3xl text-balance font-gowun text-4xl font-bold leading-none tracking-[-3.01px] text-landing-ink sm:text-6xl">You are set!<br />You’ve unlocked Pro<br />for 7 days.</h1>
      <div className="mt-14 w-full"><ProOfferPanel onClaim={onStartTrial} copy={COPILOT_OFFER} /></div>
    </section>
  )
}
