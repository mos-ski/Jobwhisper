import { useState } from 'react'

import { autoApplyJobs } from '@/mocks/auto-apply'
import { extensionJobBoards } from '@/mocks/extension'
import { ExtensionPopupView } from '@/features/extension/extension-popup-view'
import { ExtensionSignInView } from '@/features/extension/sign-in-view'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)

  if (!signedIn) {
    return <ExtensionSignInView onSignIn={() => setSignedIn(true)} />
  }

  return <ExtensionPopupView boards={extensionJobBoards} jobs={autoApplyJobs} creditBalance={10} onSignOut={() => setSignedIn(false)} />
}
