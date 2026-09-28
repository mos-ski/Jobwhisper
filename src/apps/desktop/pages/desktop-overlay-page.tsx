import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopOverlayView } from '@/features/desktop/desktop-overlay-view'
import { desktopTranscript } from '@/mocks/desktop'

export function DesktopOverlayPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const kind = params.get('kind') ?? 'interview'
  const [micOn, setMicOn] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const latest = [...desktopTranscript].reverse().find((entry) => entry.kind === 'answer')
  return (
    <div className="fixed inset-0 bg-desktop-backdrop">
      {/* Stands in for whatever call is on screen under the overlay. */}
      <div aria-hidden="true" className="absolute inset-8 rounded-2xl bg-live-panel" />
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <DesktopOverlayView
          connection={params.get('connection') === 'connected' ? 'connected' : 'unstable'}
          elapsedLabel="02:06"
          answer={!dismissed && latest?.kind === 'answer' ? { question: latest.question, runs: latest.runs } : undefined}
          micOn={micOn}
          onToggleMic={() => setMicOn((value) => !value)}
          onExpand={() => navigate(`/desktop/session?kind=${kind}`)}
          onEnd={() => navigate(`/desktop/complete?kind=${kind}`)}
          onDismiss={() => setDismissed(true)}
        />
      </div>
    </div>
  )
}
