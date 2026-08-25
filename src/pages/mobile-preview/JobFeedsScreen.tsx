import { useEffect, useState } from 'react'
import { Bookmark, Check, ChevronDown, Heart, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_JOBS, type MockJob } from './mockData'
import type { PreferencesData } from './JobPreferencesScreen'

type View =
  | { name: 'feed' }
  | { name: 'detail'; job: MockJob }

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']

const DEFAULT_PREFS: PreferencesData = {
  desiredRole: 'Product Designer',
  experienceLevel: 'Senior',
  salary: '',
  locations: '',
  employmentTypes: [],
  locationTypes: [],
  openToRelocate: false,
}

export function JobFeedsScreen() {
  const [view, setView] = useState<View>({ name: 'feed' })

  if (view.name === 'feed') return <FeedScreen onSelect={(job) => setView({ name: 'detail', job })} />
  if (view.name === 'detail') return <DetailScreen key={view.job.id} job={view.job} onBack={() => setView({ name: 'feed' })} onApply={() => setView({ name: 'feed' })} />
  return null
}

/* ─── Feed (Tinder-style cards) ─── */

function inferLocationType(loc: string): string {
  const l = loc.toLowerCase()
  if (l.includes('remote')) return 'Remote'
  if (l.includes('onsite') || l.includes('san francisco') || l.includes('new york') || l.includes('cupertino') || l.includes('menlo park') || l.includes('san jose') || l.includes('redmond') || l.includes('los angeles')) return 'Onsite'
  return 'Hybrid'
}

function FeedScreen({ onSelect }: { onSelect: (job: MockJob) => void }) {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const [swipedJobs, setSwipedJobs] = useState<Set<string>>(new Set())
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<PreferencesData>(DEFAULT_PREFS)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    const matchRole = !prefs.desiredRole || j.title.toLowerCase().includes(prefs.desiredRole.toLowerCase())
    const matchLocType = prefs.locationTypes.length === 0 || prefs.locationTypes.includes(inferLocationType(j.location))
    const matchLocSearch = !prefs.locations || j.location.toLowerCase().includes(prefs.locations.toLowerCase())
    return matchSearch && matchRole && matchLocType && matchLocSearch
  })

  const remaining = filtered.filter((j) => !swipedJobs.has(j.id))
  const currentJob = remaining[0] ?? null
  const nextJob = remaining[1] ?? null
  const thirdJob = remaining[2] ?? null
  const progress = filtered.length > 0 ? ((filtered.length - remaining.length) / filtered.length) * 100 : 0

  const hasActivePrefs = prefs.desiredRole !== DEFAULT_PREFS.desiredRole || prefs.experienceLevel !== DEFAULT_PREFS.experienceLevel || !!prefs.salary || !!prefs.locations || prefs.employmentTypes.length > 0 || prefs.locationTypes.length > 0 || prefs.openToRelocate

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentJob || swipeDir) return
    setSwipeDir(dir)
    setTimeout(() => {
      setSwipedJobs((prev) => new Set([...prev, currentJob.id]))
      setSwipeDir(null)
    }, 420)
  }

  const handleBookmark = () => {
    if (!currentJob) return
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(currentJob.id)) next.delete(currentJob.id)
      else next.add(currentJob.id)
      return next
    })
  }

  const handleUndo = () => {
    const lastId = [...swipedJobs].pop()
    if (!lastId) return
    setSwipedJobs((prev) => {
      const next = new Set(prev)
      next.delete(lastId)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pb-2 pt-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Job feeds</h1>
          <p className="mt-0.5 text-xs text-neutral-400">
            {isLoading ? (
              <span className="inline-block h-3 w-28 animate-pulse rounded bg-neutral-200 align-middle" />
            ) : remaining.length > 0 ? (
              <>{remaining.length} role{remaining.length !== 1 ? 's' : ''} to explore</>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>
        <button
          onClick={() => setShowPrefs(true)}
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95',
            hasActivePrefs
              ? 'border-[#2563EB]/40 bg-[#EEF4FF] text-[#2563EB]'
              : 'border-neutral-200 text-neutral-400 hover:border-[#2563EB]/40 hover:text-[#2563EB]'
          )}
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs or companies…"
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Progress bar */}
      {!isLoading && (
        <div className="px-5 pb-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
            <span>{filtered.length - remaining.length} of {filtered.length} swiped</span>
            <span>{bookmarkedIds.size} saved</span>
          </div>
        </div>
      )}

      {/* Preferences sheet */}
      {showPrefs && (
        <PreferencesSheet
          data={prefs}
          onChange={setPrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}

      {/* Card stack area */}
      <div className="flex flex-1 items-center justify-center px-5 pb-4">
        {isLoading ? (
          <SkeletonCardStack />
        ) : remaining.length === 0 ? (
          <EmptyState onReset={() => setSwipedJobs(new Set())} />
        ) : (
          <div className="relative h-full w-full max-w-[340px]">
            {/* Third card (bottom) */}
            {thirdJob && (
              <SwipeCard
                job={thirdJob}
                isTop={false}
                stackIndex={2}
                swipeDir={null}
                style="bottom"
              />
            )}

            {/* Second card (middle) */}
            {nextJob && (
              <SwipeCard
                job={nextJob}
                isTop={false}
                stackIndex={1}
                swipeDir={null}
                style="middle"
              />
            )}

            {/* Top card */}
            {currentJob && (
              <SwipeCard
                job={currentJob}
                isTop={true}
                stackIndex={0}
                swipeDir={swipeDir}
                isBookmarked={bookmarkedIds.has(currentJob.id)}
                onSelect={() => onSelect(currentJob)}
                style="top"
              />
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isLoading && remaining.length > 0 && (
        <div className="flex items-center justify-center gap-5 pb-5 pt-1">
          <button
            onClick={handleUndo}
            disabled={swipedJobs.size === 0}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all active:scale-90',
              swipedJobs.size === 0
                ? 'border-neutral-200 text-neutral-300'
                : 'border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100'
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 1 3.5-7.1"/><path d="M3 4v5h5"/></svg>
          </button>

          <button
            onClick={() => handleSwipe('left')}
            disabled={!!swipeDir}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-400 shadow-lg transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-300 active:scale-90"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleBookmark}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-400 shadow-lg transition-all hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 active:scale-90"
          >
            <Bookmark size={20} strokeWidth={2.5} fill={bookmarkedIds.has(currentJob?.id ?? '') ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            disabled={!!swipeDir}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-200 bg-white text-green-500 shadow-lg transition-all hover:bg-green-50 hover:text-green-600 hover:border-green-300 active:scale-90"
          >
            <Sparkles size={28} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes cardSwipeLeft {
          to { transform: translateX(-120%) rotate(-12deg); opacity: 0; }
        }
        @keyframes cardSwipeRight {
          to { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out both;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.35s ease-out both;
        }
        .animate-check-pop {
          animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .swipe-left {
          animation: cardSwipeLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .swipe-right {
          animation: cardSwipeRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

/* ─── Swipe Card ─── */

function SwipeCard({
  job,
  isTop,
  stackIndex,
  swipeDir,
  isBookmarked,
  onSelect,
  style,
}: {
  job: MockJob
  isTop: boolean
  stackIndex: number
  swipeDir: 'left' | 'right' | null
  isBookmarked?: boolean
  onSelect?: () => void
  style: 'top' | 'middle' | 'bottom'
}) {
  const scale = style === 'top' ? 1 : style === 'middle' ? 0.95 : 0.9
  const yOffset = style === 'top' ? 0 : style === 'middle' ? 8 : 16
  const zIndex = 10 - stackIndex
  const opacity = style === 'bottom' && swipeDir ? 1 : 1

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl transition-all duration-200',
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
        swipeDir === 'left' && 'swipe-left',
        swipeDir === 'right' && 'swipe-right'
      )}
      style={{
        transform: `scale(${scale}) translateY(${yOffset}px)`,
        zIndex,
        opacity,
      }}
      onClick={isTop && onSelect ? onSelect : undefined}
    >
      {/* Swipe overlay - left (skip) */}
      {isTop && swipeDir === 'left' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-red-500/10 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-400 bg-white/90">
              <X size={32} className="text-red-500" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-red-500">SKIP</span>
          </div>
        </div>
      )}

      {/* Swipe overlay - right (apply) */}
      {isTop && swipeDir === 'right' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-green-500/10 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-400 bg-white/90">
              <Sparkles size={32} className="text-green-500" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-green-600">APPLY</span>
          </div>
        </div>
      )}

      {/* Bookmark indicator */}
      {isTop && isBookmarked && !swipeDir && (
        <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 backdrop-blur-sm">
          <Bookmark size={16} className="text-blue-500" fill="currentColor" />
        </div>
      )}

      {/* Card content */}
      <div className="flex h-full flex-col overflow-hidden p-5">
        {/* Company logo + basic info */}
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
            style={{ background: job.logoColor }}
          >
            {job.company[0]}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-lg font-bold leading-tight text-neutral-900">{job.title}</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-500">{job.company}</p>
          </div>
        </div>

        {/* Meta tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(() => {
            const score = parseInt(job.matchTag) || 0
            const matchCls = score >= 90
              ? 'bg-green-50 text-green-700'
              : score >= 80
              ? 'bg-[#EEF4FF] text-[#2563EB]'
              : 'bg-amber-50 text-amber-700'
            return (
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${matchCls}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {job.matchTag}
              </span>
            )
          })()}
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {job.salary}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">
            <MapPin size={11} />
            {job.location}
          </span>
          <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-400">
            {job.postedAgo}
          </span>
          <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-400">
            {job.source}
          </span>
        </div>

        {/* Description */}
        <div className="mt-4 flex-1 overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">About the role</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 line-clamp-5">{job.description}</p>
        </div>

        {/* Tap hint */}
        {isTop && (
          <div className="mt-2 flex items-center justify-center">
            <span className="text-[10px] text-neutral-300">Tap card to view details</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Skeleton Card Stack ─── */

function SkeletonCardStack() {
  return (
    <div className="relative h-full w-full max-w-[340px]">
      {[2, 1, 0].map((i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white"
          style={{
            transform: `scale(${1 - i * 0.05}) translateY(${i * 8}px)`,
            zIndex: 10 - i,
          }}
        >
          <div className="flex h-full flex-col p-5">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl skeleton-shimmer" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-5 w-3/4 rounded skeleton-shimmer" />
                <div className="h-4 w-1/2 rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-7 w-20 rounded-full skeleton-shimmer" />
              <div className="h-7 w-16 rounded-full skeleton-shimmer" />
              <div className="h-7 w-14 rounded-full skeleton-shimmer" />
            </div>
            <div className="mt-4 flex-1 space-y-2">
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-3/4 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Empty State ─── */

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 text-center animate-fade-in-scale">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF4FF]">
        <Sparkles size={36} className="text-[#2563EB]" />
      </div>
      <p className="text-xl font-bold text-neutral-900">All caught up!</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        You've swiped through all matching jobs. Adjust your preferences or check back later for new listings.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onReset}
          className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.97]"
        >
          Start over
        </button>
        <button
          className="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] active:scale-[0.97]"
        >
          View applied
        </button>
      </div>
    </div>
  )
}

/* ─── Preferences Sheet ─── */

function PreferencesSheet({ data, onChange, onClose }: { data: PreferencesData; onChange: (d: PreferencesData) => void; onClose: () => void }) {
  const [local, setLocal] = useState<PreferencesData>(data)

  const update = (field: keyof PreferencesData, value: string | string[] | boolean) => setLocal((p) => ({ ...p, [field]: value }))

  const toggle = (list: 'employmentTypes' | 'locationTypes', value: string) => {
    const current = local[list]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setLocal({ ...local, [list]: updated })
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
          <h2 className="text-base font-bold text-neutral-900">Job Preferences</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X size={18} /></button>
        </div>
        <p className="mb-5 text-xs text-neutral-500">Set your job preferences</p>

        <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
          {/* Desired Role */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Desired Role <span className="text-red-500">*</span></label>
            {local.desiredRole ? (
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2">
                <span className="flex items-center gap-1 rounded-full bg-[#EEF4FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                  {local.desiredRole}
                  <button onClick={() => update('desiredRole', '')} className="ml-0.5 text-[#2563EB]/60 hover:text-[#2563EB]">✕</button>
                </span>
              </div>
            ) : (
              <input value={local.desiredRole} onChange={(e) => update('desiredRole', e.target.value)} placeholder="e.g. Product Designer" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Experience Level</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button key={level} onClick={() => update('experienceLevel', level)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.experienceLevel === level ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{level}</button>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Salary Expectation</label>
            <input value={local.salary} onChange={(e) => update('salary', e.target.value)} placeholder="e.g. $120,000/year" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Preferred Locations</label>
            <div className="relative mt-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={local.locations} onChange={(e) => update('locations', e.target.value)} placeholder="Search cities or regions…" className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Employment Type</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button key={t} onClick={() => toggle('employmentTypes', t)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.employmentTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Location Type */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Job Location Type</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {LOCATION_TYPES.map((t) => (
                <button key={t} onClick={() => toggle('locationTypes', t)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.locationTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Relocate */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={local.openToRelocate} onChange={(e) => update('openToRelocate', e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
            <span className="text-sm text-neutral-700">I am open to relocating</span>
          </label>
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

function DetailScreen({ job, onBack, onApply }: { job: MockJob; onBack: () => void; onApply: () => void }) {
  const [justApplied, setJustApplied] = useState(false)

  const handleApply = () => {
    if (justApplied) return
    setJustApplied(true)
    setTimeout(onApply, 600)
  }

  return (
    <div className="flex h-full flex-col animate-fade-in-scale">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack} className="transition-transform active:scale-90"><span className="text-neutral-700">←</span></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{job.company}</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm" style={{ background: job.logoColor }}>
            {job.company[0]}
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
            <p className="text-sm text-neutral-500">{job.company} · {job.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const score = parseInt(job.matchTag) || 0
            const cls = score >= 90 ? 'bg-green-50 text-green-700' : score >= 80 ? 'bg-[#EEF4FF] text-[#2563EB]' : 'bg-amber-50 text-amber-700'
            return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{job.matchTag}</span>
          })()}
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">{job.salary}</span>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">{job.source}</span>
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">About the role</h3>
          <p className="text-sm leading-relaxed text-neutral-600">{job.description}</p>
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <div className="mb-3 rounded-lg border border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
          <p className="text-xs font-semibold text-neutral-700">24/50 Credit Left</p>
          <p className="text-xs text-neutral-500">Credits only deducted for successful applications</p>
        </div>
        <button
          onClick={handleApply}
          disabled={justApplied}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-semibold text-white transition-all active:scale-[0.98]',
            justApplied ? 'bg-green-500' : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
          )}
        >
          {justApplied ? <Check size={16} className="animate-check-pop" /> : <Sparkles size={16} />}
          {justApplied ? 'Applied!' : 'Auto Apply'}
        </button>
      </div>
    </div>
  )
}

