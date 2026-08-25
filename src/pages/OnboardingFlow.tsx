import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Upload, FileText, Search, ChevronRight, MapPin, Briefcase, Zap, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'

// ─── Data ─────────────────────────────────────────────────────────────────────

const JOB_CATEGORIES: Record<string, string[]> = {
  'Software / AI': [
    'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer',
    'AI / ML Engineer', 'Data Scientist', 'Data Engineer',
    'DevOps Engineer', 'Security Engineer', 'Mobile Developer',
  ],
  'Product': [
    'Product Manager', 'Technical Product Manager', 'AI Product Manager',
    'Product Analyst', 'Product Manager, B2B/SaaS',
  ],
  'Design': [
    'UX Designer', 'Product Designer', 'UI Designer',
    'Design Manager', 'Graphic Designer',
  ],
  'Marketing': [
    'Marketing Manager', 'Growth Manager', 'Product Marketing Manager',
    'Content Strategist', 'SEO Specialist',
  ],
  'Finance': [
    'Financial Analyst', 'Investment Banker', 'Portfolio Manager',
    'Risk Analyst', 'Controller',
  ],
  'Consulting': [
    'Management Consultant', 'Business Analyst', 'Strategy Consultant',
    'IT Consultant', 'Operations Consultant',
  ],
  'Sales': [
    'Account Executive', 'Sales Manager', 'Business Development Manager',
    'Enterprise Sales',
  ],
  'Healthcare': [
    'Healthcare Data Analyst', 'Healthcare IT Specialist',
    'Clinical Operations Manager',
  ],
  'Human Resource': [
    'HR Manager', 'Recruiter', 'Talent Acquisition Specialist',
    'HR Business Partner',
  ],
}

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingStep = 'roles' | 'location' | 'resume' | 'matching' | 'welcome'

interface OnboardingData {
  jobFunctions: string[]
  employmentTypes: string[]
  experienceLevel: string
  locationTypes: string[]
  location: string
  openToRelocate: boolean
  needsSponsorship: boolean
  resumeFile: File | null
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_KEYS: OnboardingStep[] = ['roles', 'location', 'resume']

const STEP_META: Record<'roles' | 'location' | 'resume', {
  number: number
  label: string
  heading: string
  sub: string
  Icon: React.FC<{ className?: string }>
}> = {
  roles: {
    number: 1,
    label: 'Target Role',
    heading: 'What kind of work excites you?',
    sub: 'Tell us your target role and employment preferences. We\'ll find opportunities that fit your ambitions.',
    Icon: ({ className }) => <Target className={className} />,
  },
  location: {
    number: 2,
    label: 'Location',
    heading: 'Where do you want to work?',
    sub: 'We search across thousands of listings locally and globally to find your ideal location.',
    Icon: ({ className }) => <MapPin className={className} />,
  },
  resume: {
    number: 3,
    label: 'Resume',
    heading: 'Level up your applications.',
    sub: 'Your resume helps Lightforth craft a tailored pitch for every single job — automatically.',
    Icon: ({ className }) => <FileText className={className} />,
  },
}

const PLATFORM_PERKS = [
  { Icon: Zap, label: 'Auto-Apply', desc: 'We apply while you sleep' },
  { Icon: Target, label: 'Match Score', desc: 'See fit before applying' },
  { Icon: Briefcase, label: 'Custom Resume', desc: 'Tailored per role' },
]

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({ step }: { step: 'roles' | 'location' | 'resume' }) {
  const meta = STEP_META[step]
  const { Icon } = meta
  const idx = STEP_KEYS.indexOf(step)

  return (
    <div className="hidden lg:flex w-[440px] shrink-0 flex-col bg-primary px-10 py-10 text-white">
      {/* Logo */}
      <LightforthLogo linked={false} className="mb-12 brightness-0 invert" />

      {/* Step pill */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
        Step {meta.number} of 3
      </div>

      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
        <Icon className="h-6 w-6 text-white" />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold leading-tight text-white">
        {meta.heading}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/70">
        {meta.sub}
      </p>

      {/* Step dots */}
      <div className="mt-8 flex items-center gap-2">
        {STEP_KEYS.map((k, i) => (
          <div
            key={k}
            className={cn(
              'rounded-full transition-all duration-300',
              i === idx ? 'h-2 w-6 bg-white' : i < idx ? 'h-2 w-2 bg-white/60' : 'h-2 w-2 bg-white/25'
            )}
          />
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Platform perks */}
      <div className="space-y-3">
        {PLATFORM_PERKS.map(({ Icon: PIcon, label, desc }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <PIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Step Indicator (right panel top) ────────────────────────────────────────

function StepIndicator({ current }: { current: OnboardingStep }) {
  const idx = STEP_KEYS.indexOf(current)
  if (idx === -1) return null
  return (
    <div className="flex items-start gap-0">
      {STEP_KEYS.map((k, i) => {
        const done = i < idx
        const active = i === idx
        const meta = STEP_META[k as 'roles' | 'location' | 'resume']
        return (
          <div key={k} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                done ? 'bg-primary text-white' : active ? 'bg-primary text-white' : 'border-2 border-border text-muted-foreground'
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'mt-1 text-[11px] font-medium whitespace-nowrap',
                active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {meta.label}
              </span>
            </div>
            {i < STEP_KEYS.length - 1 && (
              <div className={cn('mx-2 mb-4 h-0.5 w-10 shrink-0 sm:mx-3 sm:w-16', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Target Role ──────────────────────────────────────────────────────

function StepRoles({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData
  onChange: (u: Partial<OnboardingData>) => void
  onNext: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categories = Object.keys(JOB_CATEGORIES)

  const filteredCategories = query
    ? categories.filter((cat) =>
        JOB_CATEGORIES[cat].some((r) => r.toLowerCase().includes(query.toLowerCase()))
      )
    : categories

  const visibleRoles = activeCategory
    ? (query
        ? JOB_CATEGORIES[activeCategory]?.filter((r) => r.toLowerCase().includes(query.toLowerCase()))
        : JOB_CATEGORIES[activeCategory]) ?? []
    : query
    ? Object.values(JOB_CATEGORIES).flat().filter((r) => r.toLowerCase().includes(query.toLowerCase()))
    : []

  const toggleRole = (role: string) => {
    const updated = data.jobFunctions.includes(role)
      ? data.jobFunctions.filter((r) => r !== role)
      : [...data.jobFunctions, role]
    onChange({ jobFunctions: updated })
  }

  const toggleType = (val: string) => {
    const updated = data.employmentTypes.includes(val)
      ? data.employmentTypes.filter((v) => v !== val)
      : [...data.employmentTypes, val]
    onChange({ employmentTypes: updated })
  }

  return (
    <div className="space-y-5">
      {/* Selected roles */}
      {data.jobFunctions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.jobFunctions.map((role) => (
            <span key={role} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {role}
              <button onClick={() => toggleRole(role)} className="ml-0.5 hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div>
        <label className="lf-label">Job Function <span className="text-red-500 ml-0.5">*</span></label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveCategory(null) }}
            placeholder="Search roles…"
            className="lf-input pl-9"
          />
        </div>
      </div>

      {/* Category + role picker */}
      <div className="flex rounded-lg border border-border overflow-hidden" style={{ height: '200px' }}>
        <div className="w-40 flex-shrink-0 overflow-y-auto border-r border-border bg-muted/20">
          {filteredCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors',
                activeCategory === cat
                  ? 'bg-primary/5 font-semibold text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <span>{cat}</span>
              <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-40" />
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {(activeCategory || query) ? (
            <>
              {activeCategory && !query && (
                <p className="mb-2 text-xs font-semibold text-foreground">{activeCategory}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {visibleRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      data.jobFunctions.includes(role)
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-foreground hover:border-primary/40'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">Select a category to browse roles</p>
          )}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <label className="lf-label">Employment Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMPLOYMENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.employmentTypes.includes(t)
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="lf-label">Experience Level</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => onChange({ experienceLevel: l })}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.experienceLevel === l
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={data.jobFunctions.length === 0}
          className={cn(
            'rounded-lg px-8 py-2.5 text-sm font-semibold text-white transition-colors',
            data.jobFunctions.length > 0 ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────

function StepLocation({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onChange: (u: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const toggleLocType = (val: string) => {
    const updated = data.locationTypes.includes(val)
      ? data.locationTypes.filter((v) => v !== val)
      : [...data.locationTypes, val]
    onChange({ locationTypes: updated })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="lf-label">Preferred Location <span className="text-red-500 ml-0.5">*</span></label>
        <input
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. United States, New York, Remote"
          className="lf-input mt-1"
        />
      </div>

      <div>
        <label className="lf-label">Job Location Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleLocType(t)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.locationTypes.includes(t)
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={data.openToRelocate}
            onChange={(e) => onChange({ openToRelocate: e.target.checked })}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
          />
          <div>
            <span className="text-sm font-medium text-foreground">Open to relocating</span>
            <p className="text-xs text-muted-foreground">We'll include roles that require relocation</p>
          </div>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={data.needsSponsorship}
            onChange={(e) => onChange({ needsSponsorship: e.target.checked })}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
          />
          <div>
            <span className="text-sm font-medium text-foreground">I require H1B sponsorship</span>
            <p className="text-xs text-muted-foreground">Only show roles from H1B-friendly employers</p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.location.trim()}
          className={cn(
            'rounded-lg px-8 py-2.5 text-sm font-semibold text-white transition-colors',
            data.location.trim() ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Resume Upload ────────────────────────────────────────────────────

function StepResume({
  file,
  onFile,
  onNext,
  onBack,
  onSkip,
}: {
  file: File | null
  onFile: (f: File | null) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f: File) => {
    const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (valid && f.size <= 10 * 1024 * 1024) onFile(f)
  }

  return (
    <div className="space-y-5">
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <FileText className="h-8 w-8 flex-shrink-0 text-green-600" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB — Ready to scan</p>
          </div>
          <Check className="h-5 w-5 flex-shrink-0 rounded-full bg-green-500 p-0.5 text-white" />
          <button onClick={() => onFile(null)}>
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-colors cursor-pointer',
            dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/20'
          )}
          onClick={() => inputRef.current?.click()}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">Drag & drop your resume here</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF or Word · Max 10MB</p>
          <span className="mt-4 rounded-lg border border-primary px-4 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors">
            Browse file
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {file && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          Change resume
        </button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Your resume is only used for job matching and will never be shared with third parties.
      </p>

      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip for now
          </button>
          <button
            onClick={onNext}
            disabled={!file}
            className={cn(
              'rounded-lg px-8 py-2.5 text-sm font-semibold text-white transition-colors',
              file ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
            )}
          >
            Find My Matches →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Matching Screen ──────────────────────────────────────────────────────────

const FEATURE_HIGHLIGHTS = [
  { title: 'Auto-Apply to Hundreds of Jobs', desc: 'AI applies while you focus on what matters most.' },
  { title: 'Custom Resume Per Job', desc: 'Every application gets a tailored, ATS-optimised resume.' },
  { title: 'Match Score for Every Role', desc: 'See exactly how well you fit before applying.' },
]

function MatchingScreen({ onComplete }: { onComplete: () => void }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const prog = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 60)
    const card = setInterval(() => setCardIdx((i) => (i + 1) % FEATURE_HIGHLIGHTS.length), 1800)
    const done = setTimeout(onComplete, 3500)
    return () => { clearInterval(prog); clearInterval(card); clearTimeout(done) }
  }, [onComplete])

  return (
    <div className="flex min-h-screen">
      {/* Left: solid primary */}
      <div className="hidden lg:flex w-[440px] shrink-0 flex-col items-center justify-center bg-primary px-10 py-10 text-white">
        <LightforthLogo linked={false} className="mb-12 brightness-0 invert" />
        <div className="w-full space-y-3">
          {FEATURE_HIGHLIGHTS.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                'rounded-xl p-4 transition-all duration-500',
                i === cardIdx ? 'bg-white/20 scale-[1.02]' : 'bg-white/8'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]', i <= cardIdx ? 'bg-white text-primary font-bold' : 'bg-white/20 text-white/50')}>
                  {i < cardIdx ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <div>
                  <p className={cn('text-sm font-semibold', i === cardIdx ? 'text-white' : 'text-white/60')}>{f.title}</p>
                  {i === cardIdx && <p className="mt-0.5 text-xs text-white/70">{f.desc}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: loading state */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 text-center">
        <LightforthLogo linked={false} className="mb-10 lg:hidden" />

        {/* Spinner ring */}
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full border-4 border-border" />
          <div
            className="absolute inset-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="h-7 w-7 text-primary" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground">Finding your matches</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Scanning thousands of roles based on your skills, location, and preferences…
        </p>

        {/* Progress */}
        <div className="mt-8 w-full max-w-xs">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Welcome Modal ────────────────────────────────────────────────────────────

const EXP_LEVELS = [
  { label: 'Intern / New Grad', sub: '' },
  { label: 'Entry Level', sub: '1–3 years' },
  { label: 'Mid Level', sub: '2–5 years' },
  { label: 'Senior Level', sub: '5+ years' },
  { label: 'Lead / Staff', sub: 'Cross-team leader' },
  { label: 'Director / Executive', sub: 'Director / VP / CXO' },
]

function WelcomeModal({ jobFunctions, onConfirm }: { jobFunctions: string[]; onConfirm: () => void }) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['Senior Level', 'Lead / Staff'])

  const toggle = (label: string) =>
    setSelectedLevels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-primary" />
        <div className="p-6 sm:p-8">
          <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            We found <span className="text-primary">8,777 roles</span> that fit you best.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Take a moment to confirm your experience level so we can rank the best matches first.
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-foreground mb-3">Recommended Experience Levels</p>
            <div className="grid grid-cols-2 gap-2">
              {EXP_LEVELS.map(({ label, sub }) => (
                <button
                  key={label}
                  onClick={() => toggle(label)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors',
                    selectedLevels.includes(label)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <span className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 text-[9px] font-bold transition-colors',
                    selectedLevels.includes(label) ? 'border-primary bg-primary text-white' : 'border-border'
                  )}>
                    {selectedLevels.includes(label) ? '✓' : ''}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{label}</span>
                    {sub && <span className="ml-1 text-muted-foreground">{sub}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {jobFunctions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Your Target Roles</p>
              <div className="flex flex-wrap gap-1.5">
                {jobFunctions.slice(0, 5).map((fn) => (
                  <span key={fn} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Check className="h-3 w-3" /> {fn}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onConfirm}
            className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Confirm & See My Jobs →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('roles')
  const [data, setData] = useState<OnboardingData>({
    jobFunctions: [],
    employmentTypes: ['Full-Time'],
    experienceLevel: 'Senior',
    locationTypes: ['Remote'],
    location: '',
    openToRelocate: false,
    needsSponsorship: false,
    resumeFile: null,
  })

  const update = (u: Partial<OnboardingData>) => setData((d) => ({ ...d, ...u }))

  if (step === 'matching') return <MatchingScreen onComplete={() => setStep('welcome')} />

  if (step === 'welcome') {
    return (
      <WelcomeModal
        jobFunctions={data.jobFunctions}
        onConfirm={() => navigate('/app')}
      />
    )
  }

  const formStep = step as 'roles' | 'location' | 'resume'

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <LeftPanel step={formStep} />

      {/* Right panel */}
      <div className="flex flex-1 flex-col">
        {/* Mobile-only header */}
        <header className="flex h-14 items-center border-b border-border bg-white px-6 lg:hidden">
          <LightforthLogo linked={false} />
        </header>

        {/* Form area */}
        <main className="flex flex-1 flex-col px-6 py-8 sm:px-10 sm:py-10 overflow-y-auto">
          <div className="w-full max-w-lg">
            {/* Step indicator */}
            <div className="mb-6">
              <StepIndicator current={step} />
            </div>

            {/* Step heading (visible on mobile, right panel on desktop) */}
            <div className="mb-6 lg:hidden">
              <h1 className="text-xl font-bold text-foreground">
                {STEP_META[formStep].heading}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {STEP_META[formStep].sub}
              </p>
            </div>

            {/* Form content */}
            {step === 'roles' && (
              <StepRoles data={data} onChange={update} onNext={() => setStep('location')} />
            )}
            {step === 'location' && (
              <StepLocation
                data={data}
                onChange={update}
                onNext={() => setStep('resume')}
                onBack={() => setStep('roles')}
              />
            )}
            {step === 'resume' && (
              <StepResume
                file={data.resumeFile}
                onFile={(f) => update({ resumeFile: f })}
                onNext={() => setStep('matching')}
                onBack={() => setStep('location')}
                onSkip={() => setStep('matching')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
