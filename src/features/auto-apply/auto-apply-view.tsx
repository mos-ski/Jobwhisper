import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText, Filter, LinkIcon, Lock, PenLine, Play, RefreshCw, Search, Send, Settings, X, Zap, Trash2, Download, Mail } from 'lucide-react'

import type { AutoApplyApplication, AutoApplyJob, AutoApplyOutcome, AutoApplySetup } from '@/contracts/auto-apply.draft'
import {
  DEFAULT_AUTO_APPLY_SETUP,
  EMPLOYMENT_TYPES,
  LOCATION_TYPES,
  GENDER_OPTIONS,
  EXPERIENCE_LEVELS,
  RACE_OPTIONS,
  VETERAN_OPTIONS,
  DISABILITY_OPTIONS,
  SECURITY_CLEARANCE_OPTIONS,
  US_WORK_AUTH_OPTIONS,
  START_TIMELINE_OPTIONS,
  WORK_SCHEDULE_OPTIONS,
} from '@/contracts/auto-apply.draft'
import type { ResumeDocument, ResumeHistoryRow } from '@/contracts/resume.draft'
import { clearDefaultResumePreference, getDefaultResumePreference, setDefaultResumePreference } from '@/lib/resume-preference'
import { COUNTRIES } from '@/data/countries'
import {
  cn,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  FormField,
  FormPanel,
  FormPanelFooter,
  FormSearchSelectField,
  FormSelectField,
  FormTextArea,
  LightforthAiIcon,
  ListPickerDialog,
  ReviewSummaryList,
  ShellBar,
  SourcePicker,
  TipModalTrigger,
  UploadedFileDialog,
} from '@/ui'
import { useAgentSession, type AgentSession, type FeedEvent, type FeedLink } from '@/hooks/useAgentSession'

export type AutoApplyUploadViewProps = {
  readonly homeHref: string
  readonly contactHref: string
  readonly agentHref: string
  readonly uploadedFileName: string
  readonly savedResumes: readonly ResumeHistoryRow[]
}

export type AutoApplySetupStepViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly setup: AutoApplySetup
  readonly step: 'contact' | 'preferences' | 'additional'
}

export type AutoApplyReviewViewProps = {
  readonly homeHref: string
  readonly contactHref: string
  readonly additionalHref: string
  readonly agentHref: string
  readonly setup: AutoApplySetup
}

export type AutoApplyAgentViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
}

export type AutoApplyJobsViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly resumeHistoryHref: string
  readonly jobs: readonly AutoApplyJob[]
  readonly selectedJob?: AutoApplyJob
  readonly isPremiumUser?: boolean
  readonly resumePreview: ResumeDocument
}

export type AutoApplyAppliedViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly resumeHistoryHref: string
  readonly jobs: readonly AutoApplyJob[]
  readonly resumePreview: ResumeDocument
  readonly application: AutoApplyApplication
}

const tabs = [
  { key: 'setup', label: 'Set Up' },
  { key: 'agent', label: 'Agent' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'applied', label: 'Applied' },
] as const

function Header({ homeHref, current = 'Auto Apply', actionHref }: { readonly homeHref: string; readonly current?: string; readonly actionHref?: string }) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={homeHref}
      closeLabel="Close auto apply"
      secondaryAction={actionHref ? { label: 'Update Preference', href: actionHref, icon: <img aria-hidden="true" src="/v3-assets/figma/sidebar-briefcase.svg" alt="" className="size-5" /> } : undefined}
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children }: { readonly children: ReactNode }) {
  return <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel">{children}</article>
}

function Tag({ children }: { readonly children: ReactNode }) {
  return <span className="rounded-full bg-accent-subtle px-2 py-1 text-xs font-medium text-accent-text">{children}</span>
}

export function AutoApplyUploadView({ homeHref, contactHref, agentHref, uploadedFileName, savedResumes }: AutoApplyUploadViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [useAsDefault, setUseAsDefault] = useState(() => getDefaultResumePreference() !== null)

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-8 lg:py-10">
        <PaperShell>
          <SourcePicker
            title="Upload a resume"
            options={[
              { label: 'Upload a Resume', hint: 'PDF, DOC, DOCX or TXT', onClick: () => setUploadDialogOpen(true) },
              { label: 'Use Lightforth Resume', icon: <LightforthAiIcon className="size-5" />, emphasis: 'strong', onClick: () => setPickerOpen(true) },
            ]}
            historyLink={{ label: 'Continue to saved agent', href: agentHref }}
          />
        </PaperShell>
      </section>

      <ListPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Use a Lightforth Resume"
        description="Pick a resume from your history to continue with."
        items={savedResumes.map((resume) => ({ id: resume.id, title: resume.title, subtitle: resume.company, meta: `ATS ${resume.atsScore}` }))}
        emptyLabel="No saved resumes yet. Upload one to get started."
        icon={<LightforthAiIcon className="size-4" />}
        onSelect={() => {
          setPickerOpen(false)
          setUploadDialogOpen(true)
        }}
      />

      <UploadedFileDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        fileName={uploadedFileName}
        continueHref={contactHref}
        defaultChecked={useAsDefault}
        onDefaultChange={(checked) => {
          setUseAsDefault(checked)
          if (checked) setDefaultResumePreference(uploadedFileName)
          else clearDefaultResumePreference()
        }}
      />
    </Workspace>
  )
}

export function AutoApplySetupStepView({ homeHref, backHref, nextHref, setup, step }: AutoApplySetupStepViewProps) {
  const copy = {
    contact: { title: 'Contact Information', count: '1/4' },
    preferences: { title: 'Job Preferences', count: '2/4' },
    additional: { title: 'Additional Information', count: '3/4' },
  }[step]

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title={copy.title}
          step={copy.count}
          uploadedFile={
            step === 'contact'
              ? {
                  fileName: setup.uploadedFileName,
                  changeHref: backHref,
                  onChangeClick: () => clearDefaultResumePreference(),
                }
              : undefined
          }
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} />}
        >
          {step === 'contact' ? (
            <ContactForm setup={setup} />
          ) : null}
          {step === 'preferences' ? (
            <PreferencesForm setup={setup} />
          ) : null}
          {step === 'additional' ? (
            <AdditionalForm setup={setup} />
          ) : null}
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function AutoApplyReviewView({ homeHref, contactHref, additionalHref, agentHref, setup }: AutoApplyReviewViewProps) {
  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title="Review Job Preference"
          step="4/4"
          footer={<FormPanelFooter backHref={additionalHref} nextHref={agentHref} nextLabel="Save & Continue" />}
        >
          <ReviewSummaryList
            rows={[
              {
                id: 'resume',
                title: 'Resume',
                value: setup.uploadedFileName,
                icon: <img aria-hidden="true" src="/v3-assets/figma/form-review-resume.svg" alt="" className="size-5" />,
                href: contactHref,
                details: (
                  <div className="grid gap-1">
                    <p><span className="font-medium text-ink">File:</span> {setup.uploadedFileName}</p>
                  </div>
                ),
              },
              {
                id: 'contact',
                title: 'Contact Information',
                value: `${setup.firstName} ${setup.lastName} - ${setup.email} - ${setup.country}`,
                icon: <img aria-hidden="true" src="/v3-assets/figma/form-review-contact.svg" alt="" className="size-5" />,
                href: contactHref,
                details: (
                  <div className="grid gap-1">
                    <p><span className="font-medium text-ink">Name:</span> {setup.firstName} {setup.lastName}</p>
                    <p><span className="font-medium text-ink">Email:</span> {setup.email}</p>
                    <p><span className="font-medium text-ink">Phone:</span> {setup.phone}</p>
                    <p><span className="font-medium text-ink">Country:</span> {setup.country}</p>
                    <p><span className="font-medium text-ink">City:</span> {setup.city}</p>
                    <p><span className="font-medium text-ink">Address:</span> {setup.streetAddress}, {setup.postalCode}</p>
                    {setup.linkedIn ? <p><span className="font-medium text-ink">LinkedIn:</span> {setup.linkedIn}</p> : null}
                    {setup.github ? <p><span className="font-medium text-ink">GitHub:</span> {setup.github}</p> : null}
                    {setup.portfolio ? <p><span className="font-medium text-ink">Portfolio:</span> {setup.portfolio}</p> : null}
                  </div>
                ),
              },
              {
                id: 'preferences',
                title: 'Job Preferences',
                value: `${setup.desiredRole.join(', ')}, ${setup.experienceLevel} - $${Math.round(setup.salary.min / 1000)}k–$${Math.round(setup.salary.max / 1000)}k`,
                icon: <img aria-hidden="true" src="/v3-assets/figma/form-review-briefcase.svg" alt="" className="size-5" />,
                href: '/v3/auto-apply/preferences',
                details: (
                  <div className="grid gap-1">
                    <p><span className="font-medium text-ink">Desired Role:</span> {setup.desiredRole.join(', ')}</p>
                    <p><span className="font-medium text-ink">Experience Level:</span> {setup.experienceLevel}</p>
                    <p><span className="font-medium text-ink">Salary:</span> ${Math.round(setup.salary.min / 1000)}k – ${Math.round(setup.salary.max / 1000)}k</p>
                    <p><span className="font-medium text-ink">Locations:</span> {setup.locations.join(', ')}</p>
                    <p><span className="font-medium text-ink">Employment Types:</span> {setup.employmentTypes.join(', ')}</p>
                    <p><span className="font-medium text-ink">Location Types:</span> {setup.locationTypes.join(', ')}</p>
                    <p><span className="font-medium text-ink">Open to Relocate:</span> {setup.openToRelocate ? 'Yes' : 'No'}</p>
                  </div>
                ),
              },
              {
                id: 'additional',
                title: 'Additional Info',
                value: `${setup.willingToStart} - ${setup.usWorkAuth || 'Not set'}`,
                icon: <img aria-hidden="true" src="/v3-assets/figma/form-review-info.svg" alt="" className="size-5" />,
                href: additionalHref,
                details: (
                  <div className="grid gap-1">
                    <p><span className="font-medium text-ink">Willing to Start:</span> {setup.willingToStart}</p>
                    <p><span className="font-medium text-ink">US Work Auth:</span> {setup.usWorkAuth || 'Not set'}</p>
                    <p><span className="font-medium text-ink">Work Schedule:</span> {setup.workSchedule}</p>
                    <p><span className="font-medium text-ink">Willing to Travel:</span> {setup.willingToTravel ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium text-ink">Drug Test Consent:</span> {setup.drugTestConsent ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium text-ink">Background Check:</span> {setup.backgroundCheckConsent ? 'Yes' : 'No'}</p>
                  </div>
                ),
              },
            ]}
          />
          <p className="mt-4 text-xs leading-5 text-ink-muted">
            Lightforth only charges for successful applications.
          </p>
        </FormPanel>
      </section>
    </Workspace>
  )
}

function PreferencesForm({ setup }: { readonly setup: AutoApplySetup }) {
  const SALARY_MIN = 20000
  const SALARY_MAX = 300000
  const toPercent = (val: number) => ((val - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100
  const formatK = (val: number) => `$${Math.round(val / 1000)}k`
  const formatComma = (val: number) => val.toLocaleString('en-US')
  const parseRaw = (input: string) => Number(input.replace(/[^0-9]/g, ''))

  const [roles, setRoles] = useState<string[]>([...setup.desiredRole])
  const [roleSearch, setRoleSearch] = useState('')
  const [roleOpen, setRoleOpen] = useState(false)
  const [locations, setLocations] = useState<string[]>([...setup.locations])
  const [locSearch, setLocSearch] = useState('')
  const [locOpen, setLocOpen] = useState(false)
  const [salaryMin, setSalaryMin] = useState(setup.salary.min)
  const [salaryMax, setSalaryMax] = useState(setup.salary.max)
  const [editingMin, setEditingMin] = useState(false)
  const [editingMax, setEditingMax] = useState(false)
  const [expSearch, setExpSearch] = useState('')
  const [expOpen, setExpOpen] = useState(false)
  const [experience, setExperience] = useState(setup.experienceLevel)
  const [openSection, setOpenSection] = useState<string | null>('role')

  const ROLE_OPTIONS = [
    'Product Manager', 'Senior Product Manager', 'Product Lead', 'Product Owner',
    'Software Engineer', 'Senior Software Engineer', 'Frontend Engineer', 'Backend Engineer',
    'Data Scientist', 'Data Analyst', 'Machine Learning Engineer',
    'UX Designer', 'UI Designer', 'Product Designer',
    'Project Manager', 'Program Manager', 'Scrum Master',
    'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer',
    'Marketing Manager', 'Content Strategist', 'Growth Manager',
    'Business Analyst', 'Operations Manager', 'Financial Analyst',
    'HR Manager', 'Recruiter', 'Account Executive', 'Sales Manager',
  ]

  const filteredRoles = ROLE_OPTIONS.filter((r) => r.toLowerCase().includes(roleSearch.toLowerCase()) && !roles.includes(r))

  const addRole = (role: string) => {
    if (role && roles.length < 5 && !roles.includes(role)) setRoles([...roles, role])
    setRoleSearch('')
    setRoleOpen(false)
  }
  const removeRole = (role: string) => setRoles(roles.filter((r) => r !== role))

  const LOCATION_OPTIONS = [
    'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL', 'Seattle, WA',
    'Austin, TX', 'Boston, MA', 'Denver, CO', 'Miami, FL', 'Atlanta, GA',
    'Portland, OR', 'Washington, DC', 'San Diego, CA', 'Dallas, TX', 'Houston, TX',
    'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Singapore', 'Sydney, Australia',
    'Remote', 'Hybrid', 'Onsite',
  ]

  const filteredLocations = LOCATION_OPTIONS.filter((l) => l.toLowerCase().includes(locSearch.toLowerCase()) && !locations.includes(l))

  const addLocation = (loc: string) => {
    if (loc && locations.length < 5 && !locations.includes(loc)) setLocations([...locations, loc])
    setLocSearch('')
    setLocOpen(false)
  }
  const removeLocation = (loc: string) => setLocations(locations.filter((l) => l !== loc))

  const filteredExps = EXPERIENCE_LEVELS.filter((e) => e.toLowerCase().includes(expSearch.toLowerCase()))

  const toggle = (key: string) => setOpenSection((prev) => prev === key ? null : key)

  return (
    <div className="grid gap-2">
      {/* Section 1: Role & Experience */}
      <CollapsibleSection title="Role & Experience" isOpen={openSection === 'role'} onToggle={() => toggle('role')}>
        <div className="grid gap-4">
          {/* Desired Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Desired Role <span className="text-ink-muted">(up to 5)</span></label>
            <div className="relative">
              <button type="button" onClick={() => setRoleOpen(!roleOpen)} className="flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-surface px-3 text-left text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                <span className="text-ink-muted">Search roles...</span>
                <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform', roleOpen && 'rotate-180')} />
              </button>
              {roleOpen ? (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg">
                  <div className="border-b border-border p-2">
                    <input type="text" value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} placeholder="Search roles..." autoFocus className="w-full rounded-md border border-input bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus" />
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {filteredRoles.map((opt) => (
                      <button key={opt} type="button" onClick={() => addRole(opt)} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus">{opt}</button>
                    ))}
                    {filteredRoles.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
            {roles.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {roles.map((role) => (
                  <span key={role} className="inline-flex items-center gap-1 rounded-md bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
                    {role}
                    <button type="button" onClick={() => removeRole(role)} className="rounded-full p-0.5 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus" aria-label={`Remove ${role}`}><X aria-hidden="true" className="size-3" /></button>
                  </span>
                ))}
              </div>
            ) : null}
            {roles.length >= 5 ? <p className="mt-1 text-xs text-ink-muted">Maximum 5 roles reached</p> : null}
          </div>
          {/* Experience Level */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-ink">Experience Level</label>
            <button type="button" onClick={() => setExpOpen(!expOpen)} className="flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-surface px-3 text-left text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
              <span className={experience ? '' : 'text-ink-muted'}>{experience || 'Search and select level'}</span>
              <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform', expOpen && 'rotate-180')} />
            </button>
            {expOpen ? (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg">
                <div className="border-b border-border p-2">
                  <input type="text" value={expSearch} onChange={(e) => setExpSearch(e.target.value)} placeholder="Search experience..." autoFocus className="w-full rounded-md border border-input bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus" />
                </div>
                <div className="max-h-48 overflow-y-auto p-1">
                  {filteredExps.map((opt) => (
                    <button key={opt} type="button" onClick={() => { setExperience(opt); setExpOpen(false); setExpSearch('') }} className={cn('flex w-full items-center rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus', experience === opt ? 'bg-accent-subtle text-accent font-medium' : 'text-ink hover:bg-surface-subtle')}>
                      {experience === opt ? <Check aria-hidden="true" className="mr-2 size-4" /> : <span className="mr-2 size-4" />}
                      {opt}
                    </button>
                  ))}
                  {filteredExps.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 2: Salary */}
      <CollapsibleSection title="Salary Range" isOpen={openSection === 'salary'} onToggle={() => toggle('salary')}>
        <div className="rounded-lg border border-border bg-surface-subtle p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            {editingMin ? (
              <input
                type="tel" inputMode="numeric" pattern="[0-9]*" autoFocus
                value={formatComma(salaryMin)}
                onChange={(e) => { const raw = parseRaw(e.target.value); if (!isNaN(raw)) setSalaryMin(raw) }}
                onBlur={() => setEditingMin(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingMin(false) }}
                className="w-24 rounded border border-input bg-surface px-2 py-0.5 text-center font-semibold text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus"
              />
            ) : (
              <button type="button" onClick={() => setEditingMin(true)} className="w-24 rounded border border-transparent px-2 py-0.5 text-center font-semibold text-ink hover:border-input focus:border-focus focus:ring-1 focus:ring-focus">{formatK(salaryMin)}</button>
            )}
            <span className="text-ink-muted">to</span>
            {editingMax ? (
              <input
                type="tel" inputMode="numeric" pattern="[0-9]*" autoFocus
                value={formatComma(salaryMax)}
                onChange={(e) => { const raw = parseRaw(e.target.value); if (!isNaN(raw)) setSalaryMax(raw) }}
                onBlur={() => setEditingMax(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingMax(false) }}
                className="w-24 rounded border border-input bg-surface px-2 py-0.5 text-center font-semibold text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus"
              />
            ) : (
              <button type="button" onClick={() => setEditingMax(true)} className="w-24 rounded border border-transparent px-2 py-0.5 text-center font-semibold text-ink hover:border-input focus:border-focus focus:ring-1 focus:ring-focus">{formatK(salaryMax)}</button>
            )}
          </div>
          <div className="relative h-6">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-subtle" />
            <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${toPercent(salaryMin)}%`, right: `${100 - toPercent(salaryMax)}%` }} />
            <input type="range" min={SALARY_MIN} max={SALARY_MAX} step={5000} value={salaryMax} onChange={(e) => { const v = Number(e.target.value); if (v > salaryMin) setSalaryMax(v) }} className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white" />
            <input type="range" min={SALARY_MIN} max={SALARY_MAX} step={5000} value={salaryMin} onChange={(e) => { const v = Number(e.target.value); if (v < salaryMax) setSalaryMin(v) }} className="absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 3: Location & Type */}
      <CollapsibleSection title="Location & Type" isOpen={openSection === 'location'} onToggle={() => toggle('location')}>
        <div className="grid gap-4">
          {/* Locations */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Preferred Locations <span className="text-ink-muted">(up to 5)</span></label>
            <div className="relative">
              <button type="button" onClick={() => setLocOpen(!locOpen)} className="flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-surface px-3 text-left text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                <span className="text-ink-muted">Search locations...</span>
                <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform', locOpen && 'rotate-180')} />
              </button>
              {locOpen ? (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg">
                  <div className="border-b border-border p-2">
                    <input type="text" value={locSearch} onChange={(e) => setLocSearch(e.target.value)} placeholder="Search locations..." autoFocus className="w-full rounded-md border border-input bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus" />
                  </div>
                  <div className="max-h-48 overflow-y-auto p-1">
                    {filteredLocations.map((opt) => (
                      <button key={opt} type="button" onClick={() => addLocation(opt)} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus">{opt}</button>
                    ))}
                    {filteredLocations.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
            {locations.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {locations.map((loc) => (
                  <span key={loc} className="inline-flex items-center gap-1 rounded-md bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
                    {loc}
                    <button type="button" onClick={() => removeLocation(loc)} className="rounded-full p-0.5 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus" aria-label={`Remove ${loc}`}><X aria-hidden="true" className="size-3" /></button>
                  </span>
                ))}
              </div>
            ) : null}
            {locations.length >= 5 ? <p className="mt-1 text-xs text-ink-muted">Maximum 5 locations reached</p> : null}
          </div>
          {/* Employment Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Employment Type</label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button key={t} type="button" className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', setup.employmentTypes.includes(t) ? 'border-accent bg-accent-subtle text-accent font-medium' : 'border-border text-ink hover:border-accent/40')}>{t}</button>
              ))}
            </div>
          </div>
          {/* Location Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Job Location Type</label>
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((t) => (
                <button key={t} type="button" className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', setup.locationTypes.includes(t) ? 'border-accent bg-accent-subtle text-accent font-medium' : 'border-border text-ink hover:border-accent/40')}>{t}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={setup.openToRelocate} className="size-4 rounded border-input text-accent focus:ring-focus" />
            <span className="text-sm text-ink">I am open to relocating</span>
          </label>
        </div>
      </CollapsibleSection>
    </div>
  )
}

const DOB_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, index) => ({ label, value: String(index + 1).padStart(2, '0') }))

function DateOfBirthField({ dob }: { readonly dob: string }) {
  const [year, month, day] = dob ? dob.split('-') : ['', '', '']
  const currentYear = new Date().getFullYear()
  const dayOptions = Array.from({ length: 31 }, (_, index) => {
    const value = String(index + 1).padStart(2, '0')
    return { label: value, value }
  })
  const yearOptions = Array.from({ length: 100 }, (_, index) => {
    const value = String(currentYear - index)
    return { label: value, value }
  })

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">Date of Birth</span>
      <div className="grid grid-cols-3 gap-2">
        <FormSelectField id="auto-dob-month" label="Month" hideLabel defaultValue={month} placeholder="Month" options={DOB_MONTHS} />
        <FormSelectField id="auto-dob-day" label="Day" hideLabel defaultValue={day} placeholder="Day" options={dayOptions} />
        <FormSelectField id="auto-dob-year" label="Year" hideLabel defaultValue={year} placeholder="Year" options={yearOptions} />
      </div>
    </div>
  )
}

const COUNTRY_NAMES = COUNTRIES.map((country) => country.name)

function ContactForm({ setup }: { readonly setup: AutoApplySetup }) {
  const [openSection, setOpenSection] = useState<string | null>('profile')
  const [country, setCountry] = useState(setup.country)

  const toggle = (key: string) => setOpenSection((prev) => prev === key ? null : key)

  const filled = {
    profile: !!(setup.email || setup.phone || setup.firstName || setup.lastName || setup.gender || setup.dob),
    address: !!(country || setup.city || setup.streetAddress || setup.postalCode),
    links: !!(setup.linkedIn || setup.github || setup.portfolio),
  }

  return (
    <div className="grid gap-2">
      <CollapsibleSection
        title="Profile Details"
        isOpen={openSection === 'profile'}
        onToggle={() => toggle('profile')}
        isFilled={filled.profile}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="auto-email" label="Email" defaultValue={setup.email} required disabled />
          <FormField id="auto-phone" label="Phone" defaultValue={setup.phone} placeholder="+1" />
          <FormField id="auto-first-name" label="First Name" defaultValue={setup.firstName} required />
          <FormField id="auto-last-name" label="Last Name" defaultValue={setup.lastName} required />
          <FormSelectField
            id="auto-gender"
            label="Gender"
            defaultValue={setup.gender}
            placeholder="Select gender"
            options={GENDER_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
          <DateOfBirthField dob={setup.dob} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Address and Location"
        isOpen={openSection === 'address'}
        onToggle={() => toggle('address')}
        isFilled={filled.address}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormSearchSelectField
            id="auto-country"
            label="Country"
            placeholder="Search countries..."
            searchPlaceholder="Search countries..."
            options={COUNTRY_NAMES}
            selected={country ? [country] : []}
            onSelectedChange={(next) => setCountry(next[0] ?? '')}
            multiple={false}
          />
          <FormField id="auto-city" label="City" defaultValue={setup.city} placeholder={country ? 'Enter city' : 'Select a country first'} disabled={!country} />
          <FormField id="auto-street" label="Street Address" defaultValue={setup.streetAddress} placeholder="123 Main St" />
          <FormField id="auto-postal" label="Postal Code" defaultValue={setup.postalCode} placeholder="10001" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Public Links"
        isOpen={openSection === 'links'}
        onToggle={() => toggle('links')}
        isFilled={filled.links}
      >
        <div className="grid gap-3">
          <FormField id="auto-linkedin" label="LinkedIn URL" defaultValue={setup.linkedIn} placeholder="https://linkedin.com/in/..." />
          <FormField id="auto-github" label="GitHub URL" defaultValue={setup.github} placeholder="https://github.com/..." />
          <FormField id="auto-portfolio" label="Portfolio URL" defaultValue={setup.portfolio} placeholder="https://yoursite.com" />
        </div>
      </CollapsibleSection>
    </div>
  )
}

function AdditionalForm({ setup }: { readonly setup: AutoApplySetup }) {
  const [openSection, setOpenSection] = useState<string | null>('demographics')

  const toggle = (key: string) => setOpenSection((prev) => prev === key ? null : key)

  const filled = {
    demographics: !!(setup.race || setup.citizenship || setup.veteran || setup.disability),
    security: !!setup.securityClearance,
    workAuth: !!(setup.usWorkAuth || setup.canadaWorkAuth || setup.authorizedToWork),
    logistics: !!(setup.willingToStart || setup.workSchedule || setup.willingToTravel),
    background: !!(setup.drugTestConsent || setup.backgroundCheckConsent || setup.preventPublicTrust || setup.drugDiversion),
    references: false,
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm leading-6 text-ink-muted">
        A few employers ask equal-opportunity and background questions on their applications. These are optional — answer what
        you&apos;re comfortable sharing, or skip and Lightforth will leave them blank when it applies on your behalf. Your answers
        are never shared outside the application itself.
      </p>
      <CollapsibleSection
        title="Demographics"
        isOpen={openSection === 'demographics'}
        onToggle={() => toggle('demographics')}
        isFilled={filled.demographics}
      >
        <p className="mb-3 text-xs text-ink-muted">Optional — used only if an employer's application asks for it.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormSelectField
            id="auto-race"
            label="Race/Ethnicity"
            defaultValue={setup.race}
            options={RACE_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
          <FormField id="auto-citizenship" label="Citizenship" defaultValue={setup.citizenship} placeholder="e.g. USA, Canada" />
          <FormSelectField
            id="auto-veteran"
            label="Veteran Status"
            defaultValue={setup.veteran}
            options={VETERAN_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
          <FormSelectField
            id="auto-disability"
            label="Disability Status"
            defaultValue={setup.disability}
            options={DISABILITY_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Security Clearance"
        isOpen={openSection === 'security'}
        onToggle={() => toggle('security')}
        isFilled={filled.security}
      >
        <FormSelectField
          id="auto-clearance"
          label="Do you hold a defined security clearance?"
          defaultValue={setup.securityClearance}
          options={SECURITY_CLEARANCE_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Work Authorization"
        isOpen={openSection === 'workAuth'}
        onToggle={() => toggle('workAuth')}
        isFilled={filled.workAuth}
      >
        <div className="grid gap-3">
          <FormSelectField
            id="auto-us-auth"
            label="US Work Authorization"
            defaultValue={setup.usWorkAuth}
            options={US_WORK_AUTH_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
          <FormField id="auto-canada-auth" label="Canada Work Authorization (Optional)" defaultValue={setup.canadaWorkAuth} placeholder="e.g. Citizen, PR, Work Permit" />
        </div>
        <fieldset className="mt-3">
          <legend className="text-sm font-medium text-ink">Are you authorized to work in the country you are applying to?</legend>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="authorizedToWork" value="yes" defaultChecked={setup.authorizedToWork === 'yes'} className="size-4 text-accent focus:ring-focus" />
              <span className="text-sm text-ink">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="authorizedToWork" value="no" defaultChecked={setup.authorizedToWork === 'no'} className="size-4 text-accent focus:ring-focus" />
              <span className="text-sm text-ink">No</span>
            </label>
          </div>
        </fieldset>
      </CollapsibleSection>

      <CollapsibleSection
        title="Logistics"
        isOpen={openSection === 'logistics'}
        onToggle={() => toggle('logistics')}
        isFilled={filled.logistics}
      >
        <div className="grid gap-3">
          <FormSelectField
            id="auto-start"
            label="When are you willing to start?"
            defaultValue={setup.willingToStart}
            options={START_TIMELINE_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
          <FormSelectField
            id="auto-schedule"
            label="Work Schedule Availability"
            defaultValue={setup.workSchedule}
            options={WORK_SCHEDULE_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
          />
        </div>
        <label className="mt-3 flex items-center gap-2">
          <input type="checkbox" defaultChecked={setup.willingToTravel} className="size-4 rounded border-input text-accent focus:ring-focus" />
          <span className="text-sm text-ink">I am willing to travel for work.</span>
        </label>
      </CollapsibleSection>

      <CollapsibleSection
        title="Background Questions"
        isOpen={openSection === 'background'}
        onToggle={() => toggle('background')}
        isFilled={filled.background}
      >
        <p className="mb-3 text-xs text-ink-muted">Optional — used only if an employer's application asks for it.</p>
        <div className="grid gap-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Is there anything that would prevent you from obtaining a Public Trust Clearance?</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="preventPublicTrust" value="yes" defaultChecked={setup.preventPublicTrust === 'yes'} className="size-4 text-accent focus:ring-focus" />
                <span className="text-sm text-ink">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="preventPublicTrust" value="no" defaultChecked={setup.preventPublicTrust === 'no'} className="size-4 text-accent focus:ring-focus" />
                <span className="text-sm text-ink">No</span>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Have you ever been disciplined due to drug diversion?</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="drugDiversion" value="yes" defaultChecked={setup.drugDiversion === 'yes'} className="size-4 text-accent focus:ring-focus" />
                <span className="text-sm text-ink">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="drugDiversion" value="no" defaultChecked={setup.drugDiversion === 'no'} className="size-4 text-accent focus:ring-focus" />
                <span className="text-sm text-ink">No</span>
              </label>
            </div>
          </fieldset>
          <div className="grid gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={setup.drugTestConsent} className="size-4 rounded border-input text-accent focus:ring-focus" />
              <span className="text-sm text-ink">I consent to drug testing if required by the employer.</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={setup.backgroundCheckConsent} className="size-4 rounded border-input text-accent focus:ring-focus" />
              <span className="text-sm text-ink">I consent to background checks if required.</span>
            </label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="References"
        isOpen={openSection === 'references'}
        onToggle={() => toggle('references')}
        isFilled={filled.references}
      >
        <p className="text-sm text-ink-muted">No references added yet.</p>
      </CollapsibleSection>
    </div>
  )
}

function CollapsibleSection({ title, isOpen, onToggle, isFilled, children }: { readonly title: string; readonly isOpen: boolean; readonly onToggle: () => void; readonly isFilled?: boolean; readonly children: ReactNode }) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface transition-opacity', isFilled && !isOpen && 'opacity-50')}>
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-12 w-full items-center justify-between px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <span className={cn('text-sm font-semibold text-ink', isFilled && !isOpen && 'text-ink-muted line-through')}>{title}</span>
        <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {isOpen ? (
        <div className="border-t border-border px-4 pb-4 pt-3">{children}</div>
      ) : null}
    </div>
  )
}

function AppShell({
  homeHref,
  title,
  active,
  setupHref,
  agentHref,
  jobsHref,
  appliedHref,
  children,
}: {
  readonly homeHref: string
  readonly title: string
  readonly active: 'setup' | 'agent' | 'jobs' | 'applied'
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly children: ReactNode
}) {
  const hrefs: Record<typeof tabs[number]['key'], string> = {
    setup: setupHref,
    agent: agentHref,
    jobs: jobsHref,
    applied: appliedHref,
  }

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="p-4 lg:p-8">
        <div className="mx-auto min-h-[56rem] max-w-7xl bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
          <div className="p-8">
            <nav aria-label="Auto apply sections" className="flex gap-6 border-b border-border text-sm font-medium">
              {tabs.map((tab) => (
                <a
                  key={tab.key}
                  href={hrefs[tab.key]}
                  aria-current={active === tab.key ? 'page' : undefined}
                  className={cn(
                    'min-h-11 border-b-2 px-1 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    active === tab.key ? 'border-accent text-accent' : 'border-transparent text-ink-muted',
                  )}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
            {children}
          </div>
        </div>
      </section>
    </Workspace>
  )
}

// ─── Agent View (live animation via useAgentSession) ──────────────────────────

const agentStatusTone: Record<string, string> = {
  running: 'bg-positive-surface text-positive',
  working: 'bg-warning-surface text-warning',
  complete: 'bg-accent-subtle text-accent-text',
  idle: 'bg-surface-subtle text-ink-muted',
}

const agentIcon: Record<string, typeof Search> = {
  scout: Search,
  filter: Filter,
  tailor: PenLine,
  driver: Send,
  system: Zap,
}

type AgentTabValue = 'all' | 'scout' | 'filter' | 'tailor' | 'driver'
const agentTabs: { value: AgentTabValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'scout', label: 'Scout' },
  { value: 'filter', label: 'Filter' },
  { value: 'tailor', label: 'Tailor' },
  { value: 'driver', label: 'Driver' },
]

function AgentStatsSummary({ stats }: { readonly stats: AgentSession['stats'] }) {
  const items = [
    { label: 'Found', value: stats.found },
    { label: 'Matched', value: stats.matched },
    { label: 'Tailored', value: stats.tailored },
    { label: 'Applied', value: stats.applied },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface p-4 shadow-control">
          <p className="text-xs font-semibold uppercase tracking-[0.3px] text-ink-muted">{item.label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

const agentTips: Record<string, { readonly title: string; readonly body: string }> = {
  scout: { title: 'Scout', body: 'Searches job boards like LinkedIn, Greenhouse, and Lever for new postings that match your criteria.' },
  filter: { title: 'Filter', body: 'Scores every job Scout finds against your resume — title, certifications, location, and salary — to surface the best matches.' },
  tailor: { title: 'Tailor', body: "Waits until you've reviewed Filter's matches and selectively chosen which jobs to move forward with, then generates a tailored version of your resume for each one — optimizing keywords and content for that specific posting." },
  driver: { title: 'Driver', body: "Picks up once Tailor has finished the resumes for your selected jobs, then submits each application, carrying it through the employer's application flow." },
}

function AgentStatusCards({ agents }: { readonly agents: AgentSession['agents'] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {agents.filter((a) => a.name !== 'system').map((agent) => {
        const tip = agentTips[agent.name]
        return (
          <article key={agent.name} className="rounded-lg border border-border bg-surface p-4 shadow-control">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.3px] text-ink">{agent.label}</h2>
                {tip ? <TipModalTrigger label={`What does ${agent.label} do?`} title={tip.title} body={tip.body} /> : null}
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', agentStatusTone[agent.status] ?? agentStatusTone.idle)}>
                {agent.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink">{agent.currentTask}</p>
          </article>
        )
      })}
    </div>
  )
}

function AgentFeed({ events }: { readonly events: FeedEvent[] }) {
  const [activeTab, setActiveTab] = useState<AgentTabValue>('all')
  const feedRef = useRef<HTMLDivElement>(null)

  const filtered = activeTab === 'all' ? events : events.filter((e) => e.agent === activeTab)

  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [events.length])

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-control">
      <div className="flex items-center justify-between border-b border-border px-4">
        <nav className="flex" aria-label="Filter activity by agent">
          {agentTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              aria-current={activeTab === tab.value ? 'true' : undefined}
              className={cn(
                'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                activeTab === tab.value ? 'border-accent text-accent' : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <span className="flex items-center gap-1.5 text-xs font-medium text-positive">
          <span className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
          Live
        </span>
      </div>
      <div ref={feedRef} className="max-h-[480px] overflow-y-auto px-4 py-3">
        {filtered.map((event, i) => {
          const Icon = agentIcon[event.agent] ?? Zap
          const isLast = i === filtered.length - 1
          const isTopLevel = activeTab !== 'all' || event.agent === 'scout' || event.agent === 'system'
          return (
            <div key={event.id} className={cn('flex gap-3', !isTopLevel && 'ml-5')}>
              <div className="flex flex-col items-center pt-0.5">
                <Icon className="size-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
                {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className={cn('min-w-0 pb-4', isLast && 'pb-1')}>
                <div className="mb-0.5 flex items-center gap-2">
                  {event.agent !== 'system' && (
                    <span className={cn('text-xs font-semibold capitalize', isTopLevel ? 'text-ink' : 'text-ink-muted')}>
                      {event.agent}
                    </span>
                  )}
                  <span className="text-xs text-ink-muted">
                    {event.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
                <p className={cn('text-sm leading-relaxed', isTopLevel ? 'text-ink' : 'text-ink-muted')}>{event.message}</p>
                {event.thought && <p className="mt-1 text-xs italic text-ink-muted">{event.thought}</p>}
                {event.links && event.links.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {event.links.map((link: FeedLink) => (
                      <span key={link.label} className="text-xs text-accent underline underline-offset-4">
                        {link.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function AutoApplyAgentView({ homeHref, setupHref, agentHref, jobsHref, appliedHref }: AutoApplyAgentViewProps) {
  const session = useAgentSession('auto-apply')

  return (
    <AppShell homeHref={homeHref} title="Agents" active="agent" setupHref={setupHref} agentHref={agentHref} jobsHref={jobsHref} appliedHref={appliedHref}>
      <div className="pt-5">
        <AgentStatsSummary stats={session.stats} />
        <div className="mt-4">
          <AgentStatusCards agents={session.agents} />
        </div>
        <div className="mt-6">
          <AgentFeed events={session.events} />
        </div>
      </div>
    </AppShell>
  )
}

// ─── Jobs View ────────────────────────────────────────────────────────────────

function JobSearch({ onRefresh }: { readonly onRefresh?: () => void }) {
  return (
    <div>
      <div className="flex gap-2">
        <label className="relative block flex-1">
          <span className="sr-only">Search by title or company</span>
          <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
          <input className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder="Search by title or company" />
        </label>
        {onRefresh ? (
          <>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Filter aria-hidden="true" className="size-4" />
              Filter
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-label="Refresh job list"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Refresh
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

function OutcomeBadge({ outcome }: { readonly outcome: AutoApplyOutcome }) {
  if (outcome === 'success') {
    return <span className="shrink-0 rounded-lg bg-positive-surface px-4 py-2 text-sm font-medium text-positive">Success</span>
  }
  if (outcome === 'failed') {
    return <span className="shrink-0 rounded-lg bg-danger-surface px-4 py-2 text-sm font-medium text-danger">Failed</span>
  }
  if (outcome === 'closed') {
    return <span className="shrink-0 rounded-lg bg-surface-subtle px-4 py-2 text-sm font-medium text-ink-muted">Closed</span>
  }
  return <span className="shrink-0 rounded-lg bg-warning-surface px-4 py-2 text-sm font-medium text-warning">Needs Review</span>
}

function JobList({
  jobs,
  selectedJob,
  onSelectJob,
  selectedIds,
  onSelectionChange,
  variant = 'jobs',
  onReview,
}: {
  readonly jobs: readonly AutoApplyJob[]
  readonly selectedJob?: AutoApplyJob
  readonly onSelectJob: (job: AutoApplyJob) => void
  readonly selectedIds?: ReadonlySet<string>
  readonly onSelectionChange?: (ids: ReadonlySet<string>) => void
  readonly variant?: 'jobs' | 'applied'
  readonly onReview?: (job: AutoApplyJob) => void
}) {
  const [internalSelected, setInternalSelected] = useState<ReadonlySet<string>>(new Set())
  const selected = selectedIds ?? internalSelected
  const setSelected = onSelectionChange ?? setInternalSelected

  function toggleRow(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function toggleAll() {
    if (selected.size === jobs.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(jobs.map((j) => j.id)))
    }
  }

  return (
    <div>
      <div className="grid gap-1 pt-5">
        {jobs.map((job) => {
          const isSelected = selected.has(job.id)
          const isReviewRow = variant === 'applied' && job.outcome === 'needs-review'
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => (isReviewRow ? onReview?.(job) : onSelectJob(job))}
              className={cn(
                'group/row flex w-full items-start gap-4 border-b border-border px-[16px] py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                isSelected ? 'bg-accent/10' : 'hover:bg-surface-subtle',
              )}
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold',
                  job.company.toLowerCase().includes('stripe') ? 'bg-accent-subtle text-accent-text' : 'bg-danger-surface text-danger',
                )}
              >
                {job.company.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">{job.title}</span>
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold text-positive bg-positive-surface">{job.matchPercent}% MATCH</span>
                </span>
                <span className="mt-1 block text-xs text-ink-muted">
                  {job.company} - {job.location} - {job.type}
                </span>
                <span className="mt-1 block text-xs text-ink-muted">
                  {job.dateLabel} - {job.source}
                </span>
              </span>
              {variant === 'applied' && job.outcome ? (
                <OutcomeBadge outcome={job.outcome} />
              ) : job.status === 'applied' ? (
                <span className="shrink-0 rounded-lg bg-accent-subtle px-4 py-2 text-sm font-medium text-accent-text">Applied</span>
              ) : (
                <span className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">Apply</span>
              )}
            </button>
          )
        })}
      </div>
      {selected.size > 0 ? (
        <div className="flex items-center justify-between border-t border-border bg-accent/10 px-6 py-3">
          <span className="text-sm font-semibold text-ink">{selected.size} job{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Download aria-hidden="true" className="size-4" />
              Export
            </button>
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Mail aria-hidden="true" className="size-4" />
              Email
            </button>
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-danger bg-danger-surface px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Trash2 aria-hidden="true" className="size-4" />
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function JobPreview({
  job,
  onClose,
  applied = false,
  resumePreview,
}: {
  readonly job: AutoApplyJob
  readonly onClose: () => void
  readonly applied?: boolean
  readonly resumePreview: ResumeDocument
}) {
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false)
  const reasonNote = applied && (job.outcome === 'failed' || job.outcome === 'closed') ? job.reviewNote : undefined

  return (
    <>
      <div className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={onClose} aria-hidden="true" />
      <aside className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-border bg-surface shadow-panel lg:static lg:z-auto lg:h-full lg:w-[26rem] lg:max-h-none lg:shrink-0 lg:rounded-none lg:border-0 lg:border-s lg:shadow-none">
        <div className="flex shrink-0 items-center justify-between px-6 pt-4 pb-2 lg:hidden">
          <div className="mx-auto h-1 w-10 rounded-full bg-muted" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between px-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-ink">{job.title}</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close job preview" className="grid size-10 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center gap-2">
            {applied && job.outcome ? (
              <OutcomeBadge outcome={job.outcome} />
            ) : (
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', applied ? 'bg-positive-surface text-positive' : 'bg-warning-surface text-warning')}>{applied ? 'Applied' : 'NEW'}</span>
            )}
            <span className="text-sm text-ink-muted">{job.dateLabel}</span>
          </div>

          <div className="mt-5 grid gap-5">
            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Job Listing</h3>
              <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{job.listingUrl}</span>
              </a>
            </section>

            {reasonNote ? (
              <section className={cn('rounded-lg p-4', job.outcome === 'failed' ? 'bg-danger-surface' : 'bg-surface-subtle')}>
                <h3 className={cn('text-xs font-bold uppercase tracking-wide', job.outcome === 'failed' ? 'text-danger' : 'text-ink-muted')}>
                  {job.outcome === 'failed' ? 'Why it failed' : 'Why it’s closed'}
                </h3>
                <p className={cn('mt-1 text-sm leading-6', job.outcome === 'failed' ? 'text-danger' : 'text-ink-muted')}>{reasonNote}</p>
              </section>
            ) : null}

            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Resume Used</h3>
              <button
                type="button"
                onClick={() => setResumePreviewOpen(true)}
                className="flex min-w-0 items-center gap-2 rounded-lg text-sm text-ink underline underline-offset-4 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                <span className="truncate">{job.resumeFileName}</span>
              </button>
            </section>

            {!applied ? (
              <>
                <section className="rounded-lg bg-positive-surface p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-positive">Match Score</h3>
                    <p className="text-2xl font-bold text-positive">{job.matchPercent}%</p>
                  </div>
                </section>

                <div className="flex flex-wrap gap-2">{job.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>

                <section className="grid gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">About the role</h3>
                  <p className="text-sm leading-6 text-ink-muted">{job.description}</p>
                </section>
              </>
            ) : null}
          </div>

          <div className="mt-6 grid gap-2 border-t border-border pt-5">
            {applied ? (
              <>
                <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  View Listing
                </a>
                <button type="button" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Close
                </button>
              </>
            ) : (
              <>
                <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Send aria-hidden="true" className="size-4" />
                  Apply Now
                </button>
                <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  View Listing
                </a>
                <button type="button" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
      <ResumeUsedDialog open={resumePreviewOpen} onOpenChange={setResumePreviewOpen} fileName={job.resumeFileName} resume={resumePreview} />
    </>
  )
}

function ResumeUsedDialog({
  open,
  onOpenChange,
  fileName,
  resume,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly fileName: string
  readonly resume: ResumeDocument
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup placement="center" aria-label="Resume used" className="flex max-h-[85vh] flex-col p-0 sm:max-h-[calc(100vh-4rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-3 pt-6">
          <div className="flex min-w-0 items-center gap-2">
            <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
            <DialogTitle className="truncate text-sm">{fileName}</DialogTitle>
          </div>
          <DialogClose className="static" />
        </div>
        <div className="flex-1 overflow-y-auto bg-canvas px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-8 shadow-panel">
            <h1 className="text-2xl font-bold text-ink">{resume.candidateName}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {resume.email} · {resume.location} · {resume.linkedinUrl}
            </p>
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink-muted">Summary</h2>
              <p className="mt-2 text-sm leading-6 text-ink">{resume.summary}</p>
            </section>
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink-muted">Experience</h2>
              <div className="mt-2 grid gap-5">
                {resume.roles.map((role) => (
                  <div key={`${role.company}-${role.title}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <p className="text-sm font-semibold text-ink">{role.title} · {role.company}</p>
                      <p className="text-xs text-ink-muted">{role.period}</p>
                    </div>
                    <ul className="mt-1.5 grid gap-1 text-sm leading-6 text-ink-muted">
                      {role.bullets.slice(0, 2).map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-pill bg-ink-muted" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink-muted">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="rounded-pill bg-surface-subtle px-3 py-1 text-xs font-medium text-ink-muted">{skill}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

type JobFilters = {
  readonly location: string
  readonly matchMin: number
  readonly status: string
}

const DEFAULT_FILTERS: JobFilters = { location: 'all', matchMin: 0, status: 'all' }

function FilterDropdown({
  filters,
  onFiltersChange,
}: {
  readonly filters: JobFilters
  readonly onFiltersChange: (f: JobFilters) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeCount = (filters.location !== 'all' ? 1 : 0) + (filters.matchMin > 0 ? 1 : 0) + (filters.status !== 'all' ? 1 : 0)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          activeCount > 0 ? 'border-accent bg-accent-subtle text-accent-text' : 'border-input bg-surface text-ink-muted hover:bg-surface-subtle hover:text-ink',
        )}
      >
        <Filter aria-hidden="true" className="size-4" />
        Filter{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-panel">
          <div className="grid gap-4">
            <FormSelectField
              id="auto-apply-filter-location"
              label="Location"
              value={filters.location}
              onValueChange={(value) => onFiltersChange({ ...filters, location: value })}
              options={[
                { label: 'All locations', value: 'all' },
                { label: 'Remote', value: 'remote' },
                { label: 'Onsite', value: 'onsite' },
                { label: 'Hybrid', value: 'hybrid' },
              ]}
            />
            <FormSelectField
              id="auto-apply-filter-match"
              label="Match score"
              value={String(filters.matchMin)}
              onValueChange={(value) => onFiltersChange({ ...filters, matchMin: Number(value) })}
              options={[
                { label: 'Any match', value: '0' },
                { label: '90%+', value: '90' },
                { label: '80%+', value: '80' },
                { label: '70%+', value: '70' },
              ]}
            />
            <FormSelectField
              id="auto-apply-filter-status"
              label="Status"
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
              options={[
                { label: 'All statuses', value: 'all' },
                { label: 'New', value: 'new' },
                { label: 'Applied', value: 'applied' },
              ]}
            />
            {activeCount > 0 ? (
              <button
                type="button"
                onClick={() => onFiltersChange(DEFAULT_FILTERS)}
                className="min-h-9 rounded-lg border border-border px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function applyJobFilters(jobs: readonly AutoApplyJob[], search: string, filters: JobFilters): readonly AutoApplyJob[] {
  return jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    const matchesLocation =
      filters.location === 'all' ||
      (filters.location === 'remote' && j.location.toLowerCase().includes('remote')) ||
      (filters.location === 'onsite' && !j.location.toLowerCase().includes('remote') && !j.location.toLowerCase().includes('hybrid')) ||
      (filters.location === 'hybrid' && j.location.toLowerCase().includes('hybrid'))
    const matchesMatch = j.matchPercent >= filters.matchMin
    const matchesStatus = filters.status === 'all' || j.status === filters.status
    return matchesSearch && matchesLocation && matchesMatch && matchesStatus
  })
}

export function AutoApplyJobsView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, selectedJob: initialSelectedJob, isPremiumUser = false, resumePreview }: AutoApplyJobsViewProps) {
  const [selectedJob, setSelectedJob] = useState<AutoApplyJob | undefined>(initialSelectedJob)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const [refreshKey, setRefreshKey] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const filtered = applyJobFilters(jobs, search, filters)

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-0 py-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[56rem] bg-surface shadow-panel">
            <div className="flex min-h-[5rem] items-center justify-between gap-4 border-b border-border px-[16px] sm:px-8">
              <h1 className="text-xl font-medium leading-5 text-ink">Jobs</h1>
              <a href={setupHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Update Preference
              </a>
            </div>
            <div className="p-[16px] sm:p-8">
              <div className="border-b border-border">
                <nav aria-label="Auto apply sections" className="flex gap-6 text-sm font-medium">
                  <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
                  <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
                  <a href={jobsHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
                  <a href={appliedHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
                </nav>
              </div>
              <div className="flex gap-6 pt-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex gap-2">
                    <label className="relative block flex-1">
                      <span className="sr-only">Search by title or company</span>
                      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                        placeholder="Search by title or company"
                      />
                    </label>
                    <FilterDropdown filters={filters} onFiltersChange={setFilters} />
                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      aria-label="Refresh job list"
                    >
                      <RefreshCw aria-hidden="true" className="size-4" />
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(true)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-input bg-surface text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      aria-label="Automate job applications settings"
                    >
                      <Settings aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                  <div className="-mx-[16px] sm:mx-0">
                    <JobList jobs={filtered} selectedJob={selectedJob} onSelectJob={(job) => setSelectedJob(selectedJob?.id === job.id ? undefined : job)} />
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-4 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1 text-ink-muted"><ChevronLeft aria-hidden="true" className="size-4" />Previous</span>
                    <span>Page 1 of 43</span>
                    <span className="inline-flex items-center gap-1 text-ink">Next<ChevronRight aria-hidden="true" className="size-4" /></span>
                  </div>
                </div>
                {selectedJob ? <JobPreview job={selectedJob} onClose={() => setSelectedJob(undefined)} resumePreview={resumePreview} /> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      <AutoApplySettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} isPremium={isPremiumUser} />
    </Workspace>
  )
}

function AutoApplySettingsDialog({
  open,
  onOpenChange,
  isPremium,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly isPremium: boolean
}) {
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false)
  const [dailyQuota, setDailyQuota] = useState(5)
  const [startTime, setStartTime] = useState('09:00')
  const [showUpgradeGate, setShowUpgradeGate] = useState(false)

  function handleSave() {
    if (!isPremium) {
      setShowUpgradeGate(true)
      return
    }
    onOpenChange(false)
  }

  if (showUpgradeGate) {
    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          onOpenChange(nextOpen)
          if (!nextOpen) setShowUpgradeGate(false)
        }}
      >
        <DialogPopup aria-label="Upgrade to Premium">
          <DialogClose />
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-border bg-surface-raised text-ink-muted shadow-control [&>svg]:size-5">
            <Lock aria-hidden="true" />
          </span>
          <DialogTitle className="mt-4">Upgrade to Premium</DialogTitle>
          <p className="mt-1 text-sm text-ink-muted">
            Automating job applications is available on our Premium plan. Upgrade to save this quota and let Lightforth apply to matching jobs for you automatically.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowUpgradeGate(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Not now
            </button>
            <a
              href="/v3/billing"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Upgrade Plan
            </a>
          </div>
        </DialogPopup>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) setShowUpgradeGate(false)
      }}
    >
      <DialogPopup aria-label="Automate job applications">
        <DialogClose />
        <DialogTitle>Automate job applications</DialogTitle>
        <p className="mt-1 text-sm text-ink-muted">
          Let Lightforth automatically apply to jobs that match your preferences, up to a daily limit you set.
        </p>
        <label className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border p-4">
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">Auto-apply to matching jobs</span>
            <span className="mt-0.5 block text-xs text-ink-muted">Applications are submitted automatically as new matches come in.</span>
          </span>
          <input
            type="checkbox"
            checked={autoApplyEnabled}
            onChange={(event) => setAutoApplyEnabled(event.target.checked)}
            className="size-5 shrink-0 rounded border-input text-accent focus:ring-2 focus:ring-focus"
          />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor="auto-apply-quota" className="text-sm font-medium text-ink">
              Applications per day
            </label>
            <input
              id="auto-apply-quota"
              type="number"
              min={1}
              max={50}
              value={dailyQuota}
              onChange={(event) => setDailyQuota(Number(event.target.value))}
              disabled={!autoApplyEnabled}
              className="min-h-11 rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="auto-apply-start-time" className="text-sm font-medium text-ink">
              Start time
            </label>
            <input
              id="auto-apply-start-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              disabled={!autoApplyEnabled}
              className="min-h-11 rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-muted">Lightforth will start submitting applications at this time each day, until your daily quota is reached.</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Save
          </button>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

function RetryApplicationModal({
  job,
  open,
  onOpenChange,
}: {
  readonly job: AutoApplyJob | undefined
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}) {
  const [usWorkAuth, setUsWorkAuth] = useState('')
  const [willingToStart, setWillingToStart] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) {
          setUsWorkAuth('')
          setWillingToStart('')
          setSubmitted(false)
        }
      }}
    >
      <DialogPopup aria-label="Retry application">
        {job ? (
          submitted ? (
            <>
              <div className="flex items-center gap-3">
                <CheckCircle2 aria-hidden="true" className="size-6 shrink-0 text-positive" />
                <DialogTitle>Application resubmitted</DialogTitle>
              </div>
              <DialogDescription className="text-ink">
                We&apos;ve resubmitted your application to {job.company} with the updated information. We&apos;ll let you know once we hear back.
              </DialogDescription>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <AlertTriangle aria-hidden="true" className="size-6 shrink-0 text-warning" />
                <DialogTitle>Needs Review</DialogTitle>
              </div>
              <DialogDescription className="text-ink">
                {job.reviewNote ?? 'This application needs some missing information before it can be retried.'}
              </DialogDescription>
              <p className="mt-3 text-sm text-ink-muted">{job.title} · {job.company}</p>
              <div className="mt-5 grid gap-4">
                <FormSelectField
                  id="retry-us-work-auth"
                  label="US Work Authorization"
                  placeholder="Select status"
                  value={usWorkAuth}
                  onValueChange={setUsWorkAuth}
                  options={US_WORK_AUTH_OPTIONS.map((option) => ({ label: option, value: option }))}
                />
                <FormSelectField
                  id="retry-start-timeline"
                  label="Willing to Start"
                  placeholder="Select timeline"
                  value={willingToStart}
                  onValueChange={setWillingToStart}
                  options={START_TIMELINE_OPTIONS.map((option) => ({ label: option, value: option }))}
                />
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!usWorkAuth || !willingToStart}
                  onClick={() => setSubmitted(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send aria-hidden="true" className="size-4" />
                  Retry Application
                </button>
              </div>
            </>
          )
        ) : null}
      </DialogPopup>
    </Dialog>
  )
}

// ─── Applied View ─────────────────────────────────────────────────────────────

export function AutoApplyAppliedView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, application, resumePreview }: AutoApplyAppliedViewProps) {
  const [selectedJob, setSelectedJob] = useState<AutoApplyJob | undefined>(application.job)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const [refreshKey, setRefreshKey] = useState(0)
  const [reviewJob, setReviewJob] = useState<AutoApplyJob | undefined>(undefined)
  const [retryOpen, setRetryOpen] = useState(false)

  const allJobs = jobs
    .map((job) => (job.id === application.job.id ? application.job : job))
    .filter((job) => job.status === 'applied')
  const filtered = applyJobFilters(allJobs, search, filters)

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-0 py-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[56rem] bg-surface shadow-panel">
            <div className="flex min-h-[5rem] items-center justify-between gap-4 border-b border-border px-[16px] sm:px-8">
              <h1 className="text-xl font-medium leading-5 text-ink">Applied</h1>
              <a href={setupHref} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                Update Preference
              </a>
            </div>
            <div className="p-[16px] sm:p-8">
              <div className="border-b border-border">
                <nav aria-label="Auto apply sections" className="flex gap-6 text-sm font-medium">
                  <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
                  <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
                  <a href={jobsHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
                  <a href={appliedHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
                </nav>
              </div>
              <div className="flex gap-6 pt-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex gap-2">
                    <label className="relative block flex-1">
                      <span className="sr-only">Search applied jobs</span>
                      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                        placeholder="Search applied jobs"
                      />
                    </label>
                    <FilterDropdown filters={filters} onFiltersChange={setFilters} />
                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      aria-label="Refresh applied list"
                    >
                      <RefreshCw aria-hidden="true" className="size-4" />
                      Refresh
                    </button>
                  </div>
                  <div className="-mx-[16px] sm:mx-0">
                    <JobList
                      jobs={filtered}
                      selectedJob={selectedJob}
                      onSelectJob={(job) => setSelectedJob(selectedJob?.id === job.id ? undefined : job)}
                      variant="applied"
                      onReview={(job) => {
                        setReviewJob(job)
                        setRetryOpen(true)
                      }}
                    />
                  </div>
                </div>
                {selectedJob ? (
                  <JobPreview
                    job={selectedJob}
                    onClose={() => setSelectedJob(undefined)}
                    applied
                    resumePreview={resumePreview}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      <RetryApplicationModal job={reviewJob} open={retryOpen} onOpenChange={setRetryOpen} />
    </Workspace>
  )
}
