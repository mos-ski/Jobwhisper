import { useSearchParams } from 'react-router-dom'

import type { JobDirectoryStatus } from '@/contracts/job-directory.draft'
import { JobDirectoryView } from '@/features/job-directory/job-directory-view'
import { jobBoards } from '@/mocks/job-directory'

const supportedStates = new Set<JobDirectoryStatus>(['ready', 'loading', 'error', 'offline'])

export function JobDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedState = searchParams.get('state') as JobDirectoryStatus | null
  const status = requestedState && supportedStates.has(requestedState) ? requestedState : 'ready'

  return (
    <JobDirectoryView
      homeHref="/v3/app"
      status={status}
      boards={status === 'loading' || status === 'error' ? [] : jobBoards}
      initialBoardId={searchParams.get('board') ?? undefined}
      initialJobId={searchParams.get('job') ?? undefined}
      onRetry={() => setSearchParams({})}
    />
  )
}
