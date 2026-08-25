import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, Pencil, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProfileView =
  | { name: 'main' }
  | { name: 'edit-contact' }
  | { name: 'add-section' }
  | { name: 'generate-resume' }
  | { name: 'generated-resume' }
  | { name: 'plans' }

const PLANS = [
  {
    name: 'STARTER',
    price: '₦5,000',
    credits: '15 Credits',
    desc: 'The budget tier to get your job hunt started with the essentials.',
    features: ['15 credits per month', 'Resume builder', 'Cover letter features', 'Download resumes'],
  },
  {
    name: 'PRO',
    price: '₦20,000',
    credits: '50 Credits',
    desc: 'More credits. Unlock our full suite of tools.',
    features: ['50 credits per month', 'All Starter features', 'Auto-apply', 'AI Interview prep', 'Interview Copilot'],
    popular: true,
  },
  {
    name: 'PREMIUM',
    price: '₦50,000',
    credits: '100 Credits',
    desc: 'For power users who apply daily or want maximum automation.',
    features: ['100 credits per month', 'All PRO features', 'Unlimited AI suggestions', 'Unlimited ATS scores', 'Priority support'],
  },
]

const RESUME_SECTIONS = [
  {
    title: 'Experience',
    items: [
      { role: 'Product Designer', company: 'Stripe', period: 'Jan 2024 – Present', detail: 'Design end-to-end payment experiences used by millions.' },
      { role: 'UI/UX Designer', company: 'Freelance', period: 'Jun 2022 – Dec 2023', detail: 'Built web and mobile experiences for 8+ clients.' },
    ],
  },
  {
    title: 'Education',
    items: [
      { degree: 'B.Sc. Product Design', school: 'California College of the Arts', period: '2018 – 2022' },
    ],
  },
  {
    title: 'Skills',
    tags: ['Figma', 'React', 'Prototyping', 'UX Research', 'Design Systems', 'User Testing', 'Wireframing', 'Accessibility'],
  },
]

const AVAILABLE_SECTIONS = ['Projects', 'Certifications', 'Languages', 'Volunteer Work', 'Publications', 'Awards']

export function ProfileScreen() {
  const [view, setView] = useState<ProfileView>({ name: 'main' })

  if (view.name === 'edit-contact') return <EditContactScreen onBack={() => setView({ name: 'main' })} />
  if (view.name === 'add-section') return <AddSectionScreen onBack={() => setView({ name: 'main' })} />
  if (view.name === 'generate-resume') return <GenerateResumeScreen onBack={() => setView({ name: 'main' })} onGenerated={() => setView({ name: 'generated-resume' })} />
  if (view.name === 'generated-resume') return <GeneratedResumeScreen onBack={() => setView({ name: 'main' })} onDone={() => setView({ name: 'main' })} />
  if (view.name === 'plans') return <PlansScreen onBack={() => setView({ name: 'main' })} />

  return <MainProfileScreen onNavigate={setView} />
}

function MainProfileScreen({ onNavigate }: { onNavigate: (v: ProfileView) => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>('Experience')

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-2 pt-4">
        <h1 className="text-xl font-bold text-neutral-900">Profile</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        {/* Compact credit banner */}
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#0c1d48] to-[#1a3a6b] px-4 py-3 text-white shadow-sm">
          <Sparkles size={16} className="shrink-0 text-blue-300" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">2 credits remaining</span>
              <span className="text-[10px] text-white/50">· Resets 30th Jun</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-1/3 rounded-full bg-white" />
            </div>
          </div>
          <button onClick={() => onNavigate({ name: 'plans' })} className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20">
            Get more
          </button>
        </div>

        {/* User card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB] text-lg font-bold text-white">
              DS
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-neutral-900">Darnell Smith</p>
                <button onClick={() => onNavigate({ name: 'edit-contact' })} className="text-neutral-300 hover:text-[#2563EB]">
                  <Pencil size={14} />
                </button>
              </div>
              <p className="text-sm text-neutral-500">Product Designer</p>
              <p className="text-xs text-neutral-400">darnell.smith@email.com</p>
            </div>
          </div>
        </div>

        {/* Generate resume banner */}
        <button onClick={() => onNavigate({ name: 'generate-resume' })} className="flex w-full items-center gap-4 rounded-2xl bg-gradient-to-br from-[#EEF4FF] to-[#E0E7FF] p-5 text-left shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
            <Sparkles size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#2563EB]">Generate a new resume</p>
            <p className="text-xs text-neutral-500">Paste a job description and get an ATS-optimised resume</p>
          </div>
          <ArrowRight size={18} className="flex-shrink-0 text-[#2563EB]" />
        </button>

        {/* Resume file card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-10 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-600">PDF</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">Darnell_Smith_Resume.pdf</p>
              <p className="text-xs text-neutral-400">Uploaded 1st Jun, 2026 · 248 KB</p>
            </div>
            <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600">Open</button>
          </div>
        </div>

        {/* Resume sections */}
        {RESUME_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.title
          return (
            <div key={section.title} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.title)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-semibold text-neutral-900">{section.title}</span>
                <ChevronDown size={16} className={cn('text-neutral-400 transition', isExpanded && 'rotate-180')} />
              </button>
              {isExpanded && (
                <div className="space-y-2 border-t border-neutral-100 px-4 pb-4 pt-3">
                  {'items' in section && section.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900">{item.role || item.degree}</p>
                        <p className="text-xs text-neutral-500">{item.company || item.school}</p>
                        {'detail' in item && <p className="mt-0.5 text-xs text-neutral-400">{item.detail}</p>}
                      </div>
                      <span className="shrink-0 text-xs text-neutral-400">{item.period}</span>
                    </div>
                  ))}
                  {'tags' in section && (
                    <div className="flex flex-wrap gap-1.5">
                      {section.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Add more section */}
        <button onClick={() => onNavigate({ name: 'add-section' })} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-500 transition-colors hover:border-[#2563EB]/40 hover:text-[#2563EB]">
          <Plus size={18} />
          Add more section
        </button>

        {/* Sign out */}
        <button className="w-full rounded-xl border border-red-200 py-3 text-center text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
          Sign out
        </button>
      </div>
    </div>
  )
}

// ─── Edit Contact Screen ──────────────────────────────────────────────────────

function EditContactScreen({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ name: 'Darnell Smith', email: 'darnell.smith@email.com', phone: '+1 (555) 123-4567', linkedin: 'linkedin.com/in/darnell', location: 'San Francisco, CA', title: 'Product Designer' })
  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Edit contact info</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <Field label="Full name" value={form.name} onChange={(v) => update('name', v)} />
        <Field label="Job title" value={form.title} onChange={(v) => update('title', v)} />
        <Field label="Email" value={form.email} onChange={(v) => update('email', v)} keyboard="email" />
        <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} keyboard="tel" />
        <Field label="Location" value={form.location} onChange={(v) => update('location', v)} />
        <Field label="LinkedIn (optional)" value={form.linkedin} onChange={(v) => update('linkedin', v)} />
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button onClick={onBack} className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">Save changes</button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, keyboard }: { label: string; value: string; onChange: (v: string) => void; keyboard?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <input type={keyboard ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB]" />
    </div>
  )
}

// ─── Add Section Screen ───────────────────────────────────────────────────────

function AddSectionScreen({ onBack }: { onBack: () => void }) {
  const [added, setAdded] = useState<string[]>([])
  const toggle = (section: string) => setAdded((p) => p.includes(section) ? p.filter((s) => s !== section) : [...p, section])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Add section</h1>
      </div>
      <div className="flex-1 space-y-2 px-5 pb-4">
        {AVAILABLE_SECTIONS.map((s) => {
          const isAdded = added.includes(s)
          return (
            <button key={s} onClick={() => toggle(s)} className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors', isAdded ? 'border-[#2563EB]/30 bg-[#EEF4FF]' : 'border-neutral-200 bg-white')}>
              <span className={cn('text-sm font-medium', isAdded ? 'text-[#2563EB]' : 'text-neutral-700')}>{s}</span>
              {isAdded ? <Check size={16} className="text-[#2563EB]" /> : <Plus size={16} className="text-neutral-300" />}
            </button>
          )
        })}
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button onClick={onBack} className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">
          {added.length > 0 ? `Add ${added.length} section${added.length > 1 ? 's' : ''}` : 'Done'}
        </button>
      </div>
    </div>
  )
}

// ─── Generate Resume Screen ──────────────────────────────────────────────────

function GenerateResumeScreen({ onBack, onGenerated }: { onBack: () => void; onGenerated: () => void }) {
  const [jd, setJd] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    if (!jd.trim()) return
    setGenerating(true)
    setTimeout(() => { setGenerating(false); onGenerated() }, 2000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Generate resume</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <p className="text-sm text-neutral-500">Paste a job description below and we'll tailor your resume to match it.</p>
        <div>
          <label className="text-sm font-medium text-neutral-700">Job description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={8}
            placeholder="Paste the job description here..."
            className="mt-1 w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400"
          />
          <button onClick={() => setJd('We are looking for a Product Designer with 4+ years of experience in B2B SaaS. You will design end-to-end product experiences, collaborate with engineers and product managers, and contribute to our design system. Strong Figma skills required.')} className="mt-1 text-xs font-medium text-[#2563EB]">
            ✨ Try with sample JD
          </button>
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button
          onClick={handleGenerate}
          disabled={!jd.trim() || generating}
          className={cn('flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-semibold transition-colors', jd.trim() && !generating ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]' : 'bg-neutral-200 text-neutral-400')}
        >
          {generating ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Generating…</>
          ) : (
            <><Sparkles size={16} /> Generate resume</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Generated Resume Screen ─────────────────────────────────────────────────

function GeneratedResumeScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Your new resume</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <Check size={16} /> Resume generated successfully
          </div>
          <p className="mt-1 text-xs text-green-600">Tailored for Product Designer at Stripe</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-12 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">PDF</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">Darnell_Smith_Stripe_Resume.pdf</p>
              <p className="text-xs text-neutral-400">ATS-optimised · 2 pages</p>
            </div>
            <button className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white">
              <Download size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Preview</h2>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="border-b border-neutral-100 pb-3">
              <p className="text-lg font-bold text-neutral-900">Darnell Smith</p>
              <p className="text-sm text-neutral-500">Product Designer</p>
              <p className="text-xs text-neutral-400">darnell.smith@email.com · +1 (555) 123-4567</p>
            </div>
            <div className="mt-3 space-y-3">
              <Section title="Professional Summary" text="Results-driven Product Designer with 6+ years of experience crafting end-to-end product experiences for B2B SaaS platforms. Adept at design systems, user research, and cross-functional collaboration." />
              <Section title="Experience" text="Product Designer at Stripe — Designed complex payment flows used by millions of businesses worldwide, improving checkout completion by 23%." />
              <Section title="Skills" text="Figma, Design Systems, UX Research, Prototyping, React, User Testing, Accessibility, B2B SaaS" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <div className="flex gap-3">
          <button onClick={onDone} className="flex-1 rounded-xl border border-neutral-300 py-3 text-center text-sm font-semibold text-neutral-700">Save</button>
          <button className="flex-1 rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">
            <Download size={14} className="inline mr-1" /> Download
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">{text}</p>
    </div>
  )
}

// ─── Plans Screen ─────────────────────────────────────────────────────────────

function PlansScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState('PRO')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Upgrade plan</h1>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        <p className="text-sm text-neutral-500">Choose a plan that works for you. Upgrade anytime.</p>
        {PLANS.map((plan) => {
          const isSelected = selected === plan.name
          return (
            <button
              key={plan.name}
              onClick={() => setSelected(plan.name)}
              className={cn(
                'w-full rounded-2xl border p-5 text-left transition-all',
                isSelected ? 'border-[#2563EB] bg-[#EEF4FF] shadow-sm' : 'border-neutral-200 bg-white',
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{plan.name}</span>
                    {plan.popular && <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-semibold text-white">Popular</span>}
                  </div>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">
                    {plan.price}<span className="text-sm font-normal text-neutral-400">/mo</span>
                  </p>
                </div>
                <div className={cn('flex h-5 w-5 items-center justify-center rounded-full border', isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-neutral-300')}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
              </div>
              <p className="mt-1 text-xs font-medium text-[#2563EB]">{plan.credits}</p>
              <p className="mt-2 text-xs text-neutral-500">{plan.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
                    <Check size={12} className="text-green-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">
          {selected === 'STARTER' ? 'Downgrade to Starter' : `Upgrade to ${selected}`}
        </button>
      </div>
    </div>
  )
}
