import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Bookmark, Briefcase, Clock3, FileText, Mail, MessageSquare, Paperclip, Search, SlidersHorizontal, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from './mockData'

type TrackerStatus = ApplicationStatus | 'pending' | 'retrying' | 'applied'

interface TimelineEvent {
  label: string
  time: string
}

interface TimelineGroup {
  date: string
  events: TimelineEvent[]
}

interface PersonalInfoField {
  label: string
  value: string
  incomplete?: boolean
  pills?: string[]
  selectedPill?: string
}

interface ApplicationAttachment {
  label: string
  filename: string
}

interface ApplicationQuestion {
  question: string
  answer: string
  incomplete?: boolean
}

interface TrackerApp {
  id: string
  title: string
  company: string
  location: string
  salary: string
  source: string
  date: string
  status: TrackerStatus
  resumeUsed: string
  coverLetterUsed: string
  log: { label: string; done: boolean }[]
  timeline?: TimelineGroup[]
  personalInfo?: PersonalInfoField[]
  attachments?: ApplicationAttachment[]
  applicationQuestions?: ApplicationQuestion[]
}

interface BookmarkedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  matchTag: string
  savedOn: string
  logoColor: string
}

interface InboxMessage {
  id: string
  company: string
  subject: string
  body: string
  date: string
  read: boolean
  logoColor: string
}

const TRACKER_APPS: TrackerApp[] = [
  {
    id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180k', source: 'Indeed', date: 'Feb 8, 2026', status: 'applied',
    resumeUsed: 'Resume_Tailored_Google.pdf', coverLetterUsed: 'Cover_Letter_Google.pdf',
    log: [
      { label: 'Opened job page', done: true }, { label: 'Filled application form', done: true }, { label: 'Uploaded tailored resume', done: true }, { label: 'Submitted application', done: true },
    ],
    timeline: [
      { date: 'FEB 8', events: [{ label: 'Tapped Apply', time: '09:14 AM' }, { label: 'Application submitted', time: '09:18 AM' }] },
    ],
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
    attachments: [
      { label: 'Upload your resume', filename: 'Resume_Tailored_Google.pdf' },
    ],
    applicationQuestions: [
      {
        question: 'Please answer the screening questions. Only completed applications will be reviewed.',
        answer: 'Throughout my career as a Frontend Engineer, I have consistently integrated scalable UI patterns with performance-first thinking. My recent work involved rebuilding a design system used by 40+ engineers.',
      },
      {
        question: 'Tell us something about yourself that isn\'t on your resume.',
        answer: 'Outside of my work as a Frontend Engineer, I am an avid open-source contributor. I find that maintaining public libraries — where users are strangers with real expectations — forces a level of rigor and documentation discipline that has directly improved how I approach production codebases.',
      },
    ],
  },
  {
    id: '2', title: 'Product Designer', company: 'Apple', location: 'Cupertino, CA', salary: 'Bonus', source: 'LinkedIn', date: 'Feb 7, 2026', status: 'failed',
    resumeUsed: 'Resume_Tailored_Apple.pdf', coverLetterUsed: 'Cover_Letter_Apple.pdf',
    log: [
      { label: 'Opened job page', done: true }, { label: 'Filled available fields', done: true }, { label: 'Uploaded tailored resume', done: true }, { label: 'Blocked: portfolio required', done: false },
    ],
    timeline: [
      { date: 'FEB 7', events: [{ label: 'Tapped Apply', time: '02:30 PM' }, { label: 'Application blocked', time: '02:34 PM' }] },
    ],
    personalInfo: [
      { label: 'First Name', value: 'Darnell' },
      { label: 'Last Name', value: 'Brooks' },
      { label: 'Phone', value: '+12025550173' },
      { label: 'Website, Blog or Portfolio', value: '', incomplete: true },
      { label: 'Country', value: '', pills: ['United States', 'Canada', 'United Kingdom', 'Australia'], selectedPill: 'United States' },
      { label: 'State / Province', value: 'California' },
    ],
    attachments: [
      { label: 'Upload your resume', filename: 'Resume_Tailored_Apple.pdf' },
    ],
    applicationQuestions: [
      { question: 'Share a link to your design portfolio.', answer: '', incomplete: true },
    ],
  },
  { id: '3', title: 'Data Scientist', company: 'Meta', location: 'Menlo Park, CA', salary: 'Stock', source: 'Workable', date: 'Feb 6, 2026', status: 'applied', resumeUsed: 'Resume_Tailored_Meta.pdf', coverLetterUsed: 'Cover_Letter_Meta.pdf', log: [
    { label: 'Opened job page', done: true }, { label: 'Filled application form', done: true }, { label: 'Uploaded tailored resume', done: true }, { label: 'Submitted application', done: true },
  ]},
  { id: '4', title: 'UX Researcher', company: 'Amazon', location: 'Seattle, WA', salary: '$30k', source: 'Monster', date: 'Feb 5, 2026', status: 'retrying', resumeUsed: 'Resume_Tailored_Amazon.pdf', coverLetterUsed: 'Cover_Letter_Amazon.pdf', log: [
    { label: 'Opened job page', done: true }, { label: 'Filled available fields', done: true }, { label: 'Verification step required', done: false }, { label: 'Retrying application…', done: false },
  ]},
  { id: '5', title: 'Backend Developer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$5k', source: 'ZipRecruiter', date: 'Feb 4, 2026', status: 'applied', resumeUsed: 'Resume_Tailored_Netflix.pdf', coverLetterUsed: 'Cover_Letter_Netflix.pdf', log: [
    { label: 'Opened job page', done: true }, { label: 'Filled application form', done: true }, { label: 'Uploaded tailored resume', done: true }, { label: 'Submitted application', done: true },
  ]},
  { id: '6', title: 'Product Manager', company: 'Figma', location: 'San Francisco, CA', salary: '$150k', source: 'Glassdoor', date: 'Feb 3, 2026', status: 'pending', resumeUsed: 'Resume_Tailored_Figma.pdf', coverLetterUsed: 'Cover_Letter_Figma.pdf', log: [
    { label: 'Queued job link', done: true }, { label: 'Reading job metadata', done: true }, { label: 'Filling application form', done: false }, { label: 'Submitting application', done: false },
  ]},
  { id: '7', title: 'DevOps Engineer', company: 'Slack', location: 'San Francisco, CA', salary: '$140k', source: 'Remote.co', date: 'Feb 2, 2026', status: 'applied', resumeUsed: 'Resume_Tailored_Slack.pdf', coverLetterUsed: 'Cover_Letter_Slack.pdf', log: [
    { label: 'Opened job page', done: true }, { label: 'Filled application form', done: true }, { label: 'Uploaded tailored resume', done: true }, { label: 'Submitted application', done: true },
  ]},
]

const BOOKMARKED_JOBS: BookmarkedJob[] = [
  { id: 'b-1', title: 'Staff Product Designer', company: 'Rippling', location: 'San Francisco, CA', salary: '$190k', matchTag: '85% match', savedOn: '2d ago', logoColor: '#1E3A5F' },
  { id: 'b-2', title: 'Design Manager', company: 'HubSpot', location: 'Remote', salary: '$180k', matchTag: '82% match', savedOn: '3d ago', logoColor: '#FF7A59' },
  { id: 'b-3', title: 'Senior UX Designer', company: 'Shopify', location: 'Remote', salary: '$165k', matchTag: '88% match', savedOn: '5d ago', logoColor: '#96BF48' },
  { id: 'b-4', title: 'Product Design Lead', company: 'Supabase', location: 'Remote', salary: '$175k', matchTag: '94% match', savedOn: '1w ago', logoColor: '#3ECF8E' },
  { id: 'b-5', title: 'Design Lead', company: 'Apple', location: 'Cupertino, CA', salary: '$220k', matchTag: '86% match', savedOn: '1w ago', logoColor: '#555555' },
]

const INBOX_MESSAGES: InboxMessage[] = [
  { id: 'm-1', company: 'Stripe', subject: 'Interview invitation — Product Designer', body: 'Hi Darnell, we were impressed by your portfolio. We\'d love to invite you for a first-round interview with our design team next week. Please let us know your availability.', date: '2h ago', read: false, logoColor: '#635BFF' },
  { id: 'm-2', company: 'Notion', subject: 'Application update — Senior Frontend Engineer', body: 'Your application has been shortlisted! We\'ll be in touch soon to schedule a technical assessment.', date: '1d ago', read: false, logoColor: '#000000' },
  { id: 'm-3', company: 'Linear', subject: 'We viewed your application', body: 'Your portfolio caught our eye. Our team is reviewing your application and we\'ll get back to you within the next week.', date: '3d ago', read: true, logoColor: '#5E6AD2' },
  { id: 'm-4', company: 'Figma', subject: 'Application received', body: 'Thanks for applying to Product Manager at Figma. We\'re reviewing applications and will reach out if there\'s a match.', date: '5d ago', read: true, logoColor: '#A259FF' },
  { id: 'm-5', company: 'Duolingo', subject: 'Update on your application', body: 'After careful review, we\'ve decided to move forward with other candidates for the UX Lead position. We encourage you to apply again in the future.', date: '1w ago', read: true, logoColor: '#58CC02' },
]

const STATUS_META: Record<TrackerStatus, { label: string; className: string; icon?: typeof Clock3 }> = {
  applied: { label: 'Applied', className: 'bg-green-500 text-white' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700', icon: Clock3 },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  retrying: { label: 'Retrying', className: 'bg-blue-100 text-blue-700', icon: Clock3 },
  submitted: { label: 'Submitted', className: 'bg-neutral-100 text-neutral-600' },
  viewed: { label: 'Viewed', className: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted', className: 'bg-amber-100 text-amber-700' },
  interview: { label: 'Interview', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Not selected', className: 'bg-red-100 text-red-700' },
}

type Tab = 'applied' | 'bookmarked' | 'inbox'

type View =
  | { name: 'list' }
  | { name: 'detail'; app: TrackerApp }

const ALL_STATUSES: TrackerStatus[] = ['applied', 'pending', 'failed', 'retrying']

export function ApplicationTrackerScreen() {
  const [tab, setTab] = useState<Tab>('applied')
  const [view, setView] = useState<View>({ name: 'list' })
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TrackerStatus[]>([])

  if (view.name === 'detail') return <DetailScreen app={view.app} onBack={() => setView({ name: 'list' })} />

  const activeFilterCount = statusFilter.length

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="px-5 pb-1 pt-4">
        <h1 className="text-xl font-bold text-neutral-900">Applications</h1>
        <p className="mt-0.5 text-xs text-neutral-400">
          {tab === 'applied' && `${TRACKER_APPS.length} total · ${TRACKER_APPS.filter((a) => a.status === 'applied').length} applied`}
          {tab === 'bookmarked' && `${BOOKMARKED_JOBS.length} saved jobs`}
          {tab === 'inbox' && `${INBOX_MESSAGES.filter((m) => !m.read).length} unread · ${INBOX_MESSAGES.length} total`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 px-5 pb-3">
        {(['applied', 'bookmarked', 'inbox'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
              tab === t ? 'bg-[#2563EB] text-white shadow-sm' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            )}
          >
            {t === 'applied' && <Briefcase size={13} />}
            {t === 'bookmarked' && <Bookmark size={13} />}
            {t === 'inbox' && <Mail size={13} />}
            {t === 'applied' && 'Applied'}
            {t === 'bookmarked' && 'Bookmarked'}
            {t === 'inbox' && 'Inbox'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {tab === 'applied' && <TrackerTab onSelect={(app) => setView({ name: 'detail', app })} statusFilter={statusFilter} onOpenFilter={() => setShowStatusFilter(true)} />}
        {tab === 'bookmarked' && <BookmarkedTab />}
        {tab === 'inbox' && <InboxTab />}
      </div>

      {/* Status filter sheet */}
      {showStatusFilter && (
        <StatusFilterSheet
          selected={statusFilter}
          onChange={setStatusFilter}
          onClose={() => setShowStatusFilter(false)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  )
}

/* ─── Tracker ─── */

function TrackerTab({ onSelect, statusFilter, onOpenFilter }: { onSelect: (app: TrackerApp) => void; statusFilter: TrackerStatus[]; onOpenFilter: () => void }) {
  const [search, setSearch] = useState('')
  const filtered = TRACKER_APPS.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter.length === 0 || statusFilter.includes(a.status)
    return matchSearch && matchStatus
  })
  const activeFilterCount = statusFilter.length

  return (
    <>
      <div className="relative mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications…"
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-neutral-400"
          />
        </div>
        <button
          onClick={onOpenFilter}
          className={cn(
            'relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95',
            activeFilterCount > 0
              ? 'border-[#2563EB]/40 bg-[#EEF4FF] text-[#2563EB]'
              : 'border-neutral-300 text-neutral-400 hover:border-[#2563EB]/40 hover:text-[#2563EB]'
          )}
        >
          <SlidersHorizontal size={16} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2563EB] px-1 text-[9px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      <div className="space-y-2">
        {filtered.map((app) => {
          const meta = STATUS_META[app.status]
          const Icon = meta.icon
          return (
            <button key={app.id} onClick={() => onSelect(app)} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/20 hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2563EB]">
                <Briefcase size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-900">{app.title}</p>
                <p className="truncate text-sm text-neutral-500">{app.company} · {app.location}</p>
                <p className="mt-0.5 text-xs text-neutral-400">{app.source} · {app.date}</p>
              </div>
              <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold', meta.className)}>
                {Icon && <Icon size={12} />}{meta.label}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">No applications found</div>
        )}
      </div>
    </>
  )
}

/* ─── Bookmarked ─── */

function BookmarkedTab() {
  const [saved, setSaved] = useState<string[]>(BOOKMARKED_JOBS.map((j) => j.id))

  const toggleSave = (id: string) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const visible = BOOKMARKED_JOBS.filter((j) => saved.includes(j.id))

  return (
    <>
      <div className="space-y-2">
        {visible.map((job) => (
          <div key={job.id} className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/20 hover:shadow-md">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: job.logoColor }}>
                {job.company[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-900">{job.title}</p>
                <p className="truncate text-sm text-neutral-500">{job.company} · {job.location}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span>{job.salary}</span>
                  <span>·</span>
                  <span>Saved {job.savedOn}</span>
                </div>
              </div>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">{job.matchTag}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 py-2 text-xs font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.97]">
                <ArrowUpRight size={14} /> Apply
              </button>
              <button
                onClick={() => toggleSave(job.id)}
                className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.97]"
              >
                <Trash2 size={14} className="text-neutral-400" />
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-neutral-400">
            <Bookmark size={32} className="mb-3 text-neutral-300" />
            <p>No bookmarked jobs</p>
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Inbox ─── */

function InboxTab() {
  const [messages, setMessages] = useState(INBOX_MESSAGES)

  const markRead = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  return (
    <>
      <div className="space-y-2">
        {messages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => markRead(msg.id)}
            className={cn(
              'flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
              msg.read ? 'border-neutral-200' : 'border-[#2563EB]/20'
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: msg.logoColor }}>
              {msg.company[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={cn('truncate text-sm', msg.read ? 'text-neutral-500' : 'font-semibold text-neutral-900')}>{msg.company}</p>
                {!msg.read && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />}
              </div>
              <p className={cn('truncate text-sm', msg.read ? 'text-neutral-500' : 'font-medium text-neutral-800')}>{msg.subject}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-neutral-400">{msg.body}</p>
              <p className="mt-1 text-[11px] text-neutral-400">{msg.date}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

/* ─── Status Filter Sheet ─── */

function StatusFilterSheet({ selected, onChange, onClose }: { selected: TrackerStatus[]; onChange: (s: TrackerStatus[]) => void; onClose: () => void }) {
  const [local, setLocal] = useState<TrackerStatus[]>(selected)

  const toggle = (status: TrackerStatus) => {
    setLocal((prev) => prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status])
  }

  const clearAll = () => {
    setLocal([])
    onChange([])
    onClose()
  }

  const apply = () => {
    onChange(local)
    onClose()
  }

  return (
    <>
      <div className="absolute inset-0 z-30 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-3xl bg-white px-6 pb-8 pt-5 shadow-2xl animate-slide-up">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Filter by Status</h2>
          <button onClick={clearAll} className="text-xs font-medium text-[#2563EB] hover:underline">Clear all</button>
        </div>
        <p className="mb-5 text-xs text-neutral-400">Show only applications with selected statuses</p>
        <div className="space-y-2">
          {ALL_STATUSES.map((status) => {
            const meta = STATUS_META[status]
            return (
              <button
                key={status}
                onClick={() => toggle(status)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all',
                  local.includes(status)
                    ? 'border-[#2563EB] bg-[#EEF4FF]'
                    : 'border-neutral-200 hover:border-neutral-300'
                )}
              >
                <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all', local.includes(status) ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-neutral-300')}>
                  {local.includes(status) ? '✓' : ''}
                </span>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', meta.className)}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.98]">Cancel</button>
          <button onClick={apply} className="flex-1 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] active:scale-[0.98]">Apply</button>
        </div>
      </div>
    </>
  )
}

/* ─── Detail ─── */

function DetailScreen({ app, onBack }: { app: TrackerApp; onBack: () => void }) {
  const meta = STATUS_META[app.status]
  const Icon = meta.icon
  const isFailed = app.status === 'failed'
  const isPending = app.status === 'pending'
  const isRetrying = app.status === 'retrying'

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack} className="transition-transform active:scale-90"><ArrowLeft size={20} className="text-neutral-700" /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{app.company}</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        {/* Job header */}
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2563EB]">
            <Briefcase size={22} />
          </span>
          <div>
            <p className="text-lg font-semibold text-neutral-900">{app.title}</p>
            <p className="text-sm text-neutral-500">{app.company} · {app.location}</p>
          </div>
        </div>

        {/* Status + meta badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', meta.className)}>
            {Icon && <Icon size={12} />}{meta.label}
          </span>
          <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500">{app.salary}</span>
          <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500">{app.date}</span>
        </div>

        {/* Applied on + Job Description link */}
        <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-100 pb-3">
          <span>Applied on {app.date}</span>
          <a href="#" className="flex items-center gap-1 font-medium text-[#2563EB] hover:underline">
            Job Description <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Timeline */}
        {app.timeline ? (
          <div>
            {app.timeline.map((group) => (
              <div key={group.date}>
                <p className="mb-2 text-[10px] font-semibold tracking-wider text-neutral-400">{group.date}</p>
                <div className="space-y-0">
                  {group.events.map((ev, i) => (
                    <div key={ev.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-[9px] font-bold">✓</span>
                        {i < group.events.length - 1 && <span className="w-px flex-1 bg-neutral-200 my-0.5" style={{ minHeight: '20px' }} />}
                      </div>
                      <div className="flex flex-1 items-center justify-between pb-3">
                        <p className="text-sm font-medium text-neutral-800">{ev.label}</p>
                        <p className="text-xs text-neutral-400">{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback activity log for apps without timeline */
          <div>
            <p className="mb-2 text-xs font-semibold text-neutral-700">Activity Log</p>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="space-y-2">
                {app.log.map((step, i) => {
                  const isLastBlocked = !step.done && i === app.log.length - 1 && isFailed
                  return (
                    <div key={step.label} className="flex items-center gap-2 text-xs">
                      <div className={cn('h-2 w-2 shrink-0 rounded-full', step.done ? 'bg-green-500' : isLastBlocked ? 'bg-red-500' : 'bg-amber-400')} />
                      <span className={step.done ? 'text-neutral-700' : 'text-neutral-500'}>{step.label}</span>
                    </div>
                  )
                })}
              </div>
              <button className="mt-1 flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
                ▷ See Replay
              </button>
            </div>
          </div>
        )}

        {/* Job Listing / Resume / Cover Letter */}
        <div>
          <p className="mb-1 text-xs font-semibold text-neutral-700">Job Listing</p>
          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
            <ArrowUpRight size={12} /> https://careers.{app.company.toLowerCase()}.com/jobs/{app.id}
          </a>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-neutral-700">Resume Used</p>
          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
            <FileText size={12} /> {app.resumeUsed}
          </a>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-neutral-700">Cover Letter</p>
          <a href="#" className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline">
            <FileText size={12} /> {app.coverLetterUsed}
          </a>
        </div>

        {/* Credits */}
        {!isFailed && !isRetrying && (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-xs font-semibold text-neutral-700">24/50 Credit Left</p>
            <p className="text-xs text-neutral-500">Credits only deducted for successful applications</p>
          </div>
        )}

        {/* Failed reason */}
        {isFailed && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-semibold text-red-700">Why it failed</p>
            <p className="mt-1 text-xs leading-relaxed text-red-700">The application form requested a portfolio URL before submission.</p>
            <p className="mt-1 text-xs text-red-600">Resume and cover letter were generated.</p>
          </div>
        )}

        {/* ── Application Details ── */}
        {(app.personalInfo || app.attachments || app.applicationQuestions) && (
          <div className="space-y-4 border-t border-neutral-100 pt-2">
            <p className="text-base font-bold text-neutral-900">Application Details</p>

            {/* Personal Info */}
            {app.personalInfo && (
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-800">Personal Info</p>
                <div className="space-y-2">
                  {app.personalInfo.map((field) => (
                    <PersonalInfoCard key={field.label} field={field} />
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {app.attachments && app.attachments.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-800">Attachments</p>
                <div className="space-y-2">
                  {app.attachments.map((att) => (
                    <div key={att.label} className="rounded-xl border border-neutral-200 bg-white p-3.5">
                      <p className="text-xs text-neutral-400">{att.label}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Paperclip size={13} className="text-green-500 shrink-0" />
                        <p className="text-sm text-neutral-800">{att.filename}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Questions */}
            {app.applicationQuestions && app.applicationQuestions.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-neutral-800">Application Questions</p>
                <div className="space-y-2">
                  {app.applicationQuestions.map((q, i) => (
                    <QuestionCard key={i} q={q} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        {(isFailed || isRetrying) ? (
          <button className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">
            {isRetrying ? 'Retrying...' : 'Retry application'}
          </button>
        ) : isPending ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-3 text-sm font-medium text-amber-700">
            <Clock3 size={16} /> Processing
          </div>
        ) : (
          <button className="w-full rounded-xl border border-neutral-300 py-3 text-center text-sm font-semibold text-neutral-700">
            View on job board
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Personal Info Card ─── */

function PersonalInfoCard({ field }: { field: PersonalInfoField }) {
  const PILL_OVERFLOW = 4

  if (field.pills) {
    const visible = field.pills.slice(0, PILL_OVERFLOW)
    const remaining = field.pills.length - PILL_OVERFLOW
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
        <div className="flex items-start justify-between">
          <p className="text-xs text-neutral-400">{field.label}</p>
          <span className="text-neutral-300">···</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visible.map((pill) => (
            <span
              key={pill}
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
                field.selectedPill === pill
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-neutral-200 text-neutral-600'
              )}
            >
              {pill}
            </span>
          ))}
          {remaining > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500">
              +{remaining} more ▾
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
      <div className="flex items-start justify-between">
        <p className="text-xs text-neutral-400">{field.label}</p>
        <span className="text-neutral-300">···</span>
      </div>
      <p className={cn('mt-1 text-sm', field.incomplete || !field.value ? 'italic text-neutral-400' : 'text-neutral-800')}>
        {field.value || 'Not answered'}
      </p>
    </div>
  )
}

/* ─── Question Card ─── */

function QuestionCard({ q }: { q: ApplicationQuestion }) {
  const PREVIEW_LENGTH = 120
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = q.answer.length > PREVIEW_LENGTH

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className={cn('text-xs leading-relaxed', q.incomplete ? 'text-amber-600' : 'text-neutral-400')}>
          {q.incomplete && '⚠️ '}
          {q.question}
        </p>
        <span className="shrink-0 text-neutral-300">···</span>
      </div>
      {q.answer ? (
        <div className="mt-1.5">
          <p className="text-sm leading-relaxed text-neutral-800">
            {needsTruncation && !expanded ? q.answer.slice(0, PREVIEW_LENGTH) + '…' : q.answer}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-green-600 hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      ) : (
        <p className="mt-1.5 italic text-sm text-neutral-400">Not answered</p>
      )}
    </div>
  )
}
