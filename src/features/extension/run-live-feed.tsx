import type { ComponentType } from 'react'
import { ChevronDown } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { SiGlassdoor, SiIndeed } from 'react-icons/si'

import { Badge, cn } from '@/ui'
import type { ExtensionAppliedJob, ExtensionJobBoard, ExtensionRunStats } from '@/contracts/extension.draft'

const BOARD_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  indeed: SiIndeed,
  glassdoor: SiGlassdoor,
  linkedin: FaLinkedin,
}

function truncateUrl(url: string): string {
  return url.length > 38 ? `${url.slice(0, 38)}…` : url
}

export type ExtensionRunLiveFeedProps = {
  readonly boards: readonly ExtensionJobBoard[]
  readonly activeBoardId: string
  readonly appliedJobs: readonly ExtensionAppliedJob[]
  readonly stats: ExtensionRunStats
  readonly expanded: boolean
  readonly onToggleExpanded: () => void
}

export function ExtensionRunLiveFeed({ boards, activeBoardId, appliedJobs, stats, expanded, onToggleExpanded }: ExtensionRunLiveFeedProps) {
  const activeBoard = boards.find((board) => board.id === activeBoardId)
  if (!activeBoard) return null

  return (
    <div className="-mx-4 mt-3 shrink-0 border-t border-border bg-surface">
      {expanded ? (
        <div className="max-h-64 overflow-y-auto px-4 py-3">
          {boards.map((board) => {
            const Icon = BOARD_ICONS[board.id]
            const boardJobs = appliedJobs.filter((job) => job.boardId === board.id)
            return (
              <section key={board.id} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded bg-surface-subtle text-ink">
                    {Icon ? <Icon className="size-3.5" /> : <span className="text-[10px] font-semibold">{board.name.charAt(0)}</span>}
                  </span>
                  <span className="text-sm font-semibold text-ink">{board.name}</span>
                </div>
                {boardJobs.length > 0 ? (
                  <ul role="list" className="grid gap-2 pl-8">
                    {boardJobs.map((job) => (
                      <li key={job.id} className="rounded-lg border border-border bg-canvas px-3 py-2">
                        <p className="text-sm font-medium text-ink">{job.title}</p>
                        <p className="text-xs text-ink-muted">{job.company}</p>
                        <a href={job.listingUrl} target="_blank" rel="noreferrer" className="text-xs text-accent-text hover:underline">
                          {truncateUrl(job.listingUrl)}
                        </a>
                        <div className="mt-1.5">
                          <Badge variant={job.outcome === 'success' ? 'positive' : 'danger'} size="sm">
                            {job.outcome === 'success' ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                        {job.failureReason ? <p className="mt-1 text-xs text-ink-muted">{job.failureReason}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            )
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onToggleExpanded}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent"
      >
        {activeBoard.name} AutoApply
        <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
      </button>
      <div className="flex items-center justify-around border-t border-border px-4 py-2.5 text-xs">
        <div className="text-center">
          <p className="font-semibold text-positive">{stats.applied}</p>
          <p className="text-ink-muted">Applied</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-warning">{stats.skipped}</p>
          <p className="text-ink-muted">Skipped</p>
        </div>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-ink-muted">{stats.status}</p>
    </div>
  )
}
