import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PreferencesData {
  desiredRole: string
  experienceLevel: string
  salary: string
  locations: string
  employmentTypes: string[]
  locationTypes: string[]
  openToRelocate: boolean
}

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']

export function JobPreferencesScreen({
  data,
  onChange,
  onContinue,
}: {
  data: PreferencesData
  onChange: (d: PreferencesData) => void
  onContinue: () => void
}) {
  const valid = data.desiredRole.trim()

  const toggle = (list: 'employmentTypes' | 'locationTypes', value: string) => {
    const current = data[list]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...data, [list]: updated })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
      <h2 className="text-sm font-semibold text-neutral-900">Job Preferences</h2>
      <p className="mt-0.5 text-xs text-neutral-500">Your job preferences</p>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto pb-2">
        <div>
          <label className="text-xs font-medium text-neutral-700">Desired Role <span className="text-red-500">*</span></label>
          {data.desiredRole ? (
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2">
              <span className="flex items-center gap-1 rounded-full bg-[#EEF4FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                {data.desiredRole}
                <button onClick={() => onChange({ ...data, desiredRole: '' })} className="ml-0.5 text-[#2563EB]/60 hover:text-[#2563EB]">✕</button>
              </span>
            </div>
          ) : (
            <input value={data.desiredRole} onChange={(e) => onChange({ ...data, desiredRole: e.target.value })} placeholder="e.g. Product Designer" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Experience Level</label>
          <div className="mt-1 flex gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button key={level} onClick={() => onChange({ ...data, experienceLevel: level })}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', data.experienceLevel === level ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
              >{level}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Salary Expectation</label>
          <input value={data.salary} onChange={(e) => onChange({ ...data, salary: e.target.value })} placeholder="e.g. $120,000/year" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Preferred Locations</label>
          <div className="relative mt-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={data.locations} onChange={(e) => onChange({ ...data, locations: e.target.value })} placeholder="Search cities or regions…" className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Employment Type</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((t) => (
              <button key={t} onClick={() => toggle('employmentTypes', t)}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', data.employmentTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
              >{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700">Job Location Type</label>
          <div className="mt-1 flex gap-2">
            {LOCATION_TYPES.map((t) => (
              <button key={t} onClick={() => toggle('locationTypes', t)}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', data.locationTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
              >{t}</button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={data.openToRelocate} onChange={(e) => onChange({ ...data, openToRelocate: e.target.checked })} className="h-4 w-4 accent-[#2563EB]" />
          <span className="text-sm text-neutral-700">I am open to relocating</span>
        </label>
      </div>

      <button
        onClick={onContinue}
        disabled={!valid}
        className={cn(
          'w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors',
          valid ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]' : 'bg-neutral-200 text-neutral-400'
        )}
      >
        Continue
      </button>
    </div>
  )
}
