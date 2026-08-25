import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bell, Check, ChevronDown, CornerDownRight, ExternalLink, HelpCircle, Mic, Play, Settings, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUseCase, type UseCaseId } from './desktopCopilot/useCases'
import { BG, CARD, BORDER, INPUT_BG, INPUT_BD, BLUE, formatTime, LightningLogo, MacWindow, Toggle } from './desktopCopilot/shared'
import { getPlan, type PlanId } from './desktopCopilot/plans'
import { SignInScreen } from './desktopCopilot/SignInScreen'
import AIAssistantPanel from '@/components/shared/AIAssistantPanel'
import { ContextPickerField } from './desktopCopilot/ContextPickerField'
import { resolveContextDocs, type ContextDoc } from './desktopCopilot/resolveContextDocs'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_QA = [
  { speaker: 'Interviewer 1', q: "Can you tell me a little bit about yourself and your background?", a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people." },
  { speaker: 'Interviewer 2', q: "What would you say is your greatest professional strength?", a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products." },
  { speaker: 'Interviewer 1', q: "What are some areas where you feel you could still improve, especially earlier in your career when you were finding your footing?", a: "Earlier in my career I focused heavily on execution without always ensuring long-term strategy and scalability were equally prioritized — for example, I once shipped a feature fast but had to rebuild its data model six months later. I've since adopted frameworks like RICE and MoSCoW to balance short-term wins with long-term vision. I've also been intentional about improving how I communicate across larger cross-functional teams as they scale.", interjection: { speaker: 'Interviewer 3', text: "Sorry to jump in — can you give one specific example of that?" } },
  { speaker: 'Interviewer 2', q: "Why are you interested in this role and our company specifically?", a: "I've been following your company's trajectory closely. The focus on emerging markets and user-centric innovation aligns deeply with the work I've been doing in Africa's fintech ecosystem. What drew me most is the mission — building products that matter in markets often underserved by traditional tech. I believe my background positions me to contribute meaningfully from day one." },
  { speaker: 'Interviewer 3', q: "Can you walk me through how you approach a brand new product or feature?", a: "I start with the problem, not the solution. I run discovery sessions — user interviews, competitive analysis, data review — to understand the pain point deeply. From there I map out user journeys, define success metrics, and ideate collaboratively with engineering and design. I prototype early, test with real users, and iterate before any major development investment. The key is keeping the user at the centre at every stage." },
  { speaker: 'Interviewer 1', q: "Tell me about a time you had a conflict with a stakeholder and walk us through exactly how that played out.", a: "On one project a senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I prepared a data brief showing the risk alongside two alternative approaches that met their business goal differently. We aligned on a smaller version of the feature with a 30-day review gate. It shipped, performed well, and actually strengthened the relationship.", interjection: { speaker: 'Interviewer 2', text: "And how did the stakeholder react once they saw the data?" } },
  { speaker: 'Interviewer 3', q: "How do you prioritize features when you have limited time and resources?", a: "I use a combination of RICE scoring and stakeholder alignment sessions. RICE helps me quantify reach, impact, confidence, and effort objectively. But I pair that with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently. It removes a lot of the politics from prioritization." },
  { speaker: 'Interviewer 2', q: "How do you measure the success of a product or feature after it launches?", a: "Success starts with defining the right metrics before launch — not after. I work with the team to agree on a north star metric and two to three supporting KPIs tied directly to the problem we set out to solve. Post-launch I review these weekly for the first month, then monthly. I also run qualitative follow-ups with users to catch anything the numbers don't show." },
  { speaker: 'Interviewer 1', q: "Where do you see yourself professionally in the next three to five years?", a: "I see myself leading product strategy at a company building something with genuine societal impact — either as a VP of Product or a founder. I'm deeply interested in how AI can be layered into product experiences to make them smarter and more personalised. I'm also passionate about building and mentoring strong product teams, not just shipping great products myself." },
  { speaker: 'Interviewer 3', q: "Do you have any questions for us about the role or the team?", a: "Yes, a few. First — what does success look like for this role in the first 90 days? Second — how does the product team collaborate with engineering and design today, and where do you see room to improve that? And third — what's the biggest unsolved problem the product team is wrestling with right now? That last one tells me a lot about where I'd be spending my energy." },
]

type DesktopView = 'splash' | 'onboarding' | 'sign-in' | 'regular-setup' | 'live' | 'complete'
type CopilotStatus = 'listening' | 'processing' | 'answering'

// ---------------------------------------------------------------------------
// Screen 0: Splash
// ---------------------------------------------------------------------------
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="flex min-h-[560px] items-center justify-center" style={{ background: BG }}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <LightningLogo size={42} />
          <span className="text-3xl font-bold text-white tracking-tight">Lightforth</span>
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Connecting...</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 1: Onboarding
// ---------------------------------------------------------------------------
function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  const [grants, setGrants] = useState({ screen: false, audio: false, mic: false })

  const permissions = [
    { key: 'screen' as const, label: 'Screen Recording', desc: 'Allows Copilot to overlay on your screen during the interview' },
    { key: 'audio' as const, label: 'System Audio', desc: 'Allows Copilot to hear the conversation happening on your device' },
    { key: 'mic' as const, label: 'Microphone', desc: 'Allows Copilot to pick up your voice during the session' },
  ]

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">Welcome to Lightforth Co-Pilot</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Copilot listens to your interview in real time and quietly displays the right answer on your screen — invisible to your interviewer, even during a full screen share.
      </p>

      <div className="w-full max-w-[700px]">
        <p className="mb-4 text-sm font-semibold text-white">Required Permissions</p>
        <div className="mb-6 space-y-3">
          {permissions.map(p => (
            <div key={p.key} className="flex items-center justify-between rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div>
                <p className="text-sm font-semibold text-white">{p.label}</p>
                <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
              </div>
              {grants[p.key] ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
                  <Check className="h-4 w-4" /> Granted
                </span>
              ) : (
                <button
                  onClick={() => setGrants(g => ({ ...g, [p.key]: true }))}
                  className="rounded-lg bg-white px-5 py-2 text-xs font-bold text-gray-900 hover:bg-white/90"
                >
                  Grant Access
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mb-8 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          If Lightforth Copilot doesn't appear in your system permissions list, click "+" and select it from your Applications folder. The app will restart automatically once permissions are granted — your audio will connect correctly after restart.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button className="flex h-11 items-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10">
            <Play className="h-4 w-4" /> Tutorial
          </button>
          <button onClick={onContinue} className="h-11 rounded-xl px-8 text-sm font-semibold text-white hover:opacity-90" style={{ background: BLUE }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------
type ResponseStyle = 'Default' | 'Headlines' | 'Coaching'
type AnswerLength = 'Short' | 'Medium' | 'Long'

export function PreferenceModal({ hasAnswerLength, onClose, onNext }: { hasAnswerLength: boolean; onClose: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<ResponseStyle>('Headlines')
  const [answerLength, setAnswerLength] = useState<AnswerLength>('Medium')

  const previews: Record<ResponseStyle, string> = {
    Default: '"I redesigned a vehicle maintenance app that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalised dashboard. Engagement increased by 30% in 3 months, and customer satisfaction improved significantly."',
    Headlines: '"Absolutely! I\'d love to share my experience.\n• Situation: Our vehicle maintenance app had low engagement.\n• Task: I led a cross-functional team to redesign the app.\n• Action: User interviews → Redesigned UI → Simplified navigation.\n• Result: Engagement increased by 30% in 3 months."',
    Coaching: '"Start by setting the context — mention the project and its challenges. Then highlight your leadership role and actions. Be sure to emphasise impact. Keep it conversational and confident."',
  }

  const notes: Record<ResponseStyle, string> = {
    Default: 'Best for candidates who want a direct, no-frills answer.',
    Headlines: 'Best for candidates who want structured responses that hit all key points.',
    Coaching: 'Best for candidates who prefer brief coaching instead of a full answer.',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl" style={{ background: '#111827', border: `1px solid rgba(255,255,255,0.1)` }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        <p className="mb-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Select Response Type</p>
        <div className="mb-4 flex gap-2">
          {(['Default', 'Headlines', 'Coaching'] as ResponseStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
              style={{
                background: selected === s ? 'rgba(26,122,255,0.15)' : 'transparent',
                border: `1.5px solid ${selected === s ? BLUE : 'rgba(255,255,255,0.15)'}`,
                color: selected === s ? '#60a5fa' : 'rgba(255,255,255,0.6)',
              }}
            >
              <div className={cn('h-3.5 w-3.5 rounded-full border flex items-center justify-center flex-shrink-0', selected === s ? 'border-blue-400' : 'border-white/30')}>
                {selected === s && <div className="h-2 w-2 rounded-full bg-blue-400" />}
              </div>
              {s}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-xl p-4 text-xs leading-relaxed text-white whitespace-pre-line" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {previews[selected]}
        </div>

        <div className="mb-5 flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{notes[selected]}</p>
        </div>

        {hasAnswerLength && (
          <>
            <p className="mb-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Answer Length</p>
            <div className="mb-5 flex gap-2">
              {(['Short', 'Medium', 'Long'] as AnswerLength[]).map(len => (
                <button
                  key={len}
                  onClick={() => setAnswerLength(len)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
                  style={{
                    background: answerLength === len ? 'rgba(26,122,255,0.15)' : 'transparent',
                    border: `1.5px solid ${answerLength === len ? BLUE : 'rgba(255,255,255,0.15)'}`,
                    color: answerLength === len ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {len}
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={onNext} className="h-11 w-full rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
          Confirm
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 2b: Regular Setup — Interview / Coding / Meeting as tabs on one page
// ---------------------------------------------------------------------------
type RegularUseCase = 'interview' | 'coding' | 'meeting'
const REGULAR_TABS: { id: RegularUseCase; label: string }[] = [
  { id: 'interview', label: 'Interview' },
  { id: 'coding', label: 'Coding' },
  { id: 'meeting', label: 'Meeting' },
]

const POSITION_SUGGESTIONS = [
  'Product Manager', 'Product Designer', 'Software Engineer', 'Data Analyst',
  'UX Researcher', 'Engineering Manager', 'Marketing Manager', 'Sales Representative',
]

const CODING_LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
  'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'SQL', 'HTML', 'CSS', 'Sass',
  'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Objective-C++', 'MATLAB', 'Julia',
  'Elixir', 'Erlang', 'Clojure', 'Haskell', 'F#', 'OCaml', 'Perl', 'Lua', 'Groovy',
  'Visual Basic', 'VBA', 'Assembly', 'Solidity', 'Move', 'GraphQL', 'NoSQL', 'MongoDB',
  'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Pseudocode',
]

const JD_SUGGESTION = "We're looking for a talented individual to join our growing team. You'll collaborate cross-functionally to deliver innovative solutions."

/** Plain text input with a click-to-pick dropdown of suggestions underneath. */
function SuggestInput({ value, onChange, placeholder, suggestions }: { value: string; onChange: (v: string) => void; placeholder: string; suggestions: string[] }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const filtered = value.trim() ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())) : suggestions

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
        style={{ background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' }}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-52 overflow-y-auto rounded-xl py-1.5 shadow-2xl" style={{ background: '#111827', border: `1px solid ${BORDER}` }}>
          {filtered.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className="block w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function RegularSetupScreen({ email, onBack, onContinue, unlockedUseCases }: { email?: string; onBack: () => void; onContinue: (useCaseId: RegularUseCase, primaryLabel: string) => void; unlockedUseCases: RegularUseCase[] }) {
  const availableTabs = REGULAR_TABS.filter(tab => unlockedUseCases.includes(tab.id))
  const [activeTab, setActiveTab] = useState<RegularUseCase>(availableTabs[0]?.id ?? 'interview')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [interviewContext, setInterviewContext] = useState<ContextDoc[]>([])
  const [language, setLanguage] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [agenda, setAgenda] = useState('')
  const [meetingContext, setMeetingContext] = useState<ContextDoc[]>([])
  const [audioConnected, setAudioConnected] = useState(true)
  const [dontAskAgain, setDontAskAgain] = useState(true)
  const [showPreference, setShowPreference] = useState(false)

  const config = getUseCase(activeTab)
  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const
  const contextDocs = resolveContextDocs(email ?? '')

  const primaryLabel = activeTab === 'interview' ? jobTitle : activeTab === 'meeting' ? meetingTitle : language
  const canContinue = primaryLabel.trim().length > 0

  return (
    <div className="flex flex-1 flex-col min-h-0" style={{ background: BG }}>
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b px-6" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <LightningLogo size={24} />
          <span className="text-base font-bold text-white">Lightforth</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10" style={{ borderColor: BORDER }}>
            <LightningLogo size={12} /> Upgrade
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <Bell className="h-4 w-4 text-white/60" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <HelpCircle className="h-4 w-4 text-white/60" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
        </div>
      </div>

      <div className="flex flex-shrink-0 justify-center border-b py-4" style={{ borderColor: BORDER }}>
        <div className="inline-flex items-center gap-1 rounded-full p-1" style={{ background: INPUT_BG }}>
          {availableTabs.map(tab => {
            const Icon = getUseCase(tab.id).icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-10 py-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h1 className="mb-1 text-center text-xl font-bold text-white">👋 Hola, Welcome to {config.label} Co-Pilot</h1>
            <p className="mb-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Fill in a few details so Copilot knows what to expect.</p>

            {activeTab === 'interview' && (
              <>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Position</label>
                  <SuggestInput value={jobTitle} onChange={setJobTitle} placeholder="e.g. Product Manager" suggestions={POSITION_SUGGESTIONS} />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Job description <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                  <div className="relative">
                    <textarea
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                      placeholder="Write or paste here..."
                      className="h-24 w-full resize-none rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                      style={inputStyle}
                    />
                    <button
                      onClick={() => setJobDesc(JD_SUGGESTION)}
                      className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white/70 hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <Sparkles className="h-3 w-3" /> Suggest for me
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <ContextPickerField docs={contextDocs} selected={interviewContext} onChange={setInterviewContext} />
                </div>
              </>
            )}

            {activeTab === 'coding' && (
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-white">Select language</label>
                <SuggestInput
                  value={language}
                  onChange={setLanguage}
                  placeholder="Search language..."
                  suggestions={CODING_LANGUAGES}
                />
              </div>
            )}

            {activeTab === 'meeting' && (
              <>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Meeting title</label>
                  <input
                    value={meetingTitle}
                    onChange={e => setMeetingTitle(e.target.value)}
                    placeholder="e.g. Q3 Roadmap Review"
                    className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                    style={inputStyle}
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Agenda <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                  <textarea
                    value={agenda}
                    onChange={e => setAgenda(e.target.value)}
                    placeholder="What's on the agenda..."
                    className="h-24 w-full resize-none rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                    style={inputStyle}
                  />
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Meetings work best when you share your screen — Copilot uses it to tell speakers apart.
                  </p>
                </div>
                <div className="mb-5">
                  <ContextPickerField docs={contextDocs} selected={meetingContext} onChange={setMeetingContext} />
                </div>
              </>
            )}

            {activeTab !== 'coding' && (
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-white">Select Audio</label>
                  {audioConnected && <span className="text-xs font-semibold text-green-400">Connected</span>}
                </div>
                <button onClick={() => setAudioConnected(true)} className="flex h-10 w-full items-center justify-between rounded-xl px-4 text-sm text-white/80 hover:bg-white/10 transition-colors" style={{ border: `1px solid ${INPUT_BD}`, background: INPUT_BG }}>
                  <span className="flex items-center gap-2"><Mic className="h-4 w-4 text-white/50" />{audioConnected ? "Default - Adewale' Airpod Pro" : 'No audio device selected'}</span>
                  <ChevronDown className="h-4 w-4 text-white/50" />
                </button>
              </div>
            )}

            {activeTab !== 'coding' && (
              <label className="mb-5 flex cursor-pointer select-none items-center gap-3">
                <div className={cn('h-5 w-5 flex-shrink-0 rounded flex items-center justify-center', dontAskAgain ? 'bg-blue-500' : 'border border-white/30')} onClick={() => setDontAskAgain(a => !a)}>
                  {dontAskAgain && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Don't ask again</span>
              </label>
            )}

            <button
              onClick={() => {
                if (!canContinue) return
                if (activeTab === 'coding') onContinue(activeTab, primaryLabel)
                else setShowPreference(true)
              }}
              className="h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
              style={{ background: BLUE, opacity: canContinue ? 1 : 0.45 }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {showPreference && (
        <PreferenceModal
          hasAnswerLength={config.hasAnswerLength}
          onClose={() => setShowPreference(false)}
          onNext={() => { setShowPreference(false); onContinue(activeTab, primaryLabel || config.label) }}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 3a: Conversational Canvas (Interview / Meeting)
// ---------------------------------------------------------------------------
type ConversationalUseCase = 'interview' | 'meeting'

const MOCK_MEETING_TRANSCRIPT = [
  { speaker: 'Speaker 1', q: "I think we should push the launch date by two weeks to finish QA.", a: "Support the rationale, propose a checkpoint: \"That tracks with the bug count we're seeing. Can we set a go/no-go review next Wednesday so we don't lose more time than necessary?\"" },
  { speaker: 'Speaker 2', q: "Marketing already has assets scheduled for the original date, so any slip needs to be decided today, not next week.", a: "Bridge the conflict: \"Let's loop in marketing today so they can adjust the campaign calendar in parallel rather than finding out next week.\"", interjection: { speaker: 'Speaker 3', text: "Sorry — does marketing actually need the final date today, or just a heads-up that it might move?" } },
  { speaker: 'Speaker 3', q: "What's the actual blocker on QA — is it resourcing or scope?", a: "Push for clarity: \"Worth asking the QA lead directly whether it's headcount or test coverage, since the fix is different either way.\"" },
]

interface ConversationalTurn {
  speaker: string
  q: string
  a: string
  /** A second voice jumping in before the main speaker finishes their question. */
  interjection?: { speaker: string; text: string }
}

const SPEAKER_COLORS = ['#60a5fa', '#c084fc', '#34d399', '#f472b6', '#fbbf24']
function speakerColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return SPEAKER_COLORS[hash % SPEAKER_COLORS.length]
}

function transparentSurface(hex: string, transparency: number, minAlpha = 0) {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const alpha = Math.max(minAlpha, (100 - transparency) / 100)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function MiniSliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const progress = ((value - min) / (max - min)) * 100

  return (
    <label className="flex items-center gap-[6px] text-[10.5px] font-medium leading-[21px] text-[#6d727c]">
      <span className="whitespace-nowrap">{label}</span>
      <span className="relative block h-4 w-[58px] shrink-0">
        <span className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-white/75" />
        <span
          className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#2563d8]"
          style={{ width: `${progress}%` }}
        />
        <span
          className="pointer-events-none absolute top-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
          style={{ left: `${progress}%` }}
        />
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          value={value}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-y-0 left-0 h-4 w-[58px] cursor-pointer opacity-0"
        />
      </span>
      <span className="w-3 whitespace-nowrap text-left">{value}</span>
    </label>
  )
}

function TranscriptMessage({
  speaker,
  text,
  kind,
  transparency,
  fontSize = 12,
}: {
  speaker: string
  text: string
  kind: 'speaker' | 'ai'
  transparency: number
  fontSize?: number
}) {
  const isAI = kind === 'ai'
  const background = isAI
    ? transparentSurface('#0C1B2B', transparency, 0.42)
    : `rgba(255, 255, 255, ${Math.max(0.1, (100 - transparency) / 100 * 0.1)})`
  const border = isAI ? '1px solid rgba(74, 158, 255, 0.52)' : '1px solid rgba(255, 255, 255, 0.08)'

  return (
    <div className="flex w-full flex-col items-start gap-[7.5px] rounded-[4.5px] p-[9px] text-left" style={{ background, border }}>
      <p className="w-full truncate font-mono text-[6.75px] font-bold leading-[10.125px] text-white">
        {speaker}
      </p>
      <p
        className={cn('w-full whitespace-pre-wrap break-words leading-[18px]', isAI ? 'text-slate-100' : 'text-white')}
        style={{ fontSize }}
      >
        {text}
      </p>
    </div>
  )
}

/** Cuts text at the nearest word boundary around `ratio` through the string — used to show a question trailing off when another speaker interrupts it. */
function truncateAtWord(text: string, ratio: number): string {
  const target = Math.round(text.length * ratio)
  const idx = text.lastIndexOf(' ', target)
  return text.slice(0, idx > 0 ? idx : target)
}

function questionTextFor(turn: ConversationalTurn): string {
  return turn.interjection ? truncateAtWord(turn.q, 0.55) : turn.q
}

const CONVERSATIONAL_BANKS: Record<ConversationalUseCase, ConversationalTurn[]> = {
  interview: MOCK_QA,
  meeting: MOCK_MEETING_TRANSCRIPT,
}

const TITLE_TEXT: Record<ConversationalUseCase, (label: string) => string> = {
  interview: label => `Interview for ${label}`,
  meeting: label => `Meeting: ${label}`,
}

export function LiveCanvas({ useCaseId, primaryLabel, onEnd, onBack, transparency, onTransparencyChange }: { useCaseId: ConversationalUseCase; primaryLabel: string; onEnd: (elapsed: number, history: ConversationalTurn[]) => void; onBack: () => void; transparency: number; onTransparencyChange: (v: number) => void }) {
  const bank = CONVERSATIONAL_BANKS[useCaseId]
  const [copilotStatus, setCopilotStatus] = useState<CopilotStatus>('listening')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [qDisplayed, setQDisplayed] = useState('')
  const [interjectionDisplayed, setInterjectionDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const [history, setHistory] = useState<ConversationalTurn[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [stealthMode, setStealthMode] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [autoRespond, setAutoRespond] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const statusRef = useRef(copilotStatus)
  const qIndexRef = useRef(questionIndex)
  const panelRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)
  const scrollAnimationRef = useRef<number | null>(null)
  useEffect(() => { statusRef.current = copilotStatus }, [copilotStatus])
  useEffect(() => { qIndexRef.current = questionIndex }, [questionIndex])

  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])

  useEffect(() => () => {
    if (scrollAnimationRef.current !== null) cancelAnimationFrame(scrollAnimationRef.current)
  }, [])

  // Only auto-scroll to the newest line if the user hasn't scrolled up to read
  // earlier transcript — otherwise this would fight every manual scroll attempt.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const handleScroll = () => {
      stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const el = panelRef.current
    if (!el || !stickToBottomRef.current) return

    if (scrollAnimationRef.current !== null) cancelAnimationFrame(scrollAnimationRef.current)

    const start = el.scrollTop
    const end = el.scrollHeight - el.clientHeight
    const distance = end - start
    if (Math.abs(distance) < 1) return

    const duration = 700 - ((scrollSpeed - 1) * 120)
    const startedAt = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      el.scrollTop = start + distance * easeOutCubic(progress)
      if (progress < 1) scrollAnimationRef.current = requestAnimationFrame(step)
      else scrollAnimationRef.current = null
    }

    scrollAnimationRef.current = requestAnimationFrame(step)
  }, [qDisplayed, aDisplayed, copilotStatus, history.length, scrollSpeed])

  const advance = () => {
    const cur = statusRef.current
    const qi = qIndexRef.current
    const turn = bank[qi]
    if (cur === 'listening') {
      setQDisplayed(questionTextFor(turn))
      if (turn.interjection) setInterjectionDisplayed(turn.interjection.text)
      setCopilotStatus('processing')
    }
    else if (cur === 'processing') { setCopilotStatus('answering') }
    else { setHistory(h => [...h, turn]); setQuestionIndex(i => (i + 1) % bank.length); setCopilotStatus('listening') }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || autoRespond) return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [autoRespond, bank])

  useEffect(() => {
    if (!autoRespond) return
    const delay = copilotStatus === 'listening' ? 1800 : copilotStatus === 'processing' ? 1200 : 1800
    const id = setTimeout(advance, delay)
    return () => clearTimeout(id)
  }, [autoRespond, copilotStatus, questionIndex])

  useEffect(() => {
    if (copilotStatus !== 'listening') return
    setQDisplayed(''); setADisplayed(''); setInterjectionDisplayed('')
    const turn = bank[questionIndex]
    const qText = questionTextFor(turn)
    let i = 0
    let interjectionTimeout: ReturnType<typeof setTimeout> | undefined
    let interjectionInterval: ReturnType<typeof setInterval> | undefined
    const qInterval = setInterval(() => {
      i++
      setQDisplayed(qText.slice(0, i))
      if (i >= qText.length) {
        clearInterval(qInterval)
        if (turn.interjection) {
          interjectionTimeout = setTimeout(() => {
            let j = 0
            const interjectionText = turn.interjection!.text
            interjectionInterval = setInterval(() => {
              j++
              setInterjectionDisplayed(interjectionText.slice(0, j))
              if (j >= interjectionText.length) clearInterval(interjectionInterval)
            }, 22)
          }, 350)
        }
      }
    }, 22)
    return () => {
      clearInterval(qInterval)
      if (interjectionTimeout) clearTimeout(interjectionTimeout)
      if (interjectionInterval) clearInterval(interjectionInterval)
    }
  }, [copilotStatus, questionIndex, bank])

  useEffect(() => {
    if (copilotStatus !== 'answering') return
    setADisplayed('')
    const text = bank[questionIndex].a; let i = 0
    const id = setInterval(() => { i += 6; setADisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 10)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex, bank])

  const statusText: Record<CopilotStatus, string> = { listening: 'Listening...', processing: 'Processing...', answering: 'Answering...' }
  const speakerLabel = bank[questionIndex].speaker
  const canvasBg = transparentSurface('#0A1628', transparency)
  const topBarBg = transparentSurface('#0A1628', transparency)
  const toolbarBg = transparentSurface('#0F2340', transparency)
  const liveHeaderBg = transparentSurface('#101D2B', transparency, 0.34)
  const liveBodyBg = transparentSurface('#0C121C', transparency, 0.26)
  const panelBg = transparentSurface('#0D1929', transparency)
  const glassBorder = 'rgba(255, 255, 255, 0.24)'
  const glassDivider = 'rgba(255, 255, 255, 0.16)'

  return (
    <div className="relative flex flex-1 min-h-0 flex-col" style={{ background: canvasBg }}>
      <style>{`
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 6px rgba(34,197,94,0.3),0 0 14px rgba(34,197,94,0.1)}50%{box-shadow:0 0 12px rgba(34,197,94,0.45),0 0 24px rgba(34,197,94,0.15)} }
        @keyframes processingDot { 0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
      `}</style>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Session Preferences</p>
                <div className="space-y-2 rounded-lg p-3 text-xs" style={{ background: '#0A1628' }}>
                  <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-200 truncate max-w-[140px]">{primaryLabel}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Skip setup</span><span className="font-medium text-green-400">On</span></div>
                </div>
                <button onClick={() => setShowSettings(false)} className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Reset — show setup next time</button>
              </div>
              <div className="border-t" style={{ borderColor: '#1E2D45' }} />
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Auto Respond</p><p className="mt-0.5 text-xs text-slate-500">AI answers automatically — turn off to press Space yourself</p></div>
                    <Toggle on={autoRespond} onToggle={() => setAutoRespond(a => !a)} />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Stealth Mode</p><p className="mt-0.5 text-xs text-slate-500">Hides Copilot from screen share</p></div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between"><p className="text-sm font-medium text-slate-200">Transparent Background</p><span className="text-xs text-slate-400">{transparency}%</span></div>
                    <input type="range" min={0} max={100} value={transparency} onChange={e => onTransparencyChange(Number(e.target.value))} className="w-full accent-primary" />
                    <p className="mt-1.5 text-xs text-slate-500">Adjust window transparency over other apps</p>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Always on Top</p><p className="mt-0.5 text-xs text-slate-500">Keeps Copilot above all other windows</p></div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: topBarBg }}>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <button onClick={onBack} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Back to use case selection">
            <ArrowLeft className="h-4 w-4" />
          </button>
          {TITLE_TEXT[useCaseId](primaryLabel)}</div>
        <div className="flex items-center gap-3"><span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span><button onClick={() => onEnd(elapsed, history)} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Session</button></div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: toolbarBg }}>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px]">{[5,8,11,14].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-green-400" style={{height:h}} />)}</div>
            <span className="text-green-400">Strong</span>
          </div>
          <span className="italic text-slate-400">{statusText[copilotStatus]}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <MiniSliderControl label="Auto scroll" min={1} max={5} value={scrollSpeed} onChange={setScrollSpeed} />
          <MiniSliderControl label="Font size" min={12} max={20} value={fontSize} onChange={setFontSize} />
        </div>
      </div>

      <div className={cn(
        'grid flex-1 min-h-0 overflow-hidden p-2 gap-2',
        showAI ? 'grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)]' : 'grid-cols-1',
      )}>
        <div className={cn(
          'flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[6px] transition-all duration-500',
        )} style={{ background: panelBg, border: `1px solid ${glassBorder}`, ...(copilotStatus === 'listening' ? { animation: 'glowPulse 2s ease-in-out infinite' } : {}) }}>
          <div
            className="flex flex-shrink-0 items-center justify-between rounded-t-[6px] px-[15px] py-[10px]"
            style={{ background: liveHeaderBg }}
          >
            <div className="flex w-[417.125px] max-w-[calc(100%-44px)] items-center gap-[6px]">
              <span className="relative block size-[5.25px] shrink-0">
                <span className="absolute inset-[-50%]">
                  <img src="/live-response-dot.svg" alt="" className="block size-full" />
                </span>
              </span>
              <p className="truncate text-[12px] font-medium leading-[21px] text-white">Live Interview Response</p>
            </div>
            <button
              data-testid="open-settings"
              onClick={() => setShowSettings(true)}
              className="relative size-[18px] shrink-0 opacity-90 transition hover:opacity-100"
              aria-label="Open live response settings"
            >
              <img src="/live-response-settings.svg" alt="" className="absolute inset-0 size-full" />
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-start rounded-b-[6px] border border-black px-6"
            style={{ background: liveBodyBg }}
          >
            <div ref={panelRef} className="min-h-0 flex-1 space-y-[19.5px] overflow-y-auto overflow-x-hidden py-6">
              {history.map((item, i) => (
                <div key={i} className="space-y-[19.5px]">
                  <TranscriptMessage speaker={item.speaker} text={`${questionTextFor(item)}${item.interjection ? '...' : ''}`} kind="speaker" transparency={transparency} fontSize={fontSize} />
                  {item.interjection && (
                    <div className="ml-4 flex items-start gap-1.5 border-l-2 pl-3" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                      <CornerDownRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
                      <p className="text-xs leading-relaxed text-slate-300">
                        <span className="font-semibold" style={{ color: speakerColor(item.interjection.speaker) }}>{item.interjection.speaker}</span>
                        {' '}{item.interjection.text}
                      </p>
                    </div>
                  )}
                  <TranscriptMessage speaker="Lightforth AI" text={item.a} kind="ai" transparency={transparency} fontSize={fontSize} />
                </div>
              ))}
              <div className="space-y-[19.5px]">
                {qDisplayed && (
                  <TranscriptMessage
                    speaker={speakerLabel}
                    text={`${qDisplayed}${bank[questionIndex].interjection && qDisplayed.length >= questionTextFor(bank[questionIndex]).length ? '...' : ''}${!bank[questionIndex].interjection && copilotStatus === 'listening' && qDisplayed.length < bank[questionIndex].q.length ? '|' : ''}`}
                    kind="speaker"
                    transparency={transparency}
                    fontSize={fontSize}
                  />
                )}
                {interjectionDisplayed && bank[questionIndex].interjection && (
                  <div className="ml-4 flex items-start gap-1.5 border-l-2 pl-3" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                    <CornerDownRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
                    <p className="text-xs leading-relaxed text-slate-300">
                      <span className="font-semibold" style={{ color: speakerColor(bank[questionIndex].interjection!.speaker) }}>{bank[questionIndex].interjection!.speaker}</span>
                      {' '}{interjectionDisplayed}
                      {copilotStatus === 'listening' && interjectionDisplayed.length < bank[questionIndex].interjection!.text.length && <span style={{ animation: 'blink 0.5s ease-in-out infinite' }}>|</span>}
                    </p>
                  </div>
                )}
                {copilotStatus === 'processing' && <div className="flex items-center gap-1.5 py-1">{[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />)}</div>}
                {copilotStatus === 'answering' && aDisplayed && (
                  <TranscriptMessage
                    speaker="Lightforth AI"
                    text={`${aDisplayed}${aDisplayed.length < bank[questionIndex].a.length ? '|' : ''}`}
                    kind="ai"
                    transparency={transparency}
                    fontSize={fontSize}
                  />
                )}
                {!qDisplayed && history.length === 0 && <p className="text-xs italic text-slate-600">{autoRespond ? 'Auto Respond is on — listening automatically...' : 'Press Space to start the simulation...'}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAI && (
          <div className="hidden min-h-0 min-w-0 lg:flex">
            <AIAssistantPanel context={primaryLabel} transparency={transparency} onClose={() => setShowAI(false)} />
          </div>
        )}
      </div>

      {!showAI && (
        <button
          type="button"
          aria-label="Open AI assistant"
          title="Open AI assistant"
          onClick={() => setShowAI(true)}
          className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#6bb6ff] bg-[#0494fc] shadow-lg shadow-[#0494fc]/25 transition hover:bg-[#168bff]"
        >
          <img src="/ai-assistant-icon.svg" alt="" className="h-6 w-6 brightness-0 invert" />
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 3b: Screenshot Q&A Canvas (Coding)
// ---------------------------------------------------------------------------
type ScreenshotStatus = 'idle' | 'capturing' | 'analyzing' | 'answered'

const MOCK_CODING_QA = [
  { q: "Write a function that returns the nth Fibonacci number using memoization.", a: "function fib(n, memo = {}) {\n  if (n in memo) return memo[n]\n  if (n <= 1) return n\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n  return memo[n]\n}" },
  { q: "Reverse a singly linked list in place.", a: "function reverseList(head) {\n  let prev = null\n  let curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}" },
]

export function ScreenshotCanvas({ useCaseId, primaryLabel, onEnd, onBack, transparency, onTransparencyChange }: { useCaseId: 'coding'; primaryLabel: string; onEnd: () => void; onBack: () => void; transparency: number; onTransparencyChange: (v: number) => void }) {
  const config = getUseCase(useCaseId)
  const bank = MOCK_CODING_QA

  const [status, setStatus] = useState<ScreenshotStatus>('idle')
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [stealthMode, setStealthMode] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [autoRespond, setAutoRespond] = useState(true)

  const statusRef = useRef(status)
  const indexRef = useRef(index)
  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { indexRef.current = index }, [index])
  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])

  const capture = () => {
    if (statusRef.current === 'idle') setStatus('capturing')
    else if (statusRef.current === 'answered') {
      setHistory(h => [...h, bank[indexRef.current]])
      setIndex(i => (i + 1) % bank.length)
      setStatus('idle')
    }
  }

  // Screen capture happens automatically by default (Auto Respond), but Space
  // or Ctrl/Cmd+Enter always force an immediate capture too, even while auto mode is running.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isSpace = e.code === 'Space'
      const isCtrlEnter = e.code === 'Enter' && (e.ctrlKey || e.metaKey)
      if (!isSpace && !isCtrlEnter) return
      e.preventDefault()
      capture()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [bank])

  useEffect(() => {
    if (status !== 'capturing') return
    const id = setTimeout(() => setStatus('analyzing'), 600)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (status !== 'analyzing') return
    const id = setTimeout(() => setStatus('answered'), 900)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (!autoRespond) return
    const delay = status === 'capturing' ? 600 : status === 'analyzing' ? 900 : 2000
    const id = setTimeout(capture, delay)
    return () => clearTimeout(id)
  }, [autoRespond, status, index])

  const statusText: Record<ScreenshotStatus, string> = {
    idle: autoRespond ? 'Watching your screen... (Space or Ctrl+Enter to capture now)' : 'Press Space or Ctrl+Enter to capture your screen',
    capturing: 'Capturing screen...',
    analyzing: 'Analyzing...',
    answered: autoRespond ? 'Answer ready' : 'Answer ready — press Space or Ctrl+Enter for the next question',
  }

  const current = bank[index]
  const canvasBg = transparentSurface('#0A1628', transparency)
  const topBarBg = transparentSurface('#0A1628', transparency)
  const toolbarBg = transparentSurface('#0F2340', transparency)
  const panelBg = transparentSurface('#0D1929', transparency)
  const codeBg = transparentSurface('#0A1628', transparency, 0.3)
  const glassBorder = 'rgba(255, 255, 255, 0.24)'

  return (
    <div className="flex flex-1 min-h-0 flex-col" style={{ background: canvasBg }}>
      <style>{`
        @keyframes processingDot { 0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1} }
      `}</style>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Auto Respond</p><p className="mt-0.5 text-xs text-slate-500">Captures and answers automatically — Space or Ctrl+Enter still capture instantly whether this is on or off</p></div>
                    <Toggle on={autoRespond} onToggle={() => setAutoRespond(a => !a)} />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Stealth Mode</p><p className="mt-0.5 text-xs text-slate-500">Hides Copilot from screen share</p></div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between"><p className="text-sm font-medium text-slate-200">Transparent Background</p><span className="text-xs text-slate-400">{transparency}%</span></div>
                    <input type="range" min={0} max={100} value={transparency} onChange={e => onTransparencyChange(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Always on Top</p><p className="mt-0.5 text-xs text-slate-500">Keeps Copilot above all other windows</p></div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: topBarBg }}>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <button onClick={onBack} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Back to use case selection">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          {config.label}{primaryLabel ? ` — ${primaryLabel}` : ''}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span>
          <button onClick={onEnd} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Session</button>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: toolbarBg }}>
        <span className="text-xs italic text-slate-400">{statusText[status]}</span>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            Font size
            <input type="range" min={12} max={20} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-5 text-slate-500">{fontSize}</span>
          </label>
          <button data-testid="open-settings" onClick={() => setShowSettings(true)}><Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" /></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden p-2">
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl" style={{ background: panelBg, border: `1px solid ${glassBorder}` }}>
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
            {history.map((item, i) => (
              <div key={i} className="space-y-2 border-b border-white/5 pb-4">
                <p className="text-sm text-white">{item.q}</p>
                <pre className="overflow-x-auto rounded-lg p-3 text-xs text-green-300" style={{ background: codeBg }}><code>{item.a}</code></pre>
              </div>
            ))}

            {status === 'analyzing' && (
              <div className="flex items-center gap-1.5 py-1">
                {[0, 1, 2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />)}
              </div>
            )}

            {status === 'answered' && (
              <div className="space-y-2">
                <p className="text-sm text-white">{current.q}</p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg p-3 text-xs text-green-300" style={{ background: codeBg }}><code>{current.a}</code></pre>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(current.a); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                    className="absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold text-white/70 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {status === 'idle' && history.length === 0 && (
              <p className="text-xs italic text-slate-600">{autoRespond ? 'Auto Respond is on — Copilot will capture automatically. Press Space or Ctrl+Enter to capture sooner.' : 'Press Space or Ctrl+Enter to capture your first question...'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 4: Complete
// ---------------------------------------------------------------------------
export function CompleteScreen({ useCaseId, onBack, onGoHome }: { useCaseId: UseCaseId; onBack: () => void; onGoHome: () => void }) {
  const config = getUseCase(useCaseId)
  return (
    <div className="flex flex-1 flex-col justify-center px-12 py-16" style={{ background: 'linear-gradient(145deg, #0c1d48 0%, #0d3285 55%, #1a5aff 100%)' }}>
      <div className="max-w-[520px]">
        <button onClick={onBack} className="mb-6 rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors" title="Back">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="mb-5 text-4xl font-bold leading-tight text-white">{config.completeHeading}</h1>
        <p className="mb-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {config.completeBody}
        </p>
        <div className="flex gap-3">
          <button onClick={onGoHome} className="h-11 rounded-xl border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10">
            Go Home
          </button>
          <button className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
            See Report <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function DesktopCopilotPreview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const recognizedEmail = searchParams.get('email')

  const [view, setView] = useState<DesktopView>('splash')
  const [useCase, setUseCase] = useState<UseCaseId>('interview')
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')
  const [primaryLabel, setPrimaryLabel] = useState('')
  const [transparency, setTransparency] = useState(0)
  const [returnView, setReturnView] = useState<DesktopView>('regular-setup')
  const [pendingEmail, setPendingEmail] = useState('')

  const config = getUseCase(useCase)

  return (
    <MacWindow
      blendBar={
        view === 'splash' || view === 'onboarding' || view === 'sign-in' ||
        view === 'regular-setup' || view === 'complete'
      }
      transparency={view === 'live' ? transparency : 0}
    >
      {view === 'splash'     && <SplashScreen     onDone={() => setView('onboarding')} />}
      {view === 'onboarding' && <OnboardingScreen onContinue={() => setView('sign-in')} />}
      {view === 'sign-in' && (
        <SignInScreen
          prefillEmail={recognizedEmail ?? undefined}
          onBack={() => setView('onboarding')}
          onSignUp={() => navigate('/')}
          onContinue={({ email, existingAccount }) => {
            setPendingEmail(email)
            if (existingAccount?.planId) setSelectedPlan(existingAccount.planId)
            setView('regular-setup')
          }}
        />
      )}
      {view === 'regular-setup' && (
        <RegularSetupScreen
          email={pendingEmail}
          onBack={() => setView('sign-in')}
          onContinue={(id, label) => { setUseCase(id); setPrimaryLabel(label); setReturnView('regular-setup'); setView('live') }}
          unlockedUseCases={getPlan(selectedPlan).unlockedUseCases as RegularUseCase[]}
        />
      )}
      {view === 'live' && config.canvasPattern === 'conversational' && (
        <LiveCanvas
          useCaseId={useCase as 'interview' | 'meeting'}
          primaryLabel={primaryLabel}
          onEnd={(elapsed, history) => {
            setView('complete')
          }}
          onBack={() => setView(returnView)}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'live' && config.canvasPattern === 'screenshot-qa' && (
        <ScreenshotCanvas
          useCaseId={useCase as 'coding'}
          primaryLabel={primaryLabel}
          onEnd={() => setView('complete')}
          onBack={() => setView(returnView)}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'complete' && <CompleteScreen useCaseId={useCase} onBack={() => setView('regular-setup')} onGoHome={() => setView('splash')} />}
    </MacWindow>
  )
}
