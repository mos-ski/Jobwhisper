import { ExtensionPopupView } from '@/features/extension/extension-popup-view'
import { ExtensionSignInView } from '@/features/extension/sign-in-view'
import { useExtensionAppState } from '@/features/extension/use-extension-app-state'

export function ExtensionPage() {
  const state = useExtensionAppState()

  if (!state.signedIn) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="w-full max-w-[375px]">
          <ExtensionSignInView onSignIn={state.signIn} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="fixed inset-y-0 right-0 w-[375px] border-l border-border shadow-panel">
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
      </div>
    </div>
  )
}
