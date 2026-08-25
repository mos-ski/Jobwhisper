import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  dob: string
  country: string
  city: string
  streetAddress: string
  postalCode: string
  linkedIn: string
  github: string
  portfolio: string
}

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

export function ContactDetailsScreen({
  data,
  onChange,
  onContinue,
}: {
  data: ContactData
  onChange: (d: ContactData) => void
  onContinue: () => void
}) {
  const valid = data.email.trim() && data.phone.trim() && data.firstName.trim()

  const update = (field: keyof ContactData) => (value: string) => onChange({ ...data, [field]: value })

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
      <h2 className="text-sm font-semibold text-neutral-900">Contact Information</h2>
      <p className="mt-0.5 text-xs text-neutral-500">Your contact details</p>

      <div className="mt-6 flex-1 space-y-3 overflow-y-auto pb-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name *" value={data.firstName} onChange={update('firstName')} placeholder="Darnell" />
          <Field label="Last Name" value={data.lastName} onChange={update('lastName')} placeholder="Smith" />
        </div>
        <Field label="Email *" value={data.email} onChange={update('email')} placeholder="you@example.com" keyboard="email" />
        <Field label="Phone *" value={data.phone} onChange={update('phone')} placeholder="+1 (555) 123-4567" keyboard="tel" />
        <Select label="Gender" value={data.gender} onChange={update('gender')} options={GENDERS} placeholder="Select..." />
        <Field label="Date of Birth" value={data.dob} onChange={update('dob')} placeholder="MM/DD/YYYY" />
        <Field label="Country" value={data.country} onChange={update('country')} placeholder="e.g. United States" />
        <Field label="City" value={data.city} onChange={update('city')} placeholder="e.g. San Francisco" />
        <Field label="Street Address" value={data.streetAddress} onChange={update('streetAddress')} placeholder="123 Main St" />
        <Field label="Postal Code" value={data.postalCode} onChange={update('postalCode')} placeholder="10001" />
        <Field label="LinkedIn URL (optional)" value={data.linkedin} onChange={update('linkedIn')} placeholder="https://linkedin.com/in/..." />
        <Field label="GitHub URL (optional)" value={data.github} onChange={update('github')} placeholder="https://github.com/..." />
        <Field label="Portfolio URL (optional)" value={data.portfolio} onChange={update('portfolio')} placeholder="https://yoursite.com" />
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

function Field({ label, value, onChange, placeholder, keyboard }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; keyboard?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <input type={keyboard ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
    </div>
  )
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-700">{label}</label>
      <div className="relative mt-1">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB]">
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  )
}
