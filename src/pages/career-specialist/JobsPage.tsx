import { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAREER_JOBS, type CareerJob } from '@/data/mockCareerJobs'
import { MOCK_STUDENTS, STUDENT_QUOTA } from '@/data/mockStudents'

function matchPercent(studentId: string, jobId: string): number {
  return ((parseInt(studentId) * 7 + parseInt(jobId) * 13) % 30) + 65
}

const LOCATIONS   = ['All Locations', 'New York, NY', 'London, UK', 'San Francisco, CA', 'Chicago, IL', 'Boston, MA', 'Remote', 'Redmond, WA', 'Menlo Park, CA', 'Washington, DC', 'Miami, FL', 'Atlanta, GA']
const SALARY_OPTS = [
  { label: 'Any Salary',  min: 0      },
  { label: '$60k+',       min: 60000  },
  { label: '$80k+',       min: 80000  },
  { label: '$100k+',      min: 100000 },
  { label: '$120k+',      min: 120000 },
  { label: '$150k+',      min: 150000 },
]
const TYPES      = ['All Types',   'Full-time', 'Part-time', 'Contract'] as const
const SENIORITIES = ['All Levels', 'Mid',        'Senior',    'Lead',    'Manager', 'Director'] as const

export default function JobsPage() {
  const [search,    setSearch]    = useState('')
  const [location,  setLocation]  = useState('All Locations')
  const [salaryIdx, setSalaryIdx] = useState(0)
  const [type,      setType]      = useState('All Types')
  const [seniority, setSeniority] = useState('All Levels')
  const [selected,  setSelected]  = useState<CareerJob | null>(null)
  const [modal,     setModal]     = useState(false)
  const [success,   setSuccess]   = useState<{ jobTitle: string; count: number } | null>(null)

  const filtered = useMemo(() => {
    const q       = search.toLowerCase()
    const minSal  = SALARY_OPTS[salaryIdx].min
    return CAREER_JOBS.filter(j =>
      (!q            || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) &&
      (location === 'All Locations' || j.location === location) &&
      (minSal === 0  || j.salaryMin >= minSal) &&
      (type === 'All Types'   || j.type      === type) &&
      (seniority === 'All Levels' || j.seniority === seniority)
    )
  }, [search, location, salaryIdx, type, seniority])

  const handleApplyDone = (count: number) => {
    if (!selected) return
    setSuccess({ jobTitle: selected.title, count })
    setModal(false)
  }

  return (
    <div className="p-8">
      <div>
        <div className="mb-5">
          <h1 className="lf-page-title">Jobs</h1>
          <p className="lf-body mt-1">Find roles and apply them to your students.</p>
        </div>

        <div className="grid grid-cols-[380px_1fr] gap-6 items-start">
          {/* ── Left: search + list ── */}
          <div className="lf-panel p-4 space-y-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs or companies…"
              className="lf-input"
            />
            <div className="grid grid-cols-2 gap-2">
              <select value={location}   onChange={e => setLocation(e.target.value)}       className="lf-select">
                {LOCATIONS.map(l   => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={salaryIdx}  onChange={e => setSalaryIdx(Number(e.target.value))} className="lf-select">
                {SALARY_OPTS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
              <select value={type}       onChange={e => setType(e.target.value)}            className="lf-select">
                {TYPES.map(t       => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={seniority}  onChange={e => setSeniority(e.target.value)}       className="lf-select">
                {SENIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <p className="text-xs text-muted-foreground">{filtered.length} role{filtered.length !== 1 ? 's' : ''}</p>

            <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No jobs match your filters.</p>
              ) : filtered.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selected?.id === job.id}
                  onClick={() => { setSelected(job); setSuccess(null) }}
                />
              ))}
            </div>
          </div>

          {/* ── Right: detail panel ── */}
          <div className="sticky top-6">
            {!selected ? (
              <div className="lf-panel flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-medium text-foreground">No job selected</p>
                <p className="lf-body text-xs mt-1">Click a job from the list to view details.</p>
              </div>
            ) : (
              <div className="lf-panel p-6 space-y-5">
                {/* Success banner */}
                {success && (
                  <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">
                      Applied <span className="font-medium">{success.jobTitle}</span> to {success.count} student{success.count !== 1 ? 's' : ''}. Auto-apply will begin shortly.
                    </p>
                    <button onClick={() => setSuccess(null)} className="shrink-0 text-emerald-500 hover:text-emerald-700">
                      <X size={15} />
                    </button>
                  </div>
                )}

                {/* Job header */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ background: selected.logoColor }}
                  >
                    {selected.company[0]}
                  </div>
                  <div>
                    <h2 className="lf-page-title leading-tight">{selected.title}</h2>
                    <p className="lf-body">{selected.company} · {selected.location}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">{selected.salary}</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">{selected.type}</span>
                  <SeniorityPill seniority={selected.seniority} />
                  <span className="ml-auto text-xs text-muted-foreground self-center">Posted {selected.posted}</span>
                </div>

                {/* Description */}
                <div>
                  <p className="lf-card-title mb-1.5">About the role</p>
                  <p className="lf-body leading-relaxed">{selected.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <p className="lf-card-title mb-1.5">Requirements</p>
                  <ul className="space-y-1.5">
                    {selected.requirements.map(req => (
                      <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply button */}
                <button
                  onClick={() => setModal(true)}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Apply for Students →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student picker modal */}
      {modal && selected && (
        <StudentPickerModal
          job={selected}
          onClose={() => setModal(false)}
          onApply={handleApplyDone}
        />
      )}
    </div>
  )
}

/* ── Job Card ── */

function jobMatchScore(jobId: string): number {
  return ((parseInt(jobId) * 11 + 37) % 30) + 65
}

function MatchBadge({ score }: { score: number }) {
  const cls = score >= 90
    ? 'bg-green-100 text-green-700'
    : score >= 80
    ? 'bg-primary/10 text-primary'
    : 'bg-muted text-muted-foreground'
  return (
    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold', cls)}>
      {score}%
    </span>
  )
}

function JobCard({ job, isSelected, onClick }: { job: CareerJob; isSelected: boolean; onClick: () => void }) {
  const match = jobMatchScore(job.id)
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/5',
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-white'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ background: job.logoColor }}
        >
          {job.company[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs text-muted-foreground">{job.company}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <MatchBadge score={match} />
              <SeniorityPill seniority={job.seniority} small />
            </div>
          </div>
          <p className="mt-0.5 truncate text-sm font-medium text-foreground">{job.title}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-muted-foreground">{job.location} · {job.salary} · {job.type}</p>
            <p className="shrink-0 text-xs text-muted-foreground">{job.posted}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

/* ── Seniority pill ── */

const SENIORITY_COLORS: Record<CareerJob['seniority'], string> = {
  Mid:      'bg-muted text-muted-foreground',
  Senior:   'bg-blue-50 text-blue-700',
  Lead:     'bg-violet-50 text-violet-700',
  Manager:  'bg-amber-50 text-amber-700',
  Director: 'bg-primary/10 text-primary',
}

function SeniorityPill({ seniority, small }: { seniority: CareerJob['seniority']; small?: boolean }) {
  return (
    <span className={cn('shrink-0 rounded-full px-2 py-0.5 font-medium', SENIORITY_COLORS[seniority], small ? 'text-[10px]' : 'text-xs')}>
      {seniority}
    </span>
  )
}

/* ── Student Picker Modal ── */

function StudentPickerModal({ job, onClose, onApply }: { job: CareerJob; onClose: () => void; onApply: (count: number) => void }) {
  const [search,  setSearch]  = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const students = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_STUDENTS
      .filter(s => !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q))
      .map(s => ({ ...s, match: matchPercent(s.id, job.id) }))
      .sort((a, b) => b.match - a.match)
  }, [search, job.id])

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleApply = () => onApply(checked.size)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="lf-panel w-full max-w-lg p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="lf-card-title">Apply for Students</p>
            <p className="lf-body text-xs mt-0.5">{job.title} · {job.company}</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search students…"
          className="lf-input"
        />

        {/* Student list */}
        <div className="max-h-72 space-y-1 overflow-y-auto pr-0.5">
          {students.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No students found.</p>
          ) : students.map(s => {
            const matchPct = s.match
            const matchCls = matchPct >= 85 ? 'bg-emerald-50 text-emerald-700' : matchPct >= 75 ? 'bg-amber-50 text-amber-700' : 'bg-muted text-muted-foreground'
            const isChecked = checked.has(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                  isChecked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'
                )}
              >
                {/* Checkbox */}
                <span className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-[10px] font-bold transition-colors',
                  isChecked ? 'border-primary bg-primary text-white' : 'border-border'
                )}>
                  {isChecked ? '✓' : ''}
                </span>

                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {s.initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.role} · {s.location}</p>
                </div>

                {/* Match % + quota */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', matchCls)}>
                    {matchPct}% match
                  </span>
                  <span className="text-[11px] text-muted-foreground">{s.appliedCount}/{STUDENT_QUOTA} applied</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border pt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={checked.size === 0}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply for {checked.size > 0 ? checked.size : ''} student{checked.size !== 1 ? 's' : ''} →
          </button>
        </div>
      </div>
    </div>
  )
}
