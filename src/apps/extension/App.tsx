import { useState } from 'react'

import { autoApplyJobs } from '@/mocks/auto-apply'
import { extensionJobBoards } from '@/mocks/extension'
import { getAppliedJobs } from '@/lib/extension-applications'
import { ExtensionPopupView } from '@/features/extension/extension-popup-view'
import { ExtensionSignInView } from '@/features/extension/sign-in-view'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [boards, setBoards] = useState(extensionJobBoards)
  const applications = getAppliedJobs(autoApplyJobs)

  function handleBoardAction(boardId: string) {
    setBoards((prev) =>
      prev.map((board) => (board.id === boardId ? { ...board, state: board.state === 'connect' ? 'start' : 'in-progress' } : board)),
    )
  }

  if (!signedIn) {
    return <ExtensionSignInView onSignIn={() => setSignedIn(true)} />
  }

  return (
    <ExtensionPopupView
      boards={boards}
      jobs={autoApplyJobs}
      creditBalance={10}
      applications={applications}
      onBoardAction={handleBoardAction}
      onSignOut={() => setSignedIn(false)}
    />
  )
}
