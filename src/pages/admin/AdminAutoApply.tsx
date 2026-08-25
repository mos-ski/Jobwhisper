import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Settings, Zap, Clock, CheckCircle2, Plus, X, Search, FileText, ChevronDown, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const AUTO_APPLY_STATS = {
  totalApplications: 12847,
  thisMonth: 2341,
  successRate: 78.4,
  avgResponseTime: '2.3s',
  activeJobs: 156,
  platforms: 8,
}

const APPLICATIONS = [
  { id: '1', user: 'Darnell Smith', userInitials: 'DS', company: 'JPMorgan Chase', companyInitials: 'JP', role: 'Software Engineer', location: 'New York, NY', type: 'Full-time', level: 'Senior', status: 'submitted' as const, salary: '$145k – $185k', atsScore: 92, time: '12 min ago', resume: 'Darnell_Smith_Resume.pdf', coverLetter: 'Cover_Letter_JPMorgan.pdf', source: 'LinkedIn' },
  { id: '2', user: 'Jessica Williams', userInitials: 'JW', company: 'Goldman Sachs', companyInitials: 'GS', role: 'Data Analyst', location: 'London, UK', type: 'Full-time', level: 'Mid', status: 'submitted' as const, salary: '£65k – £85k', atsScore: 87, time: '28 min ago', resume: 'Jessica_Williams_Resume.pdf', coverLetter: 'Cover_Letter_Goldman.pdf', source: 'Greenhouse' },
  { id: '3', user: 'Omar Khan', userInitials: 'OK', company: 'Google', companyInitials: 'GO', role: 'Product Manager', location: 'Mountain View, CA', type: 'Full-time', level: 'Senior', status: 'failed' as const, salary: '$160k – $210k', atsScore: 71, time: '45 min ago', resume: 'Omar_Khan_Resume.pdf', coverLetter: '', source: 'Workday', failReason: 'Application form requires manual captcha verification' },
  { id: '4', user: 'Sarah Johnson', userInitials: 'SJ', company: 'Microsoft', companyInitials: 'MS', role: 'UX Designer', location: 'Seattle, WA', type: 'Full-time', level: 'Mid', status: 'submitted' as const, salary: '$120k – $155k', atsScore: 94, time: '1 hr ago', resume: 'Sarah_Johnson_Resume.pdf', coverLetter: 'Cover_Letter_Microsoft.pdf', source: 'LinkedIn' },
  { id: '5', user: 'Carlos Rodriguez', userInitials: 'CR', company: 'Amazon', companyInitials: 'AM', role: 'Cloud Engineer', location: 'Austin, TX', type: 'Full-time', level: 'Senior', status: 'pending' as const, salary: '$135k – $175k', atsScore: 83, time: '1 hr ago', resume: 'Carlos_Rodriguez_Resume.pdf', coverLetter: '', source: 'Lever' },
  { id: '6', user: 'Aisha Davis', userInitials: 'AD', company: 'Meta', companyInitials: 'ME', role: 'Backend Engineer', location: 'Menlo Park, CA', type: 'Full-time', level: 'Senior', status: 'submitted' as const, salary: '$150k – $195k', atsScore: 89, time: '2 hr ago', resume: 'Aisha_Davis_Resume.pdf', coverLetter: 'Cover_Letter_Meta.pdf', source: 'Ashby' },
  { id: '7', user: 'James Brown', userInitials: 'JB', company: 'Apple', companyInitials: 'AP', role: 'iOS Developer', location: 'Cupertino, CA', type: 'Full-time', level: 'Mid', status: 'failed' as const, salary: '$130k – $165k', atsScore: 65, time: '2 hr ago', resume: 'James_Brown_Resume.pdf', coverLetter: '', source: 'LinkedIn', failReason: 'Job posting closed before application could be submitted' },
  { id: '8', user: 'Hannah Lee', userInitials: 'HL', company: 'Netflix', companyInitials: 'NE', role: 'Data Scientist', location: 'Los Angeles, CA', type: 'Full-time', level: 'Senior', status: 'submitted' as const, salary: '$155k – $200k', atsScore: 91, time: '3 hr ago', resume: 'Hannah_Lee_Resume.pdf', coverLetter: 'Cover_Letter_Netflix.pdf', source: 'Greenhouse' },
  { id: '9', user: 'David Martinez', userInitials: 'DM', company: 'Stripe', companyInitials: 'ST', role: 'Full Stack Engineer', location: 'San Francisco, CA', type: 'Full-time', level: 'Senior', status: 'submitted' as const, salary: '$145k – $190k', atsScore: 88, time: '3 hr ago', resume: 'David_Martinez_Resume.pdf', coverLetter: 'Cover_Letter_Stripe.pdf', source: 'LinkedIn' },
  { id: '10', user: 'Priya Patel', userInitials: 'PP', company: 'Shopify', companyInitials: 'SH', role: 'Frontend Engineer', location: 'Toronto, Canada', type: 'Full-time', level: 'Mid', status: 'pending' as const, salary: 'CAD $110k – $140k', atsScore: 80, time: '4 hr ago', resume: 'Priya_Patel_Resume.pdf', coverLetter: '', source: 'Workday' },
]

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  submitted: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Applied' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  failed: { bg: 'bg-red-50', text: 'text-red-600', label: 'Failed' },
}

const JOB_BOARDS = [
  { name: 'LinkedIn', status: 'connected', apps: 4521, successRate: 82 },
  { name: 'Greenhouse', status: 'connected', apps: 3200, successRate: 85 },
  { name: 'Workday', status: 'connected', apps: 2100, successRate: 79 },
  { name: 'Lever', status: 'connected', apps: 1800, successRate: 76 },
  { name: 'Ashby', status: 'limited', apps: 650, successRate: 72 },
  { name: 'BambooHR', status: 'connected', apps: 576, successRate: 81 },
]

const BOARD_STATUS: Record<string, string> = {
  connected: 'bg-emerald-50 text-emerald-700',
  limited: 'bg-amber-50 text-amber-700',
  down: 'bg-red-50 text-red-600',
}

function AtsBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-50 text-emerald-700' : score >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', color)}>
      ATS {score}
    </span>
  )
}

function NewApplicationModal({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [source, setSource] = useState('LinkedIn')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !role) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">New Auto-Apply</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">User <span className="text-red-500">*</span></label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="e.g. Darnell Smith" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Target Role <span className="text-red-500">*</span></label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Job Board</label>
            <select value={source} onChange={e => setSource(e.target.value)} className="lf-select">
              <option>LinkedIn</option>
              <option>Greenhouse</option>
              <option>Workday</option>
              <option>Lever</option>
              <option>Ashby</option>
              <option>BambooHR</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminAutoApply() {
  const [tab, setTab] = useState<'overview' | 'jobs' | 'settings'>('overview')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showNewApp, setShowNewApp] = useState(false)

  const filtered = APPLICATIONS.filter(a =>
    `${a.user} ${a.company} ${a.role}`.toLowerCase().includes(search.toLowerCase())
  )

  const selected = APPLICATIONS.find(a => a.id === selectedId) || null

  return (
    <div className="space-y-6">
      {showNewApp && <NewApplicationModal onClose={() => setShowNewApp(false)} />}
      <AdminPageHeader
        title="Auto-Apply"
        subtitle="Automated job application engine — monitor performance and configuration"
        actions={[{ label: 'New Application', icon: Plus, onClick: () => setShowNewApp(true) }]}
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'jobs', label: 'Job Boards' }, { key: 'settings', label: 'Settings' }]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[
              { label: 'Total Applications', value: AUTO_APPLY_STATS.totalApplications.toLocaleString(), icon: Zap, change: '+18.2%' },
              { label: 'This Month', value: AUTO_APPLY_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+12.5%' },
              { label: 'Success Rate', value: `${AUTO_APPLY_STATS.successRate}%`, icon: CheckCircle2, change: '+3.1%' },
              { label: 'Avg Response Time', value: AUTO_APPLY_STATS.avgResponseTime, icon: Clock, change: '-0.4s' },
              { label: 'Active Job Listings', value: String(AUTO_APPLY_STATS.activeJobs), icon: Zap, change: '+24' },
              { label: 'Connected Platforms', value: String(AUTO_APPLY_STATS.platforms), icon: Settings, change: '+1' },
            ].map(({ label, value, icon: Icon, change }) => (
              <div key={label} className="lf-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </span>
              </div>
            ))}
          </div>

          {/* Applications list + detail panel */}
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by user, company, or role..."
                  className="lf-input pl-9"
                />
              </div>

              {/* Application list */}
              <div className="lf-panel">
                <div className="divide-y divide-border/60">
                  {filtered.map(app => {
                    const st = STATUS_CONFIG[app.status]
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedId(selectedId === app.id ? null : app.id)}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/30',
                          selectedId === app.id && 'bg-primary/5',
                        )}
                      >
                        {/* Company initials */}
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {app.companyInitials}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{app.role}</p>
                            <AtsBadge score={app.atsScore} />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {app.company} · {app.location} · {app.type} · {app.level}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span>{app.salary}</span>
                            <span>{app.source}</span>
                            <span>{app.time}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Applicant: <span className="font-medium text-foreground">{app.user}</span>
                          </p>
                        </div>

                        {/* Status */}
                        <span className={cn('flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', st.bg, st.text)}>
                          {st.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-full flex-shrink-0 rounded-xl border border-border bg-white lg:w-80 lg:sticky lg:top-4 lg:max-h-[calc(100vh-180px)] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border p-4 pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{selected.role}</h3>
                    <p className="text-xs text-muted-foreground">{selected.company} · {selected.location}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="ml-2 flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CONFIG[selected.status].bg, STATUS_CONFIG[selected.status].text)}>
                      {STATUS_CONFIG[selected.status].label}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{selected.salary}</span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{selected.level}</span>
                  </div>

                  {/* Applicant */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground mb-1">Applicant</p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                        {selected.userInitials}
                      </div>
                      <span className="text-xs text-foreground">{selected.user}</span>
                    </div>
                  </div>

                  {/* Job Listing */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-foreground mb-1">Job Listing</p>
                    <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" /> View on {selected.source}
                    </a>
                  </div>

                  {/* Resume Used */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-foreground mb-1">Resume Used</p>
                    <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <FileText className="h-3 w-3" /> {selected.resume}
                    </a>
                  </div>

                  {/* Cover Letter */}
                  {selected.coverLetter && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-foreground mb-1">Cover Letter</p>
                      <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <FileText className="h-3 w-3" /> {selected.coverLetter}
                      </a>
                    </div>
                  )}

                  {/* ATS Score */}
                  <div className="mb-4 rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">ATS Score</p>
                      <span className={cn('text-lg font-bold', selected.atsScore >= 85 ? 'text-emerald-600' : selected.atsScore >= 70 ? 'text-amber-600' : 'text-red-600')}>
                        {selected.atsScore}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', selected.atsScore >= 85 ? 'bg-emerald-500' : selected.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${selected.atsScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Failed reason */}
                  {selected.status === 'failed' && selected.failReason && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-xs font-semibold text-red-700">Why it failed</p>
                      <p className="mt-1 text-xs leading-5 text-red-700">{selected.failReason}</p>
                    </div>
                  )}

                  {/* Activity Log */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground mb-2">Activity Log</p>
                    <div className="space-y-1.5">
                      {(selected.status === 'failed'
                        ? ['Opened job page', 'Filled available fields', 'Uploaded tailored resume', `Blocked: ${selected.failReason}`]
                        : selected.status === 'pending'
                        ? ['Opened job page', 'Filling application form...']
                        : ['Opened job page', 'Filled application form', 'Uploaded tailored resume', 'Submitted application']
                      ).map((step, i, arr) => (
                        <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={cn(
                            'h-1.5 w-1.5 rounded-full flex-shrink-0',
                            selected.status === 'failed' && i === arr.length - 1 ? 'bg-red-500' : 'bg-emerald-500',
                          )} />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  {selected.status === 'failed' && (
                    <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                      Retry Application
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'jobs' && (
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Connected Job Boards</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_BOARDS.map(board => (
              <div key={board.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{board.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${BOARD_STATUS[board.status]}`}>{board.status}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Applications</span><span className="font-medium">{board.apps.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Success Rate</span><span className="font-medium">{board.successRate}%</span></div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${board.successRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Auto-Apply Configuration</p>
          {[
            { label: 'Auto-Apply Enabled', desc: 'Allow users to auto-apply to matching jobs', checked: true },
            { label: 'Stealth Mode', desc: 'Hide application traces from employers', checked: true },
            { label: 'Smart Matching', desc: 'Use AI to match user profile to job requirements', checked: true },
            { label: 'Daily Application Limit', desc: 'Max applications per user per day', value: '50' },
            { label: 'Minimum ATS Score', desc: 'Only apply to jobs with ATS score above threshold', value: '70' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              {'checked' in item ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : (
                <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
