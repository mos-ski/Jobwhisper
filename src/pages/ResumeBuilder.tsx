import { useEffect, useState, type Dispatch, type FocusEvent, type ReactNode, type SetStateAction } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  CornerDownLeft,
  Download,
  Eye,
  FileText,
  HelpCircle,
  Info,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Sparkles,
  Target,
  Trash2,
  X,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import LightforthLogo from '@/components/shared/LightforthLogo'

type BuilderScreen =
  | 'upload'
  | 'template'
  | 'jobTitle'
  | 'summary'
  | 'experienceList'
  | 'experienceForm'
  | 'educationList'
  | 'educationForm'
  | 'skills'
  | 'contact'
  | 'language'
  | 'canvas'
  | 'ats'
  | 'preview'

const TEMPLATES = [
  { id: 't01', name: 'Classic Blue', src: '/templates/t01.png' },
  { id: 't02', name: 'Centered', src: '/templates/t02.png' },
  { id: 't03', name: 'Minimal', src: '/templates/t03.png' },
  { id: 't04', name: 'Teal Summary', src: '/templates/t04.png' },
  { id: 't05', name: 'Clean Serif', src: '/templates/t05.png' },
  { id: 't06', name: 'Professional', src: '/templates/t06.png' },
  { id: 't07', name: 'Green Accent', src: '/templates/t07.png' },
  { id: 't08', name: 'Executive', src: '/templates/t08.png' },
  { id: 't09', name: 'Burgundy', src: '/templates/t09.png' },
  { id: 't10', name: 'Bold Blue', src: '/templates/t10.png' },
  { id: 't11', name: 'Simple', src: '/templates/t11.png' },
  { id: 't12', name: 'Slate', src: '/templates/t12.png' },
  { id: 't13', name: 'Monogram', src: '/templates/t13.png' },
  { id: 't14', name: 'Teal Highlight', src: '/templates/t14.png' },
  { id: 't15', name: 'Traditional', src: '/templates/t15.png' },
  { id: 't16', name: 'Three Column', src: '/templates/t16.png' },
  { id: 't17', name: 'Founder', src: '/templates/t17.png' },
  { id: 't18', name: 'Marketing Pro', src: '/templates/t18.png' },
  { id: 't19', name: 'Creative', src: '/templates/t19.png' },
  { id: 't20', name: 'Executive Pro', src: '/templates/t20.png' },
]

type ImproveMode = 'closed' | 'menu' | 'synonyms' | 'rewrite'
type SidebarTab = 'chat' | 'create' | 'templates'
type ChatMessage = {
  id: number
  role: 'ai' | 'user'
  text: string
}

type ResumeData = {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  city: string
  portfolio: string
  linkedin: string
  summary: string
  experienceBullets: string
  education: string
  school: string
  certificate: string
  certificateDate: string
  skills: string
  languages: string
}

const initialResumeData: ResumeData = {
  firstName: 'Adedamola',
  lastName: 'Adewale',
  title: 'Director of Product',
  email: 'adedamolamoses@gmail.com',
  phone: '123-456-7890',
  city: 'Lagos, Nigeria',
  portfolio: 'mo-ski.com',
  linkedin: 'linkedin.com/in/mos-ki',
  summary: 'Senior Product Manager with 8 years of experience in scaling fintech and AI platforms, specializing in product strategy, cross-functional leadership, and market expansion. Proficient in defining and executing product vision from inception to market, leveraging skills in agile methodologies, user research, and A/B testing. Adept at mentoring product managers, managing multiple squads, and implementing data-driven strategies to enhance user retention, activation, and revenue growth. Passionate about building efficient teams and driving innovation through user-centric design and AI-assisted prototyping.',
  experienceBullets:
    'Led end-to-end development of 5 core products AI Resume Builder, AI Cover Letter Builder, Interview Prep Simulator, Copilot (live interview AI assistant), and Partnership Dashboard, launching MVP in 5 months with 95 feature completion rate.\nBuilt an ATS-compliant resume builder that rewrites an entire resume from a pasted job description using AI, significantly improving application match rates for users.\nShipped Copilot, a real-time AI assistant that surfaces suggested answers during live interview calls, a first-of-its-kind feature on the platform.\nDesigned and launched a partnership dashboard enabling athletes and enterprise partners to earn commission on every subscription paid by referred users.\nCo-designed pricing strategy that delivered 2,000 in revenue within the first 3 months of monetisation.\nGrew platform to 12,000 users, improving retention 35 and reducing churn 10 through KPI-driven iteration with the analytics team.',
  education: 'B.Sc. Agriculture',
  school: 'University of Ilorin',
  certificate: 'Product Management Certificate',
  certificateDate: '2025',
  skills: 'Product Strategy, Roadmap Planning, User Research, AI Product Development, Agile Delivery, Data Analysis, Stakeholder Management, Growth Experiments',
  languages: 'English, French, Yoruba',
}

const initialJobDescription =
  'Coordinate internal resources and third parties/vendors for the flawless execution of projects.\nEnsure that all projects are delivered on-time, within scope and within budget.\nDevelop project scopes, objectives, and measurable success criteria.'

const initialCanvasChatMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'user',
    text: 'Can you improve the job summary section, I want to emphasize that I can also design, I can do market and i have experience in Product',
  },
  {
    id: 2,
    role: 'ai',
    text: "I've updated your resume summary to emphasize your design, marketing, and product management expertise as requested.",
  },
  {
    id: 3,
    role: 'user',
    text: 'My education section, can you make it more robust, add what you think is missing',
  },
  {
    id: 4,
    role: 'ai',
    text: 'I expanded your education section by adding relevant coursework, achievements, and extracurricular activities to make it more robust.',
  },
  {
    id: 5,
    role: 'user',
    text: 'Add certifications to boost credibility',
  },
  {
    id: 6,
    role: 'user',
    text: 'Add certifications to boost credibility',
  },
  {
    id: 7,
    role: 'ai',
    text: 'I added certifications to boost your credibility, focusing on relevant areas like product management, agile methodologies, and design.',
  },
]

function updateResumeField(
  setResume: Dispatch<SetStateAction<ResumeData>>,
  field: keyof ResumeData,
  value: string,
) {
  setResume((resume) => ({ ...resume, [field]: value }))
}

const suggestions = [
  'Diligent Senior Product Manager offering [Number] years of success in product roadmap development, market research and data analysis. Highly skilled in identifying opportunities to maximize revenue. Driven and strategic with proven history of superior market penetration and product launch.',
  'Experienced with product development, market analysis, and lifecycle management. Utilizes cross-functional collaboration to drive product success and adaptability to changing market needs.',
  'Motivated professional with extensive experience in product sales and distribution. Possesses unmatched leadership and strategy skills to maximize company revenue.',
]

const skillOptions = ['Figma', 'Graphic Design', 'Photoshop', 'Miro', 'Prototyping', 'Research']
const languageOptions = ['English', 'French', 'Spanish', 'Yoruba', 'Arabic', 'Mandarin']

function getATSInsights(resume: ResumeData, jobDescription: string) {
  const resumeText = Object.values(resume).join(' ').toLowerCase()
  const jdWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4)
  const uniqueJdWords = Array.from(new Set(jdWords))
  const matchedKeywords = uniqueJdWords.filter((word) => resumeText.includes(word)).slice(0, 8)
  const missingKeywords = uniqueJdWords.filter((word) => !resumeText.includes(word)).slice(0, 6)
  const hasMetrics = /\d|%|\$|revenue|growth|reduced|increased|launched|saved/i.test(resume.experienceBullets)
  const hasContact = Boolean(resume.email.trim() && resume.phone.trim() && resume.city.trim())
  const hasSummary = resume.summary.trim().split(/\s+/).length >= 18
  const hasSkills = resume.skills.split(',').filter((skill) => skill.trim()).length >= 6
  const jdScore = uniqueJdWords.length ? Math.round((matchedKeywords.length / Math.min(uniqueJdWords.length, 8)) * 28) : 14
  const score = Math.min(98, 36 + jdScore + (hasMetrics ? 12 : 0) + (hasContact ? 8 : 0) + (hasSummary ? 8 : 0) + (hasSkills ? 8 : 0))

  return {
    score,
    matchedKeywords,
    missingKeywords,
    checks: [
      { label: 'Contact details are complete', done: hasContact },
      { label: 'Summary has enough context', done: hasSummary },
      { label: 'Experience includes measurable impact', done: hasMetrics },
      { label: 'Skills section has 6+ relevant skills', done: hasSkills },
      { label: 'Resume mirrors job keywords', done: matchedKeywords.length >= 4 },
    ],
    scores: [
      ['Headline Match', resume.title.trim().length > 2 ? 82 : 48],
      ['Skill Match', Math.min(96, 52 + matchedKeywords.length * 7)],
      ['Impact Score', hasMetrics ? 88 : 54],
      ['Experience Score', resume.experienceBullets.split('\n').filter(Boolean).length >= 3 ? 86 : 58],
      ['Style Score', resume.summary.length < 420 ? 84 : 66],
    ] as const,
  }
}

function tailorResumeFromJobDescription(resume: ResumeData, jobDescription: string): ResumeData {
  const words = Array.from(new Set(jobDescription.match(/\b[A-Za-z][A-Za-z-]{4,}\b/g) ?? [])).slice(0, 8)
  const keywordLine = words.length ? ` Core strengths include ${words.slice(0, 5).join(', ')}.` : ''
  return {
    ...resume,
    summary: `Results-driven ${resume.title || 'professional'} with experience delivering measurable outcomes across product strategy, execution, stakeholder alignment, and operational improvement.${keywordLine}`,
    experienceBullets: `${resume.experienceBullets}\nTailored resume language to match role requirements, emphasizing ${words.slice(0, 4).join(', ') || 'high-priority responsibilities'} and measurable business impact.`,
    skills: Array.from(new Set([...resume.skills.split(',').map((skill) => skill.trim()).filter(Boolean), ...words.slice(0, 6)])).join(', '),
  }
}

// ─── Shared UI primitives ───────────────────────────────────────────────────

function PrimaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90',
        className,
      )}
    >
      {children}
    </button>
  )
}

function OutlineButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-muted',
        className,
      )}
    >
      {children}
    </button>
  )
}

function ProgressBadge({ label = 'Your Progress', sub = 'Start creating your resume' }: { label?: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[conic-gradient(#2563eb_40%,#e5e7eb_0)]">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-bold text-slate-700">40%</div>
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function Field({ label, placeholder, wide, type = 'text' }: { label: string; placeholder?: string; wide?: boolean; type?: string }) {
  return (
    <label className={cn('block', wide && 'col-span-2')}>
      <span className="lf-label mb-1.5 block">{label}</span>
      <input type={type} className="lf-input" placeholder={placeholder} />
    </label>
  )
}

function DateSelect({ label }: { label: string }) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = Array.from({ length: 15 }, (_, i) => 2025 - i)
  return (
    <label className="block">
      <span className="lf-label mb-1.5 block">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <select className="lf-select">
          <option value="">Month</option>
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select className="lf-select">
          <option value="">Year</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
    </label>
  )
}

function SuggestionList() {
  return (
    <div className="space-y-2.5">
      {suggestions.map((item, index) => (
        <button
          key={index}
          className={cn(
            'flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition',
            index === 0
              ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/50',
          )}
        >
          <Plus className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{item}</p>
        </button>
      ))}
    </div>
  )
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input className="lf-input pl-9" placeholder={placeholder} />
    </div>
  )
}

function ChipList({ items, selected }: { items: string[]; selected: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition',
            item === selected
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-white text-foreground hover:border-primary/50',
          )}
        >
          {item}
          {item === selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
        </button>
      ))}
    </div>
  )
}

// ─── Create-resume flow layout ──────────────────────────────────────────────

type CreateResumeStepId =
  | 'template'
  | 'jobTitle'
  | 'summary'
  | 'experienceList'
  | 'educationList'
  | 'skills'
  | 'contact'
  | 'language'

const STEP_LIST: [CreateResumeStepId, string][] = [
  ['template', 'Choose Template'],
  ['jobTitle', 'Job Title'],
  ['summary', 'Summary'],
  ['experienceList', 'Work Experience'],
  ['educationList', 'Education'],
  ['skills', 'Skills'],
  ['contact', 'Contact Info'],
  ['language', 'Languages'],
]

function CreateResumeTopbar({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 sm:px-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Create Resume</span>
        <span className="sm:hidden">Back</span>
      </button>
      <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </header>
  )
}

function CreateResumeSteps({ active }: { active: CreateResumeStepId }) {
  const activeIndex = STEP_LIST.findIndex(([id]) => id === active)
  const progress = Math.round(((activeIndex + 1) / STEP_LIST.length) * 100)
  return (
    <aside className="shrink-0 border-b border-border bg-white px-4 py-4 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <p className="text-xs font-semibold text-muted-foreground md:text-[11px] md:font-bold md:uppercase md:tracking-widest">Step {activeIndex + 1} of {STEP_LIST.length}</p>
        <p className="text-xs font-bold text-primary md:hidden">{progress}%</p>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted md:hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <nav className="grid grid-cols-8 gap-2 md:block md:space-y-5">
        {STEP_LIST.map(([id, label], index) => {
          const isDone = index < activeIndex
          const isActive = id === active
          return (
            <div key={id} className="flex min-w-0 items-center justify-center gap-3 md:justify-start">
              <div
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors',
                  isActive && 'bg-primary text-white',
                  isDone && 'bg-emerald-500 text-white',
                  !isActive && !isDone && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <p
                className={cn(
                  'hidden text-sm font-semibold transition-colors md:block',
                  isActive && 'text-primary',
                  isDone && 'text-foreground',
                  !isActive && !isDone && 'text-muted-foreground',
                )}
              >
                {label}
              </p>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function CreateResumeFooter() {
  return (
    <footer className="hidden fixed bottom-5 left-6 space-y-0.5 text-xs text-muted-foreground md:block">
      <p>© Lightforth AI 2026</p>
      <p>support@lightforth.org</p>
    </footer>
  )
}

function BuildStep({
  step,
  onBack,
  children,
}: {
  step: CreateResumeStepId
  onBack: () => void
  children: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={onBack} onClose={() => navigate('/documents')} />
      <main className="grid flex-1 overflow-hidden md:grid-cols-[220px_minmax(0,1fr)]">
        <CreateResumeSteps active={step} />
        <section className="overflow-y-auto px-4 py-8 sm:px-6 md:px-8 md:py-10">
          <div className="mx-auto max-w-xl pb-16">{children}</div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Scratch-build steps ─────────────────────────────────────────────────────

function SummaryStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="summary" onBack={() => setScreen('jobTitle')}>
      <h1 className="lf-page-title">Professional Summary</h1>
      <p className="lf-body mt-2">Write a brief summary that captures who you are and what you bring to the table.</p>

      <div className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" placeholder="Adedamola Adewale" />
          <Field label="Job Title" placeholder="Product Manager" />
        </div>

        <div>
          <span className="lf-label mb-1.5 block">Professional Summary</span>
          <p className="lf-body mb-2">Choose from our pre-written examples below or write your own.</p>
          <textarea
            className="lf-input h-32 w-full resize-none p-3 text-sm"
            placeholder="I am a results-driven professional with experience in..."
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">AI Suggestions</p>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Sparkles className="h-3.5 w-3.5" /> Suggest more
            </button>
          </div>
          <SuggestionList />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-8 w-full">
        Next — Work Experience
      </PrimaryButton>
    </BuildStep>
  )
}

function ExperienceList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  const items = [
    { title: 'Product Manager', company: 'Lightforth', period: 'Nov 2021 – Present' },
    { title: 'Product Designer', company: 'Freelance', period: 'Jan 2019 – Oct 2021' },
    { title: 'UI/UX Designer', company: 'StartupCo', period: 'Jun 2017 – Dec 2018' },
  ]
  return (
    <BuildStep step="experienceList" onBack={() => setScreen('summary')}>
      <h1 className="lf-page-title">Work Experience</h1>
      <p className="lf-body mt-2">Add your work history, starting with the most recent position.</p>

      <div className="mt-8 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="lf-panel flex items-center justify-between p-4">
            <button
              onClick={() => setScreen('experienceForm')}
              className="flex items-center gap-3 text-left"
            >
              <span className="text-lg text-slate-300">⠿</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.company} · {item.period}</p>
              </div>
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setScreen('experienceForm')}
                className="rounded-md p-1.5 transition hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {i > 0 && (
                <button className="rounded-md p-1.5 transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setScreen('experienceForm')}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Add another experience
      </button>

      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-8 w-full">
        Next — Education
      </PrimaryButton>
    </BuildStep>
  )
}

function ExperienceForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="experienceList" onBack={() => setScreen('experienceList')}>
      <h1 className="lf-page-title">Work Experience</h1>
      <p className="lf-body mt-2">Fill in the details for this position.</p>

      <div className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job Title" placeholder="Product Manager" />
          <Field label="Company / Employer" placeholder="Google" />
          <DateSelect label="Start Date" />
          <DateSelect label="End Date" />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-primary bg-primary text-white">
            <Check className="h-3 w-3" />
          </span>
          I currently work here
        </label>

        <Field label="Location" placeholder="Lagos, Nigeria" wide />

        <div>
          <span className="lf-label mb-1.5 block">Key Achievements</span>
          <p className="lf-body mb-2">Describe what you accomplished. Start each point with an action verb.</p>
          <textarea
            className="lf-input h-32 w-full resize-none p-3 text-sm"
            placeholder="Led the development of..."
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">AI Suggestions</p>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Sparkles className="h-3.5 w-3.5" /> Suggest more
            </button>
          </div>
          <SuggestionList />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-8 w-full">
        Save Experience
      </PrimaryButton>
    </BuildStep>
  )
}

function EducationList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="educationList" onBack={() => setScreen('experienceList')}>
      <h1 className="lf-page-title">Education</h1>
      <p className="lf-body mt-2">Add your educational background, starting with the most recent.</p>

      <div className="mt-8 space-y-3">
        <div className="lf-panel flex items-center justify-between p-4">
          <button onClick={() => setScreen('educationForm')} className="flex items-center gap-3 text-left">
            <span className="text-lg text-slate-300">⠿</span>
            <div>
              <p className="text-sm font-semibold text-foreground">B.Sc. Agriculture</p>
              <p className="text-xs text-muted-foreground">University of Ilorin · 2016 – 2020</p>
            </div>
          </button>
          <button
            onClick={() => setScreen('educationForm')}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setScreen('educationForm')}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Add another education
      </button>

      <PrimaryButton onClick={() => setScreen('skills')} className="mt-8 w-full">
        Next — Skills
      </PrimaryButton>
    </BuildStep>
  )
}

function EducationForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="educationList" onBack={() => setScreen('educationList')}>
      <h1 className="lf-page-title">Education</h1>
      <p className="lf-body mt-2">Fill in your educational details.</p>

      <div className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Institution" placeholder="University of Lagos" />
          <Field label="Location" placeholder="Lagos, Nigeria" />
          <Field label="Degree" placeholder="Bachelor of Science" />
          <Field label="Course / Major" placeholder="Computer Science" />
          <DateSelect label="Start Date" />
          <DateSelect label="End / Expected Date" />
        </div>
        <Field label="CGPA (optional)" placeholder="4.5 / 5.0" />
        <div>
          <span className="lf-label mb-1.5 block">Notable Achievements (optional)</span>
          <textarea
            className="lf-input h-24 w-full resize-none p-3 text-sm"
            placeholder="Dean's List, Best Graduating Student..."
          />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-8 w-full">
        Save Education
      </PrimaryButton>
    </BuildStep>
  )
}

function SkillsStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="skills" onBack={() => setScreen('educationList')}>
      <h1 className="lf-page-title">Skills</h1>
      <p className="lf-body mt-2">Add skills relevant to the role you're targeting. Pick from suggestions or type your own.</p>

      <div className="mt-8">
        <SearchBox placeholder="Search skills..." />
        <ChipList items={skillOptions} selected="Figma" />
      </div>

      <PrimaryButton onClick={() => setScreen('contact')} className="mt-8 w-full">
        Next — Contact Info
      </PrimaryButton>
    </BuildStep>
  )
}

function ContactStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="contact" onBack={() => setScreen('skills')}>
      <h1 className="lf-page-title">Contact Information</h1>
      <p className="lf-body mt-2">This appears at the top of your resume. Keep it professional and current.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="First Name" placeholder="Adedamola" />
        <Field label="Last Name" placeholder="Adewale" />
        <Field label="Email Address" placeholder="adedamola@gmail.com" type="email" />
        <Field label="Phone Number" placeholder="+234 810 367 4006" type="tel" />
        <Field label="City" placeholder="Lagos, Nigeria" />
        <Field label="Postal Code" placeholder="100216" />
        <label className="block sm:col-span-2">
          <span className="lf-label mb-1.5 block">Website / Portfolio (optional)</span>
          <input className="lf-input" placeholder="mo-ski.com" />
        </label>
        <label className="block sm:col-span-2">
          <span className="lf-label mb-1.5 block">LinkedIn (optional)</span>
          <input className="lf-input" placeholder="linkedin.com/in/adedamola" />
        </label>
      </div>

      <PrimaryButton onClick={() => setScreen('language')} className="mt-8 w-full">
        Next — Languages
      </PrimaryButton>
    </BuildStep>
  )
}

function LanguageStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="language" onBack={() => setScreen('contact')}>
      <h1 className="lf-page-title">Languages</h1>
      <p className="lf-body mt-2">Add languages you speak. Multi-lingual skills stand out to global employers.</p>

      <div className="mt-8">
        <SearchBox placeholder="Search languages..." />
        <ChipList items={languageOptions} selected="English" />
      </div>

      <PrimaryButton onClick={() => setScreen('canvas')} className="mt-10 w-full">
        Start Building
      </PrimaryButton>
    </BuildStep>
  )
}

// ─── Resume document renderer ────────────────────────────────────────────────

function ResumePaper({
  editable = false,
  resume,
  setResume,
  fitViewport = false,
  templateId = 't01',
  walkthroughStep,
  onWalkthroughNext,
  onSwitchToCreate,
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  fitViewport?: boolean
  templateId?: string
  walkthroughStep?: number | null
  onWalkthroughNext?: () => void
  onSwitchToCreate?: () => void
}) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || 'John Doe'
  const bulletItems = resume.experienceBullets
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const skills = resume.skills.split(',').map((item) => item.trim()).filter(Boolean)
  const languages = resume.languages.split(',').map((item) => item.trim()).filter(Boolean)
  const accent = templateId === 't07' || templateId === 't14' ? '#0f766e' : templateId === 't09' ? '#9f1239' : templateId === 't12' ? '#334155' : '#143763'
  const centered = templateId === 't02' || templateId === 't13'
  const serif = true

  function editableText(field: keyof ResumeData, className: string, fallback?: string) {
    return {
      contentEditable: editable,
      suppressContentEditableWarning: true,
      className,
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (setResume) updateResumeField(setResume, field, event.currentTarget.textContent?.trim() || fallback || '')
      },
    }
  }

  return (
    <article
      className={cn(
        'mx-auto bg-white text-[#141414] transition-all duration-300',
        serif && 'font-serif',
        fitViewport
          ? 'h-full max-h-[calc(100vh-9.5rem)] aspect-[8.5/11] min-h-0 w-auto overflow-hidden px-10 py-8 text-[13px] leading-5 ring-1 ring-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
          : 'min-h-[3364px] w-[816px] px-10 py-10 text-[16px] leading-[1.45] shadow-[0_2px_12px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/70',
      )}
    >
      <header className={cn('text-center', fitViewport ? 'mb-5' : 'mb-7')}>
        <div className="mx-auto">
          <h1
            contentEditable={editable}
            suppressContentEditableWarning
            className={cn('font-bold uppercase tracking-normal text-black outline-none', fitViewport ? 'text-xl' : 'text-[32px] leading-none')}
            onBlur={(event) => {
              if (!setResume) return
              const [firstName, ...rest] = (event.currentTarget.textContent?.trim() || fullName).split(/\s+/)
              setResume((current) => ({ ...current, firstName: firstName || current.firstName, lastName: rest.join(' ') || current.lastName }))
            }}
          >
            {fullName}
          </h1>
        </div>
        <div className={cn('mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center', fitViewport ? 'text-[11px] leading-4' : 'text-[13px] leading-5')}>
          <span {...editableText('email', 'text-[#006eb6] underline', 'myemail@gmail.com')}>{resume.email}</span>
          <span>|</span>
          <span {...editableText('city', '', 'Lagos, Nigeria')}>{resume.city}</span>
          <span>|</span>
          <span {...editableText('linkedin', 'text-[#006eb6] underline', 'John Doe')}>{resume.linkedin}</span>
          <span>|</span>
          <span {...editableText('portfolio', 'text-[#006eb6] underline', 'www.myportfolio.com')}>{resume.portfolio}</span>
        </div>
      </header>

      {resume.summary && (
        <section id="walkthrough-summary-section" className={cn(fitViewport ? 'mt-5' : 'mt-8', 'relative')}>
          <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>
            Professional Summary
          </h2>
          {walkthroughStep === 2 ? (
            <div className="mt-3">
              <div className="font-sans text-xs leading-5">
                <p className="bg-red-100 text-red-800 line-through">
                  8 years building and shipping fintech, AI, and crypto products across Africa. Portfolio of 12 live apps spanning payment infrastructure, wealth management, and AI tools. Uniquely positioned as a Product manager and Design engineer who also designs and builds, reducing time-to-market for lean teams and owning the full product lifecycle from strategy to
                </p>
                <p className="bg-green-100 font-medium text-green-800">
                  Dynamic Product Manager with expertise in managing product lifecycles from concept to launch. Proven track record in leading cross-functional teams, ensuring quality standards, and driving market strategy. Adept at refining processes for efficiency gains and cost reduction. Passionate about integrating AI in product development to meet modern technological demands.
                </p>
              </div>

              {/* Accept/Decline floating action buttons */}
              <div
                id="walkthrough-diff-actions"
                className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-30 flex items-center gap-3"
              >
                <button
                  onClick={onWalkthroughNext}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Decline changes"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={onWalkthroughNext}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0494fc] text-white transition hover:bg-[#0c87dd]"
                  aria-label="Accept changes"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (setResume) updateResumeField(setResume, 'summary', event.currentTarget.textContent?.trim() || '')
              }}
              onClick={() => {
                if (walkthroughStep === 3 && onWalkthroughNext) {
                  onWalkthroughNext()
                }
                if (onSwitchToCreate) onSwitchToCreate()
              }}
              className={cn(
                'mt-3 italic outline-none transition-all duration-300',
                fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-[1.38]',
                editable && 'hover:bg-sky-50/40 focus:bg-sky-50/50 rounded p-1',
                walkthroughStep === 3 && 'cursor-pointer rounded-md border border-[#0494fc] bg-blue-50 p-1.5'
              )}
            >
              {resume.summary}
            </p>
          )}
        </section>
      )}
      <ResumeExperienceSection editable={editable} resume={resume} setResume={setResume} bulletItems={bulletItems} fitViewport={fitViewport} />
      <ResumeEducationSection editable={editable} resume={resume} setResume={setResume} fitViewport={fitViewport} />
      <ResumeCertificateSection editable={editable} resume={resume} setResume={setResume} fitViewport={fitViewport} />
      <section className={cn(fitViewport ? 'mt-5' : 'mt-8')}>
        <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>Skills</h2>
        <div className={cn('mt-3 grid gap-1 sm:grid-cols-2', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-6')}>
          {skills.map((skill, index) => (
            <p
              key={`${skill}-${index}`}
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!setResume) return
                const next = [...skills]
                next[index] = event.currentTarget.textContent?.trim() || ''
                updateResumeField(setResume, 'skills', next.filter(Boolean).join(', '))
              }}
            >
              {skill}
            </p>
          ))}
        </div>
      </section>
      <section className={cn(fitViewport ? 'mt-5' : 'mt-8')}>
        <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>Languages</h2>
        <div className={cn('mt-3', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-6')}>
          {languages.map((item, index) => (
            <p
              key={`${item}-${index}`}
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!setResume) return
                const next = [...languages]
                next[index] = event.currentTarget.textContent?.trim() || ''
                updateResumeField(setResume, 'languages', next.filter(Boolean).join(', '))
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </section>
    </article>
  )
}

function ResumeExperienceSection({
  editable,
  resume,
  setResume,
  bulletItems,
  fitViewport = false,
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  bulletItems: string[]
  fitViewport?: boolean
}) {
  const earlierRoles = [
    {
      company: 'DeeXoptions',
      location: 'Lagos',
      role: 'Head of Product',
      period: 'December 2022 - January 2026',
      bullets: [
        'Scaled monthly transaction volume to a 150k-200k run rate by optimizing core product features and merchant acquisition channels.',
        'Launched merchant payment links and APIs, reducing integration friction and driving transaction volume growth within 90 days.',
        'Optimized merchant onboarding workflow, reducing setup time from 30 minutes to under 10 minutes and achieving a 50 increase in activation rates.',
        'Developed real-time merchant analytics dashboards, enhancing data visibility which drove a 40 increase in weekly active usage and significantly improved platform stickiness.',
        'Directed the implementation of wallet-to-wallet transfers and enhanced 2FA security protocols, improving platform trust and reducing support tickets by 20.',
      ],
    },
    {
      company: 'Nazza',
      location: 'Lagos',
      role: 'Product Manager',
      period: 'January 2023 - April 2026',
      bullets: [
        'Owned roadmap planning, product discovery, and delivery rituals for growth-focused product improvements.',
        'Partnered with design, engineering, and operations teams to turn customer feedback into shipped product enhancements.',
      ],
    },
  ]

  return (
    <section className={cn(fitViewport ? 'mt-5' : 'mt-7')}>
      <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>Experience</h2>
      <div className="mt-3">
        <div className="mb-2 flex justify-between gap-6">
          <div>
            <p className={cn('font-bold text-black', fitViewport && 'text-xs')}>Lightforth</p>
            <p className={cn('text-[#424242]', fitViewport ? 'text-xs' : 'text-[14px]')}>Dallas</p>
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => setResume && updateResumeField(setResume, 'title', event.currentTarget.textContent?.trim() || 'Director of Product')}
              className={cn('italic text-[#282828] outline-none', fitViewport ? 'text-xs' : 'text-[14px]')}
            >
              {resume.title || 'Director of Product'}
            </p>
          </div>
          <p className={cn('shrink-0 text-right text-[#424242]', fitViewport ? 'text-xs' : 'text-[14px]')}>August 2024 - Present</p>
        </div>
        <EditableBulletList editable={editable} setResume={setResume} bulletItems={bulletItems} fitViewport={fitViewport} />
        {earlierRoles.map((role) => (
          <div key={role.company} className={cn(fitViewport ? 'mt-5' : 'mt-6')}>
            <div className="mb-2 flex justify-between gap-6">
              <div>
                <p className={cn('font-bold text-black', fitViewport && 'text-xs')}>{role.company}</p>
                <p className={cn('text-[#424242]', fitViewport ? 'text-xs' : 'text-[14px]')}>{role.location}</p>
                <p className={cn('italic text-[#282828]', fitViewport ? 'text-xs' : 'text-[14px]')}>{role.role}</p>
              </div>
              <p className={cn('shrink-0 text-right text-[#424242]', fitViewport ? 'text-xs' : 'text-[14px]')}>{role.period}</p>
            </div>
            <ul className={cn('list-disc space-y-1 pl-5', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-[1.35]')}>
              {role.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function EditableBulletList({
  editable,
  setResume,
  bulletItems,
  fitViewport,
}: {
  editable?: boolean
  setResume?: Dispatch<SetStateAction<ResumeData>>
  bulletItems: string[]
  fitViewport?: boolean
}) {
  return (
    <div
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(event) => {
        if (!setResume) return
        const lines = Array.from(event.currentTarget.querySelectorAll('li'))
          .map((li) => li.textContent?.trim() || '')
          .filter(Boolean)
        updateResumeField(setResume, 'experienceBullets', lines.join('\n'))
      }}
      className={cn('rounded-sm outline-none transition', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-[1.35]', editable && 'hover:bg-sky-50/40 focus:bg-sky-50/50')}
    >
      <ul className="list-disc space-y-1 pl-5">
        {bulletItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    </div>
  )
}

function ResumeEducationSection({
  editable,
  resume,
  setResume,
  fitViewport = false,
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  fitViewport?: boolean
}) {
  return (
    <section className={cn(fitViewport ? 'mt-5' : 'mt-7')}>
      <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>Education</h2>
      <div className={cn('mt-3 flex justify-between gap-6', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-6')}>
        <div>
          <p
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(event) => setResume && updateResumeField(setResume, 'education', event.currentTarget.textContent?.trim() || '')}
            className="font-bold text-black outline-none"
          >
            {resume.education}
          </p>
          <p
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(event) => setResume && updateResumeField(setResume, 'school', event.currentTarget.textContent?.trim() || '')}
            className="text-[#424242] outline-none"
          >
            {resume.school}
          </p>
        </div>
        <p className="shrink-0 text-right text-[#424242]">2016 - 2020</p>
      </div>
    </section>
  )
}

function ResumeCertificateSection({
  editable,
  resume,
  setResume,
  fitViewport = false,
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  fitViewport?: boolean
}) {
  const certificates = [
    { name: resume.certificate, issuer: 'General Assembly', year: resume.certificateDate },
    { name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', year: '2023' },
    { name: 'Google UX Design Professional Certificate', issuer: 'Google', year: '2022' },
  ]

  return (
    <section className={cn(fitViewport ? 'mt-5' : 'mt-7')}>
      <h2 className={cn('border-y border-black py-1 font-bold uppercase tracking-normal text-black', fitViewport ? 'text-sm' : 'text-base')}>Certifications</h2>
      <div className="mt-3 space-y-4">
        {certificates.map((item, index) => (
          <div key={`${item.name}-${item.year}`} className={cn('flex justify-between gap-6', fitViewport ? 'text-xs leading-5' : 'text-[14px] leading-6')}>
            <div>
              <p
                contentEditable={editable && index === 0}
                suppressContentEditableWarning
                onBlur={(event) => setResume && updateResumeField(setResume, 'certificate', event.currentTarget.textContent?.trim() || '')}
                className="font-bold text-black outline-none"
              >
                {item.name}
              </p>
              <p className="text-[#424242]">{item.issuer}</p>
            </div>
            <p
              contentEditable={editable && index === 0}
              suppressContentEditableWarning
              onBlur={(event) => setResume && updateResumeField(setResume, 'certificateDate', event.currentTarget.textContent?.trim() || '')}
              className="shrink-0 text-right text-[#424242] outline-none"
            >
              {item.year}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

import { useRef } from 'react'

function WalkthroughTooltip({
  targetId,
  title,
  description,
  onSkip,
}: {
  targetId: string
  title: string
  description: string
  onSkip: () => void
}) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updatePosition() {
      let target = document.getElementById(targetId)
      if (!target && targetId === 'walkthrough-chat-input') {
        target = document.getElementById('walkthrough-chat-input-mobile')
      }
      if (!target) {
        setCoords(null)
        return
      }

      const targetRect = target.getBoundingClientRect()
      const offset = 16 // spacing between target and tooltip
      const left = targetRect.right + window.scrollX + offset
      
      // Calculate top so that tooltip is vertically aligned next to the target
      let top = targetRect.top + window.scrollY
      if (targetRect.height > 60) {
        top = targetRect.top + window.scrollY + (targetRect.height / 2) - 45
      } else {
        top = targetRect.top + window.scrollY + (targetRect.height / 2) - 45
      }

      // Avoid placing off-screen if layout is still settling
      if (left > 0 && top > 0) {
        setCoords({ top, left })
      }
    }

    updatePosition()
    
    // Set up MutationObserver to re-align if target moves or settles
    const observer = new MutationObserver(updatePosition)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    // Run multiple times as layout settles
    const timer1 = setTimeout(updatePosition, 100)
    const timer2 = setTimeout(updatePosition, 400)
    const timer3 = setTimeout(updatePosition, 1000)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [targetId])

  if (!coords) return null

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
      }}
      className="w-72 rounded-xl bg-[#0B2545] p-4 pr-8 text-white shadow-2xl pointer-events-auto"
    >
      {/* Left-pointing arrow */}
      <div className="absolute left-[-6px] top-[22px] h-3 w-3 rotate-45 bg-[#0B2545]" />

      <button
        onClick={onSkip}
        aria-label="Dismiss tip"
        className="absolute right-2 top-2 rounded p-1 text-blue-200/60 transition hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>

      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-blue-100/80">{description}</p>
    </div>
  )
}

// ─── Chat bubble (resume canvas chat thread) ─────────────────────────────────

const CHAT_BUBBLE_CLAMP_CHARS = 150

function ChatBubble({
  message,
  expanded,
  onToggleExpanded,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isLast,
}: {
  message: ChatMessage
  expanded: boolean
  onToggleExpanded: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  isLast?: boolean
}) {
  const isUser = message.role === 'user'
  const isLong = message.text.length > CHAT_BUBBLE_CLAMP_CHARS
  return (
    <div className={cn('flex', isUser && 'justify-end')}>
      <div className="max-w-[85%]">
        <div
          className={cn(
            'relative rounded-2xl px-3.5 py-2.5 text-sm leading-[1.625]',
            isUser ? 'rounded-br-sm bg-[#0494fc] text-white shadow-sm' : 'rounded-bl-sm bg-[#f3f4f6] text-[#1f2937]',
          )}
        >
          {!isUser && isLast && canRedo && onRedo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onRedo}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[#0494fc] transition-colors hover:text-[#0280d9]"
                    aria-label="Redo last change"
                  >
                    <CornerDownLeft className="h-3.5 w-3.5 scale-x-[-1]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Redo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {!isUser && isLast && !canRedo && canUndo && onUndo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onUndo}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-600"
                    aria-label="Undo last change"
                  >
                    <CornerDownLeft className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Undo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <p className={cn(!expanded && isLong && 'line-clamp-4 overflow-hidden', !isUser && isLast && (canUndo || canRedo) && 'pr-8')}>{message.text}</p>
          {isLong && (
            <>
              <div className={cn('my-1.5 border-t', isUser ? 'border-white/20' : 'border-slate-300/60')} />
              <button
                onClick={onToggleExpanded}
                className={cn(
                  'flex w-full items-center justify-center gap-1 text-xs font-semibold',
                  isUser ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatQuickPrompts({ prompts, onSelect }: { prompts: string[]; onSelect: (prompt: string) => void }) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[#4b5563] transition hover:border-[#0494fc]/40 hover:text-[#0494fc]"
          >
            <Sparkles className="h-2.5 w-2.5 text-[#0494fc]" />
            {prompt}
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-7 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}

// ─── Canvas screen (full editor) ─────────────────────────────────────────────

function CanvasScreen({
  setScreen,
  resume,
  setResume,
  templateId,
  setTemplateId,
  jobDescription,
  setJobDescription,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
  templateId: string
  setTemplateId: (id: string) => void
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
}) {
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(() => {
    return localStorage.getItem('lf_walkthrough_completed') === 'true' ? null : 1
  })

  function handleWalkthroughNext() {
    if (walkthroughStep === 1) {
      setWalkthroughStep(2)
    } else if (walkthroughStep === 2) {
      setWalkthroughStep(3)
    } else if (walkthroughStep === 3) {
      localStorage.setItem('lf_walkthrough_completed', 'true')
      setWalkthroughStep(null)
    }
  }

  function handleWalkthroughSkip() {
    localStorage.setItem('lf_walkthrough_completed', 'true')
    setWalkthroughStep(null)
  }

  function handleWalkthroughRestart() {
    localStorage.removeItem('lf_walkthrough_completed')
    setWalkthroughStep(1)
  }

  const [expanded, setExpanded] = useState('Experience')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('chat')
  const [resumeName, setResumeName] = useState("Adedamola's CV")
  const [isEditingName, setIsEditingName] = useState(false)
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialCanvasChatMessages)
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState(['Personal Information', 'Professional Summary', 'Experience', 'Education', 'Skills', 'Language', 'Certificates', 'Website and Social Links'])
  const [zoom, setZoom] = useState(0.85)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [mobileAtsOpen, setMobileAtsOpen] = useState(false)
  const [atsPanelOpen, setAtsPanelOpen] = useState(false)
  const [atsReportOpen, setAtsReportOpen] = useState(false)
  const [expandedMessageIds, setExpandedMessageIds] = useState<number[]>([])
  const [resumeHistory, setResumeHistory] = useState<ResumeData[]>([])
  const [undoneResume, setUndoneResume] = useState<ResumeData | null>(null)
  const [selectionToolMode, setSelectionToolMode] = useState<'closed' | 'button' | 'panel'>('closed')
  const [selectedCanvasText, setSelectedCanvasText] = useState('')
  const [selectedCanvasRange, setSelectedCanvasRange] = useState<Range | null>(null)
  const navigate = useNavigate()
  const zoomPercent = Math.round(zoom * 100)
  const quickPrompts = ['Add metrics to work highlights', 'Expand skills with technical proficiencies', 'Include notable projects or case studies']
  const availableSections = ['Projects', 'Awards', 'Volunteer Work', 'Publications'].filter((item) => !visibleSections.includes(item))

  useEffect(() => {
    if (walkthroughStep !== 1) return
    const text = 'Please update my professional summary to make it more impactful and results-driven.'
    let index = 0
    setChatDraft('')
    const interval = setInterval(() => {
      index++
      setChatDraft(text.slice(0, index))
      if (index >= text.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [walkthroughStep])

  function handleTailor() {
    if (!jobDescription.trim()) return
    setUndoneResume(null)
    setResumeHistory((h) => [...h, resume])
    setResume((current) => tailorResumeFromJobDescription(current, jobDescription))
    setChatMessages((messages) => [
      ...messages,
      { id: Date.now(), role: 'user', text: 'Rewrite my resume for this job description.' },
      { id: Date.now() + 1, role: 'ai', text: 'The resume has been tailored for the job description. Review the changes when you are ready, then download the final version.' },
    ])
  }

  function applyIssueFix(updater: (current: ResumeData) => ResumeData, prompt: string, confirmText: string) {
    setUndoneResume(null)
    setResumeHistory((h) => [...h, resume])
    setResume(updater)
    setChatMessages((messages) => [
      ...messages,
      { id: Date.now(), role: 'user', text: prompt },
      { id: Date.now() + 1, role: 'ai', text: confirmText },
    ])
    setSidebarTab('chat')
  }

  function applyAllIssueFixes(issues: Array<{ apply: (current: ResumeData) => ResumeData; prompt: string; confirmText: string }>) {
    if (issues.length === 0) return
    setUndoneResume(null)
    setResumeHistory((h) => [...h, resume])
    const base = Date.now()
    const newMessages: ChatMessage[] = []
    let next = resume
    issues.forEach((issue, i) => {
      next = issue.apply(next)
      newMessages.push({ id: base + i * 2, role: 'user', text: issue.prompt })
      newMessages.push({ id: base + i * 2 + 1, role: 'ai', text: issue.confirmText })
    })
    setResume(next)
    setChatMessages((messages) => [...messages, ...newMessages])
    setSidebarTab('chat')
    setAtsPanelOpen(false)
    setAtsReportOpen(false)
  }

  function sendChat(message = chatDraft) {
    const trimmed = message.trim()
    const normalized = trimmed.toLowerCase()
    if (!normalized) return
    if (walkthroughStep === 1) {
      setWalkthroughStep(2)
    }
    setUndoneResume(null)
    setResumeHistory((h) => [...h, resume])
    let aiText = 'I updated the resume canvas with that direction. Review the changes when you are ready, then download the final version.'
    if (normalized.includes('short')) {
      updateResumeField(setResume, 'summary', resume.summary.split('.').slice(0, 2).join('.').trim())
      aiText = 'I shortened the professional summary while keeping the main positioning intact.'
    } else if (normalized.includes('formal') || normalized.includes('professional')) {
      updateResumeField(setResume, 'summary', resume.summary.replace('Dynamic', 'Accomplished').replace('robust', 'comprehensive'))
      aiText = 'I made the summary sound more formal and executive without making it stiff.'
    } else if (normalized.includes('job description') || normalized.includes('rewrite') || normalized.includes('tailor')) {
      handleTailor()
      setChatDraft('')
      return
    } else if (normalized.includes('metric') || normalized.includes('impact')) {
      updateResumeField(setResume, 'experienceBullets', `${resume.experienceBullets}\nImproved product activation and delivery quality by aligning roadmap decisions with measurable user and business outcomes.`)
      aiText = 'I added a stronger impact-focused bullet. Add exact numbers later and the ATS score will respond even better.'
    } else if (normalized.includes('education')) {
      updateResumeField(setResume, 'education', 'B.Sc. Agriculture')
      aiText = 'All 4 points you made concerning the education section have been applied. Please review the resume before downloading.'
    }
    setChatMessages((messages) => [
      ...messages,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'ai', text: aiText },
    ])
    setChatDraft('')
  }

  function addSection(section: string) {
    setVisibleSections((current) => [...current, section])
    setExpanded(section)
    setAddSectionOpen(false)
  }

  function toggleMessageExpanded(id: number) {
    setExpandedMessageIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
  }

  function undoLastChange() {
    if (resumeHistory.length === 0) return
    const previous = resumeHistory[resumeHistory.length - 1]
    setResumeHistory((h) => h.slice(0, -1))
    setUndoneResume(resume)
    setResume(previous)
  }

  function redoLastChange() {
    if (!undoneResume) return
    setResumeHistory((h) => [...h, resume])
    setResume(undoneResume)
    setUndoneResume(null)
  }

  function handleCanvasSelection() {
    window.setTimeout(() => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim() ?? ''
      if (selection && !selection.isCollapsed && selectedText.length > 0) {
        setSelectedCanvasText(selectedText)
        setSelectedCanvasRange(selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null)
        setSelectionToolMode((current) => (current === 'panel' ? current : 'button'))
        return
      }
      setSelectionToolMode((current) => (current === 'panel' ? current : 'closed'))
    }, 0)
  }

  function applyCanvasSuggestion(suggestion: string) {
    if (selectedCanvasRange) {
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(selectedCanvasRange)
      selectedCanvasRange.deleteContents()
      selectedCanvasRange.insertNode(document.createTextNode(suggestion))
      selection?.removeAllRanges()
    }
    setResume((current) => replaceResumeSelection(current, selectedCanvasText, suggestion))
    setSelectedCanvasText('')
    setSelectedCanvasRange(null)
    setSelectionToolMode('closed')
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950 lg:hidden">
        <MobileEditorHeader
          resumeName={resumeName}
          setResumeName={setResumeName}
          isEditingName={isEditingName}
          setIsEditingName={setIsEditingName}
          onClose={() => navigate('/documents')}
        />
        <MobileEditorTabs sidebarTab={sidebarTab} setSidebarTab={setSidebarTab} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {sidebarTab === 'chat' && (
            <section className="flex min-h-[calc(100dvh-8.75rem)] flex-col px-4 pb-4">
              <div className="flex flex-1 flex-col justify-center py-8 text-center">
                {chatMessages.length === 0 ? (
                  <div className="mx-auto max-w-xs">
                    <h1 className="text-xl font-black leading-tight text-slate-950">Paste your job description</h1>
                    <p className="mt-3 text-base leading-7 text-slate-500">I can rewrite your resume for the role, then we can refine it together.</p>

                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="ml-auto max-w-[86%] rounded-lg bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
                      <ul className="list-disc pl-5">
                        {resume.experienceBullets.split('\n').filter(Boolean).slice(0, 4).map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-base leading-7 text-slate-600">
                      {chatMessages.filter((message) => message.role === 'ai').at(-1)?.text ?? 'Your edits are ready to review.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 space-y-3 border-t border-slate-200 bg-white pt-3">

                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                  {quickPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendChat(prompt)} className="shrink-0 rounded-full border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600">
                      {prompt}
                    </button>
                  ))}
                </div>
                <div>
                  <div id="walkthrough-chat-input-mobile" className={cn(
                    "flex items-end gap-2 rounded-xl border p-2 transition-all",
                    walkthroughStep === 1 ? "border-[#149cf2] ring-2 ring-[#149cf2]/20" : "border-slate-200"
                  )}>
                    <textarea
                      value={chatDraft}
                      onChange={(event) => setChatDraft(event.target.value)}
                      rows={2}
                      className="min-w-0 flex-1 resize-none text-base leading-6 text-slate-700 outline-none"
                      placeholder={walkthroughStep === 1 ? "Paste a job description here to get started..." : "Message Lightforth AI..."}
                    />
                    <div className="flex items-end gap-1.5">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleWalkthroughRestart}
                              aria-label="Restart tour"
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:text-slate-600"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Restart tour</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => sendChat()} aria-label="Send chat message" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#149cf2] text-white">
                              <Send className="h-5 w-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Send</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  {walkthroughStep === 1 && (
                    <p className="mt-1 text-xs text-slate-400 text-center font-medium">
                      Enter to send · Shift+Enter for newline
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {sidebarTab === 'create' && (
            <section className="space-y-5 px-4 py-5">
              <MobileSectionRow icon={<UserIcon />} title="Personal Information" action={<><Eye className="h-5 w-5" /><Plus className="h-5 w-5" /></>} />
              <MobileSectionRow icon={<FileText className="h-5 w-5" />} title="Professional Summary" action={<Plus className="h-5 w-5" />} />
              <div className="flex items-center gap-5 px-2 text-slate-400">
                <b className="text-lg">B</b><i className="text-lg font-bold">I</i><b className="text-lg">H</b><b className="text-base">H</b><span className="text-lg">"</span><span className="text-lg">↔</span><span className="text-lg">▣</span><span className="text-lg">☷</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <textarea
                  value={resume.summary}
                  onChange={(event) => updateResumeField(setResume, 'summary', event.target.value)}
                  rows={5}
                  className="w-full resize-none text-base leading-7 text-slate-600 outline-none"
                />
                <div className="mt-6 flex items-end justify-between gap-3 border-t border-slate-200 pt-4">
                  <Info className="h-5 w-5 text-orange-400" />
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-600 shadow-sm">
                    <p>Count: {resume.summary.trim().split(/\s+/).filter(Boolean).length}/100</p>
                    <p>Character: {resume.summary.length.toLocaleString()}</p>
                  </div>
                  <div className="min-w-[150px]">
                    <CreateTextActions
                      kind="summary"
                      currentValue={resume.summary}
                      onApply={(value) => updateResumeField(setResume, 'summary', value)}
                    />
                  </div>
                </div>
              </div>
              <MobileSectionRow icon={<BriefcaseIcon />} title="Experience" action={<Plus className="h-5 w-5" />} />
              <MobileResumeFileCard onOpen={() => setScreen('preview')} />

            </section>
          )}

          {sidebarTab === 'templates' && (
            <section className="space-y-5 px-4 py-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                {TEMPLATES.slice(0, 8).map((tmpl) => (
                  <button key={tmpl.id} onClick={() => setTemplateId(tmpl.id)} className="relative text-left">
                    <div className={cn('aspect-[3/4] overflow-hidden bg-white shadow-sm', templateId === tmpl.id && 'opacity-45')}>
                      <img src={tmpl.src} alt={tmpl.name} className="h-full w-full object-cover object-top" />
                    </div>
                    {templateId === tmpl.id && (
                      <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-emerald-400 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <MobileResumeFileCard onOpen={() => setScreen('preview')} />
            </section>
          )}
        </main>
        {mobileAtsOpen && <MobileAtsSheet resume={resume} jobDescription={jobDescription} onClose={() => setMobileAtsOpen(false)} />}
      </div>

      <div className="hidden h-screen flex-col overflow-hidden bg-[#f4f5f7] font-sans text-slate-950 lg:flex">
        <FullscreenTopbar
        left={(
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/documents')} aria-label="Close resume builder" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50">
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="min-w-0">
              {isEditingName ? (
                <input
                  value={resumeName}
                  autoFocus
                  onChange={(event) => setResumeName(event.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setIsEditingName(false)
                  }}
                  className="h-7 w-44 rounded-md border border-slate-200 px-2 text-xs font-bold outline-none focus:border-[#149cf2]"
                />
              ) : (
                <button onClick={() => setIsEditingName(true)} className="flex max-w-48 items-center gap-1 text-left text-xs font-bold text-slate-950">
                  <span className="truncate">{resumeName || 'Untitled resume'}</span>
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
              <p className="text-[11px] text-slate-500">Resume canvas</p>
            </div>
          </div>
        )}
        right={(
          <>
            <span className="mr-2 hidden items-center gap-1.5 text-xs font-semibold text-green-600 lg:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </span>
            <OutlineButton onClick={() => setAtsPanelOpen(true)} className="h-9 px-4 text-sm">ATS Score <Target className="h-4 w-4" /></OutlineButton>
            <OutlineButton onClick={() => setScreen('preview')} className="h-9 px-4 text-sm">Preview <Eye className="h-4 w-4" /></OutlineButton>
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              alignRight
              button={<PrimaryButton className="h-9 px-4 text-sm">Download <Download className="ml-2 h-4 w-4" /> <ChevronDown className="ml-1.5 h-3.5 w-3.5" /></PrimaryButton>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
          </>
        )}
        />
        <main className="grid min-h-0 flex-1 grid-cols-[340px_minmax(640px,1fr)] overflow-hidden">
        <aside className="flex max-h-[48vh] min-h-[320px] flex-col overflow-hidden border-r border-slate-200 bg-white p-3 lg:max-h-none lg:min-h-0">
          <div className="mb-6 grid shrink-0 grid-cols-3 rounded-md bg-[#f0f1f3] p-1 text-center text-sm font-semibold">
            {[
              ['chat', 'Chat'],
              ['create', 'Create'],
              ['templates', 'Template'],
            ].map(([id, label]) => (
              <button
                key={id as string}
                onClick={() => setSidebarTab(id as SidebarTab)}
                className={cn('flex h-8 items-center justify-center rounded transition-colors', sidebarTab === id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500')}
              >
                {label as string}
              </button>
            ))}
          </div>
          {sidebarTab === 'chat' ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {chatMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div className="max-w-[13rem]">
                      <p className="text-base font-black text-slate-900">Paste your job description</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">I can rewrite your resume for the role, then we can refine it together.</p>

                    </div>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      expanded={expandedMessageIds.includes(message.id)}
                      onToggleExpanded={() => toggleMessageExpanded(message.id)}
                      isLast={index === chatMessages.length - 1 && message.role === 'ai'}
                      canUndo={index === chatMessages.length - 1 && message.role === 'ai' && resumeHistory.length > 0}
                      canRedo={index === chatMessages.length - 1 && message.role === 'ai' && undoneResume !== null}
                      onUndo={undoLastChange}
                      onRedo={redoLastChange}
                    />
                  ))
                )}
              </div>
          <div className="mt-3 shrink-0 space-y-2.5 pt-3">

                <ChatQuickPrompts prompts={quickPrompts} onSelect={(prompt) => sendChat(prompt)} />
                <div>
                  <div id="walkthrough-chat-input" className="rounded-2xl border border-[#0494fc] bg-white p-1 shadow-[0px_4px_6px_-4px_rgba(4,148,252,0.6),0px_2px_4px_-2px_#0494fc]">
                    <textarea
                      value={chatDraft}
                      onChange={(event) => setChatDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          sendChat()
                        }
                      }}
                      rows={3}
                      className="min-w-0 w-full resize-none px-3 pt-2.5 text-sm leading-5 text-slate-700 outline-none placeholder:text-[#9ca3af]"
                      placeholder={chatMessages.length === 0 ? "Paste a job description here to get started…" : "Message Lightforth AI..."}
                    />
                    <div className="flex items-center justify-end gap-1.5 px-2 pb-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleWalkthroughRestart}
                              aria-label="Restart tour"
                              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:text-slate-600"
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Restart tour</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => sendChat()}
                              aria-label="Send chat message"
                              className={cn(
                                'grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors',
                                chatDraft.trim() ? 'bg-[#0494fc] text-white' : 'bg-[#f3f4f6] text-slate-400',
                              )}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Send</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="mt-1.5 text-center text-[11px] font-medium text-slate-400">
                    Enter to send · Shift+Enter for newline
                  </p>
                </div>
              </div>
            </div>
          ) : sidebarTab === 'templates' ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                {TEMPLATES.slice(0, 12).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={cn(
                      'group relative overflow-hidden transition-all',
                      templateId === tmpl.id ? 'shadow-lg' : 'hover:opacity-85',
                    )}
                  >
                    <img src={tmpl.src} alt={tmpl.name} className={cn('w-full object-cover object-top', templateId === tmpl.id && 'opacity-45')} />
                    {templateId === tmpl.id && (
                      <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-emerald-400 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-200">
                {visibleSections.map((item) => (
                  <div key={item} className="py-3">
                    <button onClick={() => setExpanded(expanded === item ? '' : item)} className="flex w-full items-center justify-between text-xs font-semibold text-slate-700 transition hover:text-slate-950">
                      {item}
                      <span>{expanded === item ? '−' : '+'}</span>
                    </button>
                    {expanded === item && (
                      <div className="mt-3 space-y-2">
                        {item === 'Personal Information' && (
                          <>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                              <SidebarInput label="First Name" value={resume.firstName} onChange={(value) => updateResumeField(setResume, 'firstName', value)} />
                              <SidebarInput label="Last Name" value={resume.lastName} onChange={(value) => updateResumeField(setResume, 'lastName', value)} />
                            </div>
                            <SidebarInput label="Job Title" value={resume.title} onChange={(value) => updateResumeField(setResume, 'title', value)} />
                            <SidebarInput label="Email" value={resume.email} onChange={(value) => updateResumeField(setResume, 'email', value)} type="email" />
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                              <SidebarInput label="Phone" value={resume.phone} onChange={(value) => updateResumeField(setResume, 'phone', value)} />
                              <SidebarInput label="City" value={resume.city} onChange={(value) => updateResumeField(setResume, 'city', value)} />
                            </div>
                          </>
                        )}
                        {item === 'Professional Summary' && (
                          <>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Summary</span>
                              <textarea
                                rows={4}
                                className="lf-input h-auto w-full resize-none py-2 text-sm"
                                value={resume.summary}
                                onChange={(event) => updateResumeField(setResume, 'summary', event.target.value)}
                                placeholder="Describe yourself in 2-4 sentences..."
                              />
                            </label>
                            <CreateTextActions
                              kind="summary"
                              currentValue={resume.summary}
                              onApply={(value) => updateResumeField(setResume, 'summary', value)}
                            />
                          </>
                        )}
                        {item === 'Experience' && (
                          <>
                            <div className="mb-3 flex gap-4 text-slate-400">
                              <b>B</b><i>I</i><b>H</b><span>"</span><span>🔗</span><AlignLeft className="h-5 w-5" />
                            </div>
                            <div className="rounded-md border border-slate-200 p-4 focus-within:border-sky-300">
                              <textarea
                                rows={5}
                                className="w-full resize-none rounded-md border-0 bg-transparent text-sm leading-6 outline-none"
                                value={resume.experienceBullets}
                                onChange={(event) => updateResumeField(setResume, 'experienceBullets', event.target.value)}
                              />
                            </div>
                            <CreateTextActions
                              kind="experience"
                              currentValue={resume.experienceBullets}
                              onApply={(value) => updateResumeField(setResume, 'experienceBullets', value)}
                            />
                          </>
                        )}
                        {item === 'Education' && (
                          <>
                            <SidebarInput label="Degree / Qualification" value={resume.education} onChange={(value) => updateResumeField(setResume, 'education', value)} />
                            <SidebarInput label="School / Institution" value={resume.school} onChange={(value) => updateResumeField(setResume, 'school', value)} />
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                              <SidebarInput label="Start Year" placeholder="2014" />
                              <SidebarInput label="End Year" placeholder="2018" />
                            </div>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Description (optional)</span>
                              <textarea rows={2} className="lf-input h-auto w-full resize-none py-2 text-sm" placeholder="Relevant coursework, honours..." />
                            </label>
                            <CreateTextActions
                              kind="education"
                              currentValue={resume.education}
                              onApply={(value) => updateResumeField(setResume, 'education', value)}
                            />
                          </>
                        )}
                        {item === 'Skills' && (
                          <>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Add skills</span>
                              <textarea
                                rows={2}
                                className="lf-input h-auto w-full resize-none py-2 text-sm"
                                value={resume.skills}
                                onChange={(event) => updateResumeField(setResume, 'skills', event.target.value)}
                                placeholder="e.g. Figma, TypeScript, Agile, SQL..."
                              />
                            </label>
                            <CreateTextActions
                              kind="skills"
                              currentValue={resume.skills}
                              onApply={(value) => updateResumeField(setResume, 'skills', value)}
                            />
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {['Figma', 'TypeScript', 'Agile', 'SQL', 'React', 'Leadership'].map((s) => (
                                <button key={s} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-[#149cf2] hover:text-[#149cf2] transition-colors">
                                  {s}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                        {item === 'Language' && (
                          <>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                              <SidebarInput label="Language" value={resume.languages.split(',')[0] ?? ''} onChange={(value) => {
                                const [, ...rest] = resume.languages.split(',').map((language) => language.trim())
                                updateResumeField(setResume, 'languages', [value, ...rest].filter(Boolean).join(', '))
                              }} />
                              <label className="block">
                                <span className="mb-1 block text-xs text-slate-500">Proficiency</span>
                                <select className="lf-input w-full pr-3 text-sm">
                                  {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map((l) => (
                                    <option key={l}>{l}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <button className="flex items-center gap-1 text-xs font-semibold text-[#149cf2]">
                              <Plus className="h-3.5 w-3.5" /> Add another language
                            </button>
                          </>
                        )}
                        {item === 'Certificates' && (
                          <>
                            <SidebarInput label="Certificate Name" value={resume.certificate} onChange={(value) => updateResumeField(setResume, 'certificate', value)} />
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                              <SidebarInput label="Issuing Organisation" placeholder="Amazon Web Services" />
                              <SidebarInput label="Issue Date" value={resume.certificateDate} onChange={(value) => updateResumeField(setResume, 'certificateDate', value)} />
                            </div>
                          </>
                        )}
                        {item === 'Website and Social Links' && (
                          <>
                            <SidebarInput label="LinkedIn" value={resume.linkedin} onChange={(value) => updateResumeField(setResume, 'linkedin', value)} type="url" />
                            <SidebarInput label="Portfolio" value={resume.portfolio} onChange={(value) => updateResumeField(setResume, 'portfolio', value)} type="url" />
                          </>
                        )}
                        {['Projects', 'Awards', 'Volunteer Work', 'Publications'].includes(item) && (
                          <>
                            <SidebarInput label={`${item} title`} placeholder={`Add ${item.toLowerCase()} title`} />
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Details</span>
                              <textarea rows={3} className="lf-input h-auto w-full resize-none py-2 text-sm" placeholder="Add the details you want to show on the resume." />
                            </label>
                            <CreateTextActions
                              kind="generic"
                              currentValue=""
                              onApply={() => undefined}
                            />
                          </>
                        )}
                        {!['Experience', 'Professional Summary', 'Education', 'Skills', 'Projects', 'Awards', 'Volunteer Work', 'Publications'].includes(item) && (
                          <button className="mt-1 w-full rounded-md bg-[#149cf2]/10 py-2 text-sm font-semibold text-[#149cf2] hover:bg-[#149cf2]/20 transition-colors">
                            Save
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="relative py-3">
                  <button onClick={() => setAddSectionOpen((open) => !open)} className="flex h-10 w-full items-center justify-between text-left text-sm font-semibold text-[#149cf2]">
                    + Add section
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {addSectionOpen && (
                    <div className="absolute bottom-14 left-0 right-0 z-20 rounded-md border border-slate-200 bg-white p-1 shadow-xl">
                      {availableSections.length ? availableSections.map((section) => (
                        <button key={section} onClick={() => addSection(section)} className="flex h-9 w-full items-center rounded px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          {section}
                        </button>
                      )) : (
                        <p className="px-3 py-2 text-sm text-slate-500">All sections are already added.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        <section className="relative flex min-h-[70vh] flex-col overflow-hidden bg-[#f0f1f3] lg:min-h-0">
          <div className="absolute right-4 top-3 z-20 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-500 shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setZoom((value) => Math.max(0.55, Number((value - 0.08).toFixed(2))))} className="grid h-6 w-6 place-items-center rounded-full hover:bg-slate-50" aria-label="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button onClick={() => setZoom(0.85)} className="px-2 text-xs font-semibold text-slate-700">{zoomPercent}%</button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setZoom((value) => Math.min(1.25, Number((value + 0.08).toFixed(2))))} className="grid h-6 w-6 place-items-center rounded-full hover:bg-slate-50" aria-label="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom in</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div
            className="relative min-h-0 flex-1 overflow-auto px-3 py-16 sm:px-5"
            onMouseUp={handleCanvasSelection}
            onKeyUp={handleCanvasSelection}
          >
            <div className="mx-auto" style={{ width: 816 * zoom, height: 3364 * zoom }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                <ResumePaper
                  editable
                  resume={resume}
                  setResume={setResume}
                  templateId={templateId}
                  walkthroughStep={walkthroughStep}
                  onWalkthroughNext={handleWalkthroughNext}
                  onSwitchToCreate={() => {
                    setSidebarTab('create')
                    setExpanded('Professional Summary')
                  }}
                />
              </div>
            </div>
            {selectionToolMode !== 'closed' && (
              <CanvasSelectionTools
                mode={selectionToolMode}
                selectedText={selectedCanvasText}
                onOpenPanel={() => setSelectionToolMode('panel')}
                onClose={() => {
                  setSelectedCanvasText('')
                  setSelectedCanvasRange(null)
                  setSelectionToolMode('closed')
                }}
                onApplySuggestion={applyCanvasSuggestion}
              />
            )}
          </div>
        </section>
        </main>
      </div>

      {(atsPanelOpen || atsReportOpen) && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/20"
          onClick={() => { setAtsPanelOpen(false); setAtsReportOpen(false) }}
        />
      )}

      {atsPanelOpen && (
        <CanvasRightPanel
          resume={resume}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onClose={() => setAtsPanelOpen(false)}
          onOpenReport={() => setAtsReportOpen(true)}
          pushLeft={atsReportOpen}
        />
      )}

      {atsReportOpen && (
        <ATSReportDrawer
          resume={resume}
          jobDescription={jobDescription}
          onClose={() => setAtsReportOpen(false)}
          onApplyFix={applyIssueFix}
          onApplyAllFixes={applyAllIssueFixes}
        />
      )}

      {walkthroughStep === 1 && (
        <WalkthroughTooltip
          targetId="walkthrough-chat-input"
          title="Send your First Message"
          description="Chat or paste a job description and Lightforth will rewrite your resume to match key words"
          onSkip={handleWalkthroughSkip}
        />
      )}
      {walkthroughStep === 2 && (
        <WalkthroughTooltip
          targetId="walkthrough-diff-actions"
          title="Accept or Reject Changes"
          description="The AI has suggested edits to your resume. Review each one and accept the changes you like or reject the ones you don't."
          onSkip={handleWalkthroughSkip}
        />
      )}
      {walkthroughStep === 3 && (
        <WalkthroughTooltip
          targetId="walkthrough-summary-section"
          title="Click to Edit"
          description="Changes are live on your resume. Click directly on any section to make manual edits."
          onSkip={handleWalkthroughSkip}
        />
      )}
    </>
  )
}

// ─── Sidebar input for canvas ─────────────────────────────────────────────────

function SidebarInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-500">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="lf-input h-9 w-full text-xs"
      />
    </label>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 6h4a2 2 0 0 1 2 2v1H8V8a2 2 0 0 1 2-2Z" />
      <rect x="3" y="9" width="18" height="12" rx="2" />
    </svg>
  )
}

function CreateTextActions({
  kind,
  currentValue,
  onApply,
}: {
  kind: SuggestionKind
  currentValue: string
  onApply: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [round, setRound] = useState(0)
  return (
    <div className="relative space-y-2.5">
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#149cf2]">
        <Sparkles className="h-3.5 w-3.5" /> AI Suggestions
      </button>
      <button className="h-9 w-full rounded-md bg-[#149cf2]/10 text-sm font-bold text-[#149cf2] hover:bg-[#149cf2]/20 transition-colors">
        Save
      </button>
      {open && (
        <AISuggesterPanel
          kind={kind}
          currentValue={currentValue}
          round={round}
          onClose={() => setOpen(false)}
          onSuggestMore={() => setRound((value) => value + 1)}
          onApply={(value) => {
            onApply(applySuggestedFieldValue(kind, currentValue, value))
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

type SuggestionKind = 'summary' | 'experience' | 'education' | 'skills' | 'generic'

function applySuggestedFieldValue(kind: SuggestionKind, currentValue: string, suggestion: string) {
  if (kind !== 'experience') return suggestion
  const currentLines = currentValue.split('\n').map((line) => line.trim()).filter(Boolean)
  if (currentLines.includes(suggestion)) return currentLines.join('\n')
  return [...currentLines, suggestion].join('\n')
}

function AISuggesterPanel({
  kind,
  currentValue,
  round,
  onClose,
  onSuggestMore,
  onApply,
}: {
  kind: SuggestionKind
  currentValue: string
  round: number
  onClose: () => void
  onSuggestMore: () => void
  onApply: (value: string) => void
}) {
  const suggestions = buildAISuggesterOptions(kind, currentValue, round)
  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div className="fixed inset-x-4 bottom-20 z-50 overflow-hidden rounded-md border-2 border-[#123667] bg-white text-slate-900 shadow-xl shadow-slate-950/25 sm:left-auto sm:right-6 sm:w-[430px] lg:inset-auto lg:left-[330px] lg:top-[330px] lg:w-[420px]">
        <div className="flex h-9 items-center justify-between gap-3 bg-[#123667] px-3 text-white">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-emerald-300" /> AI Suggestions
          </h3>
          <button onClick={onClose} aria-label="Close AI suggestions" className="rounded-md p-1 text-white/80 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[340px] overflow-y-auto p-3">
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                onClick={() => onApply(suggestion)}
                className={cn(
                  'w-full border-l-2 px-3 py-2.5 text-left text-sm leading-5 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-[#149cf2]/30',
                  index === 0 ? 'border-[#149cf2] bg-sky-50' : 'border-transparent bg-white',
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button onClick={onSuggestMore} className="mt-3 text-sm font-bold text-[#149cf2] hover:text-[#0c7dc5]">
            Suggest More
          </button>
        </div>
      </div>
    </>
  )
}

function buildAISuggesterOptions(kind: SuggestionKind, currentValue: string, round = 0) {
  const value = currentValue.trim()
  const sets: Record<SuggestionKind, string[][]> = {
    summary: [
      [
        'Dynamic Product Manager with a strong background in AI products, resume automation, and career tooling. Proven ability to translate user needs into practical product experiences that improve activation, retention, and outcomes.',
        'Product-focused builder with experience launching AI resume, cover letter, interview prep, and copilot workflows. Skilled at turning complex user problems into simple, measurable product improvements.',
        'AI product leader with hands-on experience across career technology, onboarding, and user activation. Known for building practical workflows that help users move faster and make better decisions.',
      ],
      [
        'Strategic Product Manager with experience building AI-powered career tools from concept through launch. Strong in roadmap planning, user research, and cross-functional execution.',
        'Product and design-minded operator focused on AI workflows, user growth, and measurable delivery. Brings a practical approach to improving products from early insight to shipped experience.',
        'Resume and career-tech product builder with a track record of improving user journeys, clarifying product value, and delivering AI-assisted workflows at speed.',
      ],
    ],
    experience: [
      [
        'Shipped a real-time interview assistant that surfaces suggested answers during live interview calls.',
        'Built an ATS-compliant resume builder that rewrites resumes based on pasted job descriptions using AI.',
        'Led end-to-end development of AI resume, cover letter, interview prep, and copilot products from concept through launch.',
        'Increased platform usage by improving onboarding, retention, and product activation across core workflows.',
      ],
      [
        'Improved resume tailoring workflows by turning job descriptions into clearer, role-aligned content recommendations.',
        'Partnered with design and engineering to launch AI-assisted career tools across resume, interview, and application workflows.',
        'Reduced friction in the resume creation flow by simplifying content editing, preview, and download interactions.',
        'Translated user feedback into product improvements that strengthened activation and completion rates.',
      ],
    ],
    education: [
      [
        'B.Sc. Agriculture, University of Ilorin',
        'Bachelor of Science in Agriculture, University of Ilorin',
        'B.Sc. Agriculture with coursework in research, analysis, and sustainable systems.',
      ],
      [
        'Bachelor of Science, Agriculture - University of Ilorin',
        'B.Sc. Agriculture, with applied research and interdisciplinary project experience.',
        'University of Ilorin - B.Sc. Agriculture',
      ],
    ],
    skills: [
      [
        'Product Strategy, User Research, Agile Delivery, Stakeholder Management, AI Product Development, Data Analysis',
        'Product Management, Roadmap Planning, User Experience Design, AI Workflows, Growth Experiments, Cross-functional Leadership',
        'AI Product Development, Resume Automation, Interview Prep, User Activation, Product Analytics, Team Collaboration',
      ],
      [
        'Product Discovery, Market Research, UX Writing, Prompt Design, Analytics, Delivery Management',
        'Career Technology, ATS Optimization, Product Roadmapping, Customer Insights, Experimentation, Workflow Design',
        'Research Synthesis, Product Design, AI Tooling, Metrics Definition, User Onboarding, Stakeholder Communication',
      ],
    ],
    generic: [
      [
        value || 'Add a concise, outcome-focused statement that connects your work to measurable impact.',
        'Rewrite this section with clearer ownership, stronger action verbs, and a practical result.',
        'Add a short statement that highlights the project, your role, and the outcome.',
      ],
      [
        'Make this section easier to scan with one clear action, one relevant context point, and one result.',
        'Strengthen the wording by removing filler and leading with the outcome.',
        'Add a role-aligned keyword naturally without making the text sound forced.',
      ],
    ],
  }
  return sets[kind][round % sets[kind].length]
}

function MobileEditorHeader({
  resumeName,
  setResumeName,
  isEditingName,
  setIsEditingName,
  onClose,
}: {
  resumeName: string
  setResumeName: (value: string) => void
  isEditingName: boolean
  setIsEditingName: (value: boolean) => void
  onClose: () => void
}) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onClose} aria-label="Close resume editor" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600">
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <input
              value={resumeName}
              autoFocus
              onChange={(event) => setResumeName(event.target.value)}
              onBlur={() => setIsEditingName(false)}
              className="h-8 w-full rounded-md border border-slate-200 px-2 text-base font-bold outline-none"
            />
          ) : (
            <button onClick={() => setIsEditingName(true)} className="flex max-w-full items-center gap-2 text-left">
              <span className="truncate text-base font-bold text-slate-950">{resumeName}</span>
              <Pencil className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          )}
          <p className="mt-0.5 text-sm text-slate-500">Resume canvas</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-green-600">
          <CheckCircle2 className="h-4 w-4" /> Saved
        </span>
      </div>
    </header>
  )
}

function MobileEditorTabs({
  sidebarTab,
  setSidebarTab,
}: {
  sidebarTab: SidebarTab
  setSidebarTab: (tab: SidebarTab) => void
}) {
  const tabs: [SidebarTab, string][] = [
    ['chat', 'Chat'],
    ['create', 'Create'],
    ['templates', 'Template'],
  ]

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSidebarTab(id)}
            className={cn(
              'h-11 text-sm font-bold transition',
              sidebarTab === id ? 'rounded-xl bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileSectionRow({ icon, title, action }: { icon: ReactNode; title: string; action: ReactNode }) {
  return (
    <div className="flex items-center border-b border-slate-200 py-4 text-slate-700">
      <span className="mr-4 text-slate-600">{icon}</span>
      <span className="min-w-0 flex-1 text-base font-bold">{title}</span>
      <span className="flex items-center gap-4 text-slate-600">{action}</span>
    </div>
  )
}

function MobileResumeFileCard({ onOpen }: { onOpen?: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="grid h-12 w-10 shrink-0 place-items-center rounded-md bg-red-500 text-xs font-black text-white">PDF</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-slate-700">Adedamola’s CV</p>
        <p className="mt-1 text-sm text-slate-500">PDF · 200 KB</p>
      </div>
      <button onClick={onOpen} className="h-10 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:border-[#149cf2] hover:text-[#149cf2]">Open</button>
    </div>
  )
}

function MobileAtsSheet({
  resume,
  jobDescription,
  onClose,
}: {
  resume: ResumeData
  jobDescription: string
  onClose: () => void
}) {
  const insights = getATSInsights(resume, jobDescription)
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-6 pt-4">
        <button onClick={onClose} aria-label="Close ATS tips" className="mb-4 text-slate-400">
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-4 text-xl font-black text-slate-950">ATS Tips</h2>
        <section className="rounded-xl border border-slate-200 p-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#149cf2 ${insights.score}%, #f1f2f4 0)` }}>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-base font-black text-slate-600">{insights.score}%</div>
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Live ATS score</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">Updates as you edit the resume and chat prompt.</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.scores.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-bold text-slate-500"><span>{label}</span><span>{value}%</span></div>
                <div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-4 rounded-xl border border-slate-200 p-4">
          <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950"><Info className="h-4 w-4" /> Live ATS tips</h3>
          <div className="space-y-3">
            {insights.checks.map((check) => (
              <p key={check.label} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black text-white', check.done ? 'bg-emerald-500' : 'bg-amber-500')}>
                  {check.done ? '✓' : '!'}
                </span>
                {check.label}
              </p>
            ))}
          </div>
          {insights.missingKeywords.length > 0 && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4">
              <p className="text-base font-black text-amber-800">Recommended keywords</p>
              <p className="mt-2 text-sm leading-6 text-amber-700">{insights.missingKeywords.join(', ')}</p>
            </div>
          )}
          {insights.matchedKeywords.length > 0 && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4">
              <p className="text-base font-black text-emerald-800">Already matched</p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">{insights.matchedKeywords.join(', ')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function CanvasSelectionTools({
  mode,
  selectedText,
  onOpenPanel,
  onClose,
  onApplySuggestion,
}: {
  mode: 'button' | 'panel'
  selectedText: string
  onOpenPanel: () => void
  onClose: () => void
  onApplySuggestion: (suggestion: string) => void
}) {
  const [suggestionRound, setSuggestionRound] = useState(0)
  const suggestions = buildCanvasImprovementSuggestions(selectedText, suggestionRound)

  if (mode === 'button') {
    return (
      <button
        onMouseDown={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onMouseUp={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onOpenPanel()
        }}
        className="absolute left-1/2 top-[42%] z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-xl ring-1 ring-black/10"
      >
        <Sparkles className="h-3.5 w-3.5" /> Improve
      </button>
    )
  }

  return (
    <div
      className="absolute left-1/2 top-[42%] z-30 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-md border-2 border-[#123667] bg-white text-slate-900 shadow-xl shadow-slate-950/25"
      onMouseDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onMouseUp={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex h-9 items-center justify-between gap-3 bg-[#123667] px-3 text-white">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-emerald-300" /> Improve
        </h3>
        <button onClick={onClose} aria-label="Close improvement suggestions" className="rounded-md p-1 text-white/80 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[340px] overflow-y-auto p-3">
        <div className="space-y-2.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.title}
              onClick={() => onApplySuggestion(suggestion.text)}
              className="w-full border-l-2 border-transparent bg-white px-3 py-2.5 text-left transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-[#149cf2]/30 first:border-[#149cf2] first:bg-sky-50"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#149cf2]">{suggestion.title}</span>
              <span className="mt-1.5 block whitespace-pre-line text-sm leading-5 text-slate-800">{suggestion.text}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setSuggestionRound((round) => round + 1)} className="mt-3 text-sm font-bold text-[#149cf2] hover:text-[#0c7dc5]">
          Suggest More
        </button>
      </div>
    </div>
  )
}

function buildCanvasImprovementSuggestions(selectedText: string, round = 0) {
  const cleanText = selectedText.replace(/\s+/g, ' ').trim()
  const source = cleanText || 'Selected resume text'
  const clearer = source
    .replace(/\bfrom concept to launch\b/gi, 'from concept through launch')
    .replace(/\bfrom pasted job descriptions\b/gi, 'based on pasted job descriptions')
    .replace(/\bGrew\b/g, 'Increased')
    .replace(/\butilized\b/gi, 'used')
  const concise = source.length > 180 ? `${source.slice(0, 177).trim()}...` : source
  const impact = `${source.replace(/[. ]+$/, '')}, improving delivery quality, user adoption, and measurable product outcomes.`
  const ats = `${source.replace(/[. ]+$/, '')}, with stronger emphasis on product strategy, AI workflows, stakeholder alignment, and execution.`
  const firstSet = [
    { title: 'Clearer wording', text: clearer },
    { title: 'More concise', text: concise },
    { title: 'Impact focused', text: impact },
    { title: 'ATS aligned', text: ats },
  ]
  const secondSet = [
    { title: 'Stronger action', text: source.replace(/^(helped|worked on|did)\b/i, 'Led').replace(/[. ]+$/, '') },
    { title: 'More polished', text: `${source.replace(/[. ]+$/, '')}.` },
    { title: 'Metrics ready', text: `${source.replace(/[. ]+$/, '')}, increasing [metric] by [percentage].` },
    { title: 'Leadership angle', text: `${source.replace(/[. ]+$/, '')} while aligning stakeholders around clearer priorities and outcomes.` },
  ]
  const suggestions = round % 2 === 0 ? firstSet : secondSet
  return suggestions.filter((suggestion, index, list) => list.findIndex((item) => item.text === suggestion.text) === index).slice(0, 4)
}

function replaceResumeSelection(resume: ResumeData, selectedText: string, replacement: string): ResumeData {
  const fields: Array<keyof ResumeData> = ['firstName', 'lastName', 'title', 'email', 'phone', 'city', 'portfolio', 'linkedin', 'summary', 'experienceBullets', 'education', 'school', 'certificate', 'certificateDate', 'skills', 'languages']
  for (const field of fields) {
    const currentValue = resume[field]
    const nextValue = replaceTextMatch(currentValue, selectedText, replacement)
    if (nextValue !== currentValue) {
      return { ...resume, [field]: nextValue }
    }
  }
  return resume
}

function replaceTextMatch(source: string, selectedText: string, replacement: string) {
  const exact = selectedText.trim()
  if (!exact) return source
  if (source.includes(exact)) return source.replace(exact, replacement)
  const normalizedMatch = exact.replace(/\s+/g, ' ')
  const flexibleWhitespacePattern = normalizedMatch.split(' ').map(escapeRegExp).join('\\s+')
  return source.replace(new RegExp(flexibleWhitespacePattern), replacement)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function FullscreenTopbar({ left, title, right }: { left?: ReactNode; title?: string; right?: ReactNode }) {
  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-1.5 shadow-sm">
      <div className="min-w-0">{left ?? <span className="text-sm font-semibold">{title}</span>}</div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{right}</div>
    </header>
  )
}

function ActionMenu({
  button,
  items,
  open,
  setOpen,
  alignRight,
  icon = 'download',
}: {
  button: ReactNode
  items: string[]
  open: boolean
  setOpen: (open: boolean) => void
  alignRight?: boolean
  icon?: 'download' | 'save'
}) {
  const Icon = icon === 'save' ? Save : Download
  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{button}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className={cn('absolute top-11 z-30 w-48 rounded-lg border border-primary/30 bg-white p-1.5 shadow-xl', alignRight ? 'right-0' : 'left-0')}>
            {items.map((item) => (
              <button
                key={item}
                onClick={() => setOpen(false)}
                className="flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {item}
                <Icon className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ImprovePopover({ mode, setMode }: { mode: ImproveMode; setMode: (mode: ImproveMode) => void }) {
  if (mode === 'closed') return null
  return (
    <div className="absolute left-3 right-3 top-4 z-30 overflow-hidden rounded-md border-2 border-[#123667] bg-white shadow-2xl sm:left-4 sm:right-auto sm:w-[360px]">
      <div className="flex h-10 items-center justify-between bg-[#123667] px-3 text-white">
        <span className="font-semibold">✦ Improve</span>
        <button onClick={() => setMode('closed')}><X className="h-5 w-5" /></button>
      </div>
      {mode === 'synonyms' && (
        <div className="p-3">
          <p className="mb-3 text-sm">Synonyms for newsletter</p>
          <div className="flex flex-wrap gap-3">
            {['Mailings', 'Paperwork', 'Writeups', 'Summary'].map((item) => (
              <button key={item} className="rounded-md border border-sky-300 px-4 py-3 text-sm">{item}</button>
            ))}
          </div>
        </div>
      )}
      {mode === 'rewrite' && (
        <div className="p-3">
          <button onClick={() => setMode('menu')} className="mb-4 rounded-md border px-4 py-2 text-sm"><ArrowLeft className="mr-2 inline h-4 w-4" /> Back</button>
          <p className="text-sm leading-6">Developed numerous marketing programs (logos, brochures, newsletters, infographics, presentations) and guaranteed that they exceeded the expectations of our clients</p>
        </div>
      )}
      {mode === 'menu' && (
        <div className="max-h-[410px] overflow-auto p-3">
          <div className="flex flex-wrap gap-3">
            {['😊 Casual', '👋 Engaging', '✍️ Outline', '🗣️ Persuasive', '👊 Assertive', '💪 Confident', '🫶 Constructive', '🤝 Diplomatic', '☝️ Friendly', '📷 Descriptive', '💦 Detailed', '📏 Shorter', '🪜 Longer', '💃 Simplify', '🔁 Paraphrase', '🛠 Fix any mistake', '🧑‍💼 More Professional', '⚡ Rewrite'].map((item) => (
              <button
                key={item}
                onClick={() => item.includes('Rewrite') || item.includes('mistake') ? setMode('rewrite') : undefined}
                className={cn(
                  'rounded-full border border-sky-300 px-4 py-2 text-sm font-semibold',
                  item.includes('mistake') && 'bg-[#149cf2] text-white',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="mt-4 rounded-md border px-4 py-2 text-sm">↻ Generate Text</button>
        </div>
      )}
    </div>
  )
}

function CanvasRightPanel({
  resume,
  jobDescription,
  setJobDescription,
  onClose,
  onOpenReport,
  pushLeft,
}: {
  resume: ResumeData
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
  onClose: () => void
  onOpenReport: () => void
  pushLeft?: boolean
}) {
  const insights = getATSInsights(resume, jobDescription)
  const score = insights.score
  const gradeLabel = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs work'
  const gradeBadge = score >= 85 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'

  const hasMetrics = /\d|%|\$|revenue|growth|reduced|increased|launched|saved/i.test(resume.experienceBullets)
  const hasSummary = resume.summary.trim().split(/\s+/).length >= 18
  const hasSkills = resume.skills.split(',').filter((s) => s.trim()).length >= 6
  const urgentCount = (!hasMetrics ? 1 : 0) + insights.missingKeywords.length
  const criticalCount = !hasSummary ? 1 : 0
  const optionalCount = !hasSkills ? 3 : 1

  const summaryText = (() => {
    const parts: string[] = []
    if (score >= 85) parts.push(`Your resume scores ${score}% — ${gradeLabel.toLowerCase()}.`)
    else if (score >= 70) parts.push(`Your resume scores ${score}% — ${gradeLabel.toLowerCase()}.`)
    else parts.push(`Your resume scores ${score}% and needs improvement.`)
    if (hasMetrics) parts.push('It showcases strong, quantifiable achievements.')
    else parts.push('Adding measurable impact (numbers, %, $) would significantly boost your score.')
    if (hasSummary) parts.push('Your summary is well-developed.')
    else parts.push('Your summary needs more context to stand out.')
    return parts.join(' ')
  })()

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-50 w-[320px] space-y-3 overflow-y-auto bg-white p-3 shadow-2xl transition-[transform,right] duration-300 ease-out',
        visible ? 'translate-x-0' : 'translate-x-full',
        pushLeft && 'sm:right-[460px]',
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-900">ATS Score</h2>
        <button onClick={onClose} aria-label="Close ATS panel" className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Grade + counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#149cf2 ${score}%, #f1f2f4 0)` }}>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-slate-600">{score}%</div>
          </div>
          <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', gradeBadge)}>{gradeLabel}</span>
        </div>
        <div className="flex gap-1.5">
          {([
            { label: 'Urgent', count: urgentCount, text: 'text-red-600' },
            { label: 'Critical', count: criticalCount, text: 'text-amber-600' },
            { label: 'Optional', count: optionalCount, text: 'text-blue-600' },
          ] as const).map((chip) => (
            <div key={chip.label} className="w-[58px] rounded-md border border-slate-100 px-1 py-1.5 text-center">
              <p className={cn('text-base font-bold', chip.text)}>{chip.count}</p>
              <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">{chip.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Summary */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Analysis Summary</h3>
        <p className="mt-1.5 text-xs leading-5 text-slate-600">{summaryText}</p>
      </div>

      <button
        onClick={onOpenReport}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        View Full Report <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
      </button>

      {/* Job Description — optional, always visible */}
      <section className="rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-black text-slate-900">Job Description <span className="font-normal text-slate-400">(optional)</span></h3>
        <p className="mt-1 text-[11px] leading-4 text-slate-500">Paste the job description here — Lightforth scores your resume against it for a more accurate ATS report.</p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description..."
          className="lf-input mt-2 h-20 w-full resize-none p-2.5 text-xs leading-5"
        />
      </section>

      <section className="rounded-md border border-slate-200 p-3">
        <h3 className="text-sm font-black text-slate-900">Score Breakdown</h3>
        <p className="mb-3 mt-1 text-[11px] leading-4 text-slate-500">Updates as you edit the resume and chat prompt.</p>
        <div className="space-y-2.5">
          {insights.scores.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-500"><span>{label}</span><span>{value}%</span></div>
              <div className="h-1 rounded-full bg-slate-200"><div className="h-1 rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-md border border-slate-200 p-3">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-black"><Info className="h-3.5 w-3.5" /> Live ATS tips</h3>
        <div className="space-y-2.5">
          {insights.checks.map((check) => (
            <p key={check.label} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
              <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white', check.done ? 'bg-emerald-500' : 'bg-amber-500')}>
                {check.done ? '✓' : '!'}
              </span>
              {check.label}
            </p>
          ))}
        </div>
      </section>
      </aside>
  )
}

// ─── ATS screen ───────────────────────────────────────────────────────────────

function ATSScreen({
  setScreen,
  resume,
  setResume,
  jobDescription,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
  jobDescription: string
}) {
  const navigate = useNavigate()
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] font-sans lg:h-screen lg:overflow-hidden">
      <FullscreenTopbar
        left={<button onClick={() => setScreen('canvas')} className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Back to canvas</button>}
        right={(
          <>
            <OutlineButton onClick={() => setScreen('preview')} className="h-9">Preview <Eye className="h-4 w-4" /></OutlineButton>
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              button={<OutlineButton className="h-9">Download <Download className="h-4 w-4" /></OutlineButton>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
            <ActionMenu
              open={saveOpen}
              setOpen={setSaveOpen}
              alignRight
              button={<PrimaryButton className="h-9">Save <Save className="ml-2 h-4 w-4" /></PrimaryButton>}
              items={['Save changes', 'Save as draft']}
              icon="save"
            />
            <button onClick={() => navigate('/documents')} aria-label="Close ATS view" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      />
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_460px] lg:overflow-hidden">
        <section className="flex min-h-[70vh] items-center justify-center overflow-auto rounded-md border border-slate-200 bg-[#eef1f5] p-3 shadow-inner sm:p-4 lg:min-h-0 lg:overflow-hidden">
          <ResumePaper editable resume={resume} setResume={setResume} fitViewport />
        </section>
        <ATSOverviewPanel
          resume={resume}
          jobDescription={jobDescription}
          onApplyFix={(updater) => setResume(updater)}
          onApplyAllFixes={(issues) => setResume((current) => issues.reduce((acc, issue) => issue.apply(acc), current))}
        />
      </main>
    </div>
  )
}

function ATSOverviewPanel({
  resume,
  jobDescription,
  onClose,
  onApplyFix,
  onApplyAllFixes,
}: {
  resume: ResumeData
  jobDescription: string
  onClose?: () => void
  onApplyFix: ApplyFix
  onApplyAllFixes: ApplyAllFixes
}) {
  const insights = getATSInsights(resume, jobDescription)

  const hasMetrics = /\d|%|\$|revenue|growth|reduced|increased|launched|saved/i.test(resume.experienceBullets)
  const hasSummary = resume.summary.trim().split(/\s+/).length >= 18
  const hasSkills = resume.skills.split(',').filter((s) => s.trim()).length >= 6

  const urgentCount = (!hasMetrics ? 1 : 0) + insights.missingKeywords.length

  const [expandedWhy, setExpandedWhy] = useState<number[]>([])

  type ATSIssue = {
    type: 'Urgent' | 'Critical' | 'Minor'
    label: string
    count: number
    desc: string
    original: string
    aiVersion: string
    prompt: string
    confirmText: string
    apply: (current: ResumeData) => ResumeData
  }

  function replaceBulletLine(text: string, oldLine: string, newLine: string): string {
    const lines = text.split('\n')
    const idx = lines.indexOf(oldLine)
    if (idx === -1) return [...lines, newLine].join('\n').trim()
    lines[idx] = newLine
    return lines.join('\n')
  }

  const bulletLines = resume.experienceBullets.split('\n').filter(Boolean)
  const firstBulletLine = bulletLines.find(Boolean) ?? 'Led product development initiatives.'
  const fillerLine = bulletLines.find((line) => /\b(responsible for|assisted with|worked with)\b/i.test(line))
  const fillerAiVersion = fillerLine
    ? fillerLine
        .replace(/\bresponsible for\b/i, 'Led')
        .replace(/\bassisted with\b/i, 'Drove')
        .replace(/\bworked with\b/i, 'Partnered with')
    : ''

  const metricBulletCount = bulletLines.filter((line) => /\d|%|\$/.test(line)).length
  const lowMetricCoverage = bulletLines.length > 0 && metricBulletCount / bulletLines.length < 0.6
  const lowMetricBullet = bulletLines.find((line) => !/\d|%|\$/.test(line))
  const lowMetricAiVersion = lowMetricBullet ? `${lowMetricBullet.replace(/\.$/, '')}, boosting team performance by an estimated 25%.` : ''

  const verbSynonyms: Record<string, string> = { led: 'Directed', built: 'Engineered', designed: 'Architected', managed: 'Oversaw', created: 'Established', grew: 'Scaled', drove: 'Propelled', shipped: 'Delivered' }
  const firstWords = bulletLines.map((line) => line.trim().split(/\s+/)[0]?.toLowerCase() ?? '')
  const duplicateVerbIdx = firstWords.findIndex((w, i) => w && firstWords.indexOf(w) !== i)
  const duplicateVerbLine = duplicateVerbIdx >= 0 ? bulletLines[duplicateVerbIdx] : undefined
  const duplicateVerbAiVersion = duplicateVerbLine
    ? duplicateVerbLine.replace(/^\S+/, (verb) => verbSynonyms[verb.toLowerCase()] ?? 'Spearheaded')
    : ''

  const sections: Array<{ number: number; title: string; issues: ATSIssue[]; why: string }> = [
    {
      number: 1,
      title: 'Relevance',
      issues: [
        !hasSummary
          ? {
              type: 'Minor' as const,
              label: 'Summary Needs Improvement',
              count: 1,
              desc: 'Your summary does not effectively showcase your qualifications and alignment with the job you are targeting.',
              original: resume.summary || 'No professional summary provided.',
              aiVersion: 'Accomplished Product Manager with 5+ years driving SaaS growth and cross-functional team alignment. Proven record of delivering 20%+ revenue improvements through data-informed product roadmaps. Recognized for translating complex user needs into scalable, market-ready features.',
              prompt: "Fix my professional summary — it isn't showcasing my qualifications or fit for this role.",
              confirmText: 'Done — I rewrote your summary to lead with your experience and a clear value proposition. Review it on the canvas.',
              apply: (current: ResumeData) => ({ ...current, summary: 'Accomplished Product Manager with 5+ years driving SaaS growth and cross-functional team alignment. Proven record of delivering 20%+ revenue improvements through data-informed product roadmaps. Recognized for translating complex user needs into scalable, market-ready features.' }),
            }
          : null,
        insights.missingKeywords.length > 0
          ? {
              type: 'Minor' as const,
              label: 'Missing Job Keywords',
              count: insights.missingKeywords.length,
              desc: `Keywords missing from your resume: ${insights.missingKeywords.slice(0, 4).join(', ')}.`,
              original: resume.skills || 'No skills listed.',
              aiVersion: [resume.skills, ...insights.missingKeywords.slice(0, 3)].filter(Boolean).join(', '),
              prompt: `Work these missing keywords into my resume: ${insights.missingKeywords.slice(0, 4).join(', ')}.`,
              confirmText: 'Done — I added those keywords to your skills section without keyword-stuffing.',
              apply: (current: ResumeData) => ({ ...current, skills: [current.skills, ...insights.missingKeywords.slice(0, 3)].filter(Boolean).join(', ') }),
            }
          : null,
        !resume.certificate.trim()
          ? {
              type: 'Minor' as const,
              label: 'No Certifications Listed',
              count: 1,
              desc: 'Adding a relevant certification can strengthen your credibility and help you stand out for this role.',
              original: '(no certifications listed)',
              aiVersion: `${resume.title || 'Professional'} Certification`,
              prompt: "I don't have any certifications listed — suggest one relevant to my role and add it.",
              confirmText: 'Done — I added a certification relevant to your role. Review it on the canvas.',
              apply: (current: ResumeData) => ({ ...current, certificate: `${current.title || 'Professional'} Certification`, certificateDate: String(new Date().getFullYear()) }),
            }
          : null,
      ].filter(Boolean) as ATSIssue[],
      why: 'Relevance ensures your experience and trajectory are directly aligned with the type of role you\'re applying for.',
    },
    {
      number: 2,
      title: 'Impact & Achievements',
      issues: [
        !hasMetrics
          ? {
              type: 'Urgent' as const,
              label: 'Methodology Explanation',
              count: urgentCount,
              desc: 'Some of your experience lacks specific approaches and measurable outcomes that showcase domain expertise.',
              original: firstBulletLine,
              aiVersion: 'Spearheaded product roadmap for 3 enterprise verticals, accelerating feature delivery by 40% and generating $2.1M in incremental ARR over 18 months.',
              prompt: "This bullet doesn't show measurable impact — rewrite it with a stronger verb and a quantified result.",
              confirmText: 'Done — I rewrote that bullet to lead with a strong action verb and a measurable outcome.',
              apply: (current: ResumeData) => ({ ...current, experienceBullets: replaceBulletLine(current.experienceBullets, firstBulletLine, 'Spearheaded product roadmap for 3 enterprise verticals, accelerating feature delivery by 40% and generating $2.1M in incremental ARR over 18 months.') }),
            }
          : null,
        lowMetricCoverage && lowMetricBullet
          ? {
              type: 'Critical' as const,
              label: 'Limited Quantified Impact',
              count: bulletLines.length - metricBulletCount,
              desc: `${bulletLines.length - metricBulletCount} of your ${bulletLines.length} bullets lack measurable results. Recruiters and ATS systems weigh quantified impact heavily.`,
              original: lowMetricBullet,
              aiVersion: lowMetricAiVersion,
              prompt: "Most of my bullets don't have measurable results — add a quantified outcome to one of them.",
              confirmText: 'Done — I added a measurable outcome to that bullet.',
              apply: (current: ResumeData) => ({ ...current, experienceBullets: replaceBulletLine(current.experienceBullets, lowMetricBullet, lowMetricAiVersion) }),
            }
          : null,
      ].filter(Boolean) as ATSIssue[],
      why: 'Achievements and impact are the backbone of a compelling resume. They showcase not just what you did, but how well you did it.',
    },
    {
      number: 3,
      title: 'Brevity & Effectiveness',
      issues: [
        fillerLine
          ? {
              type: 'Minor' as const,
              label: 'Use of Filler Words',
              count: 1,
              desc: 'One of your bullets uses filler phrases that do not add value and could be streamlined for greater impact.',
              original: fillerLine,
              aiVersion: fillerAiVersion,
              prompt: 'This bullet uses filler language like "responsible for" — tighten it up with an active verb.',
              confirmText: 'Done — I removed the filler language and tightened that bullet.',
              apply: (current: ResumeData) => ({ ...current, experienceBullets: replaceBulletLine(current.experienceBullets, fillerLine, fillerAiVersion) }),
            }
          : null,
        duplicateVerbLine
          ? {
              type: 'Minor' as const,
              label: 'Repeated Action Verbs',
              count: 1,
              desc: 'More than one bullet starts with the same verb. Varying your verbs keeps the resume engaging and avoids sounding repetitive.',
              original: duplicateVerbLine,
              aiVersion: duplicateVerbAiVersion,
              prompt: 'A couple of my bullets start with the same verb — vary the wording on one of them.',
              confirmText: 'Done — I swapped in a stronger, less repetitive verb for that bullet.',
              apply: (current: ResumeData) => ({ ...current, experienceBullets: replaceBulletLine(current.experienceBullets, duplicateVerbLine, duplicateVerbAiVersion) }),
            }
          : null,
        !hasSkills
          ? {
              type: 'Minor' as const,
              label: 'Skills Section Incomplete',
              count: 1,
              desc: 'Add at least 6 specific skills to improve ATS keyword matching.',
              original: resume.skills || '(empty)',
              aiVersion: [resume.skills, 'Agile', 'Scrum', 'SQL', 'Figma', 'Stakeholder Management', 'Data Analysis'].filter(Boolean).join(', '),
              prompt: 'My skills section is too short — add more relevant skills.',
              confirmText: 'Done — I added more relevant skills to round out that section.',
              apply: (current: ResumeData) => ({ ...current, skills: [current.skills, 'Agile', 'Scrum', 'SQL', 'Figma', 'Stakeholder Management', 'Data Analysis'].filter(Boolean).join(', ') }),
            }
          : null,
      ].filter(Boolean) as ATSIssue[],
      why: 'Brevity ensures your resume is concise and communicates your most relevant experiences swiftly. Recruiters spend only seconds scanning.',
    },
  ]

  const issueStyle: Record<'Urgent' | 'Critical' | 'Minor', { badge: string; groupLabel: string }> = {
    Urgent: { badge: 'bg-red-100 text-red-700', groupLabel: 'Urgent Issues' },
    Critical: { badge: 'bg-amber-100 text-amber-700', groupLabel: 'Critical Issues' },
    Minor: { badge: 'bg-blue-100 text-blue-700', groupLabel: 'Minor Issues' },
  }

  function toggleWhy(sectionNumber: number) {
    setExpandedWhy((current) => (current.includes(sectionNumber) ? current.filter((n) => n !== sectionNumber) : [...current, sectionNumber]))
  }

  const allIssues = sections.flatMap((sec) => sec.issues)

  return (
    <div className="h-full overflow-y-auto bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
        <button onClick={onClose} disabled={!onClose} className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:invisible">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Resume Analysis Report</h2>
      </div>

      {/* Analysis Highlights */}
      <h3 className="mb-4 text-sm font-semibold text-foreground">Analysis Highlights</h3>
      <div className="space-y-6">
        {sections.map((sec) => {
          const isWhyExpanded = expandedWhy.includes(sec.number)
          const severityOrder: Array<'Urgent' | 'Critical' | 'Minor'> = ['Urgent', 'Critical', 'Minor']
          const groups = severityOrder
            .map((type) => ({ type, issues: sec.issues.filter((issue) => issue.type === type) }))
            .filter((group) => group.issues.length > 0)

          return (
            <div key={sec.number}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {sec.number}
                </span>
                <span className="text-sm font-semibold text-foreground">{sec.title}</span>
              </div>
              <div className="mt-3 border-t border-border" />

              {groups.length === 0 ? (
                <p className="mt-3 text-xs font-medium text-green-600">✓ No issues found in this area.</p>
              ) : (
                groups.map((group) => (
                  <div key={group.type} className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{issueStyle[group.type].groupLabel}</p>
                    <div className="space-y-2">
                      {group.issues.map((issue) => (
                        <div key={issue.label} className="lf-panel p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-foreground">{issue.label}</span>
                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', issueStyle[issue.type].badge)}>
                              {issue.count} {issue.count === 1 ? 'issue' : 'issues'}
                            </span>
                            <button
                              onClick={() => onApplyFix(issue.apply, issue.prompt, issue.confirmText)}
                              className="ml-auto text-xs font-semibold text-primary underline-offset-2 hover:underline"
                            >
                              Fix
                            </button>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{issue.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why This Is Important</p>
                <p className={cn('mt-1.5 text-sm leading-6 text-slate-700', !isWhyExpanded && 'line-clamp-2')}>{sec.why}</p>
                <button
                  onClick={() => toggleWhy(sec.number)}
                  className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {isWhyExpanded ? 'Show less' : 'Learn why this matters'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {allIssues.length > 0 && (
        <button
          onClick={() => onApplyAllFixes(allIssues)}
          className="mt-8 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Fix All
        </button>
      )}
    </div>
  )
}

type ApplyFix = (updater: (current: ResumeData) => ResumeData, prompt: string, confirmText: string) => void
type ApplyAllFixes = (issues: Array<{ apply: (current: ResumeData) => ResumeData; prompt: string; confirmText: string }>) => void

function ATSReportDrawer({
  resume,
  jobDescription,
  onClose,
  onApplyFix,
  onApplyAllFixes,
}: {
  resume: ResumeData
  jobDescription: string
  onClose: () => void
  onApplyFix: ApplyFix
  onApplyAllFixes: ApplyAllFixes
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-50 w-full overflow-hidden border-l border-border bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[460px]',
        visible ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <ATSOverviewPanel resume={resume} jobDescription={jobDescription} onClose={onClose} onApplyFix={onApplyFix} onApplyAllFixes={onApplyAllFixes} />
    </aside>
  )
}

function DiffInlineActions({
  accepted,
  onAccept,
  onReject,
  onRegenerate,
}: {
  accepted?: boolean
  onAccept?: () => void
  onReject?: () => void
  onRegenerate?: () => void
}) {
  return (
    <div className="mt-3 flex items-center justify-end gap-2">
      <button onClick={onRegenerate} className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm">
        <RotateCcw className="h-3.5 w-3.5" /> Regenerate
      </button>
      <button onClick={onReject} className="inline-flex h-8 items-center gap-1 rounded-full border border-red-200 bg-white px-3 text-xs font-bold text-red-500 shadow-sm">
        <X className="h-3.5 w-3.5" /> Reject
      </button>
      <button onClick={onAccept} className={cn('inline-flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-bold shadow-sm', accepted ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-200 bg-white text-emerald-600')}>
        <Check className="h-3.5 w-3.5" /> {accepted ? 'Accepted' : 'Accept'}
      </button>
    </div>
  )
}

function DiffResumePaper({
  resume,
  acceptedSections = [],
  onAcceptSection,
  onRejectSection,
  onRegenerateSection,
}: {
  resume: ResumeData
  acceptedSections?: string[]
  onAcceptSection?: (id: string) => void
  onRejectSection?: (id: string) => void
  onRegenerateSection?: (id: string) => void
}) {
  const bullets = resume.experienceBullets.split('\n').map((item) => item.trim()).filter(Boolean)
  const skills = resume.skills.split(',').map((item) => item.trim()).filter(Boolean)
  const removedSummary = '8 years building and shipping fintech, AI, and crypto products across Africa. Portfolio of 12 live apps spanning payment infrastructure, wealth management, and AI tools.'
  const removedBullets = [
    'Scaled platform from 0 to 300 active users, driving 60K in transaction volume over 2 years.',
    'Launched merchant payment links and APIs, increasing transactions 30 within 90 days.',
  ]

  return (
    <article className="min-h-[1056px] w-[816px] border border-slate-100 bg-white px-16 py-12 font-serif text-[13px] leading-5 text-slate-950">
      <header className="text-center">
        <h1 className="text-2xl font-bold uppercase tracking-normal">{`${resume.firstName} ${resume.lastName}`}</h1>
        <p className="mt-1 text-sm text-[#149cf2] underline">{resume.email} <span className="mx-2 text-slate-700 no-underline">|</span> {resume.city}</p>
      </header>

      <section className="mt-8">
        <h2 className="border-b-2 border-slate-800 pb-1 text-base font-bold uppercase">Professional Summary</h2>
        <p className="mt-3 italic">
          <span className="bg-red-100 text-red-700 line-through decoration-red-700">{removedSummary}</span>{' '}
          <span className="bg-emerald-100 text-emerald-800">{resume.summary}</span>
        </p>
        <DiffInlineActions
          accepted={acceptedSections.includes('summary')}
          onAccept={() => onAcceptSection?.('summary')}
          onReject={() => onRejectSection?.('summary')}
          onRegenerate={() => onRegenerateSection?.('summary')}
        />
      </section>

      <section className="mt-8">
        <h2 className="border-b-2 border-slate-800 pb-1 text-base font-bold uppercase">Experience</h2>
        <div className="mt-4">
          <div className="flex justify-between gap-4">
            <div>
              <p className="font-bold"><span className="bg-red-100 text-red-700 line-through">Lightforth</span><span className="bg-emerald-100 text-emerald-800">DeeXoptions</span></p>
              <p className="italic"><span className="bg-red-100 text-red-700 line-through">Product Manager</span> <span className="bg-emerald-100 text-emerald-800">Head of Product & Design Engineering</span></p>
            </div>
            <span className="text-sm text-slate-500">Jan 2024 - Present</span>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><span className="bg-emerald-100 text-emerald-800">Spearheaded the design and development of multiple tech products, achieving a 25% increase in user engagement.</span></li>
            {bullets.slice(0, 4).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
          <DiffInlineActions
            accepted={acceptedSections.includes('experience-1')}
            onAccept={() => onAcceptSection?.('experience-1')}
            onReject={() => onRejectSection?.('experience-1')}
            onRegenerate={() => onRegenerateSection?.('experience-1')}
          />
        </div>

        <div className="mt-8">
          <p className="font-bold"><span className="bg-red-100 text-red-700 line-through">Syarpa</span><span className="bg-emerald-100 text-emerald-800"> Celler (Tampay)</span></p>
          <p className="italic">Product Manager</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><span className="bg-emerald-100 text-emerald-800">Coordinated the redesign of the user experience for a leading digital platform, boosting customer satisfaction by 30%.</span></li>
            <li>Implemented engineering solutions to enhance product features, leading to a 40% increase in functionality efficiency.</li>
            <li>Collaborated with engineering teams to integrate sustainable materials into product design, reducing environmental impact.</li>
            <li>Managed end-to-end product lifecycle with a focus on seamless integration of design and technical components.</li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="font-bold"><span className="bg-red-100 text-red-700 line-through">Givito</span><span className="bg-emerald-100 text-emerald-800"> Syarpa</span></p>
          <p className="italic">Product Manager</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><span className="bg-emerald-100 text-emerald-800">Directed design projects that aligned product features with market demands, increasing market share by 15%.</span></li>
            <li>Guided engineering teams in the development of design prototypes, accelerating the design validation process by 25%.</li>
            <li>Conducted design workshops that stimulated innovative thinking and collaborative problem-solving.</li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="font-bold"><span className="bg-red-100 text-red-700 line-through">Nazza</span></p>
          <p className="italic"><span className="bg-red-100 text-red-700 line-through">Product Manager</span></p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {removedBullets.map((item) => <li key={item}><span className="bg-red-100 text-red-700 line-through">{item}</span></li>)}
            <li>Designed merchant payment workflows that reduced manual transaction errors.</li>
            <li>Optimized onboarding and wallet creation, boosting sign-up to KYC conversion.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b-2 border-slate-800 pb-1 text-base font-bold uppercase">Education</h2>
        <div className="mt-3 flex justify-between gap-4">
          <div>
            <p className="font-bold">{resume.education}</p>
            <p>{resume.school}</p>
          </div>
          <p className="text-sm text-slate-500">2023-01-01</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="border-b-2 border-slate-800 pb-1 text-base font-bold uppercase">Skills</h2>
        <div className="mt-3 grid grid-cols-2 gap-x-10 gap-y-1">
          {skills.map((skill) => <p key={skill}>{skill}</p>)}
        </div>
      </section>
    </article>
  )
}

// ─── Preview screen ───────────────────────────────────────────────────────────

function PreviewScreen({
  setScreen,
  resume,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
}) {
  const navigate = useNavigate()
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [acceptedWebSections, setAcceptedWebSections] = useState<string[]>([])
  const [acceptedChanges, setAcceptedChanges] = useState<string[]>([])
  const webSectionIds = ['summary', 'experience-1']
  const mobileChanges = [
    {
      id: 'summary',
      title: 'Professional Summary',
      removed: '8 years building and shipping fintech, AI, and crypto products across Africa.',
      added: resume.summary,
    },
    {
      id: 'role',
      title: 'Experience headline',
      removed: 'Product Manager at Lightforth',
      added: 'Head of Product & Design Engineering at DeeXoptions',
    },
    {
      id: 'impact',
      title: 'Impact bullet',
      removed: 'Managed product work across multiple tools.',
      added: resume.experienceBullets.split('\n').filter(Boolean)[0] ?? 'Spearheaded product delivery with measurable business impact.',
    },
  ]
  const allMobileChangesAccepted = acceptedChanges.length === mobileChanges.length

  function acceptMobileChange(id: string) {
    setAcceptedChanges((current) => current.includes(id) ? current : [...current, id])
  }

  function acceptWebSection(id: string) {
    setAcceptedWebSections((current) => current.includes(id) ? current : [...current, id])
  }

  function rejectWebSection(id: string) {
    setAcceptedWebSections((current) => current.filter((sectionId) => sectionId !== id))
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white font-sans lg:hidden">
        <header className="border-b border-slate-200 bg-white px-4 py-4">
          <div className="grid grid-cols-3 items-center">
            <button onClick={() => setScreen('canvas')} className="flex items-center gap-2 text-base text-slate-600">
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            <h1 className="text-center text-base font-black text-slate-950">{accepted ? 'Review Changes' : 'Review Changes'}</h1>
            <button onClick={() => navigate('/documents')} aria-label="Close preview" className="justify-self-end text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          {accepted ? (
            <>
              <h2 className="text-lg font-black text-slate-950">Resume Ready!</h2>
              <span className="inline-flex items-center gap-2 text-base font-bold text-green-600">
                <CheckCircle2 className="h-5 w-5" /> Saved
              </span>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-black text-slate-950">Review individual changes</h2>
                <p className="mt-1 text-sm text-slate-500">{acceptedChanges.length} of {mobileChanges.length} accepted</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Added</span>
                <span className="inline-flex items-center gap-1 text-red-500"><span className="h-2 w-2 rounded-full bg-red-300" /> Removed</span>
              </div>
            </>
          )}
        </div>
        <main className="flex-1 overflow-y-auto bg-[#eef1f5] px-4 py-5">
          {accepted ? (
            <div className="mx-auto h-[calc(100dvh-13.5rem)] min-h-[480px] max-w-[680px] overflow-hidden rounded-lg bg-white shadow-sm">
              <ResumePaper editable resume={resume} fitViewport />
            </div>
          ) : (
            <div className="space-y-4">
              {mobileChanges.map((change) => {
                const isAccepted = acceptedChanges.includes(change.id)
                return (
                  <section key={change.id} className={cn('rounded-xl border bg-white p-4 shadow-sm', isAccepted ? 'border-emerald-200' : 'border-slate-200')}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-900">{change.title}</h3>
                        {isAccepted && <p className="mt-1 text-sm font-bold text-emerald-600">Accepted</p>}
                      </div>
                      {isAccepted && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
                    </div>
                    <div className="mt-4 space-y-3 text-sm leading-6">
                      <p className="rounded-lg bg-red-50 p-3 text-red-700 line-through decoration-red-700">{change.removed}</p>
                      <p className="rounded-lg bg-emerald-50 p-3 text-emerald-800">{change.added}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-slate-200 text-xs font-bold text-[#149cf2]">
                        <RotateCcw className="h-3.5 w-3.5" /> Regen
                      </button>
                      <button className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                      <button onClick={() => acceptMobileChange(change.id)} className={cn('inline-flex h-10 items-center justify-center gap-1 rounded-lg text-xs font-bold', isAccepted ? 'bg-emerald-100 text-emerald-700' : 'bg-[#149cf2] text-white')}>
                        <Check className="h-3.5 w-3.5" /> {isAccepted ? 'Done' : 'Accept'}
                      </button>
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </main>
        <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-slate-200 bg-white px-4 py-4">
          <button onClick={() => accepted ? navigate('/app') : setScreen('canvas')} className="h-12 rounded-lg border border-slate-200 text-base font-bold text-slate-700">
            {accepted ? 'Dashboard' : 'Back'}
          </button>
          {accepted ? (
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              alignRight
              button={<button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#149cf2] text-base font-bold text-white">Download <Download className="h-5 w-5" /></button>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
          ) : (
            <button
              onClick={() => setAccepted(true)}
              disabled={!allMobileChangesAccepted}
              className={cn('h-12 rounded-lg text-base font-bold text-white', allMobileChangesAccepted ? 'bg-emerald-600' : 'bg-emerald-300')}
            >
              Accept Changes
            </button>
          )}
        </div>
      </div>

      <div className="hidden h-screen flex-col overflow-hidden bg-[#f3f3f4] font-sans lg:flex">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <LightforthLogo to="/app" className="h-8" />
          <div className="flex items-center gap-3">
            <button onClick={() => { setAccepted(false); setAcceptedWebSections([]) }} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-[#149cf2] shadow-sm transition hover:bg-slate-50">
              Regenerate <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => setScreen('canvas')} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
              Reject <X className="h-4 w-4" />
            </button>
            <button onClick={() => { setAcceptedWebSections(webSectionIds); setAccepted(true) }} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#149cf2] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f8add]">
              Accept <Check className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto px-8 py-12">
          <div className="mx-auto w-fit rounded-lg bg-white p-6 shadow-xl">
            {accepted ? (
              <ResumePaper resume={resume} />
            ) : (
              <DiffResumePaper
                resume={resume}
                acceptedSections={acceptedWebSections}
                onAcceptSection={acceptWebSection}
                onRejectSection={rejectWebSection}
                onRegenerateSection={rejectWebSection}
              />
            )}
          </div>
        </main>
        <button
          onClick={() => setScreen('canvas')}
          aria-label="Open chat"
          className="fixed bottom-8 right-8 grid h-16 w-16 place-items-center rounded-full bg-[#123667] text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-[#0f2d57]"
        >
          <MessageSquare className="h-7 w-7" />
        </button>
      </div>
    </>
  )
}

// ─── Upload resume screen ─────────────────────────────────────────────────────

function UploadResumeScreen({ setScreen, skipTemplate }: { setScreen: (screen: BuilderScreen) => void; skipTemplate?: boolean }) {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(f: File) {
    const ok = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (ok && f.size <= 5 * 1024 * 1024) setFile(f)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={() => navigate('/documents')} onClose={() => navigate('/documents')} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-16">
        <div className="w-full max-w-lg">
          <h1 className="lf-page-title text-center">Upload your resume</h1>
          <p className="lf-body mt-2 text-center">
            {skipTemplate
              ? "Upload your existing resume and we'll parse it, then take you straight to the editor."
              : "Upload your existing resume and we'll parse it for you, then let you pick a new template."}
          </p>

          <label
            className={cn(
              'mt-10 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-4 py-12 text-center transition-colors sm:px-8 sm:py-16',
              isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className={cn('grid h-16 w-16 place-items-center rounded-2xl', file ? 'bg-emerald-100' : 'bg-primary/10')}>
              {file
                ? <Check className="h-8 w-8 text-emerald-600" />
                : <Upload className="h-8 w-8 text-primary" />
              }
            </div>

            {file ? (
              <>
                <p className="text-base font-bold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · ready to import</p>
                <button
                  onClick={(e) => { e.preventDefault(); setFile(null) }}
                  className="text-sm font-semibold text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-base font-semibold text-foreground">Drag & drop your resume here</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <p className="text-xs text-muted-foreground">PDF or DOCX · Max 5 MB</p>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </label>

          <PrimaryButton
            onClick={() => file && setScreen(skipTemplate ? 'canvas' : 'template')}
            className={cn('mt-8 w-full', !file && 'cursor-not-allowed bg-primary/35 hover:bg-primary/35')}
          >
            {skipTemplate ? 'Open Editor' : 'Continue — Choose Template'}
          </PrimaryButton>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Your resume is parsed locally and never stored without your permission.
          </p>
        </div>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Template selection screen ────────────────────────────────────────────────

function TemplateSelectScreen({
  setScreen,
  templateId,
  setTemplateId,
  nextScreen,
}: {
  setScreen: (screen: BuilderScreen) => void
  templateId: string
  setTemplateId: (id: string) => void
  nextScreen: BuilderScreen
}) {
  const navigate = useNavigate()
  const selectedTemplate = TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0]
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950 lg:h-screen lg:overflow-hidden">
      <CreateResumeTopbar onBack={() => navigate(-1)} onClose={() => navigate('/documents')} />
      <main className="grid min-h-0 flex-1 bg-white md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,560px)_1fr]">
        <CreateResumeSteps active="template" />
        <section className="min-h-0 overflow-y-auto border-border px-4 py-7 pb-28 sm:px-6 md:border-r md:py-8 lg:pb-8">
          <h1 className="text-2xl font-bold leading-tight text-foreground md:text-xl">Choose a resume template</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Select a professionally designed template. All templates are ATS-optimized.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {TEMPLATES.slice(0, 8).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplateId(tmpl.id)}
                className={cn(
                  'group overflow-hidden rounded-lg border bg-white text-left transition hover:border-primary/70',
                  templateId === tmpl.id ? 'border-primary ring-2 ring-primary/15' : 'border-border',
                )}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted md:h-56 md:aspect-auto">
                  <img src={tmpl.src} alt={tmpl.name} className="h-full w-full object-cover object-top" />
                  {templateId === tmpl.id && (
                    <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-green-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-3">
                  <p className={cn('text-sm font-bold', templateId === tmpl.id ? 'text-primary' : 'text-foreground')}>{tmpl.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">Clean ATS-friendly resume layout for professional applications.</p>
                </div>
              </button>
            ))}
          </div>
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-4 py-3 shadow-[0_-10px_25px_rgba(15,23,42,0.08)] backdrop-blur md:left-[220px] lg:sticky lg:bottom-0 lg:left-auto lg:mt-6 lg:px-0 lg:pt-4 lg:shadow-none lg:backdrop-blur-none">
            <p className="mb-2 text-center text-xs text-muted-foreground"><b className="text-foreground">{selectedTemplate.name}</b> selected</p>
            <PrimaryButton onClick={() => setScreen(nextScreen)} className="w-full">
              {nextScreen === 'canvas' ? 'Open Editor' : 'Proceed'}
            </PrimaryButton>
          </div>
        </section>
        <section className="hidden min-h-0 flex-col bg-slate-50 lg:flex">
          <div className="border-b border-border bg-white px-6 py-4">
            <h2 className="text-base font-bold text-foreground">Template Preview</h2>
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-hidden p-8">
            <div className="h-full max-h-[calc(100vh-10rem)] w-[560px] rounded-md bg-white p-4 shadow-lg">
              <img src={selectedTemplate.src} alt={`${selectedTemplate.name} preview`} className="h-full w-full object-contain object-top" />
            </div>
          </div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Job title screen ─────────────────────────────────────────────────────────

function JobTitleScreen({
  setScreen,
  resume,
  setResume,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
}) {
  const navigate = useNavigate()
  const popularTitles = ['Software Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'Marketing Manager']
  const canStart = resume.title.trim().length > 0 && resume.title !== 'Position'

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={() => setScreen('template')} onClose={() => navigate('/documents')} />
      <main className="grid flex-1 bg-white md:grid-cols-[220px_minmax(0,1fr)]">
        <CreateResumeSteps active="jobTitle" />
        <section className="px-6 py-14">
          <div className="mx-auto max-w-xl">
            <h1 className="text-2xl font-bold text-foreground">What position are you applying for?</h1>
            <p className="mt-4 text-sm leading-6 text-foreground">
              Enter the job title you're targeting. This will be used to personalize your resume and help you stand out to employers.
              <span className="font-semibold text-primary"> This field is required.</span>
            </p>
            <div className="mt-8 rounded-lg bg-muted p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Job Title</span>
                <input
                  value={resume.title === 'Position' ? '' : resume.title}
                  onChange={(event) => updateResumeField(setResume, 'title', event.target.value)}
                  placeholder="Ex. Product Designer, Software Engineer"
                  className="lf-input h-11 bg-white"
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Popular titles:</span>
                {popularTitles.map((title) => (
                  <button
                    key={title}
                    onClick={() => updateResumeField(setResume, 'title', title)}
                    className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
            <PrimaryButton
              onClick={() => canStart && setScreen('summary')}
              className={cn('mt-8 w-full', !canStart && 'cursor-not-allowed bg-primary/35 hover:bg-primary/35')}
            >
              Start Building
            </PrimaryButton>
          </div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') ?? 'scratch'
  // resume: upload → template → canvas
  // tailor: template → canvas (dashboard already has an uploaded resume)
  // scratch: template → jobTitle → summary → … → canvas
  const [screen, setScreen] = useState<BuilderScreen>(mode === 'resume' ? 'upload' : mode === 'tailor' ? 'canvas' : 'template')
  const [resume, setResume] = useState<ResumeData>(initialResumeData)
  const [templateId, setTemplateId] = useState<string>('t01')
  const [jobDescription, setJobDescription] = useState(initialJobDescription)

  const nextScreenAfterTemplate: BuilderScreen = mode === 'resume' || mode === 'tailor' ? 'canvas' : 'jobTitle'

  if (screen === 'upload') return <UploadResumeScreen setScreen={setScreen} skipTemplate={mode === 'resume'} />
  if (screen === 'template') return <TemplateSelectScreen setScreen={setScreen} templateId={templateId} setTemplateId={setTemplateId} nextScreen={nextScreenAfterTemplate} />
  if (screen === 'jobTitle') return <JobTitleScreen setScreen={setScreen} resume={resume} setResume={setResume} />
  if (screen === 'canvas') return <CanvasScreen setScreen={setScreen} resume={resume} setResume={setResume} templateId={templateId} setTemplateId={setTemplateId} jobDescription={jobDescription} setJobDescription={setJobDescription} />
  if (screen === 'ats') return <ATSScreen setScreen={setScreen} resume={resume} setResume={setResume} jobDescription={jobDescription} />
  if (screen === 'preview') return <PreviewScreen setScreen={setScreen} resume={resume} />
  if (screen === 'experienceList') return <ExperienceList setScreen={setScreen} />
  if (screen === 'experienceForm') return <ExperienceForm setScreen={setScreen} />
  if (screen === 'educationList') return <EducationList setScreen={setScreen} />
  if (screen === 'educationForm') return <EducationForm setScreen={setScreen} />
  if (screen === 'skills') return <SkillsStep setScreen={setScreen} />
  if (screen === 'contact') return <ContactStep setScreen={setScreen} />
  if (screen === 'language') return <LanguageStep setScreen={setScreen} />
  return <SummaryStep setScreen={setScreen} />
}
