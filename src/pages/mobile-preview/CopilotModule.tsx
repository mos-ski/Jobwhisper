import { useEffect, useState } from 'react'
import { ArrowLeft, Check, FileText, Mic, Settings, Sparkles, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_QA, MOCK_RESUMES } from './mockData'

type ResponseStyle = 'default' | 'headlines' | 'coaching'
type CopilotView =
  | { name: 'entry' }
  | { name: 'onboarding' }
  | { name: 'setup' }
  | { name: 'style'; jobTitle: string }
  | { name: 'live'; jobTitle: string; style: ResponseStyle }
  | { name: 'complete' }

const NAVY = '#0c1d48'

export function CopilotModule() {
  const [view, setView] = useState<CopilotView>({ name: 'entry' })

  if (view.name === 'entry') return <EntryScreen onStart={() => setView({ name: 'onboarding' })} />
  if (view.name === 'onboarding') return <OnboardingScreen onContinue={() => setView({ name: 'setup' })} />
  if (view.name === 'setup') return <SetupScreen onBack={() => setView({ name: 'onboarding' })} onContinue={(jobTitle) => setView({ name: 'style', jobTitle })} />
  if (view.name === 'style') return <ResponseStyleScreen jobTitle={view.jobTitle} onSelect={(style) => setView({ name: 'live', jobTitle: view.jobTitle, style })} />
  if (view.name === 'live') return <LiveCanvasScreen jobTitle={view.jobTitle} onEnd={() => setView({ name: 'complete' })} />
  if (view.name === 'complete') return <CompleteScreen onGoHome={() => setView({ name: 'entry' })} />
  return null
}

function EntryScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: NAVY }}>
      <Sparkles className="text-blue-300" size={36} />
      <h1 className="text-xl font-semibold text-white">Interview Copilot</h1>
      <p className="text-sm text-white/60">Real-time AI assistance during live interviews — on video calls or phone calls, right from your pocket.</p>
      <button onClick={onStart} className="mt-2 rounded-xl bg-[#1a7aff] px-6 py-3 text-sm font-semibold text-white">Start a session</button>
    </div>
  )
}

function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 py-8 text-white" style={{ background: NAVY }}>
      <Sparkles className="text-blue-300" size={28} />
      <h1 className="mt-4 text-xl font-semibold">Copilot listens, you respond with confidence</h1>
      <p className="mt-2 text-sm text-white/60">Place your phone beside your laptop during video calls, or use it directly during phone interviews. Copilot listens and shows you what to say — only you can see it.</p>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] p-3">
          <Mic size={18} className="text-blue-300" />
          <div>
            <p className="text-sm font-medium">Microphone access</p>
            <p className="text-xs text-white/50">Needed to hear the interviewer and respond in real time</p>
          </div>
        </div>
      </div>
      <button onClick={onContinue} className="mt-auto rounded-xl bg-[#1a7aff] py-3 text-center text-sm font-semibold text-white">Continue</button>
    </div>
  )
}

const STYLES: { id: ResponseStyle; title: string; desc: string }[] = [
  { id: 'default', title: 'Default', desc: 'Full natural-sounding answer to read aloud' },
  { id: 'headlines', title: 'Headlines', desc: 'STAR-format bullet points' },
  { id: 'coaching', title: 'Coaching', desc: 'Short tips to guide your own response' },
]

function ResponseStyleScreen({ jobTitle, onSelect }: { jobTitle: string; onSelect: (style: ResponseStyle) => void }) {
  return (
    <div className="flex h-full flex-col justify-end px-5 pb-8 text-white" style={{ background: NAVY }}>
      <div className="rounded-2xl bg-white/[0.07] p-5">
        <h2 className="text-base font-semibold">How should Copilot present answers?</h2>
        <p className="mt-1 text-xs text-white/50">For your {jobTitle} session</p>
        <div className="mt-4 space-y-2">
          {STYLES.map((s) => (
            <button key={s.id} onClick={() => onSelect(s.id)} className="block w-full rounded-xl border border-white/15 p-3 text-left">
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-white/50">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type CopilotStatus = 'listening' | 'processing' | 'answering'

const COPILOT_STATUS_LABEL: Record<CopilotStatus, string> = { listening: 'Listening…', processing: 'Processing…', answering: 'Answering…' }

const QUICK_TITLES = ['Product Designer', 'Software Engineer', 'Product Manager']

function LiveCanvasScreen({ jobTitle, onEnd }: { jobTitle: string; onEnd: () => void }) {
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<CopilotStatus>('listening')
  const [streamed, setStreamed] = useState('')
  const qa = MOCK_QA[index % MOCK_QA.length]

  useEffect(() => {
    setStatus('listening')
    setStreamed('')
    const t1 = setTimeout(() => setStatus('processing'), 1400)
    const t2 = setTimeout(() => setStatus('answering'), 2600)
    let charTimer: ReturnType<typeof setInterval>
    let advanceTimer: ReturnType<typeof setTimeout>
    const t3 = setTimeout(() => {
      let i = 0
      charTimer = setInterval(() => {
        i += 4
        setStreamed(qa.a.slice(0, i))
        if (i >= qa.a.length) {
          clearInterval(charTimer)
          advanceTimer = setTimeout(() => setIndex((n) => n + 1), 2200)
        }
      }, 30)
    }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(charTimer); clearTimeout(advanceTimer) }
  }, [index])

  return (
    <div className="flex h-full flex-col text-white" style={{ background: NAVY }}>
      <header className="flex items-center justify-between px-5 pt-4">
        <span className="truncate text-xs text-white/50">{jobTitle} session</span>
        <Settings size={16} className="text-white/50" />
      </header>
      <div className="flex items-center gap-2 px-5 pt-2">
        <span className={cn('h-2 w-2 rounded-full', status === 'listening' && 'bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]', status === 'processing' && 'bg-amber-400', status === 'answering' && 'bg-blue-400')} />
        <span className="text-xs text-white/60">{COPILOT_STATUS_LABEL[status]}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-sm font-medium text-white/70">{qa.q}</p>
        {status === 'processing' && (
          <div className="mt-4 flex gap-1">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
        {status === 'answering' && <p className="mt-4 text-base leading-relaxed text-white">{streamed}<span className="animate-pulse">▋</span></p>}
      </div>
      <div className="flex-shrink-0 p-4">
        <button onClick={onEnd} className="w-full rounded-xl bg-white/10 py-3 text-center text-sm font-semibold text-white">End session</button>
      </div>
    </div>
  )
}

function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white" style={{ background: NAVY }}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <Check className="text-green-400" size={28} />
      </div>
      <h1 className="text-lg font-semibold">Session complete</h1>
      <p className="text-sm text-white/60">Nice work. Your Copilot session has ended — you can review your preferences any time before your next interview.</p>
      <button onClick={onGoHome} className="mt-2 rounded-xl bg-[#1a7aff] px-6 py-3 text-sm font-semibold text-white">Go Home</button>
    </div>
  )
}

function SetupScreen({ onBack, onContinue }: { onBack: () => void; onContinue: (jobTitle: string) => void }) {
  const [jobTitle, setJobTitle] = useState('Product Designer')
  const [resume, setResume] = useState<string | null>(MOCK_RESUMES[0]?.name ?? null)
  const [jd, setJd] = useState('')
  const [micConnected, setMicConnected] = useState(false)
  const [dontAsk, setDontAsk] = useState(false)

  return (
    <div className="flex h-full flex-col text-white" style={{ background: NAVY }}>
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold">Session setup</h1>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <div>
          <label className="text-xs font-medium text-white/60">Job title</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm text-white outline-none" />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_TITLES.map((t) => (
              <button key={t} onClick={() => setJobTitle(t)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Resume</label>
          {resume ? (
            <div className="mt-1 flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm">
              <span className="flex items-center gap-2 truncate"><FileText size={14} />{resume}</span>
              <button onClick={() => setResume(null)} className="text-xs text-white/50">Remove</button>
            </div>
          ) : (
            <button onClick={() => setResume(MOCK_RESUMES[0]?.name ?? null)} className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-3 text-sm text-white/70">
              <Upload size={14} />Upload or use Lightforth resume
            </button>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Job description (optional)</label>
          <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={3} placeholder="Paste the job description…" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30" />
          <button onClick={() => setJd('Looking for a product designer with 4+ years of experience in B2B SaaS, strong systems thinking, and a portfolio of shipped work.')} className="mt-1 text-xs font-medium text-blue-300">✨ Suggest for me</button>
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Audio device</label>
          <button onClick={() => setMicConnected(true)} className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm">
            <span className="flex items-center gap-2"><Mic size={14} />Phone microphone</span>
            {micConnected ? <span className="flex items-center gap-1 text-xs font-medium text-green-400"><Check size={12} />Connected</span> : <span className="text-xs text-white/40">Tap to connect</span>}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={dontAsk} onChange={(e) => setDontAsk(e.target.checked)} className="h-4 w-4 rounded" />
          Don't ask me again
        </label>
      </div>
      <div className="flex-shrink-0 p-4">
        <button onClick={() => onContinue(jobTitle)} disabled={!micConnected} className={cn('w-full rounded-xl py-3 text-center text-sm font-semibold', micConnected ? 'bg-[#1a7aff] text-white' : 'bg-white/10 text-white/40')}>
          Continue
        </button>
      </div>
    </div>
  )
}
