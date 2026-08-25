import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft, X, Settings, Upload, FileText, Mic, Sparkles, Lock,
  ChevronDown, Search, Play, Monitor, Video, Phone, MoreVertical, MessageSquare, Users, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import DocumentPickerModal from '@/components/shared/DocumentPickerModal'
import AIAssistantPanel from '@/components/shared/AIAssistantPanel'
import { useAuth } from '@/hooks/useAuth'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CopilotView = 'landing' | 'setup' | 'live' | 'complete' | 'report'
type ResponseType = 'default' | 'headlines' | 'coaching'
type LiveState = 'waiting' | 'sharing' | 'interviewing'

// ---------------------------------------------------------------------------
// Mock Q&A — 10 questions for demo/testing
// ---------------------------------------------------------------------------

const MOCK_QA = [
  {
    q: "Can you tell me a little bit about yourself and your background?",
    a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people.",
  },
  {
    q: "What would you say is your greatest professional strength?",
    a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products.",
  },
  {
    q: "What are some areas where you feel you could still improve?",
    a: "Earlier in my career I focused heavily on execution without always ensuring long-term strategy and scalability were equally prioritized. I've since adopted frameworks like RICE and MoSCoW to balance short-term wins with long-term vision. I've also been intentional about improving how I communicate across larger cross-functional teams as they scale.",
  },
  {
    q: "Why are you interested in this role and our company specifically?",
    a: "I've been following your company's trajectory closely. The focus on emerging markets and user-centric innovation aligns deeply with the work I've been doing in Africa's fintech ecosystem. What drew me most is the mission — building products that matter in markets often underserved by traditional tech. I believe my background positions me to contribute meaningfully from day one.",
  },
  {
    q: "Can you walk me through how you approach a brand new product or feature?",
    a: "I start with the problem, not the solution. I run discovery sessions — user interviews, competitive analysis, data review — to understand the pain point deeply. From there I map out user journeys, define success metrics, and ideate collaboratively with engineering and design. I prototype early, test with real users, and iterate before any major development investment. The key is keeping the user at the centre at every stage.",
  },
  {
    q: "Tell me about a time you had a conflict with a stakeholder. How did you handle it?",
    a: "On one project a senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I prepared a data brief showing the risk alongside two alternative approaches that met their business goal differently. We aligned on a smaller version of the feature with a 30-day review gate. It shipped, performed well, and actually strengthened the relationship.",
  },
  {
    q: "How do you prioritize features when you have limited time and resources?",
    a: "I use a combination of RICE scoring and stakeholder alignment sessions. RICE helps me quantify reach, impact, confidence, and effort objectively. But I pair that with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently. It removes a lot of the politics from prioritization.",
  },
  {
    q: "How do you measure the success of a product or feature after it launches?",
    a: "Success starts with defining the right metrics before launch — not after. I work with the team to agree on a north star metric and two to three supporting KPIs tied directly to the problem we set out to solve. Post-launch I review these weekly for the first month, then monthly. I also run qualitative follow-ups with users to catch anything the numbers don't show.",
  },
  {
    q: "Where do you see yourself professionally in the next three to five years?",
    a: "I see myself leading product strategy at a company building something with genuine societal impact — either as a VP of Product or a founder. I'm deeply interested in how AI can be layered into product experiences to make them smarter and more personalised. I'm also passionate about building and mentoring strong product teams, not just shipping great products myself.",
  },
  {
    q: "Do you have any questions for us about the role or the team?",
    a: "Yes, a few. First — what does success look like for this role in the first 90 days? Second — how does the product team collaborate with engineering and design today, and where do you see room to improve that? And third — what's the biggest unsolved problem the product team is wrestling with right now? That last one tells me a lot about where I'd be spending my energy.",
  },
]

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_HISTORY = [
  { id: '1', title: 'UI/UX Designer', date: 'May 1st 2026, 4:23 pm', duration: '2m' },
  { id: '2', title: 'Product Manager', date: 'April 22nd 2026, 12:40 pm', duration: '12m' },
  { id: '3', title: 'Product Designer', date: 'April 21st 2026, 1:10 pm', duration: '4m' },
  { id: '4', title: 'Product Designer', date: 'April 21st 2026, 1:02 pm', duration: '6m' },
  { id: '5', title: 'Software Engineer', date: 'April 20th 2026, 5:42 pm', duration: '1m' },
  { id: '6', title: 'Product Designer', date: 'April 18th 2026, 1:14 pm', duration: '4m' },
  { id: '7', title: 'Product Manager', date: 'April 15th 2026, 1:09 pm', duration: '3m' },
  { id: '8', title: 'Product Designer', date: 'April 13th 2026, 6:13 pm', duration: '4m' },
  { id: '9', title: 'Product Designer', date: 'April 13th 2026, 6:08 pm', duration: '3m' },
]

const MOCK_TRANSCRIPT = [
  { role: 'interviewer', time: '00:00', text: 'as your greatest and...' },
  { role: 'interviewer', time: '00:01', text: 'biggest improvement areas.' },
  { role: 'interviewer', time: '00:04', text: 'And what have you done to improve them so far?' },
  { role: 'user', time: '00:07', text: "One of my greatest strengths is my ability to own the full product lifecycle, from strategy all the way to delivering a working product. My background as both a product manager and a design engineer allows me to not only define the vision but also execute and iterate quickly with lean teams. This combination has been instrumental in reducing time-to-market and shipping 12 live apps across fintech, crypto, and AI spaces. Additionally, I thrive in data-driven environments, where I can continuously measure KPIs and make informed decisions to improve user retention and feature adoption. As for areas of improvement, earlier in my career I focused heavily on execution without always ensuring that long-term strategy and scalability were equally prioritized. Over time, I realized the importance of balancing short-term wins with long-term product vision." },
]

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function formatTime(s: number): string {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------

function PreferenceModal({
  responseType,
  setResponseType,
  onNext,
  onClose,
}: {
  responseType: ResponseType
  setResponseType: (t: ResponseType) => void
  onNext: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="lf-panel w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        <p className="text-xs font-medium text-muted-foreground mb-3">Select Response Type</p>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {(['default', 'headlines', 'coaching'] as ResponseType[]).map(t => (
            <button
              key={t}
              onClick={() => setResponseType(t)}
              className={cn(
                'flex-1 flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors',
                responseType === t ? 'border-primary text-primary bg-primary/5' : 'border-border text-foreground',
              )}
            >
              <div className={cn(
                'h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                responseType === t ? 'border-primary' : 'border-muted-foreground',
              )}>
                {responseType === t && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
          {responseType === 'default' && (
            <p>
              &quot;I redesigned a <strong>vehicle maintenance app</strong> that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalized dashboard. <strong><em>Engagement increased by 30% in 3 months</em></strong>, and customer satisfaction improved significantly. Strong experience in user centered design and cross-functional collaboration&quot;
            </p>
          )}
          {responseType === 'headlines' && (
            <div className="space-y-2">
              <p className="italic">&quot;Absolutely, Eric! I&apos;d love to share my experience in product management within the automotive aftermarket.&quot;</p>
              <p><strong>• Situation:</strong> Our vehicle maintenance app had low engagement and poor satisfaction.</p>
              <p><strong>• Task:</strong> I led a cross-functional team to redesign the app and improve usability.</p>
              <p><strong>• Action:</strong> Conducted user interviews → Redesigned UI → Simplified navigation → Personalized dashboard.</p>
              <p><strong>• Result:</strong> Engagement increased by <span className="text-green-600 font-medium">30% in 3 months</span>, customer satisfaction improved.</p>
              <p className="italic text-muted-foreground">This project reinforced my skills in user-centered design and collaboration. How does your team at Lightforth incorporate user feedback into product design?</p>
            </div>
          )}
          {responseType === 'coaching' && (
            <div className="space-y-2">
              <p className="italic">&quot;Start by setting the context—mention the project and its challenges. Then, highlight your leadership role and actions. Be sure to emphasize impact. Keep it conversational and confident.&quot;</p>
              <p className="font-bold flex items-center gap-1">
                <span className="text-primary">♦</span> Key Pointers for Your Response:
              </p>
              <ul className="space-y-1">
                <li>• <strong>Mention the project</strong> and its objective.</li>
                <li>• <strong>Explain your role</strong> and what actions you took.</li>
                <li>• <strong>End with results &amp; impact</strong> (numbers help).</li>
                <li>• <strong>Engage the interviewer</strong> with a follow-up question.</li>
              </ul>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {responseType === 'default' && 'Best for candidates who want a direct, no-frills answer'}
          {responseType === 'headlines' && 'Best for candidates who want structured responses that hit all key points.'}
          {responseType === 'coaching' && 'Best for candidates who prefer brief coaching instead of a full answer'}
        </p>

        <button
          onClick={onNext}
          className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Landing Content (within AppLayout)
// ---------------------------------------------------------------------------

function LandingContent({
  onStart,
  onSelectHistory,
  onInstallDesktop,
  onInstallMobile,
  hasCopilotAccess,
}: {
  onStart: () => void
  onSelectHistory: (id: string) => void
  onInstallDesktop: () => void
  onInstallMobile: () => void
  hasCopilotAccess: boolean
}) {
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Interview Co-Pilot</h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Bring Co-Pilot into your next interview. It quietly listens and delivers the right answers on your screen whenever you&apos;re unsure what to say.
        </p>
      </div>

      {/* Amber banner */}
      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-amber-800 font-medium">
          {hasCopilotAccess ? 'For coding interviews and stealth version.' : 'Upgrade to Pro or Premium to install the Copilot desktop app.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={onInstallDesktop} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
            {hasCopilotAccess ? <Monitor className="h-3 w-3" /> : <Lock className="h-3 w-3" />} Install Desktop
          </button>
          <button onClick={onInstallMobile} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
            <Monitor className="h-3 w-3" /> Install Mobile
          </button>
        </div>
      </div>

      {/* History heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">History</h2>
      </div>

      {/* Search + Start button row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search"
            className="lf-input pl-9"
          />
        </div>
        <button
          onClick={onStart}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Start Interview
        </button>
      </div>

      {/* History table */}
      <div className="lf-table-wrap">
      <table className="lf-table">
        <thead className="lf-table-head">
          <tr>
            <th className="lf-table-th w-8"></th>
            <th className="lf-table-th">Title ↓</th>
            <th className="lf-table-th">Date &amp; Time ↓</th>
            <th className="lf-table-th">Duration ↓</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_HISTORY.map(item => (
            <tr
              key={item.id}
              onClick={() => onSelectHistory(item.id)}
              className="lf-table-row cursor-pointer"
            >
              <td className="lf-table-cell">
                <div className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground">
                  <Play className="h-3 w-3" />
                </div>
              </td>
              <td className="lf-table-cell font-medium text-foreground">{item.title}</td>
              <td className="lf-table-cell text-muted-foreground">{item.date}</td>
              <td className="lf-table-cell text-muted-foreground">{item.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

// ---------------------------------------------------------------------------
// Setup Overlay
// ---------------------------------------------------------------------------

function SetupContent({
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  resumeType,
  setResumeType,
  jobDesc,
  setJobDesc,
  audioConnected,
  setAudioConnected,
  dontAskAgain,
  setDontAskAgain,
  onBack,
  onContinue,
}: {
  jobTitle: string
  setJobTitle: (v: string) => void
  company: string
  setCompany: (v: string) => void
  resumeType: 'upload' | 'lightforth'
  setResumeType: (v: 'upload' | 'lightforth') => void
  jobDesc: string
  setJobDesc: (v: string) => void
  audioConnected: boolean
  setAudioConnected: (v: boolean) => void
  dontAskAgain: boolean
  setDontAskAgain: (v: boolean) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [docModal, setDocModal]   = useState(false)
  const [addedDocs, setAddedDocs] = useState<{ name: string; type: string }[]>([])

  return (
    <>
      <div className="flex min-h-[64px] items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-6 lg:h-[70px] lg:px-16">
        <button onClick={onBack} className="flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onBack} aria-label="Close setup"><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
      </div>

      <main className="flex h-[calc(100vh-64px)] items-center justify-center overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="lf-panel w-full max-w-[620px] p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="lf-overlay-title">Set up Interview Copilot</h1>
          <p className="lf-body mt-3">
            Connect your role, resume, and audio so Copilot can guide you during the live interview.
          </p>
        </div>

        <div className="mb-4">
          <label className="lf-label mb-2 block">Job title</label>
          <div className="relative">
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="Enter job role"
              className="lf-input h-11 pr-8"
            />
            {jobTitle && (
              <button onClick={() => setJobTitle('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {['UI/UX Designer', 'Software Engineer', 'SEO Specialist'].map(s => (
              <button
                key={s}
                onClick={() => setJobTitle(s)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="lf-label mb-2 block">Company <span className="text-xs text-muted-foreground font-normal">(optional)</span></label>
          <input
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="e.g. Microsoft, Google…"
            className="lf-input h-11"
          />
        </div>

        <div className="mb-4">
          <label className="lf-label mb-2 block">Choose resume</label>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={() => setResumeType('upload')}
              className={cn(
                'flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors',
                resumeType === 'upload' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <Upload className="h-4 w-4" /> Upload a new resume
            </button>
            <button
              onClick={() => setResumeType('lightforth')}
              className={cn(
                'relative flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors',
                resumeType === 'lightforth' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {resumeType === 'lightforth' && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-white px-2 py-0.5 text-[9px] font-bold text-primary">
                  RECOMMENDED
                </span>
              )}
              <Sparkles className="h-4 w-4" /> Use Lightforth Resume
            </button>
          </div>

          {resumeType === 'lightforth' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 fill-red-500 text-red-500" />
              <span>Darnell_Smith_resume.pdf</span>
              <button aria-label="Remove resume"><X className="h-3.5 w-3.5 hover:text-destructive" /></button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="lf-label mb-2 block">Job description <span className="text-xs text-muted-foreground">(optional)</span></label>
          <div className="relative">
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Write or paste here..."
              className="lf-input h-28 resize-none py-3"
            />
            <button className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-primary hover:underline">
              <Sparkles className="h-3 w-3" /> Suggest for me
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="lf-label">Documents <span className="text-xs text-muted-foreground font-normal">(optional)</span></label>
            <button onClick={() => setDocModal(true)} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <Plus className="h-3 w-3" /> Add Documents
            </button>
          </div>
          {addedDocs.length === 0 ? (
            <button onClick={() => setDocModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 py-3 text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition">
              <Plus className="h-3.5 w-3.5" /> Add context, notes, or other docs
            </button>
          ) : (
            <div className="space-y-1.5">
              {addedDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{doc.name}</span>
                  <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                  <button onClick={() => setAddedDocs(prev => prev.filter((_, j) => j !== i))} aria-label="Remove">
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              <button onClick={() => setDocModal(true)} className="flex items-center gap-1 text-xs text-primary hover:underline pt-0.5">
                <Plus className="h-3 w-3" /> Add more
              </button>
            </div>
          )}
          {docModal && <DocumentPickerModal onClose={() => setDocModal(false)} onAdd={doc => setAddedDocs(prev => [...prev, doc])} />}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label className="lf-label">Select audio</label>
            {audioConnected && <span className="text-xs font-medium text-green-600">Connected</span>}
          </div>
          <button
            onClick={() => setAudioConnected(true)}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-white px-3 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-muted-foreground" />
              {audioConnected ? 'MacBook Pro Microphone' : 'No audio device selected'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <button
          onClick={() => setAudioConnected(true)}
          className="mb-4 h-11 w-full rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Enable Microphone Access
        </button>
        <label className="mb-3 flex cursor-pointer items-center gap-2.5 select-none">
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={e => setDontAskAgain(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">Don't ask me again — skip setup next time</span>
        </label>
        <button
          onClick={onContinue}
          className={cn(
            'h-11 w-full rounded-lg text-sm font-semibold text-white transition-colors',
            jobTitle ? 'bg-primary hover:bg-primary/90' : 'bg-primary/40 cursor-not-allowed',
          )}
        >
          Continue
        </button>
      </div>
      </main>
    </>
  )
}

// ---------------------------------------------------------------------------
// Google Meet Mock
// ---------------------------------------------------------------------------

function GoogleMeetMock() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#202124' }}>
      {/* Interviewer video tile */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2a2d3a 0%, #1c1f2b 60%, #141720 100%)' }}>
        {/* Room/office background suggestion */}
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 30%, #3a4060 0%, transparent 65%)' }} />

        {/* Person silhouette */}
        <div className="absolute inset-0 flex items-end justify-center" style={{ paddingBottom: '14%' }}>
          {/* Shoulders / upper body */}
          <div className="relative flex flex-col items-center">
            <div
              className="relative z-10 rounded-full"
              style={{
                width: 52, height: 52,
                background: 'radial-gradient(circle at 40% 35%, #c8a882 0%, #a07850 55%, #7a5c38 100%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              }}
            >
              {/* Hair */}
              <div className="absolute -top-1 left-0 right-0 h-6 rounded-t-full" style={{ background: '#2c1a0e' }} />
              {/* Eye suggestion */}
              <div className="absolute top-5 left-3 h-1.5 w-1.5 rounded-full bg-gray-800/60" />
              <div className="absolute top-5 right-3 h-1.5 w-1.5 rounded-full bg-gray-800/60" />
            </div>
            {/* Neck + shoulders */}
            <div className="relative -mt-1 z-0" style={{ width: 90, height: 38, background: 'linear-gradient(180deg, #4a5568 0%, #374151 100%)', borderRadius: '40% 40% 0 0' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-5" style={{ background: '#a07850' }} />
            </div>
          </div>
        </div>

        {/* Subtle desk/table line */}
        <div className="absolute bottom-[14%] left-0 right-0 h-px opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #fff, transparent)' }} />
      </div>

      {/* Top bar — Google Meet style */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 py-2" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <span className="text-[10px] font-bold" style={{ color: '#4285F4' }}>G</span>
            <span className="text-[10px] font-bold" style={{ color: '#EA4335' }}>o</span>
            <span className="text-[10px] font-bold" style={{ color: '#FBBC05' }}>o</span>
            <span className="text-[10px] font-bold" style={{ color: '#4285F4' }}>g</span>
            <span className="text-[10px] font-bold" style={{ color: '#34A853' }}>l</span>
            <span className="text-[10px] font-bold" style={{ color: '#EA4335' }}>e</span>
          </div>
          <span className="text-[10px] text-white/70 font-medium">Meet</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/60">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>REC</span>
        </div>
      </div>

      {/* Interviewer name badge */}
      <div className="absolute bottom-10 left-2 flex items-center gap-1.5 rounded px-2 py-1" style={{ background: 'rgba(0,0,0,0.65)' }}>
        <Mic className="h-2.5 w-2.5 text-white/70" />
        <span className="text-[10px] font-medium text-white">Sarah Chen</span>
      </div>

      {/* Self-view PiP */}
      <div className="absolute bottom-10 right-2 overflow-hidden rounded shadow-lg" style={{ width: 52, height: 38, background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' }}>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-5 w-5 rounded-full" style={{ background: 'radial-gradient(circle at 40% 35%, #d4a574 0%, #a07850 100%)' }} />
            <div className="mt-0.5 h-3 w-8 rounded-t-full" style={{ background: '#4b5563' }} />
          </div>
        </div>
        <div className="absolute bottom-0.5 left-1 text-[8px] text-white/60">You</div>
      </div>

      {/* Bottom controls bar */}
      <div className="absolute bottom-0 left-0 right-0 flex h-9 items-center justify-center gap-2.5" style={{ background: 'rgba(32,33,36,0.92)' }}>
        <button className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <Mic className="h-3 w-3 text-white" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <Video className="h-3 w-3 text-white" />
        </button>
        <button className="flex h-6 w-16 items-center justify-center rounded-full bg-red-500">
          <Phone className="h-3 w-3 rotate-[135deg] text-white" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <MessageSquare className="h-3 w-3 text-white" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <Users className="h-3 w-3 text-white" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <MoreVertical className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Live Interview Overlay
// ---------------------------------------------------------------------------

const INTERVIEWERS = [
  { name: 'Interviewer 1', color: '#22c55e' },
  { name: 'Interviewer 2', color: '#ec4899' },
  { name: 'Interviewer 3', color: '#f97316' },
]

function LiveInterview({
  jobTitle,
  liveState,
  setLiveState,
  elapsed,
  onEnd,
  onResetPrefs,
}: {
  jobTitle: string
  liveState: LiveState
  setLiveState: (s: LiveState) => void
  elapsed: number
  onEnd: () => void
  onResetPrefs: () => void
}) {
  const [fontSize, setFontSize] = useState(14)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [showSettings, setShowSettings] = useState(false)
  const [showAI, setShowAI] = useState(true)

  type CopilotStatus = 'listening' | 'processing' | 'answering' | 'paused'
  const [copilotStatus, setCopilotStatus] = useState<CopilotStatus>('listening')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const [history, setHistory] = useState<{ q: string; a: string; interviewerIdx: number }[]>([])
  const statusRef = useRef(copilotStatus)
  const qIndexRef = useRef(questionIndex)
  const interviewerIdxRef = useRef(0)
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => { statusRef.current = copilotStatus }, [copilotStatus])
  useEffect(() => { qIndexRef.current = questionIndex }, [questionIndex])

  useEffect(() => {
    panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' })
  }, [qDisplayed, aDisplayed, copilotStatus])

  useEffect(() => {
    if (liveState !== 'interviewing') return
    setCopilotStatus('listening')
    setQuestionIndex(0)
    setHistory([])
    interviewerIdxRef.current = 0
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      const cur = statusRef.current
      const qi = qIndexRef.current
      if (cur === 'listening') {
        setQDisplayed(MOCK_QA[qi].q)
        setCopilotStatus('processing')
      } else if (cur === 'processing') {
        setCopilotStatus('answering')
      } else if (cur === 'answering') {
        const iIdx = interviewerIdxRef.current
        setHistory(h => [...h, { q: MOCK_QA[qi].q, a: MOCK_QA[qi].a, interviewerIdx: iIdx }])
        interviewerIdxRef.current = (iIdx + 1) % INTERVIEWERS.length
        setQuestionIndex(i => (i + 1) % MOCK_QA.length)
        setCopilotStatus('listening')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [liveState])

  useEffect(() => {
    if (copilotStatus !== 'listening' || liveState !== 'interviewing') return
    setQDisplayed('')
    setADisplayed('')
    const text = MOCK_QA[questionIndex].q
    let i = 0
    const id = setInterval(() => {
      i++
      setQDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex, liveState])

  useEffect(() => {
    if (copilotStatus !== 'answering' || liveState !== 'interviewing') return
    setADisplayed('')
    const text = MOCK_QA[questionIndex].a
    let i = 0
    const id = setInterval(() => {
      i += 6
      setADisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 10)
    return () => clearInterval(id)
  }, [copilotStatus, liveState, questionIndex])

  const statusConfig: Record<CopilotStatus, { text: string }> = {
    listening:  { text: 'Listening...'  },
    processing: { text: 'Processing...' },
    answering:  { text: 'Answering...'  },
    paused:     { text: 'Paused...'     },
  }

  const isListening = copilotStatus === 'listening' && liveState === 'interviewing'
  const currentInterviewerIdx = interviewerIdxRef.current

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(34,197,94,0.55), 0 0 18px rgba(34,197,94,0.18); }
          50%       { box-shadow: 0 0 0 1px rgba(34,197,94,1),    0 0 32px rgba(34,197,94,0.28); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes processingDot {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-shrink-0 items-center justify-between px-5 py-3"
        style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button className="flex-shrink-0 text-slate-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-red-500" />
            <span className="truncate text-sm font-medium text-white">
              Interview for {jobTitle || 'Software Engineer'}
            </span>
          </div>
        </div>

        <div className="ml-4 flex flex-shrink-0 items-center gap-3">
          {liveState === 'interviewing' && (
            <>
              <span className="tabular-nums text-sm font-medium text-slate-300">{formatTime(elapsed)}</span>
              <button
                onClick={onEnd}
                className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                End Session
              </button>
            </>
          )}
          {liveState === 'waiting' && (
            <button
              onClick={() => setLiveState('sharing')}
              className="rounded-lg border border-slate-600 px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-400 hover:text-white"
            >
              Share Screen
            </button>
          )}
          {liveState === 'sharing' && (
            <button
              onClick={() => setLiveState('interviewing')}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Start Interview
            </button>
          )}
        </div>
      </div>

      {/* ── STATUS BAR ──────────────────────────────────────────────── */}
      <div
        className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-2"
        style={{
          background: '#0F2340',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0px -1px 6px 0px rgba(34,197,94,0.14)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-[3px]">
            {[5, 8, 11, 14].map((h, i) => (
              <div key={i} className="w-[3px] rounded-sm bg-green-400" style={{ height: h }} />
            ))}
          </div>
          <span className="text-sm font-medium text-green-400">Strong</span>
          <span className="text-sm italic text-slate-400">
            {liveState === 'interviewing'
              ? statusConfig[copilotStatus].text
              : liveState === 'sharing'
              ? 'Connecting...'
              : 'Idle...'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAI(a => !a)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all',
              showAI
                ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
                : 'text-slate-400 hover:bg-white/10 hover:text-white',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Assistant
          </button>
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            Auto scroll
            <input
              type="range" min="1" max="5" value={scrollSpeed}
              onChange={e => setScrollSpeed(Number(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="w-3 text-center">{scrollSpeed}</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            Font size
            <input
              type="range" min="12" max="20" value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="w-4 text-center">{fontSize}</span>
          </label>
        </div>
      </div>

      {/* ── MAIN CONTENT: 2-panel ────────────────────────────────────── */}
      <div className="flex flex-1 gap-3 overflow-hidden p-3">

        {/* Live Response panel */}
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl transition-all duration-300"
          style={{
            background: '#0D1929',
            border: isListening ? '1px solid #22c55e' : '1px solid #1E2D45',
            ...(isListening ? { animation: 'glowPulse 2s ease-in-out infinite' } : {}),
          }}
        >
          {/* Panel header */}
          <div
            className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3"
            style={{ borderColor: '#1E2D45' }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              Live Response
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettings(s => !s)}
                aria-label="Session settings"
              >
                <Settings
                  className={cn('h-4 w-4 transition-colors', showSettings ? 'text-white' : 'text-slate-400 hover:text-white')}
                />
              </button>
              {showSettings && (
                <div
                  className="absolute right-0 top-7 z-20 w-64 rounded-xl p-4 shadow-2xl"
                  style={{ background: '#0A1628', border: '1px solid #1E2D45' }}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Session Preferences</p>
                  <div className="mb-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Role</span>
                      <span className="max-w-[140px] truncate font-medium text-slate-200">{jobTitle || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Resume</span>
                      <span className="font-medium text-slate-200">Lightforth Resume</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Skip setup</span>
                      <span className="font-medium text-green-400">On</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <button
                      onClick={() => { onResetPrefs(); setShowSettings(false) }}
                      className="w-full rounded-lg py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      Reset — show setup next time
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable conversation */}
          <div ref={panelRef} className="flex-1 space-y-6 overflow-y-auto p-5">
            {liveState === 'interviewing' ? (
              <>
                {history.map((item, i) => {
                  const iv = INTERVIEWERS[item.interviewerIdx]
                  return (
                    <div key={i} className="space-y-2">
                      <p className="text-xs font-semibold" style={{ color: iv.color }}>{iv.name}</p>
                      <div className="inline-block rounded-xl px-3 py-2" style={{ background: '#1A2F4A' }}>
                        <p className="text-sm text-white">{item.q}</p>
                      </div>
                      <p className="leading-relaxed text-slate-200" style={{ fontSize }}>{item.a}</p>
                    </div>
                  )
                })}

                <div className="space-y-2">
                  {qDisplayed && (
                    <>
                      <p className="text-xs font-semibold" style={{ color: INTERVIEWERS[currentInterviewerIdx].color }}>
                        {INTERVIEWERS[currentInterviewerIdx].name}
                      </p>
                      <div className="inline-block rounded-xl px-3 py-2" style={{ background: '#1A2F4A' }}>
                        <p className="text-sm text-white">
                          {qDisplayed}
                          {copilotStatus === 'listening' && qDisplayed.length < MOCK_QA[questionIndex].q.length && (
                            <span style={{ animation: 'blink 0.5s ease-in-out infinite' }}>|</span>
                          )}
                        </p>
                      </div>
                    </>
                  )}
                  {copilotStatus === 'processing' && (
                    <div className="flex items-center gap-1.5 py-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-slate-500"
                          style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
                        />
                      ))}
                    </div>
                  )}
                  {copilotStatus === 'answering' && aDisplayed && (
                    <p className="leading-relaxed text-slate-200" style={{ fontSize }}>
                      {aDisplayed}
                      {aDisplayed.length < MOCK_QA[questionIndex].a.length && (
                        <span
                          className="ml-px inline-block w-[2px] bg-primary align-middle"
                          style={{ height: '1em', animation: 'blink 0.45s ease-in-out infinite' }}
                        />
                      )}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="max-w-[260px] text-center text-sm leading-relaxed text-slate-500">
                  {liveState === 'sharing'
                    ? 'Connecting to audio...'
                    : 'Lightforth will analyze your interview questions and generate target responses in real time.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant panel — collapses smoothly to zero width */}
        <div
          className="flex overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: showAI ? 340 : 0, minWidth: 0, opacity: showAI ? 1 : 0, flexShrink: 0 }}
        >
          <div className="h-full w-[340px] flex-shrink-0">
            <AIAssistantPanel context={jobTitle} onClose={() => setShowAI(false)} />
          </div>
        </div>

      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Complete Screen
// ---------------------------------------------------------------------------

function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <>
      <div className="flex min-h-[64px] items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-6 lg:h-[70px] lg:px-16">
        <button onClick={onGoHome} className="flex items-center gap-3 text-sm font-bold text-foreground">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onGoHome} aria-label="Close complete screen"><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <main className="flex h-[calc(100vh-64px)] items-center justify-center overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="lf-panel w-full max-w-[620px] p-4 text-left sm:p-8">
        <h1 className="lf-overlay-title">Your Interview is complete!</h1>
        <p className="lf-body mt-5">
          Thank you for completing the AI interview. Your responses have been recorded and will be evaluated by our AI to provide an unbiased assessment.
        </p>
        <button
          onClick={onGoHome}
          className="mt-10 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
      </main>
    </>
  )
}

// ---------------------------------------------------------------------------
// Report Page
// ---------------------------------------------------------------------------

function ReportPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      {/* Top bar */}
      <div className="flex min-h-14 flex-shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-foreground">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onBack}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>

      {/* Back link */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Copilot
        </button>
      </div>

      {/* Two-panel body */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left: Transcript */}
        <div className="flex-1 overflow-y-auto border-border p-4 sm:p-6 lg:border-r">
          <h2 className="text-sm font-semibold text-foreground mb-4">Interview Transcript</h2>
          <div className="space-y-4">
            {MOCK_TRANSCRIPT.map((entry, i) => (
              <div key={i}>
                {entry.role === 'interviewer' ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Interviewer</span>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    <p className="text-sm text-foreground pl-2">{entry.text}</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-5 w-8 items-center justify-center rounded-md bg-foreground">
                        <span className="text-[10px] font-bold text-white">You</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pl-2">{entry.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Insights */}
        <div className="w-full flex-shrink-0 overflow-y-auto p-4 sm:p-6 lg:w-96">
          <h2 className="text-sm font-semibold text-foreground mb-4">Insights</h2>
          <h3 className="text-lg font-bold text-foreground mb-4">Software Engineer</h3>

          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Session Summary:</p>
            <p className="text-sm text-foreground leading-relaxed">
              The session captured a discussion focused on your improvement areas, reasons you applied for the job, and motivations for wanting to join.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-3">Improvement:</p>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">1. Clarity in Communication:</p>
                <p className="text-sm text-foreground leading-relaxed">Your communication was punctuated and clear, allowing easy understanding of your responses. However, be cautious of disruptive pauses and ensure a smooth continuation between all topics. Such fluency will enhance the conversational flow.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">2. Specificity in Examples:</p>
                <p className="text-sm text-foreground leading-relaxed">Unfortunately, without candidate responses noted in the logs, there was no opportunity to assess specificity. Aim to always provide detailed examples and explanations to support your points, as this demonstrates insight and depth in your experience.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">3. Follow-Up and Engagement with the Interviewer:</p>
                <p className="text-sm text-foreground leading-relaxed">Due to a lack of candidate responses in the transcript, it&apos;s challenging to evaluate your engagement. In general, active engagement and probing questions regarding the role and company not only show your interest but also help ascertain if the position aligns with your career goals.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Feedback Conclusion:</p>
                <p className="text-sm text-foreground leading-relaxed">While this session&apos;s transcript was limited to the AI&apos;s questions and lacked your direct responses, it&apos;s essential in any interview to communicate clearly and specifically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const PREFS_KEY = 'lf_copilot_prefs'

export default function InterviewCopilot() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const hasCopilotAccess = user?.plan === 'pro' || user?.plan === 'premium'
  const [view, setView] = useState<CopilotView>('landing')
  const [showPreference, setShowPreference] = useState(false)
  const [responseType, setResponseType] = useState<ResponseType>('default')
  const [liveState, setLiveState] = useState<LiveState>('waiting')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany]   = useState('')
  const [resumeType, setResumeType] = useState<'upload' | 'lightforth'>('lightforth')
  const [jobDesc, setJobDesc] = useState('')
  const [audioConnected, setAudioConnected] = useState(false)
  const [dontAskAgain, setDontAskAgain] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [, setSelectedHistoryId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY)
      if (saved) {
        const p = JSON.parse(saved)
        if (p.jobTitle) setJobTitle(p.jobTitle)
        if (p.resumeType) setResumeType(p.resumeType)
        if (p.responseType) setResponseType(p.responseType)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (liveState !== 'interviewing') return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [liveState])

  function handleStartInterview() {
    const hasSaved = !!localStorage.getItem(PREFS_KEY)
    if (hasSaved) {
      setView('live')
      setLiveState('waiting')
    } else {
      setView('setup')
    }
  }

  function goToLive() {
    if (dontAskAgain) {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ jobTitle, resumeType, responseType }))
    }
    setShowPreference(false)
    setView('live')
    setLiveState('waiting')
  }

  function handleContinue() {
    if (jobTitle) setShowPreference(true)
  }

  function handleResetPrefs() {
    localStorage.removeItem(PREFS_KEY)
  }

  function handleEndInterview() {
    setView('complete')
    setLiveState('waiting')
    setElapsed(0)
  }

  function handleSelectHistory(id: string) {
    setSelectedHistoryId(id)
    setView('report')
  }

  function handleInstallDesktop() {
    if (!hasCopilotAccess) {
      toast.info('Upgrade to Pro or Premium to unlock the Copilot desktop app.')
      navigate('/billing')
      return
    }
    navigate(`/desktop-copilot-preview${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`)
  }

  return (
    <>
      {/* Landing content (within AppLayout) */}
      <LandingContent
        onStart={handleStartInterview}
        onSelectHistory={handleSelectHistory}
        onInstallDesktop={handleInstallDesktop}
        onInstallMobile={() => navigate('/downloads')}
        hasCopilotAccess={hasCopilotAccess}
      />

      {/* Setup overlay */}
      {view === 'setup' && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-background">
          <SetupContent
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            company={company}
            setCompany={setCompany}
            resumeType={resumeType}
            setResumeType={setResumeType}
            jobDesc={jobDesc}
            setJobDesc={setJobDesc}
            audioConnected={audioConnected}
            setAudioConnected={setAudioConnected}
            dontAskAgain={dontAskAgain}
            setDontAskAgain={setDontAskAgain}
            onBack={() => setView('landing')}
            onContinue={handleContinue}
          />
          {showPreference && (
            <PreferenceModal
              responseType={responseType}
              setResponseType={setResponseType}
              onNext={goToLive}
              onClose={() => setShowPreference(false)}
            />
          )}
        </div>
      )}

      {/* Live interview overlay */}
      {view === 'live' && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#0A1628' }}>
          <LiveInterview
            jobTitle={jobTitle}
            liveState={liveState}
            setLiveState={setLiveState}
            elapsed={elapsed}
            onEnd={handleEndInterview}
            onResetPrefs={handleResetPrefs}
          />
        </div>
      )}

      {/* Complete screen */}
      {view === 'complete' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <CompleteScreen onGoHome={() => setView('landing')} />
        </div>
      )}

      {/* Report overlay */}
      {view === 'report' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
          <ReportPage onBack={() => setView('landing')} />
        </div>
      )}
    </>
  )
}
