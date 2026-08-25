import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockStudent } from '@/data/mockStudents'

const JOB_TITLE_SUGGESTIONS = [
  'Compliance Specialist', 'Regulatory Compliance Analyst', 'Compliance Auditor',
  'Governance Analyst', 'Policy and Compliance Analyst', 'Compliance Consultant',
  'Internal Control Analyst', 'Vendor Risk Analyst', 'IT Compliance Analyst',
  'Risk and Compliance Analyst', 'Compliance Analyst', 'Risk Management Analyst',
  'IT Risk Analyst', 'Information Security Risk Analyst', 'Operational Risk Analyst',
  'Risk Management Specialist', 'IT Compliance and Risk Analyst', 'Cyber Risk Analyst',
  'IT Security Analyst', 'Technology Risk Analyst', 'IT Audit Analyst',
  'Cybersecurity Engineer', 'Security Risk Analyst', 'GRC Analyst', 'AML Analyst',
  'Data Privacy Officer', 'Regulatory Affairs Analyst', 'Third Party Risk Manager',
]

const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Principal', 'Staff', 'Manager', 'Director', 'Executive']
const EMPLOYMENT_TYPES  = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES    = ['Onsite', 'Remote', 'Hybrid']

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none', value ? 'bg-gray-900' : 'bg-gray-300')}
    >
      <span className={cn('inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5.5' : 'translate-x-0.5')} />
    </button>
  )
}

interface Props {
  student: MockStudent
  onClose: () => void
}

export default function EditJobPreferencesModal({ student, onClose }: Props) {
  const [titles, setTitles] = useState<string[]>([
    'Compliance Specialist', 'Regulatory Compliance Analyst', 'Compliance Auditor',
    'Governance Analyst', 'Compliance Consultant', 'IT Compliance Analyst',
  ])
  const [titleSearch, setTitleSearch] = useState('')
  const [expLevel,    setExpLevel]    = useState<string[]>(['Mid Level'])
  const [empType,     setEmpType]     = useState<string[]>(['Full-Time'])
  const [locType,     setLocType]     = useState<string[]>(['Remote'])
  const [openToRelocate, setOpenToRelocate] = useState(false)
  const [salaryMin, setSalaryMin] = useState('80000')
  const [salaryMax, setSalaryMax] = useState('200000')
  const [canWorkInPerson,       setCanWorkInPerson]       = useState(true)
  const [canStartImmediately,   setCanStartImmediately]   = useState(false)
  const [reliableTransportation,setReliableTransportation]= useState(true)
  const [requiresAccommodations,setRequiresAccommodations]= useState(false)
  const [howFindJobs, setHowFindJobs] = useState('')

  const titleSuggestions = JOB_TITLE_SUGGESTIONS.filter(t =>
    !titles.includes(t) && t.toLowerCase().includes(titleSearch.toLowerCase())
  )

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[440px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 pt-6 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Job Preferences</h2>
            <p className="mt-0.5 text-sm text-gray-500">Update job preferences for {student.name.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">

          {/* Primary Job Titles */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Primary Job Titles</p>
            <div className="rounded-lg border border-gray-200 p-3">
              {titles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {titles.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-700">
                      {t}
                      <button type="button" onClick={() => setTitles(titles.filter(v => v !== t))} className="ml-0.5 text-gray-400 hover:text-gray-600">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <input
                  value={titleSearch}
                  onChange={e => setTitleSearch(e.target.value)}
                  placeholder="Search and add job titles..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-8 text-sm outline-none focus:border-blue-400"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                {titleSearch && titleSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {titleSuggestions.map(t => (
                      <button key={t} type="button" onClick={() => { setTitles([...titles, t]); setTitleSearch('') }} className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Experience Level</p>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map(lvl => (
                <button key={lvl} type="button" onClick={() => setExpLevel(toggle(expLevel, lvl))}
                  className={cn('rounded-full border px-3 py-1 text-sm transition-colors',
                    expLevel.includes(lvl) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                  {lvl}{expLevel.includes(lvl) && <span className="ml-1 text-blue-500">×</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Employment Type</p>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setEmpType(toggle(empType, t))}
                  className={cn('rounded-full border px-3 py-1 text-sm transition-colors',
                    empType.includes(t) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                  {t}{empType.includes(t) && <span className="ml-1 text-blue-500">×</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Job Location Type */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Job Location Type</p>
            <div className="flex gap-2">
              {LOCATION_TYPES.map(loc => (
                <button key={loc} type="button" onClick={() => setLocType(toggle(locType, loc))}
                  className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors',
                    locType.includes(loc) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                  {loc}{locType.includes(loc) && <span className="ml-1 text-blue-500">×</span>}
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={openToRelocate} onChange={e => setOpenToRelocate(e.target.checked)} className="rounded border-gray-300" />
              Open to relocate
            </label>
          </div>

          {/* Preferred Location */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Preferred Location</p>
            <input placeholder="Search for locations" className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-0.5 text-sm text-gray-700">
                United States
                <button type="button" className="ml-0.5 text-gray-400 hover:text-gray-600">×</button>
              </span>
            </div>
          </div>

          {/* Visa */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Select where you have visa to work at</p>
            <button type="button" className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:border-gray-300">
              United States
            </button>
          </div>

          {/* Salary Expectation */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Salary Expectation</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs text-gray-500">Min</p>
                <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Max</p>
                <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
          </div>

          {/* Work Preferences */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Work Preferences</p>
            <div className="space-y-3">
              {([
                { label: 'Can work in person',                val: canWorkInPerson,        set: setCanWorkInPerson },
                { label: 'Can start immediately',             val: canStartImmediately,    set: setCanStartImmediately,    sub: 'Available within 2 weeks' },
                { label: 'Has reliable transportation',       val: reliableTransportation, set: setReliableTransportation },
                { label: 'Requires workplace accommodations', val: requiresAccommodations, set: setRequiresAccommodations },
              ] as { label: string; val: boolean; set: (v: boolean) => void; sub?: string }[]).map(({ label, val, set, sub }) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-gray-700">{label}</p>
                    {sub && <p className="text-xs text-gray-400">{sub}</p>}
                  </div>
                  <Toggle value={val} onChange={set} />
                </div>
              ))}
            </div>
          </div>

          {/* How find jobs */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">How do you typically find jobs? (Optional)</p>
            <div className="relative">
              <select value={howFindJobs} onChange={e => setHowFindJobs(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option value="">Select source</option>
                <option>LinkedIn</option>
                <option>Indeed</option>
                <option>Referral</option>
                <option>Company website</option>
                <option>Job fair</option>
                <option>Glassdoor</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}
