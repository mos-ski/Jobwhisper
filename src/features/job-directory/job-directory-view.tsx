import { BriefcaseBusiness, ExternalLink, Globe2, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { DirectoryJob, JobBoard, JobBoardFocus, JobDirectoryStatus } from '@/contracts/job-directory.draft'
import { AppShell } from '@/features/dashboard/app-nav'
import { Button, Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle, ShellBar, cn } from '@/ui'

const ALL_FOCUS = 'All job boards'

export type JobDirectoryViewProps = {
  readonly homeHref: string
  readonly status: JobDirectoryStatus
  readonly boards: readonly JobBoard[]
  readonly onRetry: () => void
  readonly initialBoardId?: string
  readonly initialJobId?: string
}

type BoardPreviewProps = {
  readonly board: JobBoard
  readonly initialJobId?: string
  readonly offline: boolean
  readonly onClose: () => void
}

function BoardMark({ board }: { readonly board: JobBoard }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-soft border border-border bg-surface-subtle font-gowun text-sm font-bold text-ink"
    >
      {board.shortName}
    </span>
  )
}

function JobButton({ job, selected, onClick }: { readonly job: DirectoryJob; readonly selected: boolean; readonly onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'w-full border-b border-border px-4 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
        selected ? 'bg-accent-subtle' : 'bg-surface hover:bg-surface-subtle',
      )}
    >
      <span className="block font-semibold text-ink">{job.title}</span>
      <span className="mt-1 block text-sm text-ink-muted">{job.company}</span>
      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
        <span>{job.location}</span>
        <span>{job.workStyle}</span>
      </span>
    </button>
  )
}

function JobDetail({ board, job, offline }: { readonly board: JobBoard; readonly job: DirectoryJob; readonly offline: boolean }) {
  return (
    <article className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent-text">{job.company}</p>
          <h2 className="mt-1 font-gowun text-xl font-bold leading-tight text-ink sm:text-2xl">{job.title}</h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4" />{job.location}</span>
            <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness aria-hidden="true" className="size-4" />{job.employmentType}</span>
          </div>
        </div>
        {offline ? (
          <Button disabled className="min-h-11">Apply unavailable offline</Button>
        ) : (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-control hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Apply on {board.name}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        )}
      </div>

      <dl className="mt-6 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
        <div><dt className="text-ink-muted">Salary</dt><dd className="mt-1 font-semibold text-ink">{job.salaryLabel}</dd></div>
        <div><dt className="text-ink-muted">Work style</dt><dd className="mt-1 font-semibold text-ink">{job.workStyle}</dd></div>
        <div><dt className="text-ink-muted">Listed</dt><dd className="mt-1 font-semibold text-ink">{job.postedLabel}</dd></div>
      </dl>

      <section className="mt-6">
        <h3 className="font-gowun text-base font-bold text-ink">About the role</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">{job.summary}</p>
      </section>

      <section className="mt-6">
        <h3 className="font-gowun text-base font-bold text-ink">What you will do</h3>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-muted">
          {job.responsibilities.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">•</span><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-gowun text-base font-bold text-ink">Skills</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill) => <li key={skill} className="rounded-pill border border-border bg-surface-subtle px-3 py-1.5 text-xs font-semibold text-ink">{skill}</li>)}
        </ul>
      </section>
    </article>
  )
}

function BoardPreview({ board, initialJobId, offline, onClose }: BoardPreviewProps) {
  const [selectedJobId, setSelectedJobId] = useState(initialJobId ?? board.jobs[0]?.id)
  const selectedJob = board.jobs.find((job) => job.id === selectedJobId) ?? board.jobs[0]

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPopup
        aria-label={`Explore jobs on ${board.name}`}
        className="flex max-h-[85vh] flex-col overflow-hidden p-0 sm:h-4/5 sm:w-4/5 sm:max-w-none"
      >
        <header className="shrink-0 border-b border-border bg-surface">
          <div className="flex min-h-14 items-center gap-3 px-4 pe-14">
            <BoardMark board={board} />
            <div className="min-w-0">
              <DialogTitle className="truncate font-gowun text-base">Explore jobs on {board.name}</DialogTitle>
              <DialogDescription className="mt-0">Curated preview by Jobwhisper</DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border bg-surface-subtle px-4 py-2 text-xs text-ink-muted">
            <Globe2 aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate rounded-soft border border-border bg-surface px-3 py-2">{board.websiteUrl}</span>
            <span className="ms-auto hidden shrink-0 sm:inline">Application opens on the source site</span>
          </div>
          <DialogClose className="static absolute end-2 top-2" aria-label={`Close ${board.name} preview`} />
        </header>

        {selectedJob ? (
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <aside className="max-h-64 shrink-0 overflow-y-auto border-b border-border bg-surface lg:max-h-none lg:w-80 lg:border-b-0 lg:border-e" aria-label={`${board.name} jobs`}>
              <div className="border-b border-border px-4 py-3 text-xs font-semibold text-ink-muted">{board.jobs.length} jobs in this preview</div>
              {board.jobs.map((job) => (
                <JobButton key={job.id} job={job} selected={job.id === selectedJob.id} onClick={() => setSelectedJobId(job.id)} />
              ))}
            </aside>
            <JobDetail board={board} job={selectedJob} offline={offline} />
          </div>
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <p className="text-sm text-ink-muted">No representative jobs are available for this board yet.</p>
          </div>
        )}
      </DialogPopup>
    </Dialog>
  )
}

function BoardCard({ board, onExplore }: { readonly board: JobBoard; readonly onExplore: () => void }) {
  return (
    <article className="flex min-w-0 flex-col gap-4 border border-border bg-surface p-5 sm:flex-row sm:items-start">
      <BoardMark board={board} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-gowun text-base font-bold text-ink">{board.name}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">{board.description}</p>
          </div>
          <Button onClick={onExplore} className="min-h-11 shrink-0" aria-label={`Explore ${board.name}`}>Explore</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-pill bg-accent-subtle px-3 py-1.5 font-semibold text-accent-text">{board.focus}</span>
          {board.regions.map((region) => <span key={region} className="rounded-pill border border-border px-3 py-1.5 text-ink-muted">{region}</span>)}
          {board.workStyles.map((style) => <span key={style} className="rounded-pill border border-border px-3 py-1.5 text-ink-muted">{style}</span>)}
        </div>
      </div>
    </article>
  )
}

function LoadingBoards() {
  return (
    <div role="status" aria-label="Loading job boards" className="mt-6 space-y-3">
      <span className="sr-only">Loading job boards</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} data-testid="job-board-skeleton" className="flex animate-pulse gap-4 border border-border p-5 motion-reduce:animate-none">
          <span className="size-12 shrink-0 rounded-soft bg-muted" />
          <span className="flex-1 space-y-3">
            <span className="block h-4 w-40 rounded-soft bg-muted" />
            <span className="block h-3 max-w-xl rounded-soft bg-muted" />
            <span className="block h-3 w-2/3 rounded-soft bg-muted" />
          </span>
        </div>
      ))}
    </div>
  )
}

export function JobDirectoryView({ homeHref, status, boards, onRetry, initialBoardId, initialJobId }: JobDirectoryViewProps) {
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState<typeof ALL_FOCUS | JobBoardFocus>(ALL_FOCUS)
  const [selectedBoardId, setSelectedBoardId] = useState(initialBoardId)
  const focuses = Array.from(new Set(boards.map((board) => board.focus)))
  const filteredBoards = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return boards.filter((board) => {
      const matchesFocus = focus === ALL_FOCUS || board.focus === focus
      const searchable = [board.name, board.description, board.focus, ...board.regions, ...board.workStyles].join(' ').toLocaleLowerCase()
      return matchesFocus && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [boards, focus, query])
  const selectedBoard = boards.find((board) => board.id === selectedBoardId)

  return (
    <AppShell>
      <ShellBar homeHref={homeHref} current="Job Directory" closeHref={homeHref} closeLabel="Close job directory" />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <article className="w-full min-w-0 bg-surface shadow-panel">
          <header className="border-b border-border px-4 py-5 sm:px-6 lg:px-8">
            <h1 className="font-gowun text-xl font-bold text-ink">Find your next job board</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Browse trusted job sites, preview opportunities here, then apply directly on the source website.</p>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {status === 'offline' ? (
              <div role="status" aria-label="Offline directory" className="mb-5 border border-warning bg-warning-surface px-4 py-3 text-sm text-ink">
                You are offline. You can browse the saved directory, but applications will be available when your connection returns.
              </div>
            ) : null}
            <div className="grid gap-4 border-b border-border pb-6 sm:grid-cols-[minmax(0,1fr)_14rem]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Search job boards</span>
                <span className="flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-3 focus-within:ring-2 focus-within:ring-focus">
                  <Search aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, focus, or region" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted" />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Focus</span>
                <select value={focus} onChange={(event) => setFocus(event.target.value as typeof ALL_FOCUS | JobBoardFocus)} className="min-h-11 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <option>{ALL_FOCUS}</option>
                  {focuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>

            {status === 'loading' ? (
              <LoadingBoards />
            ) : status === 'error' ? (
              <div className="py-16 text-center" role="alert">
                <h2 className="font-gowun text-lg font-bold text-ink">We could not load the directory</h2>
                <p className="mt-2 text-sm text-ink-muted">Try again to restore the latest list of job boards.</p>
                <Button onClick={onRetry} className="mt-5">Try again</Button>
              </div>
            ) : filteredBoards.length === 0 ? (
              <div className="py-16 text-center">
                <h2 className="font-gowun text-lg font-bold text-ink">No job boards match your search</h2>
                <p className="mt-2 text-sm text-ink-muted">Try a broader term or clear the current filters.</p>
                <Button
                  variant="secondary"
                  className="mt-5"
                  onClick={() => {
                    setQuery('')
                    setFocus(ALL_FOCUS)
                  }}
                >
                  Clear search and filters
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredBoards.map((board) => <BoardCard key={board.id} board={board} onExplore={() => setSelectedBoardId(board.id)} />)}
              </div>
            )}
          </div>
        </article>
      </section>

      {selectedBoard ? <BoardPreview board={selectedBoard} initialJobId={initialJobId} offline={status === 'offline'} onClose={() => setSelectedBoardId(undefined)} /> : null}
    </AppShell>
  )
}
