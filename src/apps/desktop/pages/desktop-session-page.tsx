import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { DesktopChatMessage, DesktopResponseLength } from '@/contracts/desktop.draft'
import { DesktopSessionView } from '@/features/desktop/desktop-session-view'
import { desktopChat, desktopTranscript } from '@/mocks/desktop'

import { readDesktopKind } from './desktop-configure-page'

function clock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function DesktopSessionPage({ stealth, onToggleStealth }: { readonly stealth: boolean; readonly onToggleStealth: () => void }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const kind = readDesktopKind(params.get('kind'))
  const empty = params.get('state') === 'empty'
  const [seconds, setSeconds] = useState(81)
  const [length, setLength] = useState<DesktopResponseLength>('medium')
  const [micOn, setMicOn] = useState(true)
  const [chat, setChat] = useState<readonly DesktopChatMessage[]>(empty ? [] : desktopChat)

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <DesktopSessionView
      title={params.get('title') || 'Product Manager · Guwe'}
      connection={params.get('connection') === 'unstable' ? 'unstable' : params.get('connection') === 'fair' ? 'fair' : 'connected'}
      activity={empty ? 'listening' : 'answering'}
      elapsedLabel={clock(seconds)}
      length={length}
      onLengthChange={setLength}
      transcript={empty ? [] : desktopTranscript}
      chat={chat}
      onAsk={(text) => setChat((current) => [
        ...current,
        { id: `you-${current.length}`, author: 'you', text },
        { id: `cp-${current.length}`, author: 'copilot', text: 'Lead with the outcome: at Syarpa, KYC tiering and savings-goal flows lifted weekly active users 45%. Then say how you got there in one line, and close on what it means for Guwe.' },
      ])}
      micOn={micOn}
      onToggleMic={() => setMicOn((value) => !value)}
      stealth={stealth}
      onToggleStealth={onToggleStealth}
      onCapture={() => undefined}
      onCompact={() => navigate(`/desktop/overlay?kind=${kind}`)}
      onOpenSettings={() => {
        const next = new URLSearchParams(params)
        next.set('settings', kind)
        setParams(next)
      }}
      onEnd={() => navigate(`/desktop/complete?kind=${kind}`)}
      modelLabel="OpenAI"
      creditsUsed={0.12}
      minutesLeftLabel="About 506 min left at this rate"
    />
  )
}
