import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_STUDENTS } from '@/data/mockStudents'
import { MOCK_APPLICATIONS } from '@/data/mockApplications'
import EditJobPreferencesModal from './EditJobPreferencesModal'
import EditProfileModal from './EditProfileModal'
import AgentsTab from '@/components/agents/AgentsTab'

type Tab = 'overview' | 'applications' | 'quota' | 'agent'

const STATUS_PILL: Record<string, string> = {
  failed:       'bg-red-100 text-red-700',
  needs_review: 'bg-orange-100 text-orange-700',
  completed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
}

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>('overview')
  const [autoApply, setAutoApply] = useState(true)
  const [dailyQuota, setDailyQuota] = useState(10)
  const [enforceQuota, setEnforceQuota] = useState(true)
  const [jobUrl, setJobUrl] = useState('')
  const [showPrefModal,    setShowPrefModal]    = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const student = MOCK_STUDENTS.find(s => s.id === id)
  if (!student) return (
    <div className="flex items-center justify-center p-16 text-sm text-gray-500">Student not found.</div>
  )

  const applications = MOCK_APPLICATIONS.filter(a => a.studentId === id)
  const dailyApplied = 38
  const weeklyApplied = 38
  const weeklyTarget = 70

  return (
    <div className="p-8 space-y-0">
      <Link to="/career-specialist/students" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide uppercase">{student.name}</h1>
            <p className="text-base font-medium text-gray-600 mt-1">{student.role}, {student.seniority}</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setAutoApply(v => !v)}
            className={cn(
              'inline-flex items-center gap-2.5 rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors',
              autoApply ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-600 bg-white'
            )}
          >
            Auto-apply {autoApply ? 'Running' : 'Paused'}
            <span className={cn(
              'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
              autoApply ? 'bg-green-500' : 'bg-gray-300'
            )}>
              <span className={cn(
                'inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform',
                autoApply ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </span>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <nav className="flex gap-6">
            {(['overview', 'agent', 'applications', 'quota'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'pb-1 text-sm font-medium capitalize transition-colors border-b-2',
                  tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {t === 'agent' ? 'Agent' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <button onClick={() => setShowPrefModal(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
              ✏ Edit Preference
            </button>
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              ✏ Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Overview Tab ── */}
      {tab === 'overview' && (
        <div className="space-y-5 pt-5">
          <Section title="PERFORMANCE">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'AI Auto Applied Jobs',      value: String(applications.length) },
                { label: 'Successfully Submitted Jobs', value: String(applications.filter(a => a.status === 'completed').length) },
                { label: 'Resume Created',             value: '1' },
                { label: 'Errors occurred',            value: String(applications.filter(a => a.status === 'failed').length), link: 'See issues' },
              ].map(({ label, value, link }) => (
                <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-sm text-gray-500">{label}</p>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {link && <button className="text-xs text-blue-600 hover:underline">{link}</button>}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="PROFILE DETAILS">
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="grid grid-cols-9 border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider gap-4">
                {['User ID', 'Phone', 'Gender', 'Birthday', 'Country', 'City', 'Date Created', 'LinkedIn', 'GitHub'].map(h => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              <div className="grid grid-cols-9 px-4 py-3 text-sm text-gray-700 gap-4">
                <span className="text-xs text-gray-400 truncate">usr_{student.id}abc123def</span>
                <span>+1 (555) 010-{String(parseInt(student.id) * 1234).padStart(4, '0')}</span>
                <span>{student.id === '1' || student.id === '3' || student.id === '5' || student.id === '7' ? 'female' : 'male'}</span>
                <span>Not available</span>
                <span>{student.location.includes('London') ? 'United Kingdom' : 'United States'}</span>
                <span>{student.location}</span>
                <span>Jun 2026</span>
                <span><a href="#" className="text-blue-600 hover:underline">View ↗</a></span>
                <span>–</span>
              </div>
            </div>
          </Section>

          <Section title="JOB PREFERENCE">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Job Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {student.preferences.map(p => (
                    <span key={p} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700">{p}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Resume attached</p>
                <div className="rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📄</span>
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{student.name.toLowerCase().replace(' ', '_')}_resume.pdf</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">🖨</button>
                </div>
                <button className="mt-3 w-full rounded-lg border border-gray-200 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Upload New</button>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── Applications Tab ── */}
      {tab === 'applications' && (
        <div className="space-y-5 pt-5">
          <Section title="APPLICATIONS">
            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/30 p-4 mb-4">
              <p className="text-sm font-medium text-blue-700 mb-2">🔗 Apply to a specific job</p>
              <div className="flex gap-2">
                <input
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  placeholder="https://jobs.ashbyhq.com/company/role-id"
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap">
                  + Add Job
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">We'll scrape the job details, tailor the student's resume, and queue the application automatically. 1 credit will be deducted.</p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="relative">
                <input placeholder="Search" className="rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm outline-none focus:border-blue-400 w-48" />
              </div>
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Refresh</button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    {['S/N', 'Title', 'Company', 'Type', 'Source', 'Posted At', 'Date Applied', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 ? (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No applications yet.</td></tr>
                  ) : applications.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{a.jobTitle}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white" style={{ background: a.companyColor }}>
                            {a.company[0]}
                          </div>
                          <Link to={`/career-specialist/applications/${a.id}`} className="text-sm text-blue-600 hover:underline truncate max-w-[120px]">{a.company}</Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{a.source}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.postedAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{a.dateApplied}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_PILL[a.status] ?? 'bg-gray-100 text-gray-700')}>
                          {a.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">···</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}

      {/* ── Agent Tab ── */}
      {tab === 'agent' && (
        <div className="pt-5">
          <AgentsTab studentId={student.id} />
        </div>
      )}

      {/* ── Modals ── */}
      {showPrefModal    && <EditJobPreferencesModal student={student} onClose={() => setShowPrefModal(false)} />}
      {showProfileModal && <EditProfileModal        student={student} onClose={() => setShowProfileModal(false)} />}

      {/* ── Quota Tab ── */}
      {tab === 'quota' && (
        <div className="space-y-5 pt-5">
          <Section title="APPLICATION QUOTA">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Daily Progress</p>
                  <span className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                    dailyApplied >= dailyQuota ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  )}>
                    {dailyApplied >= dailyQuota ? 'Complete' : 'In Progress'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Completed Applications Today</span>
                  <span className="font-semibold text-gray-900">{dailyApplied} / {dailyQuota}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${Math.min((dailyApplied / dailyQuota) * 100, 100)}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
                  <span>Remaining: 0</span>
                  <span>{Math.round((dailyApplied / dailyQuota) * 100)}% completed</span>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Weekly Progress</p>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Completed Applications This Week</span>
                  <span className="font-semibold text-gray-900">{weeklyApplied} / {weeklyTarget}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${Math.round((weeklyApplied / weeklyTarget) * 100)}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
                  <span>Remaining: {weeklyTarget - weeklyApplied}</span>
                  <span>{Math.round((weeklyApplied / weeklyTarget) * 100)}% completed</span>
                </div>
              </div>
            </div>

            {dailyApplied >= dailyQuota && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <span className="h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                Quota Reached – No more applications will be submitted today
              </div>
            )}
          </Section>

          <Section title="QUOTA SETTINGS">
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1.5">Daily Quota</p>
                  <input
                    type="number"
                    value={dailyQuota}
                    onChange={e => setDailyQuota(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Max applications per day (1-100)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1.5">Enforce Quota Mode</p>
                  <button
                    onClick={() => setEnforceQuota(v => !v)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                      enforceQuota ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600'
                    )}
                  >
                    <span className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
                      enforceQuota ? 'bg-green-500' : 'bg-gray-300'
                    )}>
                      <span className={cn('inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform', enforceQuota ? 'translate-x-4' : 'translate-x-0.5')} />
                    </span>
                    {enforceQuota ? 'Enabled' : 'Disabled'}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">When enabled, cron jobs will keep running until daily quota of completed applications is reached</p>
                </div>
              </div>
              <button className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">Save Changes</button>
            </div>
          </Section>

          <div className="rounded-lg border border-gray-200 bg-white px-6 py-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Activity Info</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-500">Last Application</p><p className="font-medium text-gray-900">Jun 12, 2026, 1:30 PM</p></div>
              <div><p className="text-gray-500">Daily Reset</p><p className="font-medium text-gray-900">Jun 12, 2026</p></div>
              <div><p className="text-gray-500">Weekly Reset</p><p className="font-medium text-gray-900">Jun 8, 2026</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gray-200" />
        <p className="text-xs font-semibold tracking-wider text-gray-400">{title}</p>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {children}
    </div>
  )
}
