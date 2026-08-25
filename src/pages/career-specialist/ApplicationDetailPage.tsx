import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FileText, ChevronDown, ChevronUp, MessageSquare, Paperclip } from 'lucide-react'
import { MOCK_APPLICATIONS, type AttemptDetail, type ApplicationQuestion } from '@/data/mockApplications'
import { cn } from '@/lib/utils'

const STATUS_PILL: Record<string, string> = {
  failed:       'bg-red-100 text-red-700',
  needs_review: 'bg-orange-100 text-orange-700',
  completed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
}

const TRACE_COLOR: Record<string, string> = {
  blue:   'text-blue-400',
  green:  'text-green-400',
  yellow: 'text-yellow-400',
  red:    'text-red-400',
  purple: 'text-purple-400',
  cyan:   'text-cyan-400',
  orange: 'text-orange-400',
  gray:   'text-gray-400',
}

function AttemptAccordion({ attempt }: { attempt: AttemptDetail }) {
  const [open, setOpen] = useState(attempt.number === 1)

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">Attempt #{attempt.number}</span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_PILL[attempt.status] ?? 'bg-gray-100 text-gray-700')}>
            {attempt.status === 'failed' && '⊘ '}
            {attempt.status.replace('_', ' ')}
          </span>
          <span className="text-sm text-gray-500">{attempt.date}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-200 space-y-4 p-5">
          {attempt.statusReason && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold text-red-600 mb-0.5">Status Reason</p>
              <p className="text-sm text-red-700">{attempt.statusReason}</p>
            </div>
          )}

          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <span>▶</span> Recording
            </p>
            <div className="rounded-lg bg-black aspect-video max-w-xl flex items-center justify-center">
              <p className="text-xs text-gray-500">Recording unavailable in preview</p>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <span>🖼</span> Screenshots (3)
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 w-28 shrink-0 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Screen {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" /> Attempt Logs ({attempt.logs.length} lines)
              </p>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1">
                📋 Copy All
              </button>
            </div>
            <div className="rounded-lg bg-gray-950 p-4 max-h-48 overflow-y-auto">
              {attempt.logs.map((line, i) => (
                <p key={i} className="text-xs text-gray-300 font-mono leading-relaxed">{line}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Trace Log</p>
            <div className="rounded-lg bg-gray-950 p-4 space-y-1">
              {attempt.traceLog.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 font-mono text-xs">
                  <span className="text-gray-500 shrink-0">{ev.time}</span>
                  <span className={cn('font-semibold shrink-0', TRACE_COLOR[ev.color])}>{ev.event}</span>
                  {ev.detail && <span className="text-gray-400 truncate">{ev.detail}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RetryModal({ onClose, onRetry }: { onClose: () => void; onRetry: () => void }) {
  const [notes, setNotes] = useState('')
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900">Retry Application</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add any supplemental fields that may be required to complete the application.
          </p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Info (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter any additional information..."
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => { onRetry(); onClose() }}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [showRetry, setShowRetry] = useState(false)
  const [retried,   setRetried]   = useState(false)
  const app = MOCK_APPLICATIONS.find(a => a.id === id)

  if (!app) return (
    <div className="flex items-center justify-center p-16 text-sm text-gray-500">Application not found.</div>
  )

  const latestAttempt = app.attempts[app.attempts.length - 1]

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <Link to="/career-specialist/applications" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{app.jobTitle}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <span>🏢</span> {app.company}
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_PILL[app.status] ?? 'bg-gray-100 text-gray-700')}>
                {app.status === 'failed' && '⊘ '}{app.status.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                📍 {app.state}
              </span>
              <span className="text-xs text-gray-500">{app.type}</span>
            </div>
            <div className="mt-3 space-y-0.5 text-sm text-gray-500">
              <p>Application ID: <span className="font-mono text-xs text-gray-700">{app.id}</span></p>
              <p>Applied: <span className="text-gray-700">{app.dateApplied}</span></p>
            </div>
            <a href="#" className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> View Job Posting
            </a>
          </div>
          {retried ? (
            <span className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Retry queued
            </span>
          ) : (
            <button
              onClick={() => setShowRetry(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              ↺ Retry Application
            </button>
          )}
        </div>
      </div>

      {app.timeline && app.timeline.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Timeline</h2>
          {app.timeline.map((group) => (
            <div key={group.date} className="mb-2">
              <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-400">{group.date}</p>
              <div>
                {group.events.map((ev, i) => (
                  <div key={ev.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-[9px] font-bold">✓</span>
                      {i < group.events.length - 1 && <span className="w-px flex-1 bg-gray-200 my-0.5" style={{ minHeight: '20px' }} />}
                    </div>
                    <div className="flex flex-1 items-center justify-between pb-3">
                      <p className="text-sm font-medium text-gray-800">{ev.label}</p>
                      <p className="text-xs text-gray-400">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
          <span className="text-sm font-medium text-gray-700">👤</span>
          <h2 className="text-sm font-semibold text-gray-900">Submitted Details</h2>
        </div>

        <div className="p-6 space-y-6">
          <DetailsSection title="PERSONAL INFORMATION">
            <InfoGrid items={[
              { label: 'First Name',     value: app.firstName },
              { label: 'Last Name',      value: app.lastName },
              { label: 'Email',          value: <span className="flex items-center gap-1">✉ {app.email}</span> },
              { label: 'Phone',          value: <span className="flex items-center gap-1">📞 {app.phone}</span> },
              { label: 'Gender',         value: app.gender },
              { label: 'Date of Birth',  value: app.birthday },
            ]} />
          </DetailsSection>

          <DetailsSection title="LOCATION">
            <InfoGrid items={[
              { label: 'Street Address', value: app.streetAddress },
              { label: 'City',           value: app.city },
              { label: 'Postal Code',    value: app.postalCode },
            ]} />
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 mb-1">Country</p>
              <p className="text-sm text-gray-800">{app.country}</p>
            </div>
          </DetailsSection>

          <DetailsSection title="PROFESSIONAL LINKS">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">LinkedIn</p>
              <a href={app.linkedin} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                🔗 View Profile
              </a>
            </div>
          </DetailsSection>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
          <FileText className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">Documents Used</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Resume</p>
              <a href="#" className="text-xs text-blue-600 hover:underline">↗ {app.resumeName}</a>
            </div>
          </div>
          {app.coverLetterName && (
            <div className="inline-flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <Paperclip className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Cover Letter</p>
                <a href="#" className="text-xs text-blue-600 hover:underline">↗ {app.coverLetterName}</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {app.applicationQuestions && app.applicationQuestions.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">Application Questions</h2>
            <span className="ml-auto text-xs text-gray-400">{app.applicationQuestions.length} question{app.applicationQuestions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="p-6 space-y-3">
            {app.applicationQuestions.map((q, i) => (
              <QuestionItem key={i} q={q} />
            ))}
          </div>
        </div>
      )}

      {latestAttempt && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Latest Attempt</p>
            <span className="text-sm text-gray-500">{latestAttempt.date}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_PILL[latestAttempt.status] ?? 'bg-gray-100 text-gray-700')}>
              {latestAttempt.status === 'failed' && '⊘ '}{latestAttempt.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">Attempt #{latestAttempt.number}</span>
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          ATTEMPTS ({app.attempts.length})
        </p>
        <div className="space-y-2">
          {app.attempts.map(attempt => (
            <AttemptAccordion key={attempt.number} attempt={attempt} />
          ))}
        </div>
      </div>

      {showRetry && (
        <RetryModal
          onClose={() => setShowRetry(false)}
          onRetry={() => setRetried(true)}
        />
      )}
    </div>
  )
}

function DetailsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wider text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  )
}

function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-4">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
          <p className="text-sm text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  )
}

function QuestionItem({ q }: { q: ApplicationQuestion }) {
  const [expanded, setExpanded] = useState(false)
  const TRUNCATE_AT = 180
  const needsTruncate = q.answer.length > TRUNCATE_AT

  return (
    <div className={cn('rounded-lg border p-4', q.incomplete ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50')}>
      <p className="text-xs font-medium text-gray-500 mb-2">{q.question}</p>
      {q.incomplete || !q.answer ? (
        <p className="flex items-center gap-1.5 text-sm text-orange-600">
          <span>⚠</span> Not answered
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-800 leading-relaxed">
            {needsTruncate && !expanded ? `${q.answer.slice(0, TRUNCATE_AT)}…` : q.answer}
          </p>
          {needsTruncate && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-2 text-xs font-medium text-blue-600 hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
