import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockStudent } from '@/data/mockStudents'

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-semibold tracking-wider text-gray-400">{children}</p>
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400'

interface Education {
  school: string; degree: string; field: string; startDate: string; endDate: string
}
interface WorkHistory {
  company: string; role: string; startDate: string; endDate: string; current: boolean; description: string
}

interface Props {
  student: MockStudent
  onClose: () => void
}

export default function EditProfileModal({ student, onClose }: Props) {
  const [firstName,    setFirstName]    = useState(student.name.split(' ')[0] ?? '')
  const [lastName,     setLastName]     = useState(student.name.split(' ').slice(1).join(' ') ?? '')
  const [email,        setEmail]        = useState(`${student.name.toLowerCase().replace(/\s+/g, '.')}@email.com`)
  const [phone,        setPhone]        = useState('+1 (555) 000-0000')
  const [countryCode,  setCountryCode]  = useState('+1')
  const [gender,       setGender]       = useState('Female')
  const [birthday,     setBirthday]     = useState('')
  const [streetAddress,setStreetAddress]= useState('8316 Catalpa Ln')
  const [city,         setCity]         = useState('McKinney')
  const [state,        setState_]       = useState('Texas')
  const [postalCode,   setPostalCode]   = useState('75071')
  const [country,      setCountry]      = useState('United States of America')
  const [linkedin,     setLinkedin]     = useState('https://www.linkedin.com/in/user/')
  const [github,       setGithub]       = useState('')
  const [portfolio,    setPortfolio]    = useState('')
  const [currentSalary,setCurrentSalary]= useState('70000')
  const [visaType,     setVisaType]     = useState('')
  const [authorizedUS, setAuthorizedUS] = useState(true)
  const [requiresSponsorship, setRequiresSponsorship] = useState(false)

  const [education, setEducation] = useState<Education[]>([
    { school: 'Obafemi Awolowo University', degree: 'Bachelor of Science (BSc)', field: 'Computer Science', startDate: '2012-09', endDate: '2016-06' },
  ])
  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([
    { company: 'COMCAST', role: 'Third Party Risk Manager', startDate: '2024-04', endDate: '', current: true, description: 'Escalated critical vendor risk exposures and compliance violations to executive leadership.' },
    { company: 'Accenture Federal Services', role: 'IT Auditor', startDate: '2022-05', endDate: '2024-02', current: false, description: 'Coordinated 15+ IT audit engagements annually for federal-sector clients.' },
    { company: 'USAA', role: 'IT Compliance Analyst', startDate: '2021-07', endDate: '2022-03', current: false, description: 'Assessed compliance with PCI DSS, ISO 27001, and NIST SP 800-53 requirements.' },
    { company: 'CarMax', role: 'IT Auditor', startDate: '2018-05', endDate: '2021-06', current: false, description: 'Spearheaded reviews of privileged access, user provisioning, and segregation of duties.' },
  ])

  const addEducation = () => setEducation(e => [...e, { school: '', degree: '', field: '', startDate: '', endDate: '' }])
  const removeEducation = (i: number) => setEducation(e => e.filter((_, idx) => idx !== i))
  const updateEducation = (i: number, key: keyof Education, val: string) =>
    setEducation(e => e.map((item, idx) => idx === i ? { ...item, [key]: val } : item))

  const addWork = () => setWorkHistory(w => [...w, { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }])
  const removeWork = (i: number) => setWorkHistory(w => w.filter((_, idx) => idx !== i))
  const updateWork = <K extends keyof WorkHistory>(i: number, key: K, val: WorkHistory[K]) =>
    setWorkHistory(w => w.map((item, idx) => idx === i ? { ...item, [key]: val } : item))

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 pt-6 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Profile Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">Update profile information for {student.name.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">

          {/* ── Personal Information ── */}
          <div>
            <SectionTitle>PERSONAL INFORMATION</SectionTitle>
            <div className="space-y-4">
              <FormRow>
                <Field label="First Name">
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} placeholder="First name" />
                </Field>
                <Field label="Last Name">
                  <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} placeholder="Last name" />
                </Field>
              </FormRow>

              <Field label="Email">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="email@example.com" />
              </Field>

              <Field label="Phone Number">
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="w-24 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-blue-400">
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={cn(inputCls, 'flex-1')} placeholder="(555) 000-0000" />
                </div>
              </Field>

              <FormRow>
                <Field label="Gender">
                  <div className="relative">
                    <select value={gender} onChange={e => setGender(e.target.value)} className={cn(inputCls, 'appearance-none pr-7')}>
                      <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                  </div>
                </Field>
                <Field label="Birthday">
                  <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} className={inputCls} />
                </Field>
              </FormRow>
            </div>
          </div>

          {/* ── Location ── */}
          <div>
            <SectionTitle>LOCATION</SectionTitle>
            <div className="space-y-4">
              <FormRow>
                <Field label="Street Address">
                  <input value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className={inputCls} placeholder="123 Main St" />
                </Field>
                <Field label="City">
                  <input value={city} onChange={e => setCity(e.target.value)} className={inputCls} placeholder="City" />
                </Field>
              </FormRow>
              <FormRow>
                <Field label="State / Province">
                  <input value={state} onChange={e => setState_(e.target.value)} className={inputCls} placeholder="State" />
                </Field>
                <Field label="Postal Code">
                  <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputCls} placeholder="00000" />
                </Field>
              </FormRow>
              <Field label="Country">
                <div className="relative">
                  <select value={country} onChange={e => setCountry(e.target.value)} className={cn(inputCls, 'appearance-none pr-7')}>
                    <option>United States of America</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Nigeria</option>
                    <option>Australia</option>
                    <option>India</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
              </Field>
            </div>
          </div>

          {/* ── Professional Links ── */}
          <div>
            <SectionTitle>PROFESSIONAL LINKS</SectionTitle>
            <div className="space-y-4">
              <Field label="LinkedIn URL">
                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} className={inputCls} placeholder="https://linkedin.com/in/username" />
              </Field>
              <Field label="GitHub URL">
                <input value={github} onChange={e => setGithub(e.target.value)} className={inputCls} placeholder="https://github.com/yourusername" />
              </Field>
              <Field label="Portfolio URL">
                <input value={portfolio} onChange={e => setPortfolio(e.target.value)} className={inputCls} placeholder="https://yourportfolio.com" />
              </Field>
            </div>
          </div>

          {/* ── Employment ── */}
          <div>
            <SectionTitle>EMPLOYMENT</SectionTitle>
            <Field label="Current Salary">
              <input type="number" value={currentSalary} onChange={e => setCurrentSalary(e.target.value)} className={inputCls} placeholder="0" />
            </Field>
          </div>

          {/* ── Work Authorization ── */}
          <div>
            <SectionTitle>WORK AUTHORIZATION</SectionTitle>
            <div className="space-y-4">
              <Field label="Work Status / Visa Type">
                <div className="relative">
                  <select value={visaType} onChange={e => setVisaType(e.target.value)} className={cn(inputCls, 'appearance-none pr-7')}>
                    <option value="">Select status</option>
                    <option>US Citizen</option>
                    <option>Permanent Resident (Green Card)</option>
                    <option>H-1B Visa</option>
                    <option>OPT / CPT</option>
                    <option>TN Visa</option>
                    <option>L-1 Visa</option>
                    <option>Other</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
              </Field>
              {[
                { label: 'Authorized to work in the US', val: authorizedUS,         set: setAuthorizedUS },
                { label: 'Requires visa sponsorship',   val: requiresSponsorship,   set: setRequiresSponsorship },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-gray-700">{label}</p>
                  <Toggle value={val} onChange={set} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Education ── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>EDUCATION</SectionTitle>
              <button type="button" onClick={addEducation} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="relative rounded-lg border border-gray-200 p-4 space-y-3">
                  {education.length > 1 && (
                    <button type="button" onClick={() => removeEducation(i)} className="absolute right-3 top-3 text-gray-300 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <FormRow>
                    <Field label="School">
                      <input value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} className={inputCls} placeholder="University name" />
                    </Field>
                    <Field label="Degree">
                      <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className={inputCls} placeholder="e.g. Bachelor of Science" />
                    </Field>
                  </FormRow>
                  <Field label="Field of Study">
                    <input value={edu.field} onChange={e => updateEducation(i, 'field', e.target.value)} className={inputCls} placeholder="e.g. Computer Science" />
                  </Field>
                  <FormRow>
                    <Field label="Start Date">
                      <input type="month" value={edu.startDate} onChange={e => updateEducation(i, 'startDate', e.target.value)} className={inputCls} placeholder="YYYY-MM" />
                    </Field>
                    <Field label="End Date">
                      <input type="month" value={edu.endDate} onChange={e => updateEducation(i, 'endDate', e.target.value)} className={inputCls} placeholder="YYYY-MM" />
                    </Field>
                  </FormRow>
                </div>
              ))}
            </div>
          </div>

          {/* ── Work History ── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>WORK HISTORY</SectionTitle>
              <button type="button" onClick={addWork} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {workHistory.map((job, i) => (
                <div key={i} className="relative rounded-lg border border-gray-200 p-4 space-y-3">
                  {workHistory.length > 1 && (
                    <button type="button" onClick={() => removeWork(i)} className="absolute right-3 top-3 text-gray-300 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <FormRow>
                    <Field label="Company">
                      <input value={job.company} onChange={e => updateWork(i, 'company', e.target.value)} className={inputCls} placeholder="Company name" />
                    </Field>
                    <Field label="Role">
                      <input value={job.role} onChange={e => updateWork(i, 'role', e.target.value)} className={inputCls} placeholder="Job title" />
                    </Field>
                  </FormRow>
                  <FormRow>
                    <Field label="Start Date">
                      <input type="month" value={job.startDate} onChange={e => updateWork(i, 'startDate', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="End Date">
                      <input type="month" value={job.endDate} onChange={e => updateWork(i, 'endDate', e.target.value)} className={inputCls} disabled={job.current} />
                    </Field>
                  </FormRow>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={job.current} onChange={e => updateWork(i, 'current', e.target.checked)} className="rounded border-gray-300" />
                    Currently working here
                  </label>
                  <Field label="Description">
                    <textarea
                      value={job.description}
                      onChange={e => updateWork(i, 'description', e.target.value)}
                      rows={2}
                      className={cn(inputCls, 'resize-none')}
                      placeholder="Brief description of responsibilities..."
                    />
                  </Field>
                </div>
              ))}
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
