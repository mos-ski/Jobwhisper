import { useState } from 'react'
import { Maximize2 } from 'lucide-react'

import { JobwhisperMark, Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionAppliedJob, ExtensionApplicationRow, ExtensionJobBoard, ExtensionRunStats } from '@/contracts/extension.draft'
import { ExtensionApplicationsTabView } from './applications-tab-view'
import { ExtensionJobsTabView } from './jobs-tab-view'
import { ExtensionRunTabView } from './run-tab-view'

export type ExtensionPopupViewProps = {
  readonly boards: readonly ExtensionJobBoard[]
  readonly jobs: readonly AutoApplyJob[]
  readonly creditBalance: number
  readonly applications: readonly ExtensionApplicationRow[]
  readonly onBoardAction: (boardId: string) => void
  readonly onSignOut: () => void
  readonly activeRunBoardId: string | null
  readonly runAppliedJobs: readonly ExtensionAppliedJob[]
  readonly runStats: ExtensionRunStats
}

export function ExtensionPopupView({
  boards,
  jobs,
  creditBalance,
  applications,
  onBoardAction,
  onSignOut,
  activeRunBoardId,
  runAppliedJobs,
  runStats,
}: ExtensionPopupViewProps) {
  const [activeTab, setActiveTab] = useState('run')
  const [feedExpanded, setFeedExpanded] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-canvas text-ink">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <JobwhisperMark className="h-5 w-auto text-brand-mark" />
        <div className="flex items-center gap-2">
          <span className="rounded-pill border border-border px-2 py-0.5 text-xs font-semibold text-ink-muted">{creditBalance} credits</span>
          <button type="button" disabled aria-disabled="true" aria-label="Open in a full tab" className="text-ink-muted">
            <Maximize2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden px-4 pt-3">
        <TabsList>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="run" className="flex flex-1 flex-col overflow-hidden pb-4">
          <ExtensionRunTabView
            boards={boards}
            onBoardAction={onBoardAction}
            activeBoardId={activeRunBoardId}
            appliedJobs={runAppliedJobs}
            stats={runStats}
            feedExpanded={feedExpanded}
            onToggleFeedExpanded={() => setFeedExpanded((prev) => !prev)}
            onViewJobHistory={() => setActiveTab('applications')}
          />
        </TabsContent>
        <TabsContent value="jobs" className="flex-1 overflow-y-auto pb-4">
          <ExtensionJobsTabView jobs={jobs} />
        </TabsContent>
        <TabsContent value="applications" className="flex-1 overflow-y-auto pb-4">
          <ExtensionApplicationsTabView applications={applications} />
        </TabsContent>
      </Tabs>

      <footer className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
        <span className="text-ink-muted">Extension</span>
        <button type="button" onClick={onSignOut} className="font-semibold text-accent-text hover:underline">
          Sign out
        </button>
      </footer>
    </div>
  )
}
