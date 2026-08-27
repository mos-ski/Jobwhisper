import { useEffect, useState } from 'react'

import { autoApplyJobs } from '@/mocks/auto-apply'
import { extensionAppliedJobQueue, extensionJobBoards } from '@/mocks/extension'
import { autoApplyJobToApplicationRow, extensionAppliedJobToApplicationRow, getAppliedJobs } from '@/lib/extension-applications'
import type { ExtensionRunStats } from '@/contracts/extension.draft'

const REVEAL_INTERVAL_MS = 1800

export function useExtensionAppState() {
  const [signedIn, setSignedIn] = useState(false)
  const [boards, setBoards] = useState(extensionJobBoards)
  const [activeRunBoardId, setActiveRunBoardId] = useState<string | null>(
    extensionJobBoards.find((board) => board.state === 'in-progress')?.id ?? null,
  )
  const [revealedCount, setRevealedCount] = useState(0)

  const revealedJobs = extensionAppliedJobQueue.slice(0, revealedCount)
  const activeBoardQueueLength = activeRunBoardId
    ? extensionAppliedJobQueue.filter((job) => job.boardId === activeRunBoardId).length
    : 0
  const activeBoardRevealedCount = activeRunBoardId
    ? revealedJobs.filter((job) => job.boardId === activeRunBoardId).length
    : 0

  useEffect(() => {
    if (!activeRunBoardId) return
    if (activeBoardRevealedCount >= activeBoardQueueLength) return

    const timer = window.setInterval(() => {
      setRevealedCount((prev) => Math.min(prev + 1, extensionAppliedJobQueue.length))
    }, REVEAL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [activeRunBoardId, activeBoardRevealedCount, activeBoardQueueLength])

  function handleBoardAction(boardId: string) {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== boardId) return board
        if (board.state === 'connect') return { ...board, state: 'start' }
        return { ...board, state: 'in-progress' }
      }),
    )
    const board = boards.find((b) => b.id === boardId)
    if (board?.state === 'start') {
      setActiveRunBoardId(boardId)
    }
  }

  const applications = [
    ...getAppliedJobs(autoApplyJobs).map(autoApplyJobToApplicationRow),
    ...revealedJobs.filter((job) => job.outcome === 'success').map(extensionAppliedJobToApplicationRow),
  ]

  const runStats: ExtensionRunStats = {
    applied: revealedJobs.filter((job) => job.boardId === activeRunBoardId && job.outcome === 'success').length,
    skipped: revealedJobs.filter((job) => job.boardId === activeRunBoardId && job.outcome === 'failed').length,
    status: activeBoardRevealedCount >= activeBoardQueueLength ? 'Up to date' : 'Fetching jobs…',
  }

  return {
    signedIn,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    boards,
    jobs: autoApplyJobs,
    creditBalance: 10,
    applications,
    onBoardAction: handleBoardAction,
    activeRunBoardId,
    runAppliedJobs: revealedJobs,
    runStats,
  }
}
