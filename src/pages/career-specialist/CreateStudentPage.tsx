import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { num: 1, title: 'Upload Resume',    sub: 'Upload your resume to auto-fill details' },
  { num: 2, title: 'Profile details',  sub: 'Personal info & location' },
  { num: 3, title: 'Work Eligibility', sub: 'Visa type & authorization' },
  { num: 4, title: 'Quick Checklist',  sub: 'Preferences, background & DEI' },
  { num: 5, title: 'App Password',     sub: 'Password for job site accounts' },
  { num: 6, title: 'Job Preferences',  sub: 'Select your job preferences' },
]

const JOB_TITLE_SUGGESTIONS = [
  'Compliance Specialist', 'Regulatory Compliance Analyst', 'Compliance Auditor',
  'Governance Analyst', 'Policy and Compliance Analyst', 'Compliance Consultant',
  'Internal Control Analyst', 'Vendor Risk Analyst', 'IT Compliance Analyst',
  'Risk and Compliance Analyst', 'Compliance Analyst', 'Risk Management Analyst',
  'IT Risk Analyst', 'Information Security Risk Analyst', 'Operational Risk Analyst',
  'Risk Management Specialist', 'IT Compliance and Risk Analyst', 'Cyber Risk Analyst',
  'IT Security Analyst', 'Technology Risk Analyst', 'IT Audit Analyst',
  'Cybersecurity Engineer', 'Security Risk Analyst', 'GRC Analyst', 'AML Analyst',
  'Privacy Analyst', 'Regulatory Affairs Analyst', 'Data Privacy Officer',
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors', value ? 'bg-gray-900' : 'bg-gray-300')}
    >
      <span className={cn('inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5.5' : 'translate-x-0.5')} />
    </button>
  )
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        {...props}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
      />
    </div>
  )
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        >
          <option value="">Select...</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-wider text-gray-400 mb-3">{children}</p>
}

export default function CreateStudentPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    gender: '', birthday: '',
    streetAddress: '', city: '', state: '', postalCode: '',
    country: 'United States of America',
  })

  const [workElig, setWorkElig] = useState({
    visaType: '', authorizedUS: true, requiresSponsorship: false,
  })

  const [checklist, setChecklist] = useState({
    locationType: ['Remote'] as string[],
    openToRelocate: false,
    canWorkInPerson: true,
    canStartImmediately: false,
    reliableTransportation: true,
    requiresAccommodations: false,
    howFindJobs: '',
  })

  const [passwords, setPasswords] = useState({
    indeed: '', linkedin: '', glassdoor: '', zipRecruiter: '',
  })

  const [jobPrefs, setJobPrefs] = useState({
    titles: [] as string[],
    titleSearch: '',
    expLevel: ['Mid Level'] as string[],
    empType: ['Full-Time'] as string[],
    salaryMin: '80000',
    salaryMax: '200000',
  })

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setResumeFile(file)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setResumeFile(file)
  }

  const titleSuggestions = JOB_TITLE_SUGGESTIONS.filter(t =>
    !jobPrefs.titles.includes(t) && t.toLowerCase().includes(jobPrefs.titleSearch.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/career-specialist/students" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Create new student</h1>
      </div>

      <div className="flex gap-10">
        {/* ── Stepper ── */}
        <div className="w-64 shrink-0">
          {STEPS.map((s, i) => {
            const isActive = s.num === step
            const isDone = s.num < step
            return (
              <div key={s.num} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold border-2 transition-all',
                    isActive || isDone ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'
                  )}>
                    {isDone ? '✓' : s.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('w-px flex-1 my-1 min-h-[28px]', isDone ? 'bg-blue-600' : 'bg-gray-200')} />
                  )}
                </div>
                <div className="pt-1 pb-6">
                  <p className={cn('text-sm font-medium leading-tight', isActive ? 'text-blue-600' : isDone ? 'text-gray-900' : 'text-gray-400')}>
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Step Content ── */}
        <div className="flex-1 min-w-0">
          {/* ── Step 1: Upload Resume ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
                <p className="text-sm text-gray-500 mt-1">We'll scan the uploaded resume to auto-fill profile details.</p>
              </div>
              <label
                className={cn(
                  'block cursor-pointer rounded-xl border-2 border-dashed p-16 text-center transition-colors',
                  dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                )}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept=".pdf,.png,.jpg" className="sr-only" onChange={handleFileInput} />
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-400 text-blue-500">
                    <Upload className="h-6 w-6" />
                  </div>
                  {resumeFile ? (
                    <>
                      <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                      <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PDF, PNG, JPG (max. 5MB)</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* ── Step 2: Profile Details ── */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>

              <SectionTitle>PERSONAL INFORMATION</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                <Input label="Last Name"  value={profile.lastName}  onChange={e => setProfile(p => ({ ...p, lastName:  e.target.value }))} placeholder="Last name" />
              </div>
              <Input label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select className="rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-blue-400 w-24">
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                    <option>🇳🇬 +234</option>
                  </select>
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 000-0000" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Gender" value={profile.gender} onChange={v => setProfile(p => ({ ...p, gender: v }))} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                <Input label="Birthday" type="date" value={profile.birthday} onChange={e => setProfile(p => ({ ...p, birthday: e.target.value }))} />
              </div>

              <SectionTitle>LOCATION</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Street Address"  value={profile.streetAddress} onChange={e => setProfile(p => ({ ...p, streetAddress: e.target.value }))} placeholder="123 Main St" />
                <Input label="City"            value={profile.city}          onChange={e => setProfile(p => ({ ...p, city:          e.target.value }))} placeholder="City" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="State / Province" value={profile.state}      onChange={e => setProfile(p => ({ ...p, state:      e.target.value }))} placeholder="State" />
                <Input label="Postal Code"      value={profile.postalCode} onChange={e => setProfile(p => ({ ...p, postalCode: e.target.value }))} placeholder="00000" />
              </div>
              <SelectField label="Country" value={profile.country} onChange={v => setProfile(p => ({ ...p, country: v }))} options={['United States of America', 'United Kingdom', 'Canada', 'Nigeria', 'Australia']} />
            </div>
          )}

          {/* ── Step 3: Work Eligibility ── */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Work Eligibility</h2>

              <SelectField
                label="Work Status / Visa Type"
                value={workElig.visaType}
                onChange={v => setWorkElig(e => ({ ...e, visaType: v }))}
                options={['US Citizen', 'Permanent Resident (Green Card)', 'H-1B Visa', 'OPT / CPT', 'TN Visa', 'L-1 Visa', 'Other']}
              />

              <div className="space-y-4">
                {[
                  { label: 'Authorized to work in the US', val: workElig.authorizedUS, key: 'authorizedUS' },
                  { label: 'Requires visa sponsorship',   val: workElig.requiresSponsorship, key: 'requiresSponsorship' },
                ].map(({ label, val, key }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-700">{label}</p>
                    <Toggle value={val} onChange={v => setWorkElig(e => ({ ...e, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Quick Checklist ── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Checklist</h2>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Job Location Type</p>
                <div className="flex gap-2">
                  {['Onsite', 'Remote', 'Hybrid'].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setChecklist(c => ({ ...c, locationType: toggleArr(c.locationType, loc) }))}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm transition-colors',
                        checklist.locationType.includes(loc) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      {loc}{checklist.locationType.includes(loc) && ' ×'}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                  <input type="checkbox" checked={checklist.openToRelocate} onChange={e => setChecklist(c => ({ ...c, openToRelocate: e.target.checked }))} className="rounded border-gray-300" />
                  Open to relocate
                </label>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Work Preferences</p>
                <div className="space-y-3">
                  {([
                    { key: 'canWorkInPerson',        label: 'Can work in person' },
                    { key: 'canStartImmediately',    label: 'Can start immediately', sub: 'Available within 2 weeks' },
                    { key: 'reliableTransportation', label: 'Has reliable transportation' },
                    { key: 'requiresAccommodations', label: 'Requires workplace accommodations' },
                  ] as const).map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm text-gray-700">{label}</p>
                        {sub && <p className="text-xs text-gray-400">{sub}</p>}
                      </div>
                      <Toggle value={checklist[key] as boolean} onChange={v => setChecklist(c => ({ ...c, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How do you typically find jobs? (Optional)</label>
                <div className="relative">
                  <select value={checklist.howFindJobs} onChange={e => setChecklist(c => ({ ...c, howFindJobs: e.target.value }))} className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                    <option value="">Select source</option>
                    <option>LinkedIn</option><option>Indeed</option><option>Referral</option>
                    <option>Company website</option><option>Job fair</option><option>Glassdoor</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: App Password ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">App Password</h2>
                <p className="text-sm text-gray-500 mt-1">Securely store passwords for job site accounts to enable auto-apply.</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                🔒 Passwords are encrypted and only used for automated application submissions.
              </div>
              <div className="space-y-4">
                {[
                  { key: 'indeed',      label: 'Indeed',       placeholder: 'Indeed account password' },
                  { key: 'linkedin',    label: 'LinkedIn',     placeholder: 'LinkedIn account password' },
                  { key: 'glassdoor',   label: 'Glassdoor',    placeholder: 'Glassdoor account password' },
                  { key: 'zipRecruiter',label: 'ZipRecruiter', placeholder: 'ZipRecruiter account password' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="grid grid-cols-[120px_1fr] items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="password"
                      value={passwords[key as keyof typeof passwords]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 6: Job Preferences ── */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Job Preferences</h2>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Primary Job Titles</p>
                <div className="rounded-lg border border-gray-200 p-3 space-y-2">
                  {jobPrefs.titles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {jobPrefs.titles.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-700">
                          {t} <button type="button" onClick={() => setJobPrefs(p => ({ ...p, titles: p.titles.filter(v => v !== t) }))} className="text-gray-400 hover:text-gray-600">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      value={jobPrefs.titleSearch}
                      onChange={e => setJobPrefs(p => ({ ...p, titleSearch: e.target.value }))}
                      placeholder="Search and add job titles..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 pr-8"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                    {jobPrefs.titleSearch && titleSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                        {titleSuggestions.map(t => (
                          <button key={t} type="button" onClick={() => setJobPrefs(p => ({ ...p, titles: [...p.titles, t], titleSearch: '' }))} className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Experience Level</p>
                <div className="flex flex-wrap gap-2">
                  {['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Principal', 'Staff', 'Manager', 'Director', 'Executive'].map(lvl => (
                    <button key={lvl} type="button" onClick={() => setJobPrefs(p => ({ ...p, expLevel: toggleArr(p.expLevel, lvl) }))}
                      className={cn('rounded-full border px-3 py-1 text-sm transition-colors', jobPrefs.expLevel.includes(lvl) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                      {lvl}{jobPrefs.expLevel.includes(lvl) && ' ×'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Employment Type</p>
                <div className="flex flex-wrap gap-2">
                  {['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer'].map(t => (
                    <button key={t} type="button" onClick={() => setJobPrefs(p => ({ ...p, empType: toggleArr(p.empType, t) }))}
                      className={cn('rounded-full border px-3 py-1 text-sm transition-colors', jobPrefs.empType.includes(t) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                      {t}{jobPrefs.empType.includes(t) && ' ×'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Salary Expectation</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min</p>
                    <input type="number" value={jobPrefs.salaryMin} onChange={e => setJobPrefs(p => ({ ...p, salaryMin: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Max</p>
                    <input type="number" value={jobPrefs.salaryMax} onChange={e => setJobPrefs(p => ({ ...p, salaryMax: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <Link to="/career-specialist/students" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
            <div className="flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Back
                </button>
              )}
              {step < 6 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Next
                </button>
              ) : (
                <button type="button" onClick={() => navigate('/career-specialist/students')} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Create Student
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
