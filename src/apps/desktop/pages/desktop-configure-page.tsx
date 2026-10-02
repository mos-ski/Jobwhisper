import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { DesktopCredits, DesktopSessionConfig, DesktopSessionKind } from '@/contracts/desktop.draft'
import { DesktopConfigureView } from '@/features/desktop/desktop-configure-view'
import { Button, Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from '@/ui'
import { desktopCredits, desktopKnowledgeBase, desktopRoles, desktopSuggestedContext } from '@/mocks/desktop'
import { resumeDocument } from '@/mocks/resume'

const QUICK_TITLES: Record<DesktopSessionKind, string> = { interview: 'Interview', coding: 'Coding session', meeting: 'Meeting' }

// One credit buys about a minute of Copilot, so an hour is 60 credits.
const HOUR_IN_CREDITS = 60

export function readDesktopKind(value: string | null): DesktopSessionKind {
  return value === 'coding' || value === 'meeting' ? value : 'interview'
}

export function DesktopConfigurePage({ credits, onTopUp }: { readonly credits: DesktopCredits; readonly onTopUp: () => void }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const kind = readDesktopKind(params.get('kind'))
  const [pending, setPending] = useState<DesktopSessionConfig | null>(null)
  // `?state=lowcredits` previews the sub-hour warning without draining the wallet.
  const balance = params.get('state') === 'lowcredits' ? 42 + (credits.balance - desktopCredits.balance) : credits.balance

  const startSession = (config: DesktopSessionConfig) =>
    navigate(`/desktop/session?kind=${config.kind}&title=${encodeURIComponent([config.role, config.company].filter(Boolean).join(' · '))}`)

  return (
    <>
      <DesktopConfigureView
        key={kind}
        kind={kind}
        step={params.get('step') === '2' ? 2 : 1}
        onStepChange={(step) => {
          const next = new URLSearchParams(params)
          next.set('step', String(step))
          setParams(next)
        }}
        roles={desktopRoles}
        knowledgeBase={desktopKnowledgeBase}
        resume={{ name: 'Adedamola PM Resume Sept 26', document: resumeDocument }}
        suggestedContext={desktopSuggestedContext}
        models={['OpenAI (GPT 5.6 Sol)', 'Claude (Sonnet 5)', 'Gemini (3 Pro)']}
        languages={['English', 'French', 'Spanish', 'Portuguese', 'German']}
        onBack={() => navigate('/desktop/home')}
        onStart={(config) => {
          if (balance < HOUR_IN_CREDITS) setPending(config)
          else startSession(config)
        }}
        onStartWithoutSetup={() => navigate(`/desktop/session?kind=${kind}&title=${encodeURIComponent(QUICK_TITLES[kind])}`)}
      />
      <Dialog open={pending !== null} onOpenChange={(open) => { if (!open) setPending(null) }}>
        <DialogPopup aria-label="Low on credits">
          <DialogTitle className="text-base font-semibold">Low on credits</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6">
            You have {balance.toLocaleString('en-US')} credits — under an hour of Copilot at about a credit a minute. If this interview might run long, top up before you start.
          </DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setPending(null)
                onTopUp()
              }}
            >
              Top up
            </Button>
            <Button
              onClick={() => {
                const config = pending
                setPending(null)
                if (config) startSession(config)
              }}
            >
              Start anyway
            </Button>
          </div>
          <DialogClose aria-label="Close" />
        </DialogPopup>
      </Dialog>
    </>
  )
}
