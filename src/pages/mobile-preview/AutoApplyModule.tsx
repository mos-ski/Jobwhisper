import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Loader2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_JOBS, MOCK_APPLICATIONS, type ApplicationStatus, type MockJob } from './mockData'

type AutoApplyView =
  | { name: 'feed' }
  | { name: 'detail'; job: MockJob }
  | { name: 'applying'; job: MockJob }
  | { name: 'applied'; job: MockJob }
  | { name: 'history' }
  | { name: 'application-detail'; applicationId: string }

export function AutoApplyModule() {
  const [view, setView] = useState<AutoApplyView>({ name: 'feed' })

  if (view.name === 'feed') return <JobFeedScreen onSelectJob={(job) => setView({ name: 'detail', job })} onViewHistory={() => setView({ name: 'history' })} />
  if (view.name === 'detail') return <JobDetailScreen job={view.job} onBack={() => setView({ name: 'feed' })} onApply={() => setView({ name: 'applying', job: view.job })} />
  if (view.name === 'applying') return <ApplyingScreen job={view.job} onDone={() => setView({ name: 'applied', job: view.job })} />
  if (view.name === 'applied') return <AppliedScreen job={view.job} onDone={() => setView({ name: 'feed' })} />
  if (view.name === 'history') return <HistoryScreen onBack={() => setView({ name: 'feed' })} onSelect={(id) => setView({ name: 'application-detail', applicationId: id })} />
  if (view.name === 'application-detail') return <ApplicationDetailScreen applicationId={view.applicationId} onBack={() => setView({ name: 'history' })} />
  return null
}

function JobFeedScreen({ onSelectJob, onViewHistory }: { onSelectJob: (job: MockJob) => void; onViewHistory: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Jobs for you</h1>
        <button onClick={onViewHistory} className="text-sm font-medium text-[#2563EB]">History</button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {MOCK_JOBS.map((job) => (
          <button key={job.id} onClick={() => onSelectJob(job)} className="block w-full rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: job.logoColor }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-900">{job.title}</p>
                <p className="truncate text-sm text-neutral-500">{job.company}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin size={12} /><span>{job.location}</span><span>·</span><span>{job.postedAgo}</span>
                </div>
              </div>
              <span className="flex-shrink-0 rounded-full bg-[#2563EB]/10 px-2 py-1 text-[11px] font-medium text-[#2563EB]">{job.matchTag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function JobDetailScreen({ job, onBack, onApply }: { job: MockJob; onBack: () => void; onApply: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{job.company}</h1>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl" style={{ background: job.logoColor }} />
          <div>
            <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
            <p className="text-sm text-neutral-500">{job.company} · {job.location}</p>
          </div>
        </div>
        <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-medium text-[#2563EB]">{job.matchTag}</span>
        <p className="text-sm leading-relaxed text-neutral-600">{job.description}</p>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button onClick={onApply} className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">Apply with one tap</button>
      </div>
    </div>
  )
}

function ApplyingScreen({ job, onDone }: { job: MockJob; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <Loader2 className="animate-spin text-[#2563EB]" size={32} />
      <p className="font-semibold text-neutral-900">Applying to {job.company}…</p>
      <p className="text-sm text-neutral-500">Filling in your application using your career profile and resume.</p>
    </div>
  )
}

function AppliedScreen({ job, onDone }: { job: MockJob; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="text-green-600" size={28} />
      </div>
      <p className="text-lg font-semibold text-neutral-900">Application sent!</p>
      <p className="text-sm text-neutral-500">Your application to {job.company} for {job.title} has been submitted. We'll keep you posted on its status.</p>
      <button onClick={onDone} className="mt-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white">Back to jobs</button>
    </div>
  )
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: 'Submitted', viewed: 'Viewed', shortlisted: 'Shortlisted', interview: 'Interview', rejected: 'Not selected',
}

// 'rejected' is excluded: handled by a separate branch in ApplicationDetailScreen
const STAGES: ApplicationStatus[] = ['submitted', 'viewed', 'shortlisted', 'interview']
const STATUS_COLOR: Record<ApplicationStatus, string> = {
  submitted: 'bg-neutral-100 text-neutral-600', viewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-amber-100 text-amber-700', interview: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
}

function HistoryScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-semibold text-neutral-900">Apply history</h1>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {MOCK_APPLICATIONS.map((app) => (
          <button key={app.id} onClick={() => onSelect(app.id)} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: app.logoColor }} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-900">{app.jobTitle}</p>
              <p className="truncate text-sm text-neutral-500">{app.company} · {app.appliedOn}</p>
            </div>
            <span className={cn('flex-shrink-0 rounded-full px-2 py-1 text-[11px] font-medium', STATUS_COLOR[app.status])}>{STATUS_LABEL[app.status]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ApplicationDetailScreen({ applicationId, onBack }: { applicationId: string; onBack: () => void }) {
  const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId)
  if (!app) return <div className="p-5 text-sm text-neutral-500">Application not found.</div>
  const currentIndex = STAGES.indexOf(app.status)
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{app.company}</h1>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl" style={{ background: app.logoColor }} />
          <div>
            <p className="text-lg font-semibold text-neutral-900">{app.jobTitle}</p>
            <p className="text-sm text-neutral-500">{app.company} · Applied {app.appliedOn}</p>
          </div>
        </div>
        {app.status === 'rejected' ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">This application wasn't selected this time. Keep going — new roles are waiting for you.</div>
        ) : (
          <ol className="space-y-3">
            {STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3">
                <div className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold', i <= currentIndex ? 'bg-[#2563EB] text-white' : 'bg-neutral-200 text-neutral-400')}>
                  {i <= currentIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn('text-sm', i <= currentIndex ? 'font-medium text-neutral-900' : 'text-neutral-400')}>{STATUS_LABEL[stage]}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
