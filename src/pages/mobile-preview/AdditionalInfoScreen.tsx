import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdditionalInfoData {
  race: string
  citizenship: string
  veteran: string
  disability: string
  securityClearance: string
  usWorkAuth: string
  willingToStart: string
  workSchedule: string
  willingToTravel: boolean
  drugTestConsent: boolean
  backgroundCheckConsent: boolean
}

const RACE_OPTIONS = ['Asian', 'Black or African American', 'Hispanic or Latino', 'White', 'Two or more races', 'Prefer not to say']
const VETERAN_OPTIONS = ['Not a Veteran', 'Veteran', 'Active Duty', 'Prefer not to say']
const DISABILITY_OPTIONS = ['No disability', 'Yes, I have a disability', 'Prefer not to say']
const CLEARANCE_OPTIONS = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI']
const WORK_AUTH_OPTIONS = ['US Citizen', 'Green Card Holder', 'H-1B Visa', 'OPT/CPT', 'Other', 'Not Authorized']
const START_OPTIONS = ['Immediately', '2 weeks', '1 month', '2 months', '3+ months']
const SCHEDULE_OPTIONS = ['9-5 / Standard', 'Flexible', 'Nights', 'Weekends', 'Shifts']

export function AdditionalInfoScreen({
  data,
  onChange,
  onContinue,
}: {
  data: AdditionalInfoData
  onChange: (d: AdditionalInfoData) => void
  onContinue: () => void
}) {
  const update = (field: keyof AdditionalInfoData) => (value: string | boolean) => onChange({ ...data, [field]: value })

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
      <h2 className="text-sm font-semibold text-neutral-900">Additional Information</h2>
      <p className="mt-0.5 text-xs text-neutral-500">Additional details for applications</p>

      <div className="mt-6 flex-1 space-y-5 overflow-y-auto pb-2">
        {/* Demographics */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Demographics</h3>
          <div className="space-y-3">
            <Select label="Race/Ethnicity" value={data.race} onChange={update('race') as (v: string) => void} options={RACE_OPTIONS} />
            <Field label="Citizenship" value={data.citizenship} onChange={update('citizenship') as (v: string) => void} placeholder="e.g. USA, Canada" />
            <Select label="Veteran Status" value={data.veteran} onChange={update('veteran') as (v: string) => void} options={VETERAN_OPTIONS} />
            <Select label="Disability Status" value={data.disability} onChange={update('disability') as (v: string) => void} options={DISABILITY_OPTIONS} />
          </div>
        </div>

        {/* Security Clearance */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Security Clearance</h3>
          <Select label="Do you hold a security clearance?" value={data.securityClearance} onChange={update('securityClearance') as (v: string) => void} options={CLEARANCE_OPTIONS} />
        </div>

        {/* Work Authorization */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Work Authorization</h3>
          <Select label="US Work Authorization" value={data.usWorkAuth} onChange={update('usWorkAuth') as (v: string) => void} options={WORK_AUTH_OPTIONS} />
        </div>

        {/* Logistics */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Logistics</h3>
          <div className="space-y-3">
            <Select label="When can you start?" value={data.willingToStart} onChange={update('willingToStart') as (v: string) => void} options={START_OPTIONS} />
            <Select label="Work schedule availability" value={data.workSchedule} onChange={update('workSchedule') as (v: string) => void} options={SCHEDULE_OPTIONS} />
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={data.willingToTravel} onChange={(e) => update('willingToTravel')(e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
              <span className="text-sm text-neutral-700">I am willing to travel for work</span>
            </label>
          </div>
        </div>

        {/* Background */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Background</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={data.drugTestConsent} onChange={(e) => update('drugTestConsent')(e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
              <span className="text-sm text-neutral-700">I consent to drug testing if required</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={data.backgroundCheckConsent} onChange={(e) => update('backgroundCheckConsent')(e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
              <span className="text-sm text-neutral-700">I consent to background checks if required</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white hover:bg-[#1d4ed8]"
      >
        Continue
      </button>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className="relative mt-1">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB]">
          <option value="" disabled>Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  )
}
