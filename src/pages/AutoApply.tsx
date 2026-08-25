import { useState, useEffect } from 'react'
import {
  Check, Search, ArrowUpRight, X, FileText,
  Bot, Zap, Briefcase, Network, Sparkles, AlertTriangle,
  ArrowDown, ChevronDown, ChevronUp, Link as LinkIcon, Clock3, Paperclip, MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import AgentsTab from '@/components/agents/AgentsTab'

type AutoApplyView = 'setup' | 'paywall' | 'loading' | 'dashboard'
type SetupStep = 1 | 2 | 3 | 4
type DashboardTab = 'setup' | 'jobs' | 'applied' | 'agent'
type IssueStatus = 'needs_review' | 'retrying' | 'resolved'
type ManualApplication = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  source: string
  url: string
  date: string
  status: 'pending'
  resumeUsed: string
  coverLetterUsed: string
}
type AutoApplyIssue = {
  id: string
  jobId: string
  title: string
  company: string
  source: string
  reason: string
  fallback: string
  status: IssueStatus
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180k/yr', type: 'Full-time', level: 'Senior Level', source: 'Indeed', date: 'Feb 8, 2026', applicants: 59, match: 95, matchLabel: 'EXCELLENT MATCH', matchHighlight: 'H1B Sponsor Likely', resumeUsed: 'Resume_Tailored_Google.pdf', description: 'Build and maintain high-performance web applications used by billions. You\'ll partner with product managers, designers, and backend engineers to ship polished, accessible interfaces. Strong React, TypeScript, and performance optimisation skills required.', perks: ['Competitive equity & RSUs', 'Full health, dental & vision', 'H1B sponsorship', '20 weeks parental leave', 'Free meals on campus', '$10k annual learning budget'] },
  { id: '2', title: 'Product Designer', company: 'Apple', location: 'Cupertino, CA', salary: 'Competitive', type: 'Full-time', level: 'Senior Level', source: 'LinkedIn', date: 'Feb 7, 2026', applicants: 191, match: 88, matchLabel: 'STRONG MATCH', matchHighlight: 'Growth Opportunities', resumeUsed: 'Resume_Tailored_Apple.pdf', description: 'Join the team that defines how hundreds of millions of people interact with technology. You\'ll design end-to-end experiences across hardware and software, bringing exceptional taste and rigor to every interaction.', perks: ['Product discounts', 'RSU grants', 'On-site fitness centres', 'Sabbatical programme', 'Full medical coverage', 'Commuter benefits'] },
  { id: '3', title: 'Data Scientist', company: 'Meta', location: 'Menlo Park, CA', salary: '$160k–$200k/yr', type: 'Full-time', level: 'Mid, Senior Level', source: 'Workable', date: 'Feb 6, 2026', applicants: 83, match: 78, matchLabel: 'GOOD MATCH', matchHighlight: 'Remote-Friendly', resumeUsed: 'Resume_Tailored_Meta.pdf', description: 'Use data at unprecedented scale to shape products for 3 billion people. You\'ll run experiments, build predictive models, and partner with product teams to drive business decisions across the family of apps.', perks: ['Generous RSU package', 'Remote-friendly policy', 'Free meals', '$4k tech stipend', 'Mental health support', 'On-site healthcare'] },
  { id: '4', title: 'UX Researcher', company: 'Amazon', location: 'Seattle, WA', salary: '$130k–$160k/yr', type: 'Full-time', level: 'Mid Level', source: 'Monster', date: 'Feb 5, 2026', applicants: 44, match: 85, matchLabel: 'STRONG MATCH', matchHighlight: 'H1B Sponsor Likely', resumeUsed: 'Resume_Tailored_Amazon.pdf', description: 'Lead qualitative and quantitative research that shapes the shopping experiences of hundreds of millions of customers. You\'ll own studies from scoping through synthesis and present findings to senior leadership.', perks: ['Sign-on bonus', 'H1B sponsorship', 'Relocation assistance', 'Comprehensive health plans', '401k match', 'Employee discount'] },
  { id: '5', title: 'Backend Developer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$190k/yr', type: 'Full-time', level: 'Senior Level', source: 'ZipRecruiter', date: 'Feb 4, 2026', applicants: 22, match: 91, matchLabel: 'EXCELLENT MATCH', matchHighlight: 'Top Compensation', resumeUsed: 'Resume_Tailored_Netflix.pdf', description: 'Build the systems that deliver entertainment to 260M+ subscribers worldwide. You\'ll work on high-throughput APIs, streaming infrastructure, and distributed systems that must remain resilient at massive scale.', perks: ['Industry-leading salary', 'Unlimited PTO', 'No bureaucracy culture', 'Top-tier health coverage', 'Stock options', 'Annual travel allowance'] },
  { id: '6', title: 'Mobile App Developer', company: 'Microsoft', location: 'Redmond, WA', salary: '$150k/yr', type: 'Full-time', level: 'Mid Level', source: 'CareerBuilder', date: 'Feb 3, 2026', applicants: 67, match: 72, matchLabel: 'GOOD MATCH', matchHighlight: 'Remote Option', resumeUsed: 'Resume_Tailored_Microsoft.pdf', description: 'Develop cross-platform mobile experiences for Microsoft\'s productivity suite. You\'ll write Swift and Kotlin across iOS and Android, collaborating with design and platform teams to deliver polished, accessible apps.', perks: ['Hybrid work options', 'ESPP', 'Comprehensive wellness', 'Generous 401k', 'Free Xbox & Surface', 'Tuition reimbursement'] },
  { id: '7', title: 'DevOps Engineer', company: 'Slack', location: 'San Francisco, CA', salary: '$145k/yr', type: 'Full-time', level: 'Senior Level', source: 'Remote.co', date: 'Feb 2, 2026', applicants: 38, match: 80, matchLabel: 'STRONG MATCH', matchHighlight: 'Remote-Friendly', resumeUsed: 'Resume_Tailored_Slack.pdf', description: 'Own the infrastructure that keeps Slack running for 38M daily active users. You\'ll drive improvements to our CI/CD pipelines, Kubernetes clusters, and incident response processes while championing reliability across engineering.', perks: ['Fully remote role', 'Home office stipend', 'Salesforce parent benefits', '$2k wellness budget', 'Equity', 'Flexible PTO'] },
  { id: '8', title: 'Data Analyst', company: 'Airbnb', location: 'San Francisco, CA', salary: '$120k/yr', type: 'Full-time', level: 'Mid Level', source: 'Glassdoor', date: 'Feb 1, 2026', applicants: 112, match: 74, matchLabel: 'GOOD MATCH', matchHighlight: 'Growth Opportunities', resumeUsed: 'Resume_Tailored_Airbnb.pdf', description: 'Turn Airbnb\'s rich data into insights that guide product strategy and business decisions. You\'ll build dashboards, run A/B analyses, and partner with cross-functional teams to improve the host and guest experience.', perks: ['Annual travel credit', 'Equity grants', 'Remote-first culture', 'Comprehensive health', 'Career growth support', 'Paid volunteer time'] },
  { id: '9', title: 'Software Architect', company: 'Uber', location: 'San Francisco, CA', salary: '$200k+/yr', type: 'Full-time', level: 'Lead Level', source: 'FlexJobs', date: 'Jan 31, 2026', applicants: 29, match: 87, matchLabel: 'STRONG MATCH', matchHighlight: 'H1B Sponsor Likely', resumeUsed: 'Resume_Tailored_Uber.pdf', description: 'Define the technical direction for Uber\'s core platform services. You\'ll make foundational decisions that affect thousands of engineers and millions of trips per day, balancing scalability, reliability, and developer experience.', perks: ['H1B sponsorship', 'Top-band compensation', 'Uber credits', 'Stock options', 'Hybrid flexibility', 'Annual learning stipend'] },
  { id: '10', title: 'Machine Learning Engineer', company: 'Lyft', location: 'San Francisco, CA', salary: '$170k/yr', type: 'Full-time', level: 'Senior Level', source: 'AngelList', date: 'Jan 30, 2026', applicants: 55, match: 93, matchLabel: 'EXCELLENT MATCH', matchHighlight: 'AI-Focused Team', resumeUsed: 'Resume_Tailored_Lyft.pdf', description: 'Build ML systems that power ride pricing, matching, and demand forecasting at Lyft. You\'ll train and deploy production models, design data pipelines, and collaborate with research scientists to push model quality forward.', perks: ['AI-focused team', 'Lyft credits', 'Equity upside', 'Flexible remote days', 'Mental health days', 'Competitive health plan'] },
]

interface AppliedDetail {
  timeline?: { date: string; events: { label: string; time: string }[] }[]
  personalInfo?: { label: string; value: string; incomplete?: boolean; pills?: string[]; selectedPill?: string }[]
  attachments?: { label: string; filename: string }[]
  applicationQuestions?: { question: string; answer: string; incomplete?: boolean }[]
}

const APPLIED_DETAILS: Record<string, AppliedDetail> = {
  '1': {
    timeline: [{ date: 'FEB 8', events: [{ label: 'Clicked Apply', time: '09:14 AM' }, { label: 'Application submitted', time: '09:18 AM' }] }],
    personalInfo: [
      { label: 'First Name', value: 'Darnell' },
      { label: 'Last Name', value: 'Brooks' },
      { label: 'Phone', value: '+12025550173' },
      { label: 'Address', value: '204 Oak Street' },
      { label: 'City', value: 'San Francisco' },
      { label: 'ZIP', value: '94102' },
      { label: 'LinkedIn URL', value: 'linkedin.com/in/darnellbrooks' },
      { label: 'Date Available', value: '2026-03' },
      { label: 'Desired Pay', value: '180000' },
      { label: 'Website, Blog or Portfolio', value: '', incomplete: true },
      { label: 'Country', value: '', pills: ['United States', 'Canada', 'United Kingdom', 'Australia'], selectedPill: 'United States' },
      { label: 'State / Province', value: 'California' },
    ],
    attachments: [{ label: 'Upload your resume', filename: 'Resume_Tailored_Google.pdf' }],
    applicationQuestions: [
      { question: 'Please answer the screening questions. Only completed applications will be reviewed.', answer: 'Throughout my career as a Frontend Engineer, I have consistently integrated scalable UI patterns with performance-first thinking. My recent work involved rebuilding a design system used by 40+ engineers.' },
      { question: "Tell us something about yourself that isn't on your resume.", answer: 'Outside of my work as a Frontend Engineer, I am an avid open-source contributor. I find that maintaining public libraries — where users are strangers with real expectations — forces a level of rigor that has directly improved how I approach production codebases.' },
    ],
  },
  '2': {
    timeline: [{ date: 'FEB 7', events: [{ label: 'Clicked Apply', time: '02:30 PM' }, { label: 'Application blocked', time: '02:34 PM' }] }],
    personalInfo: [
      { label: 'First Name', value: 'Darnell' },
      { label: 'Last Name', value: 'Brooks' },
      { label: 'Phone', value: '+12025550173' },
      { label: 'Website, Blog or Portfolio', value: '', incomplete: true },
      { label: 'Country', value: '', pills: ['United States', 'Canada', 'United Kingdom', 'Australia'], selectedPill: 'United States' },
      { label: 'State / Province', value: 'California' },
    ],
    attachments: [{ label: 'Upload your resume', filename: 'Resume_Tailored_Apple.pdf' }],
    applicationQuestions: [
      { question: 'Share a link to your design portfolio.', answer: '', incomplete: true },
    ],
  },
  '3': {
    timeline: [{ date: 'FEB 6', events: [{ label: 'Clicked Apply', time: '11:05 AM' }, { label: 'Application submitted', time: '11:11 AM' }] }],
    personalInfo: [
      { label: 'First Name', value: 'Darnell' },
      { label: 'Last Name', value: 'Brooks' },
      { label: 'Phone', value: '+12025550173' },
      { label: 'Date Available', value: '2026-03' },
      { label: 'Desired Pay', value: '165000' },
      { label: 'Country', value: '', pills: ['United States', 'Canada', 'United Kingdom', 'Australia'], selectedPill: 'United States' },
      { label: 'State / Province', value: 'California' },
    ],
    attachments: [{ label: 'Upload your resume', filename: 'Resume_Tailored_Meta.pdf' }],
    applicationQuestions: [
      { question: 'Describe a project where you used machine learning or advanced statistics to drive a business decision.', answer: 'At my previous role I built a churn prediction model using XGBoost that identified at-risk users with 87% precision. The model fed a personalised re-engagement campaign that recovered $2.4M ARR in the first quarter. I owned the full pipeline from data extraction to deployment on AWS SageMaker.' },
    ],
  },
}

const FEATURES = [
  { icon: Bot, title: 'Hands-Free Applications', desc: 'AI applies to hundreds of matched jobs while you get on with your life' },
  { icon: Zap, title: 'Smart Job Matching', desc: 'Only relevant roles — filtered by your skills, preferences, and experience' },
  { icon: Briefcase, title: 'Tailored Resumes', desc: 'Every application goes out with a resume customised for that exact role' },
  { icon: Network, title: 'Full Application Tracking', desc: 'See every application, its status, and what happens next — all in one place' },
]

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']

function inferApplicationFromUrl(url: string): ManualApplication {
  let host = 'Job link'
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    host = url.replace(/^https?:\/\//, '').split('/')[0] || 'Job link'
  }
  const company = host.split('.')[0]?.replace(/[-_]/g, ' ') || 'Company'
  const companyName = company.replace(/\b\w/g, (letter) => letter.toUpperCase())
  return {
    id: `manual-${Date.now()}`,
    title: 'Job application',
    company: companyName,
    location: 'Parsing job link',
    salary: 'Pending',
    source: host,
    url,
    date: 'Today',
    status: 'pending',
    resumeUsed: `Resume_Tailored_${companyName.replace(/\s+/g, '_')}.pdf`,
    coverLetterUsed: `Cover_Letter_${companyName.replace(/\s+/g, '_')}.pdf`,
  }
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function TipsButton() {
  return (
    <button className="flex items-center gap-1 rounded-lg border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
      <Sparkles className="h-3 w-3" /> Tips
    </button>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  fullWidth,
  disabled,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
  disabled?: boolean
  type?: string
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <label className="lf-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'lf-input',
          disabled && 'cursor-not-allowed bg-muted text-muted-foreground'
        )}
      />
    </div>
  )
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
  required,
  fullWidth,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  required?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <label className="lf-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="lf-select"
        >
          <option value="">Select...</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-primary h-4 w-4 flex-shrink-0"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

function RadioField({
  question,
  name,
  value,
  onChange,
}: {
  question: string
  name: string
  value: 'yes' | 'no'
  onChange: (v: 'yes' | 'no') => void
}) {
  return (
    <div>
      <p className="text-sm text-foreground mb-1">{question}</p>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={value === 'yes'}
            onChange={() => onChange('yes')}
            className="accent-primary"
          />
          Yes
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="no"
            checked={value === 'no'}
            onChange={() => onChange('no')}
            className="accent-primary"
          />
          No
        </label>
      </div>
    </div>
  )
}

// ─── StepIndicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: SetupStep }) {
  const steps = ['Resume', 'Contact Information', 'Job Preferences', 'Additional Information']
  return (
    <div className="flex w-full items-start overflow-x-auto pb-2">
      {steps.map((label, i) => {
        const n = (i + 1) as SetupStep
        const done = n < step
        const active = n === step
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                  done || active
                    ? 'bg-primary text-white'
                    : 'border-2 border-border text-muted-foreground'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium whitespace-nowrap',
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mx-2 h-0.5 w-8 flex-shrink-0 mb-4 sm:mx-3 sm:w-16', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── ApplicationScorePanel ────────────────────────────────────────────────────

function ApplicationScorePanel({ step }: { step: SetupStep }) {
  const items = [
    { label: 'Resume attached', done: step >= 1 },
    { label: 'Contact info complete', done: step >= 3 },
    { label: 'Job preferences set', done: step >= 4 },
    { label: 'Additional info provided', done: false },
  ]
  return (
    <div className="w-full lg:w-56 lg:flex-shrink-0">
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Application Score</h3>
        <p className="text-xs text-muted-foreground mb-4">Complete all items to start auto-applying</p>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <div className="h-4 w-4 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              ) : (
                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground/40" />
              )}
              <span className={cn('text-xs', item.done ? 'text-foreground' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Resume ───────────────────────────────────────────────────────────

function Step1Resume({ resumeFile }: { resumeFile: string }) {
  return (
    <div className="lf-panel p-4 sm:p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Resume</h2>
        <TipsButton />
      </div>
      <p className="text-xs text-muted-foreground mb-4">Upload your resume</p>

      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3">
        <FileText className="h-8 w-8 flex-shrink-0 text-red-500" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{resumeFile}</p>
          <p className="text-xs text-muted-foreground">120 KB — 100% uploaded</p>
        </div>
        <Check className="h-5 w-5 flex-shrink-0 rounded-full bg-primary p-0.5 text-white" />
        <X className="h-4 w-4 flex-shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
      </div>

      <button className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
        Upload new
      </button>
    </div>
  )
}

// ─── Step 2: Contact Information ──────────────────────────────────────────────

interface ContactState {
  email: string
  phone: string
  firstName: string
  lastName: string
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

function Step2Contact({
  contact,
  setContact,
}: {
  contact: ContactState
  setContact: (c: ContactState) => void
}) {
  const set = (key: keyof ContactState) => (v: string) => setContact({ ...contact, [key]: v })

  return (
    <div className="lf-panel p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Contact Information</h2>
          <p className="text-xs text-muted-foreground">Your contact details</p>
        </div>
        <TipsButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledInput label="Email" value={contact.email} onChange={set('email')} required placeholder="you@example.com" />
        <LabeledInput label="Phone" value={contact.phone} onChange={set('phone')} placeholder="+1" />
        <LabeledInput label="First Name" value={contact.firstName} onChange={set('firstName')} required />
        <LabeledInput label="Last Name" value={contact.lastName} onChange={set('lastName')} required />

        <LabeledSelect
          label="Gender"
          value={contact.gender}
          onChange={set('gender')}
          options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
        />

        <LabeledInput label="Date of Birth" value={contact.dob} onChange={set('dob')} placeholder="MM/DD/YYYY" />

        {/* Country with clear */}
        <div>
          <label className="lf-label">Country</label>
          <div className="relative">
            <input
              value={contact.country}
              onChange={(e) => set('country')(e.target.value)}
              placeholder="Select country"
              className="lf-input pr-8"
            />
            {contact.country && (
              <button
                onClick={() => set('country')('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <LabeledInput
          label="City"
          value={contact.city}
          onChange={set('city')}
          placeholder={contact.country ? 'Enter city' : 'Select a country first'}
          disabled={!contact.country}
        />

        <LabeledInput label="Street Address" value={contact.streetAddress} onChange={set('streetAddress')} placeholder="123 Main St" />
        <LabeledInput label="Postal Code" value={contact.postalCode} onChange={set('postalCode')} placeholder="10001" />
        <LabeledInput label="LinkedIn URL" value={contact.linkedIn} onChange={set('linkedIn')} placeholder="https://linkedin.com/in/..." />
        <LabeledInput label="GitHub URL" value={contact.github} onChange={set('github')} placeholder="https://github.com/..." />
        <LabeledInput label="Portfolio URL" value={contact.portfolio} onChange={set('portfolio')} placeholder="https://yoursite.com" fullWidth />
      </div>
    </div>
  )
}

// ─── Step 3: Job Preferences ──────────────────────────────────────────────────

interface PrefsState {
  desiredRole: string
  experienceLevel: string
  salary: string
  locations: string
  employmentTypes: string[]
  locationTypes: string[]
  openToRelocate: boolean
}

function Step3JobPrefs({
  prefs,
  setPrefs,
}: {
  prefs: PrefsState
  setPrefs: (p: PrefsState) => void
}) {
  const toggleType = (list: 'employmentTypes' | 'locationTypes', value: string) => {
    const current = prefs[list]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setPrefs({ ...prefs, [list]: updated })
  }

  return (
    <div className="lf-panel p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Job Preferences</h2>
          <p className="text-xs text-muted-foreground">Your job preferences</p>
        </div>
        <TipsButton />
      </div>

      <div className="space-y-4">
        {/* Desired Role + Experience Level */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Desired Role as tag input */}
          <div>
            <label className="lf-label">
              Desired Role<span className="text-red-500 ml-0.5">*</span>
            </label>
            {prefs.desiredRole ? (
              <div className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 min-h-[42px]">
                <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {prefs.desiredRole}
                  <button onClick={() => setPrefs({ ...prefs, desiredRole: '' })}>
                    <X className="h-3 w-3 ml-0.5" />
                  </button>
                </span>
              </div>
            ) : (
              <input
                value={prefs.desiredRole}
                onChange={(e) => setPrefs({ ...prefs, desiredRole: e.target.value })}
                placeholder="e.g. Product Manager"
                className="lf-input"
              />
            )}
          </div>

          <LabeledSelect
            label="Experience Level"
            value={prefs.experienceLevel}
            onChange={(v) => setPrefs({ ...prefs, experienceLevel: v })}
            options={['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']}
            required
          />
        </div>

        {/* Salary */}
        <LabeledInput
          label="Salary Expectation"
          value={prefs.salary}
          onChange={(v) => setPrefs({ ...prefs, salary: v })}
          placeholder="e.g. $120,000/year"
          fullWidth={false}
        />

        {/* Preferred Locations */}
        <div>
          <label className="lf-label">Preferred Locations</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={prefs.locations}
              onChange={(e) => setPrefs({ ...prefs, locations: e.target.value })}
              placeholder="Search cities or regions…"
              className="lf-input pl-9"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">Employment Type</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType('employmentTypes', t)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  prefs.employmentTypes.includes(t)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-foreground hover:border-primary/40'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Job Location Type */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">Job Location Type</label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType('locationTypes', t)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  prefs.locationTypes.includes(t)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-foreground hover:border-primary/40'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Open to relocate */}
        <CheckboxField
          label="I am open to relocating"
          checked={prefs.openToRelocate}
          onChange={(v) => setPrefs({ ...prefs, openToRelocate: v })}
        />
      </div>
    </div>
  )
}

// ─── Step 4: Additional Information ──────────────────────────────────────────

interface AdditionalInfoState {
  race: string
  citizenship: string
  veteran: string
  disability: string
  securityClearance: string
  usWorkAuth: string
  canadaWorkAuth: string
  authorizedToWork: 'yes' | 'no'
  willingToStart: string
  workSchedule: string
  willingToTravel: boolean
  drugTestConsent: boolean
  backgroundCheckConsent: boolean
  preventPublicTrust: 'yes' | 'no'
  drugDiversion: 'yes' | 'no'
}

function Step4Additional({
  info,
  setInfo,
}: {
  info: AdditionalInfoState
  setInfo: (i: AdditionalInfoState) => void
}) {
  const set = (key: keyof AdditionalInfoState) => (v: string | boolean) =>
    setInfo({ ...info, [key]: v })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Additional Information</h2>
          <p className="text-xs text-muted-foreground">Additional details for applications</p>
        </div>
        <TipsButton />
      </div>

      {/* Demographics */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Demographics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledSelect
            label="Race/Ethnicity"
            value={info.race}
            onChange={set('race') as (v: string) => void}
            options={['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Pacific Islander', 'White', 'Two or more races', 'Prefer not to say']}
          />
          <LabeledInput
            label="Citizenship"
            value={info.citizenship}
            onChange={set('citizenship') as (v: string) => void}
            placeholder="e.g. USA, Canada"
          />
          <LabeledSelect
            label="Veteran Status"
            value={info.veteran}
            onChange={set('veteran') as (v: string) => void}
            options={['Not a Veteran', 'Veteran', 'Active Duty', 'Reserve or National Guard', 'Prefer not to say']}
          />
          <LabeledSelect
            label="Disability Status"
            value={info.disability}
            onChange={set('disability') as (v: string) => void}
            options={['No disability', 'Yes, I have a disability', 'Prefer not to say']}
          />
        </div>
      </div>

      {/* Security Clearance */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Security Clearance</h3>
        <LabeledSelect
          label="Do you hold a defined security clearance?"
          value={info.securityClearance}
          onChange={set('securityClearance') as (v: string) => void}
          options={['None', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI']}
        />
      </div>

      {/* Work Authorization */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Work Authorization</h3>
        <div className="mb-3 grid gap-4 sm:grid-cols-2">
          <LabeledSelect
            label="US Work Authorization"
            value={info.usWorkAuth}
            onChange={set('usWorkAuth') as (v: string) => void}
            options={['US Citizen', 'Green Card Holder', 'H-1B Visa', 'OPT/CPT', 'TN Visa', 'Other', 'Not Authorized']}
            required
          />
          <LabeledInput
            label="Canada Work Authorization (Optional)"
            value={info.canadaWorkAuth}
            onChange={set('canadaWorkAuth') as (v: string) => void}
            placeholder="e.g. Citizen, PR, Work Permit"
          />
        </div>
        <RadioField
          question="Are you authorized to work in the country you are applying to?"
          name="authorizedToWork"
          value={info.authorizedToWork}
          onChange={set('authorizedToWork') as (v: 'yes' | 'no') => void}
        />
      </div>

      {/* Logistics */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Logistics</h3>
        <div className="mb-3 grid gap-4 sm:grid-cols-2">
          <LabeledSelect
            label="When are you willing to start?"
            value={info.willingToStart}
            onChange={set('willingToStart') as (v: string) => void}
            options={['Immediately', '2 weeks', '1 month', '2 months', '3+ months']}
            required
          />
          <LabeledSelect
            label="Work Schedule Availability"
            value={info.workSchedule}
            onChange={set('workSchedule') as (v: string) => void}
            options={['9-5 / Standard', 'Flexible', 'Nights', 'Weekends', 'Shifts']}
            required
          />
        </div>
        <CheckboxField
          label="I am willing to travel for work."
          checked={info.willingToTravel}
          onChange={set('willingToTravel') as (v: boolean) => void}
        />
      </div>

      {/* Background Questions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Background Questions</h3>
        <div className="space-y-3">
          <CheckboxField
            label="I consent to drug testing if required by the employer."
            checked={info.drugTestConsent}
            onChange={set('drugTestConsent') as (v: boolean) => void}
          />
          <CheckboxField
            label="I consent to background checks if required."
            checked={info.backgroundCheckConsent}
            onChange={set('backgroundCheckConsent') as (v: boolean) => void}
          />
          <RadioField
            question="Is there anything that would prevent you from obtaining a Public Trust Clearance?"
            name="preventPublicTrust"
            value={info.preventPublicTrust}
            onChange={set('preventPublicTrust') as (v: 'yes' | 'no') => void}
          />
          <RadioField
            question="Have you ever been disciplined due to drug diversion?"
            name="drugDiversion"
            value={info.drugDiversion}
            onChange={set('drugDiversion') as (v: 'yes' | 'no') => void}
          />
        </div>
      </div>

      {/* References */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">References</h3>
          <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
            + Add Reference
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          No references added yet. Click "Add Reference" to add professional references.
        </p>
      </div>
    </div>
  )
}

// ─── Loading View ─────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Search className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Finding Your Jobs</h2>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
        We're searching for the best opportunities that match your profile. This may take a moment…
      </p>
      <div className="w-64 h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
        <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: '40%' }} />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Paywall View ─────────────────────────────────────────────────────────────

function PaywallView() {
  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
        <Sparkles className="h-8 w-8 text-amber-400" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
        Your job search, on autopilot
      </h1>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
        Auto-Apply is available on Pro and Premium. Pick the plan that fits and let Lightforth do the heavy lifting.
      </p>

      {/* Feature cards */}
      <div className="mb-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <f.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing cards */}
      <div className="mb-4 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {/* PRO */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground">PRO</span>
            <span className="text-xs text-muted-foreground">50 credits/month</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-0.5">
            ₦20,000 <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <div className="mt-4 space-y-2 mb-6">
            {['Auto-Apply access', 'Smart job matching', 'Application tracking'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 flex-shrink-0 text-green-500" /> {feat}
              </div>
            ))}
          </div>
          <button className="w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-white hover:bg-foreground/90 transition-colors">
            Get Pro
          </button>
        </div>

        {/* PREMIUM */}
        <div className="relative rounded-2xl border-2 border-primary bg-primary/5 p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Most Popular</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary">PREMIUM</span>
            <span className="text-xs text-muted-foreground">100 credits/month</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-0.5">
            ₦50,000 <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <div className="mt-4 space-y-2 mb-6">
            {['Everything in Pro', '2.5× more credits', 'Tailored resumes per application', 'Priority job matching'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 flex-shrink-0 text-green-500" /> {feat}
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            <Sparkles className="h-4 w-4" /> Get Premium
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Cancel anytime. No hidden fees. Instant access on upgrade.</p>
    </div>
  )
}

// ─── Dashboard: Stat Cards ────────────────────────────────────────────────────

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      {children}
    </div>
  )
}

function StatsRow({ issueCount, onSeeIssues }: { issueCount: number; onSeeIssues: () => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {/* Applied */}
      <StatCard title="Applied">
        <p className="text-2xl font-bold text-foreground">268</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight className="h-3 w-3" /> +12.65% Success Rate
        </p>
      </StatCard>

      {/* Jobs Found */}
      <StatCard title="Jobs Found">
        <p className="text-2xl font-bold text-foreground">319</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(319 / 500) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">1/500</p>
      </StatCard>

      {/* Resume Created */}
      <StatCard title="Resume Created">
        <p className="text-2xl font-bold text-foreground">43</p>
      </StatCard>

      {/* Errors */}
      <StatCard title="Errors">
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertTriangle className={cn('h-4 w-4 flex-shrink-0', issueCount > 0 ? 'text-amber-400' : 'text-green-500')} />
          <span className={cn('text-2xl font-bold', issueCount > 0 ? 'text-red-500' : 'text-green-600')}>{issueCount}</span>
        </div>
        <button onClick={onSeeIssues} className="text-xs text-primary hover:underline mt-0.5">
          {issueCount > 0 ? 'See issues' : 'View history'}
        </button>
      </StatCard>

      {/* Credits */}
      <StatCard title="Credits">
        <p className="text-2xl font-bold text-foreground">93/100</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-green-500" style={{ width: '93%' }} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">93 remaining</p>
      </StatCard>
    </div>
  )
}

const AUTO_APPLY_ISSUES: AutoApplyIssue[] = [
  {
    id: 'issue-1',
    jobId: '2',
    title: 'Product Designer',
    company: 'Apple',
    source: 'LinkedIn',
    reason: 'Application form requested a portfolio URL before submission.',
    fallback: 'Resume and cover letter were generated.',
    status: 'needs_review',
  },
  {
    id: 'issue-2',
    jobId: '4',
    title: 'UX Researcher',
    company: 'Amazon',
    source: 'Monster',
    reason: 'The job page required a one-time verification step.',
    fallback: 'Application is saved for manual review.',
    status: 'needs_review',
  },
]

function IssuesPanel({
  issues,
  onClose,
  onReview,
  onRetry,
}: {
  issues: AutoApplyIssue[]
  onClose: () => void
  onReview: (issue: AutoApplyIssue) => void
  onRetry: (issue: AutoApplyIssue) => void
}) {
  return (
    <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Auto-apply issues
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">These applications need your attention before Lightforth can finish them.</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-white hover:text-foreground" aria-label="Close issues">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {issues.map((issue) => (
          <article key={issue.id} className={cn('rounded-lg border bg-white p-4', issue.status === 'resolved' ? 'border-green-200' : 'border-amber-200')}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{issue.title}</h3>
                <p className="text-xs text-muted-foreground">{issue.company} · {issue.source}</p>
              </div>
              <span className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                issue.status === 'resolved' ? 'bg-green-100 text-green-700' : issue.status === 'retrying' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700',
              )}>
                {issue.status === 'resolved' ? 'Resolved' : issue.status === 'retrying' ? 'Retrying' : 'Needs review'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{issue.reason}</p>
            <p className="mt-2 text-xs text-muted-foreground">{issue.fallback}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onReview(issue)}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
              >
                Review now
              </button>
              <button
                onClick={() => onRetry(issue)}
                disabled={issue.status !== 'needs_review'}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {issue.status === 'retrying' ? 'Retrying...' : issue.status === 'resolved' ? 'Retried' : 'Retry'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─── Dashboard: Tabs ──────────────────────────────────────────────────────────

function DashboardTabs({
  tab,
  setTab,
}: {
  tab: DashboardTab
  setTab: (t: DashboardTab | 'setup') => void
}) {
  return (
    <div className="lf-tabs mt-6">
      {(['setup', 'agent', 'jobs', 'applied'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={cn(
            'lf-tab',
            tab === t || (t === 'setup')
              ? tab === t
                ? 'lf-tab-active'
                : 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {t === 'setup' ? 'Set Up' : t === 'agent' ? 'Agent' : t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  )
}

function ManualApplyCard({
  onAddApplication,
}: {
  onAddApplication: (application: ManualApplication) => void
}) {
  const [jobLink, setJobLink] = useState('')

  function submitLink() {
    const trimmed = jobLink.trim()
    if (!trimmed) return
    onAddApplication(inferApplicationFromUrl(trimmed))
    setJobLink('')
  }

  return (
    <section className="mt-5 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <LinkIcon className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground">Manual auto-apply</h2>
              <p className="text-sm text-muted-foreground">Paste a job link. We add it as pending while AI fills the application details.</p>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 gap-2 lg:max-w-xl">
          <input
            value={jobLink}
            onChange={(event) => setJobLink(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitLink()
            }}
            className="lf-input min-w-0 flex-1"
            placeholder="Paste job link..."
          />
          <button
            onClick={submitLink}
            className="shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Add job
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────

function PersonalInfoRow({ field }: { field: AppliedDetail['personalInfo'] extends (infer T)[] | undefined ? T : never }) {
  if (!field) return null
  if (field.pills) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-2.5">
        <p className="text-xs text-muted-foreground mb-1.5">{field.label}</p>
        <div className="flex flex-wrap gap-1">
          {field.pills.map((pill) => (
            <span key={pill} className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', field.selectedPill === pill ? 'border-green-500 bg-green-50 text-green-700' : 'border-border text-muted-foreground')}>
              {pill}
            </span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-2.5">
      <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
      <p className={cn('text-xs', field.incomplete || !field.value ? 'italic text-muted-foreground' : 'text-foreground')}>
        {field.value || 'Not answered'}
      </p>
    </div>
  )
}

function QuestionRow({ q }: { q: NonNullable<AppliedDetail['applicationQuestions']>[number] }) {
  const [expanded, setExpanded] = useState(false)
  const TRUNCATE_AT = 120
  const needsTruncate = q.answer.length > TRUNCATE_AT
  return (
    <div className={cn('rounded-lg border p-2.5', q.incomplete ? 'border-orange-200 bg-orange-50' : 'border-border bg-muted/30')}>
      <p className="text-xs text-muted-foreground mb-1">{q.question}</p>
      {q.incomplete || !q.answer ? (
        <p className="text-xs text-orange-600">⚠ Not answered</p>
      ) : (
        <>
          <p className="text-xs text-foreground leading-relaxed">
            {needsTruncate && !expanded ? `${q.answer.slice(0, TRUNCATE_AT)}…` : q.answer}
          </p>
          {needsTruncate && (
            <button onClick={() => setExpanded(v => !v)} className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline">
              {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Show more</>}
            </button>
          )}
        </>
      )}
    </div>
  )
}

function JobDetailPanel({
  jobId,
  tab,
  onClose,
  issue,
  onRetryIssue,
}: {
  jobId: string
  tab: 'jobs' | 'applied'
  onClose: () => void
  issue?: AutoApplyIssue
  onRetryIssue?: (issue: AutoApplyIssue) => void
}) {
  const job = MOCK_JOBS.find((j) => j.id === jobId)!
  const hasFailed = tab === 'applied' && issue && issue.status !== 'resolved'
  const isRetrying = issue?.status === 'retrying'
  const isApplied = tab === 'applied' && !hasFailed
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className="w-full flex-shrink-0 rounded-xl border border-border bg-white lg:w-80 lg:sticky lg:top-4 lg:max-h-[calc(100vh-180px)] overflow-y-auto">
      {/* Header with close */}
      <div className="flex items-start justify-between border-b border-border p-4 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
          <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
        </div>
        <button onClick={onClose} className="ml-2 flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {hasFailed ? (
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', isRetrying ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700')}>
            {isRetrying ? 'Retrying' : 'Failed'}
          </span>
        ) : isApplied ? (
          <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">Applied</span>
        ) : (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">NEW</span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.salary}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.date}</span>
      </div>

      {/* Job Listing */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-foreground mb-1">Job Listing</p>
        <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
          <ArrowUpRight className="h-3 w-3" /> https://careers.google.com/jobs/123
        </a>
      </div>

      {/* Resume Used */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-1">Resume Used</p>
        <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
          <FileText className="h-3 w-3" /> {job.resumeUsed}
        </a>
      </div>

      {tab === 'applied' && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground mb-1">Cover Letter</p>
          <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <FileText className="h-3 w-3" /> Cover_Letter_{job.company}.pdf
          </a>
        </div>
      )}

      {hasFailed && issue ? (
        <>
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-700">Why it failed</p>
            <p className="mt-1 text-xs leading-5 text-red-700">{issue.reason}</p>
            <p className="mt-2 text-xs text-red-600">{issue.fallback}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Activity Log</p>
            <div className="space-y-1.5">
              {['Opened job page', 'Filled available application fields', 'Uploaded tailored resume', `Blocked: ${issue.reason}`].map((step, index) => (
                <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', index === 3 ? 'bg-red-500' : 'bg-green-500')} />
                  {step}
                </div>
              ))}
              <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                ▷ See Replay
              </button>
            </div>
          </div>
          <button
            onClick={() => onRetryIssue?.(issue)}
            disabled={issue.status !== 'needs_review'}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? 'Retrying...' : 'Retry application'}
          </button>
        </>
      ) : isApplied ? (
        <>
          {/* Timeline */}
          {APPLIED_DETAILS[jobId]?.timeline?.map((group) => (
            <div key={group.date} className="mb-4">
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground">{group.date}</p>
              {group.events.map((ev, i) => (
                <div key={ev.label} className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-[8px] font-bold">✓</span>
                    {i < group.events.length - 1 && <span className="w-px flex-1 bg-border" style={{ minHeight: '16px' }} />}
                  </div>
                  <div className="flex flex-1 items-center justify-between pb-2.5">
                    <p className="text-xs font-medium text-foreground">{ev.label}</p>
                    <p className="text-xs text-muted-foreground">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Activity Log */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Activity Log</p>
            <div className="space-y-1.5">
              {['Opened job page', 'Filled application form', 'Uploaded tailored resume', 'Submitted application'].map((step) => (
                <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {step}
                </div>
              ))}
              <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                ▷ See Replay
              </button>
            </div>
          </div>

          {/* Application Details — collapsible */}
          {APPLIED_DETAILS[jobId] && (
            <div className="border-t border-border pt-3">
              <button
                onClick={() => setDetailsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-muted/30"
              >
                <span className="text-xs font-bold text-foreground">Application Details</span>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', detailsOpen && 'rotate-180')} />
              </button>

              {detailsOpen && (
                <div className="mt-3 space-y-4">
                  {/* Personal Info */}
                  {APPLIED_DETAILS[jobId]?.personalInfo && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Personal Info</p>
                      <div className="space-y-1.5">
                        {APPLIED_DETAILS[jobId]!.personalInfo!.map((field) => (
                          <PersonalInfoRow key={field.label} field={field} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {APPLIED_DETAILS[jobId]?.attachments?.map((att) => (
                    <div key={att.label} className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">{att.label}</p>
                      <div className="flex items-center gap-1.5">
                        <Paperclip className="h-3 w-3 text-green-500 shrink-0" />
                        <p className="text-xs text-foreground">{att.filename}</p>
                      </div>
                    </div>
                  ))}

                  {/* Application Questions */}
                  {APPLIED_DETAILS[jobId]?.applicationQuestions && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Application Questions</p>
                      <div className="space-y-1.5">
                        {APPLIED_DETAILS[jobId]!.applicationQuestions!.map((q, i) => (
                          <QuestionRow key={i} q={q} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </>
      ) : (
        <>
          {/* Match score */}
          {(() => {
            const s = job.match
            const bg = s >= 90 ? 'bg-green-50' : s >= 80 ? 'bg-[#EEF4FF]' : s >= 70 ? 'bg-amber-50' : 'bg-muted/40'
            const fg = s >= 90 ? 'text-green-700' : s >= 80 ? 'text-primary' : s >= 70 ? 'text-amber-700' : 'text-muted-foreground'
            return (
              <div className={cn('mb-4 rounded-lg p-3', bg)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn('text-xs font-semibold', fg)}>{job.matchLabel}</p>
                    {job.matchHighlight && <p className={cn('mt-0.5 text-xs opacity-75', fg)}>✓ {job.matchHighlight}</p>}
                  </div>
                  <span className={cn('text-2xl font-bold', fg)}>{job.match}%</span>
                </div>
              </div>
            )
          })()}

          {/* Job meta */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.type}</span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.level}</span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.applicants} applicants</span>
          </div>

          {/* Job description */}
          {'description' in job && job.description && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-foreground mb-1.5">About the role</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{job.description}</p>
            </div>
          )}

          {/* Perks */}
          {'perks' in job && Array.isArray(job.perks) && job.perks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-foreground mb-2">Perks & Benefits</p>
              <div className="flex flex-wrap gap-1.5">
                {(job.perks as string[]).map((perk) => (
                  <span key={perk} className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Credit info */}
          <div className="mb-4 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-foreground mb-0.5">24/50 Credit Left</p>
            <p className="text-xs text-muted-foreground mb-1.5">
              Lightforth will only deduct credit for successful applications
            </p>
            <button className="text-xs text-primary font-medium hover:underline">Upgrade</button>
          </div>

          {/* Auto Apply button */}
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            <Check className="h-4 w-4" /> Auto Apply
          </button>
        </>
      )}
      </div>
    </div>
  )
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────

const FILTER_PILLS = ['Location', 'Job Function', 'Experience Level', 'Job Type', 'Date Posted']

function MatchBadge({ score, label }: { score: number; label: string }) {
  const cls = score >= 90
    ? 'bg-green-100 text-green-700'
    : score >= 80
    ? 'bg-primary/10 text-primary'
    : score >= 70
    ? 'bg-amber-100 text-amber-700'
    : 'bg-muted text-muted-foreground'
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', cls)}>
      {score}% {label}
    </span>
  )
}

function JobsTab({
  selectedJob,
  setSelectedJob,
}: {
  selectedJob: string | null
  setSelectedJob: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filtered = MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mt-4 flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or company"
            className="lf-input pl-9"
          />
        </div>

        {/* Filter pills */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(activeFilter === pill ? null : pill)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                activeFilter === pill
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {pill}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          ))}
        </div>

        {/* Job list */}
        <div className="lf-table-wrap">
          <div className="divide-y divide-border/60">
            {filtered.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/30',
                  selectedJob === job.id && 'bg-primary/5'
                )}
              >
                {/* Company initials */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {job.company.slice(0, 2).toUpperCase()}
                </div>

                {/* Job details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{job.title}</p>
                    <MatchBadge score={job.match} label={job.matchLabel} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {job.company} · {job.location} · {job.type} · {job.level}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{job.salary}</span>
                    <span>{job.applicants} applicants</span>
                    <span>{job.date}</span>
                    {job.matchHighlight && (
                      <span className="text-primary">✓ {job.matchHighlight}</span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-3 w-full text-center text-sm text-primary hover:underline">Load more</button>
      </div>

      {selectedJob && (
        <JobDetailPanel jobId={selectedJob} tab="jobs" onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

// ─── Applied Tab ──────────────────────────────────────────────────────────────

function AppliedTab({
  selectedJob,
  setSelectedJob,
  manualApplications,
  issues,
  onRetryIssue,
}: {
  selectedJob: string | null
  setSelectedJob: (id: string | null) => void
  manualApplications: ManualApplication[]
  issues: AutoApplyIssue[]
  onRetryIssue: (issue: AutoApplyIssue) => void
}) {
  const [search, setSearch] = useState('')
  const getActiveIssue = (jobId: string) => issues.find((issue) => issue.jobId === jobId && issue.status !== 'resolved')
  const appliedJobs = [
    ...manualApplications,
    ...MOCK_JOBS.map((job) => {
      const issue = getActiveIssue(job.id)
      return {
        ...job,
        status: issue?.status === 'retrying' ? 'retrying' as const : issue ? 'failed' as const : 'applied' as const,
        url: '#',
        coverLetterUsed: `Cover_Letter_${job.company}.pdf`,
      }
    }),
  ]
  const filtered = appliedJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mt-4 flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="lf-input pl-9"
          />
        </div>

        <div className="lf-table-wrap">
          <div className="divide-y divide-border/60">
            {filtered.map((job) => {
              const mockJob = MOCK_JOBS.find((m) => m.id === job.id)
              const statusCls = job.status === 'pending' ? 'bg-amber-100 text-amber-700' : job.status === 'failed' ? 'bg-red-100 text-red-700' : job.status === 'retrying' ? 'bg-blue-100 text-blue-700' : 'bg-green-500 text-white'
              const statusLabel = job.status === 'pending' ? 'Pending' : job.status === 'failed' ? 'Failed' : job.status === 'retrying' ? 'Retrying' : 'Applied'
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  className={cn('flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/30', selectedJob === job.id && 'bg-primary/5')}
                >
                  {/* Company initials */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Job details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{job.title}</p>
                      {mockJob && <MatchBadge score={mockJob.match} label={mockJob.matchLabel} />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.company} · {job.location} · {job.type} · {job.level}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{job.salary}</span>
                      <span>{job.source}</span>
                      <span>{job.date}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={cn('flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', statusCls)}>
                    {(job.status === 'pending' || job.status === 'retrying') && <Clock3 className="h-3 w-3" />}
                    {statusLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <button className="mt-3 w-full text-center text-sm text-primary hover:underline">Load more</button>
      </div>

      {selectedJob && selectedJob.startsWith('manual-') && (
        <ManualApplicationPanel
          application={manualApplications.find((job) => job.id === selectedJob)!}
          onClose={() => setSelectedJob(null)}
        />
      )}
      {selectedJob && !selectedJob.startsWith('manual-') && (
        <JobDetailPanel
          jobId={selectedJob}
          tab="applied"
          onClose={() => setSelectedJob(null)}
          issue={issues.find((issue) => issue.jobId === selectedJob)}
          onRetryIssue={onRetryIssue}
        />
      )}
    </div>
  )
}

function ManualApplicationPanel({
  application,
  onClose,
}: {
  application: ManualApplication
  onClose: () => void
}) {
  if (!application) return null
  return (
    <div className="w-full flex-shrink-0 overflow-y-auto rounded-xl border border-border bg-white lg:w-80">
      <div className="flex items-start justify-between border-b border-border p-4 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{application.title}</h3>
          <p className="text-xs text-muted-foreground">{application.company} · {application.location}</p>
        </div>
        <button onClick={onClose} className="ml-2 flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Clock3 className="h-3 w-3" /> Pending
          </span>
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{application.salary}</span>
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{application.date}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Job Listing</p>
          <a href={application.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 break-all text-xs text-primary hover:underline">
            <ArrowUpRight className="h-3 w-3 shrink-0" /> {application.url}
          </a>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-foreground mb-1">Resume Used</p>
          <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <FileText className="h-3 w-3" /> {application.resumeUsed}
          </a>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-foreground mb-1">Cover Letter</p>
          <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <FileText className="h-3 w-3" /> {application.coverLetterUsed}
          </a>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-foreground mb-2">Activity Log</p>
          <div className="space-y-1.5">
            {[
              ['Queued job link', true],
              ['Reading job metadata', true],
              ['Filling application form', false],
              ['Submitting application', false],
            ].map(([step, done]) => (
              <div key={step as string} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', done ? 'bg-green-500' : 'bg-amber-400')} />
                {step as string}
              </div>
            ))}
            <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
              ▷ See Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AutoApply() {
  const { user } = useAuth()
  const [view, setView] = useState<AutoApplyView>('dashboard')
  const [setupStep, setSetupStep] = useState<SetupStep>(1)
  const [dashTab, setDashTab] = useState<DashboardTab>('jobs')
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [manualApplications, setManualApplications] = useState<ManualApplication[]>([])
  const [issuesOpen, setIssuesOpen] = useState(false)
  const [issues, setIssues] = useState<AutoApplyIssue[]>(AUTO_APPLY_ISSUES)
  const activeIssueCount = issues.filter((issue) => issue.status !== 'resolved').length

  // Form state — kept at top level to preserve across steps
  const [resumeFile] = useState('Darnell_Smith_Product_Manager_2026.pdf')
  const [contact, setContact] = useState<ContactState>({
    email: 'demo@lightforth.ai',
    phone: '',
    firstName: 'Darnell',
    lastName: 'Smith',
    gender: '',
    dob: '',
    country: 'Nigeria',
    city: '',
    streetAddress: 'Lagos',
    postalCode: '10001',
    linkedIn: '',
    github: '',
    portfolio: '',
  })
  const [prefs, setPrefs] = useState<PrefsState>({
    desiredRole: 'Product Manager',
    experienceLevel: 'Senior',
    salary: '',
    locations: '',
    employmentTypes: [],
    locationTypes: [],
    openToRelocate: false,
  })
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoState>({
    race: '',
    citizenship: '',
    veteran: '',
    disability: '',
    securityClearance: '',
    usWorkAuth: '',
    canadaWorkAuth: '',
    authorizedToWork: 'no',
    willingToStart: '',
    workSchedule: '',
    willingToTravel: false,
    drugTestConsent: false,
    backgroundCheckConsent: false,
    preventPublicTrust: 'no',
    drugDiversion: 'no',
  })

  // Loading → dashboard transition
  useEffect(() => {
    if (view === 'loading') {
      const t = setTimeout(() => setView('dashboard'), 2500)
      return () => clearTimeout(t)
    }
  }, [view])

  const handleNext = () => {
    if (setupStep < 4) {
      if (setupStep === 3 && user?.plan === 'non_subscriber') {
        setView('paywall')
        return
      }
      setSetupStep((s) => (s + 1) as SetupStep)
    } else {
      setView('loading')
    }
  }

  const handleBack = () => {
    if (setupStep > 1) setSetupStep((s) => (s - 1) as SetupStep)
  }

  function addManualApplication(application: ManualApplication) {
    setManualApplications((current) => [application, ...current])
    setDashTab('applied')
    setSelectedJob(application.id)
  }

  function reviewIssue(issue: AutoApplyIssue) {
    setDashTab('applied')
    setSelectedJob(issue.jobId)
    setIssuesOpen(false)
  }

  function retryIssue(issue: AutoApplyIssue) {
    if (issue.status !== 'needs_review') return
    setIssues((current) => current.map((item) => item.id === issue.id ? { ...item, status: 'retrying' } : item))
    window.setTimeout(() => {
      setIssues((current) => current.map((item) => item.id === issue.id ? { ...item, status: 'resolved', fallback: 'Retry completed and application was submitted.' } : item))
      setDashTab('applied')
      setSelectedJob(issue.jobId)
    }, 900)
  }

  if (view === 'loading') return <LoadingView />
  if (view === 'paywall') return <PaywallView />

  if (view === 'dashboard') {
    return (
      <div className="lf-page-shell">
        <div className="lf-page-header">
          <h1 className="lf-page-title">Auto-Apply</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Set your preferences and let Lightforth apply for you
          </p>
        </div>
        <StatsRow issueCount={activeIssueCount} onSeeIssues={() => setIssuesOpen((open) => !open)} />
        {issuesOpen && (
          <IssuesPanel
            issues={issues}
            onClose={() => setIssuesOpen(false)}
            onReview={reviewIssue}
            onRetry={retryIssue}
          />
        )}
        <ManualApplyCard onAddApplication={addManualApplication} />
        <DashboardTabs
          tab={dashTab}
          setTab={(t) => {
            if (t === 'setup') {
              setView('setup')
              setSetupStep(1)
            } else {
              setDashTab(t as DashboardTab)
            }
          }}
        />
        {dashTab === 'jobs' && (
          <JobsTab selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
        )}
        {dashTab === 'applied' && (
          <AppliedTab
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            manualApplications={manualApplications}
            issues={issues}
            onRetryIssue={retryIssue}
          />
        )}
        {dashTab === 'agent' && (
          <div className="mt-5">
            <AgentsTab studentId="auto-apply" />
          </div>
        )}
      </div>
    )
  }

  // view === 'setup'
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Auto-Apply</h1>
        <p className="mt-2 text-base text-muted-foreground">Complete your profile to start auto-applying</p>
      </div>

      <div className="lf-tabs mb-6">
        <span className="lf-tab lf-tab-active">
          Profile
        </span>
      </div>

      <StepIndicator step={setupStep} />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          {setupStep === 1 && <Step1Resume resumeFile={resumeFile} />}
          {setupStep === 2 && <Step2Contact contact={contact} setContact={setContact} />}
          {setupStep === 3 && <Step3JobPrefs prefs={prefs} setPrefs={setPrefs} />}
          {setupStep === 4 && (
            <Step4Additional info={additionalInfo} setInfo={setAdditionalInfo} />
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {setupStep === 4 ? 'Save Profile' : 'Next'} →
            </button>
          </div>
        </div>

        <ApplicationScorePanel step={setupStep} />
      </div>
    </div>
  )
}
