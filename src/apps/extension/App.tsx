import { ExtensionPopupView } from '@/features/extension/extension-popup-view'
import { ExtensionSignInView } from '@/features/extension/sign-in-view'
import { useExtensionAppState } from '@/features/extension/use-extension-app-state'

export default function App() {
  const state = useExtensionAppState()

  if (!state.signedIn) {
    return <ExtensionSignInView onSignIn={state.signIn} />
  }

  return (
    <ExtensionPopupView
      boards={state.boards}
      jobs={state.jobs}
      creditBalance={state.creditBalance}
      applications={state.applications}
      onBoardAction={state.onBoardAction}
      onSignOut={state.signOut}
      activeRunBoardId={state.activeRunBoardId}
      runAppliedJobs={state.runAppliedJobs}
      runStats={state.runStats}
    />
  )
}
