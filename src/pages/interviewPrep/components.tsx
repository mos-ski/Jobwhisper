import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  History,
  Mic,
  MicOff,
  Pause,
  PhoneOff,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  UserRound,
  Volume2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InterviewAnswer, InterviewReport, InterviewScenario, InterviewerPersona, InterviewType } from './types'
import { getScenarioPersona, interviewQuestions, personas } from './mockData'

const filters: Array<'All' | InterviewType> = ['All', 'Recruiter Screen', 'Hiring Manager', 'Technical', 'Culture Fit', 'Final Round']
const USER_PORTRAIT_URL = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=360&h=360&q=85'

function PersonaPortrait({ persona, size = 'md', label }: { persona: InterviewerPersona; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const sizes = {
    sm: 'h-11 w-11 text-xs ring-2',
    md: 'h-16 w-16 text-base ring-[3px]',
    lg: 'h-28 w-28 text-3xl ring-4',
  }

  return (
    <div
      aria-label={label}
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm ring-offset-2 ring-offset-white',
        sizes[size],
      )}
      style={{ ['--tw-ring-color' as string]: persona.accentColor }}
    >
      <img
        src={persona.imageUrl}
        alt={label ?? `${persona.name} portrait`}
        className="h-full w-full object-cover"
        onError={event => {
          event.currentTarget.style.display = 'none'
          event.currentTarget.nextElementSibling?.classList.remove('hidden')
          event.currentTarget.nextElementSibling?.classList.add('grid')
        }}
      />
      <span className="absolute inset-0 hidden place-items-center bg-slate-800 text-white">{persona.initials}</span>
    </div>
  )
}

function UserPortrait({ size = 'lg' }: { size?: 'md' | 'lg' }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm ring-4 ring-primary/25 ring-offset-2 ring-offset-white',
        size === 'lg' ? 'h-28 w-28' : 'h-16 w-16',
      )}
    >
      <img
        src={USER_PORTRAIT_URL}
        alt="Candidate portrait"
        className="h-full w-full object-cover"
        onError={event => {
          event.currentTarget.style.display = 'none'
          event.currentTarget.nextElementSibling?.classList.remove('hidden')
          event.currentTarget.nextElementSibling?.classList.add('grid')
        }}
      />
      <span className="absolute inset-0 hidden place-items-center bg-primary text-2xl font-black text-white">DS</span>
    </div>
  )
}

function ScenarioPreview({ scenario, persona }: { scenario: InterviewScenario; persona: InterviewerPersona }) {
  return (
    <aside data-testid="scenario-preview" className="sticky top-5 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border bg-[#EEF4FF] px-5 py-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Scenario preview</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {scenario.durationMinutes} min
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center px-6 py-8 text-center">
        <PersonaPortrait persona={persona} size="lg" />
        <h2 className="mt-5 text-xl font-bold leading-snug text-slate-950">{scenario.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{scenario.targetRole}</p>
        <p className="mt-1 text-sm text-slate-500">
          {persona.role} - {scenario.company}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{scenario.type}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{scenario.difficulty}</span>
        </div>
        <div className="mt-6 w-full rounded-xl border border-border bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Interviewer style</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {persona.voice}. {persona.tone}.
          </p>
        </div>
      </div>
    </aside>
  )
}

export function ScenarioGallery({
  scenarios,
  onCreate,
  onConfigure,
  onOpenReport,
}: {
  scenarios: InterviewScenario[]
  onCreate: () => void
  onConfigure: (scenario: InterviewScenario) => void
  onOpenReport: (scenario: InterviewScenario) => void
}) {
  const [activeFilter, setActiveFilter] = useState<'All' | InterviewType>('All')
  const visibleScenarios = activeFilter === 'All' ? scenarios : scenarios.filter(scenario => scenario.type === activeFilter)

  return (
    <div className="lf-page-stack pb-10">
      <header className="rounded-2xl bg-[#EEF4FF] px-5 py-6 sm:rounded-3xl sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">Practice room</p>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950 md:text-3xl">Interview Prep</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Pick a scenario, practice with an AI interviewer, and get a coaching report you can act on.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-white" onClick={() => onOpenReport(scenarios[0])}>
              <History className="h-4 w-4" />
              History
              <span className="ml-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-white">7</span>
            </Button>
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4" />
              Create Scenario
            </Button>
          </div>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition',
              activeFilter === filter
                ? 'border-primary bg-primary text-white shadow-sm'
                : 'border-border bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <button
          onClick={onCreate}
          className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-primary hover:bg-primary/[0.03]"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-base font-bold text-slate-950">Create Your Own</h2>
          <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-500">
            Build a room around a company, role, interviewer, and difficulty.
          </p>
        </button>

        {visibleScenarios.map(scenario => {
          const persona = getScenarioPersona(scenario)
          return (
            <article
              key={scenario.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:border-primary/25 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border bg-slate-50/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <PersonaPortrait persona={persona} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950">{persona.name}</p>
                    <p className="truncate text-xs text-slate-500">{scenario.company}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-border">
                  {scenario.difficulty}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-base font-bold leading-snug text-slate-950">{scenario.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{scenario.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{scenario.type}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                    <Clock3 className="h-3 w-3" />
                    {scenario.durationMinutes} min
                  </span>
                </div>
                <Button className="mt-5 w-full justify-between" onClick={() => onConfigure(scenario)}>
                  Configure & Start
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export function ScenarioBuilder({
  scenario,
  onScenarioChange,
  onBack,
  onStart,
}: {
  scenario: InterviewScenario
  onScenarioChange: (scenario: InterviewScenario) => void
  onBack: () => void
  onStart: () => void
}) {
  const persona = getScenarioPersona(scenario)
  const updateScenario = (patch: Partial<InterviewScenario>) => onScenarioChange({ ...scenario, ...patch })

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-5 md:px-7 md:py-6">
          <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </button>
          <p className="mb-1 text-sm font-medium text-primary">Setup</p>
          <h1 className="text-2xl font-bold text-slate-950">Configure your interview</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tune the room so practice feels close to the real conversation.</p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
          <label className="block">
            <span className="lf-label mb-2 block">Interview type</span>
            <select className="lf-select" value={scenario.type} onChange={event => updateScenario({ type: event.target.value as InterviewType })}>
              {filters.filter((filter): filter is InterviewType => filter !== 'All').map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="lf-label mb-2 block">Difficulty</span>
            <select
              className="lf-select"
              value={scenario.difficulty}
              onChange={event => updateScenario({ difficulty: event.target.value as InterviewScenario['difficulty'] })}
            >
              {['Easy', 'Medium', 'Hard', 'Expert'].map(level => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="lf-label mb-2 block">Target role</span>
            <input className="lf-input" value={scenario.targetRole} onChange={event => updateScenario({ targetRole: event.target.value })} />
          </label>
          <label className="block">
            <span className="lf-label mb-2 block">Company</span>
            <input className="lf-input" value={scenario.company} onChange={event => updateScenario({ company: event.target.value })} />
          </label>
          <label className="block md:col-span-2">
            <span className="lf-label mb-2 block">Interviewer persona</span>
            <input
              className="lf-input"
              value={persona.role}
              onChange={event => updateScenario({ interviewerRole: event.target.value })}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="lf-label mb-2 block">Additional context</span>
            <textarea
              className="lf-input min-h-28 resize-none py-3"
              value={scenario.context}
              onChange={event => updateScenario({ context: event.target.value })}
            />
          </label>
        </div>

        <div className="border-t border-border px-5 py-6 md:px-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">Choose interviewer voice</h2>
              <p className="mt-1 text-sm text-slate-500">Pick who should pressure-test your answers.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Selected voice: {persona.name}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {personas.map(option => {
              const selected = option.id === scenario.interviewerId
              return (
                <button
                  key={option.id}
                  onClick={() => updateScenario({ interviewerId: option.id, interviewerRole: option.role })}
                  className={cn(
                    'overflow-hidden rounded-xl border bg-white text-left transition',
                    selected ? 'border-primary shadow-sm ring-2 ring-primary/15' : 'border-border hover:border-slate-300',
                  )}
                  aria-label={`Select ${option.name}`}
                >
                  <div className="relative h-24 bg-slate-100">
                    <img src={option.imageUrl} alt={`${option.name} portrait`} className="h-full w-full object-cover" />
                    {selected && (
                      <Check className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-primary p-1 text-white shadow-sm" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-slate-950">{option.name}</p>
                    <p className="mt-0.5 min-h-8 text-xs leading-4 text-slate-500">{option.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {option.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <label className="inline-flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm text-slate-600">
            <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
            <span>
              <span className="block font-semibold text-slate-900">Save for later</span>
              <span className="text-xs">Keep this scenario in your practice history.</span>
            </span>
          </label>
          <Button className="h-11 px-6" onClick={onStart}>
            <Play className="h-4 w-4" />
            Start Interview
          </Button>
        </div>
      </section>

      <ScenarioPreview scenario={scenario} persona={persona} />
    </div>
  )
}

function LightShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('fixed inset-0 z-[9999] overflow-y-auto bg-[#F4F7FB]', className)}>
      {children}
    </div>
  )
}

export function PreparingScreen({ scenario }: { scenario: InterviewScenario }) {
  return (
    <LightShell>
      <div className="grid min-h-full place-items-center p-6 text-center">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
          <h1 className="mt-5 text-xl font-bold text-slate-950">Preparing interview...</h1>
          <p className="mt-2 text-sm text-slate-500">{scenario.title}</p>
        </div>
      </div>
    </LightShell>
  )
}

export function StudioScreen({
  scenario,
  persona,
  onEnd,
}: {
  scenario: InterviewScenario
  persona: InterviewerPersona
  onEnd: (answers: InterviewAnswer[]) => void
}) {
  const [muted, setMuted] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const currentQuestion = interviewQuestions[questionIndex]

  const speakQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentQuestion.text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    speakQuestion()
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [questionIndex])

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Advance captions through the question bank while the call is live
  useEffect(() => {
    if (questionIndex >= interviewQuestions.length - 1) return
    const next = window.setTimeout(() => setQuestionIndex(index => index + 1), 28000)
    return () => window.clearTimeout(next)
  }, [questionIndex])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#0B1B3A] text-white">
      {/* Soft meet-style ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.18),transparent_55%)]" />

      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-200/70">Live interview studio</p>
          <h1 className="mt-0.5 truncate text-sm font-semibold text-white/90 sm:text-base">
            {scenario.title} · {scenario.company}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            Live
          </span>
          <div className="rounded-full bg-white/10 px-3.5 py-1.5 font-mono text-sm font-semibold text-white/90 ring-1 ring-white/10">
            {mm}:{ss}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-8">
        {/* Participant tiles — Meet-style grid */}
        <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-2 md:gap-4">
          {/* You */}
          <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#12274F] ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.12),transparent_60%)]" />
            <div className="relative">
              <div className="overflow-hidden rounded-full ring-4 ring-emerald-400/50 ring-offset-4 ring-offset-[#12274F]">
                <img
                  src={USER_PORTRAIT_URL}
                  alt="You"
                  className="h-28 w-28 object-cover sm:h-36 sm:w-36"
                  onError={event => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/45 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
              {muted ? <MicOff className="h-3.5 w-3.5 text-red-300" /> : <Mic className="h-3.5 w-3.5 text-emerald-300" />}
              <span>Darnell Smith</span>
              <span className="text-white/50">· You</span>
            </div>
          </div>

          {/* Interviewer */}
          <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#12274F] ring-1 ring-white/10">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${persona.accentColor}33, transparent 60%)`,
              }}
            />
            <div className="relative">
              <div
                className={cn(
                  'overflow-hidden rounded-full ring-4 ring-offset-4 ring-offset-[#12274F]',
                  isSpeaking ? 'ring-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.45)]' : 'ring-white/25',
                )}
              >
                <img
                  src={persona.imageUrl}
                  alt={persona.name}
                  className="h-28 w-28 object-cover sm:h-36 sm:w-36"
                  onError={event => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/45 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <Volume2 className={cn('h-3.5 w-3.5', isSpeaking ? 'text-blue-300' : 'text-white/50')} />
              <span>{persona.name}</span>
              <span className="text-white/50">· Interviewer</span>
            </div>
          </div>
        </div>

        {/* Meet-style live captions (not a form) */}
        <div className="mx-auto mt-4 w-full max-w-3xl rounded-xl bg-black/35 px-4 py-3 text-center backdrop-blur-md ring-1 ring-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-200/70">
            Question {questionIndex + 1} of {interviewQuestions.length} · {currentQuestion.focus}
          </p>
          <p className="mt-1.5 text-sm leading-6 text-white/90 sm:text-base">
            <span className="font-semibold text-blue-200">{persona.name}:</span> {currentQuestion.text}
          </p>
        </div>
      </main>

      {/* Call controls bar */}
      <footer className="relative z-10 flex items-center justify-center gap-3 px-4 py-5 sm:gap-4">
        <button
          type="button"
          onClick={speakQuestion}
          className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-white/15"
          aria-label="Replay question"
          title="Replay question"
        >
          <Volume2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setMuted(value => !value)}
          className={cn(
            'grid h-12 w-12 place-items-center rounded-full ring-1 transition',
            muted ? 'bg-red-500/90 text-white ring-red-400/40 hover:bg-red-500' : 'bg-white/10 text-white ring-white/10 hover:bg-white/15',
          )}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => onEnd([])}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500"
          aria-label="End interview"
        >
          <PhoneOff className="h-5 w-5" />
          End call
        </button>
      </footer>
    </div>
  )
}

export function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const steps = ['Processing call recording', 'Fetching transcript and audio', 'Analyzing performance', 'Generating coaching feedback']

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setStep(value => Math.min(value + 1, steps.length - 1))
    }, 750)
    const doneTimer = window.setTimeout(onDone, 3000)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onDone, steps.length])

  return (
    <LightShell>
      <main className="mx-auto max-w-2xl px-5 py-12">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-950">Preparing your coaching report...</h1>
          <p className="mt-2 text-sm text-slate-500">This usually takes a few moments.</p>

          <section className="mt-8 space-y-4">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm',
                    index < step
                      ? 'bg-emerald-500 text-white'
                      : index === step
                        ? 'bg-primary/10 text-primary'
                        : 'bg-slate-100 text-slate-300',
                  )}
                >
                  {index < step ? (
                    <Check className="h-4 w-4" />
                  ) : index === step ? (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </span>
                <span className={cn('text-sm font-semibold', index <= step ? 'text-slate-900' : 'text-slate-400')}>{label}</span>
              </div>
            ))}
          </section>

          <div className="mt-8 space-y-3">
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      </main>
    </LightShell>
  )
}

export function ReportScreen({
  scenario,
  persona,
  report,
  onBack,
  onRetry,
}: {
  scenario: InterviewScenario
  persona: InterviewerPersona
  report: InterviewReport
  onBack: () => void
  onRetry: () => void
}) {
  const scoreTone =
    report.score >= 80 ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : report.score >= 65 ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-rose-600 border-rose-200 bg-rose-50'

  return (
    <div className="lf-page-stack pb-12">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" />
        Back to Scenarios
      </button>

      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <PersonaPortrait persona={persona} />
          <div>
            <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">{scenario.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {scenario.type} · {persona.role} · {scenario.durationMinutes} min
            </p>
          </div>
        </div>
        <Button onClick={onRetry}>
          <RotateCcw className="h-4 w-4" />
          Practice Again
        </Button>
      </header>

      <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className={cn('grid h-28 w-28 shrink-0 place-items-center rounded-full border-8 text-4xl font-black', scoreTone)}>
          {report.score}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Overall Summary</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{report.summary}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <BarChart3 className="h-5 w-5 text-primary" />
          Post-Interview Scorecard
        </h2>
        <ReportList title="What Went Well" items={report.whatWentWell} tone="good" />
        <ReportList title="What Needs Work" items={report.whatNeedsWork} tone="bad" />
        <ReportList title="Knowledge Gaps" items={report.knowledgeGaps} tone="neutral" />
        <ReportList title="Suggested Questions for Future Interviews" items={report.suggestedQuestions} tone="question" />
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <Search className="h-5 w-5 text-slate-400" />
          Interview Rubric Breakdown
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Element</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {report.rubric.map(item => (
                <tr key={item.element} className="border-t border-border">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{item.element}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold',
                        item.status === 'Strong'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Partial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700',
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-950">Talk Time Ratio</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>You: {report.talkTime.user}%</span>
            <span>Interviewer: {report.talkTime.interviewer}%</span>
          </div>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-primary" style={{ width: `${report.talkTime.user}%` }} />
            <div className="bg-slate-300" style={{ width: `${report.talkTime.interviewer}%` }} />
          </div>
          <p className="mt-3 text-xs text-slate-500">For recruiter screens, aim for concise answers with room for follow-up.</p>

          <div className="mt-8">
            <h2 className="text-base font-bold text-slate-950">Call Recording</h2>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-slate-50 p-3">
              <button className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white" aria-label="Play recording">
                <Play className="h-4 w-4" />
              </button>
              <span className="font-mono text-sm text-slate-500">0:00</span>
              <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                <div className="h-1.5 w-1/3 rounded-full bg-primary/70" />
              </div>
              <Pause className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
            <BookOpen className="h-4 w-4 text-slate-400" />
            Transcript
          </h2>
          <div className="mt-4 space-y-3">
            {report.transcript.map(turn => (
              <div key={turn.id} className="rounded-xl bg-slate-50 p-3.5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className={cn('font-bold', turn.speaker === 'user' ? 'text-primary' : 'text-slate-700')}>
                    {turn.speakerName}
                  </span>
                  <span className="font-mono text-slate-400">{turn.time}</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{turn.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Scenarios
        </Button>
        <Button onClick={onRetry}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}

function ReportList({ title, items, tone }: { title: string; items: string[]; tone: 'good' | 'bad' | 'neutral' | 'question' }) {
  const icon = useMemo(() => {
    if (tone === 'good') return <Check className="h-4 w-4" />
    if (tone === 'bad') return <Sparkles className="h-4 w-4" />
    if (tone === 'question') return <Bookmark className="h-4 w-4" />
    return <UserRound className="h-4 w-4" />
  }, [tone])

  return (
    <div className="mt-6 border-t border-border pt-6">
      <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-950">
        <span
          className={cn(
            'grid h-8 w-8 place-items-center rounded-lg',
            tone === 'good'
              ? 'bg-emerald-50 text-emerald-600'
              : tone === 'bad'
                ? 'bg-rose-50 text-rose-600'
                : tone === 'question'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-slate-100 text-slate-500',
          )}
        >
          {icon}
        </span>
        {title}
      </h3>
      <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600">
        {items.map(item => (
          <li key={item} className="pl-4 before:-ml-4 before:mr-2 before:text-slate-300 before:content-['•']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
