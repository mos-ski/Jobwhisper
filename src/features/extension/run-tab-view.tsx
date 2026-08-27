import type { ComponentType } from 'react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { SiGlassdoor, SiIndeed } from 'react-icons/si'

import { Badge, Button } from '@/ui'
import type { ExtensionAppliedJob, ExtensionJobBoard, ExtensionRunStats } from '@/contracts/extension.draft'
import { ExtensionRunLiveFeed } from './run-live-feed'

const BOARD_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  indeed: SiIndeed,
  glassdoor: SiGlassdoor,
  linkedin: FaLinkedin,
}

export type ExtensionRunTabViewProps = {
  readonly boards: readonly ExtensionJobBoard[]
  readonly onBoardAction: (boardId: string) => void
  readonly activeBoardId: string | null
  readonly appliedJobs: readonly ExtensionAppliedJob[]
  readonly stats: ExtensionRunStats
  readonly feedExpanded: boolean
  readonly onToggleFeedExpanded: () => void
  readonly onViewJobHistory: () => void
}

export function ExtensionRunTabView({
  boards,
  onBoardAction,
  activeBoardId,
  appliedJobs,
  stats,
  feedExpanded,
  onToggleFeedExpanded,
  onViewJobHistory,
}: ExtensionRunTabViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <ul role="list" className="grid gap-2">
          {boards.map((board) => {
            const Icon = BOARD_ICONS[board.id]
            return (
              <li key={board.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-md bg-surface-subtle text-ink">
                    {Icon ? <Icon className="size-4" /> : <span className="text-xs font-semibold">{board.name.charAt(0)}</span>}
                  </span>
                  <span className="text-sm font-medium text-ink">{board.name}</span>
                </div>
                {board.state === 'in-progress' ? (
                  <Badge variant="neutral" className="inline-flex items-center gap-1.5">
                    <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                    Application in progress
                  </Badge>
                ) : (
                  <Button type="button" size="sm" variant={board.state === 'connect' ? 'secondary' : 'primary'} onClick={() => onBoardAction(board.id)}>
                    {board.state === 'connect' ? 'Connect to Jobwhisper' : 'Start AutoApply'}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>

        {activeBoardId ? (
          <button
            type="button"
            onClick={onViewJobHistory}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-text hover:underline"
          >
            Job history
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>

      {activeBoardId ? (
        <ExtensionRunLiveFeed
          boards={boards}
          activeBoardId={activeBoardId}
          appliedJobs={appliedJobs}
          stats={stats}
          expanded={feedExpanded}
          onToggleExpanded={onToggleFeedExpanded}
        />
      ) : null}
    </div>
  )
}
