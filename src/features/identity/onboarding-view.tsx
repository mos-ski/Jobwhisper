import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'

import { Checkbox, cn, FormField, FormPanel, FormPanelFooter, FormSearchSelectField, ShellBar, Spinner } from '@/ui'
import { COUNTRIES, countryFlagEmoji, type Country } from '@/data/countries'
import { STATES_BY_COUNTRY } from '@/data/states'

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function CountrySelectField({
  id,
  label,
  selectedIso2,
  onSelect,
}: {
  readonly id: string
  readonly label: string
  readonly selectedIso2: string
  readonly onSelect: (country: Country) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const selected = COUNTRIES.find((country) => country.iso2 === selectedIso2)
  const filtered = COUNTRIES.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="grid gap-1.5" ref={ref}>
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
      </label>
      <div className="relative min-w-0">
        <button
          type="button"
          id={id}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface px-3.5 py-2.5 text-start text-sm text-ink shadow-control outline-none transition-colors duration-normal ease-default focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span className={cn('flex min-w-0 items-center gap-2 truncate', !selected && 'text-ink-muted')}>
            {selected ? (
              <>
                <span aria-hidden="true">{countryFlagEmoji(selected.iso2)}</span>
                {selected.name}
              </>
            ) : (
              'Search countries...'
            )}
          </span>
          <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} />
        </button>
        {open ? (
          <div className="absolute z-tooltip mt-1 w-full rounded-lg border border-border bg-surface shadow-popover">
            <div className="border-b border-border p-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search countries..."
                autoFocus
                className="w-full rounded-md border border-input bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus"
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.map((country) => (
                <button
                  key={country.iso2}
                  type="button"
                  onClick={() => {
                    onSelect(country)
                    setSearch('')
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
                >
                  <span aria-hidden="true">{countryFlagEmoji(country.iso2)}</span>
                  {country.name}
                </button>
              ))}
              {filtered.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export type OnboardingProfileViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly emailValue: string
}

export function OnboardingProfileView({ homeHref, backHref, nextHref, emailValue }: OnboardingProfileViewProps) {
  const [firstName, setFirstName] = useState('Darnell')
  const [lastName, setLastName] = useState('Smith')
  const [countryIso2, setCountryIso2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const selectedCountry = COUNTRIES.find((country) => country.iso2 === countryIso2)
  const stateOptions = STATES_BY_COUNTRY[countryIso2]

  return (
    <Workspace>
      <ShellBar homeHref={homeHref} current="Complete Your Profile" />
      <section className="px-4 py-9">
        <FormPanel
          title="Complete Your Profile"
          step="1/2"
          className="max-w-[36rem]"
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} nextLabel="Next" />}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <FormField id="onboarding-first-name" label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            <FormField id="onboarding-last-name" label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            <div className="col-span-2 grid gap-1.5">
              <label htmlFor="onboarding-email" className="text-sm font-medium leading-5 text-ink">
                Email
              </label>
              <div className="relative">
                <input
                  id="onboarding-email"
                  type="email"
                  value={emailValue}
                  disabled
                  className="min-h-11 w-full rounded-lg border border-input bg-surface-subtle px-3.5 py-2.5 pe-24 text-sm leading-6 text-ink-muted shadow-control outline-none disabled:cursor-not-allowed"
                />
                <span className="absolute inset-y-0 end-3 inline-flex items-center gap-1 text-xs font-semibold text-positive">
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  Verified
                </span>
              </div>
            </div>
            <CountrySelectField
              id="onboarding-country"
              label="Country"
              selectedIso2={countryIso2}
              onSelect={(country) => {
                setCountryIso2(country.iso2)
                setState('')
              }}
            />
            {stateOptions ? (
              <FormSearchSelectField
                id="onboarding-state"
                label="State"
                placeholder="Search states..."
                searchPlaceholder="Search states..."
                options={stateOptions}
                selected={state ? [state] : []}
                onSelectedChange={(next) => setState(next[0] ?? '')}
                multiple={false}
              />
            ) : (
              <FormField id="onboarding-state" label="State" placeholder="e.g. Texas" value={state} onChange={(event) => setState(event.target.value)} />
            )}
            <FormField id="onboarding-city" label="City" placeholder="e.g. Austin" value={city} onChange={(event) => setCity(event.target.value)} />
            <FormField id="onboarding-postal" label="Postal Code" placeholder="e.g. 73301" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
            <div className="col-span-2 grid gap-1.5">
              <label htmlFor="onboarding-phone" className="text-sm font-medium leading-5 text-ink">
                Phone Number
              </label>
              <div className="flex gap-2">
                <span
                  className={cn(
                    'flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-input bg-surface-subtle px-3 text-sm font-medium',
                    selectedCountry ? 'text-ink' : 'text-ink-muted',
                  )}
                >
                  {selectedCountry ? (
                    <>
                      <span aria-hidden="true">{countryFlagEmoji(selectedCountry.iso2)}</span>
                      {selectedCountry.dialCode}
                    </>
                  ) : (
                    '🏳️'
                  )}
                </span>
                <input
                  id="onboarding-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={!selectedCountry}
                  placeholder={selectedCountry ? undefined : 'Select a country first'}
                  className="min-h-11 w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm leading-6 text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </FormPanel>
      </section>
    </Workspace>
  )
}

const JOB_ROLE_OPTIONS = [
  'Product Manager',
  'Software Engineer',
  'Designer',
  'Data & Analytics',
  'Marketing',
  'Sales',
  'Customer Success',
  'Operations',
  'Student / Recent Graduate',
  'Other',
]

const LOOKING_FOR_OPTIONS = [
  'Building my resume',
  'Finding & applying to jobs',
  'Practicing for interviews',
  'Getting career guidance',
  'Other',
]

const HEARD_ABOUT_OPTIONS = [
  'Search engine (SEO)',
  'Social media',
  'Video (YouTube/TikTok)',
  'Online ads',
  'Friend or colleague',
  'Podcast',
  'Community (Reddit/Discord)',
  'Other',
]

function CheckboxGrid({
  label,
  options,
  selected,
  onSelectedChange,
}: {
  readonly label: string
  readonly options: readonly string[]
  readonly selected: readonly string[]
  readonly onSelectedChange: (next: readonly string[]) => void
}) {
  function toggle(option: string) {
    if (selected.includes(option)) onSelectedChange(selected.filter((value) => value !== option))
    else onSelectedChange([...selected, option])
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {options.map((option) => (
          <Checkbox key={option} checked={selected.includes(option)} onCheckedChange={() => toggle(option)} label={option} />
        ))}
      </div>
    </div>
  )
}

export type OnboardingInterestsViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly onComplete: () => void
}

export function OnboardingInterestsView({ homeHref, backHref, onComplete }: OnboardingInterestsViewProps) {
  const [jobRole, setJobRole] = useState<readonly string[]>([])
  const [lookingFor, setLookingFor] = useState<readonly string[]>([])
  const [heardAbout, setHeardAbout] = useState<readonly string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const canComplete = jobRole.length > 0 && lookingFor.length > 0 && heardAbout.length > 0

  function handleComplete() {
    if (submitting || !canComplete) return
    setSubmitting(true)
    window.setTimeout(onComplete, 900)
  }

  return (
    <Workspace>
      <ShellBar homeHref={homeHref} current="One More Step" />
      <section className="px-4 py-9">
        <FormPanel
          title="One More Step"
          step="2/2"
          bodyClassName="gap-4"
          footer={
            <FormPanelFooter
              backHref={backHref}
              nextHref="#"
              nextLabel={submitting ? 'Setting up your workspace…' : 'Complete'}
              nextIcon={submitting ? <Spinner size="sm" /> : undefined}
              nextDisabled={submitting || !canComplete}
              onNextClick={(event) => {
                event.preventDefault()
                handleComplete()
              }}
            />
          }
        >
          <p className="text-sm leading-6 text-ink-muted">Help us tailor Lightforth to what you're looking for.</p>
          <FormSearchSelectField
            id="onboarding-job-role"
            label="Job Role"
            placeholder="Search job roles..."
            searchPlaceholder="Search job roles..."
            options={JOB_ROLE_OPTIONS}
            selected={jobRole}
            onSelectedChange={setJobRole}
            multiple={false}
            dropdownPlacement="top"
          />
          <FormSearchSelectField
            id="onboarding-looking-for"
            label="What brings you to Lightforth?"
            placeholder="Search..."
            searchPlaceholder="Search..."
            options={LOOKING_FOR_OPTIONS}
            selected={lookingFor}
            onSelectedChange={setLookingFor}
            dropdownPlacement="top"
          />
          <CheckboxGrid label="How did you hear about Lightforth?" options={HEARD_ABOUT_OPTIONS} selected={heardAbout} onSelectedChange={setHeardAbout} />
        </FormPanel>
      </section>
    </Workspace>
  )
}
