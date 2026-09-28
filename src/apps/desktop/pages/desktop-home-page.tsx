import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopHomeView, type DesktopHomeViewProps } from '@/features/desktop/desktop-home-view'
import { desktopCredits, desktopRecentSessions, desktopUser } from '@/mocks/desktop'

function readSessions(state: string | null): DesktopHomeViewProps['sessions'] {
  if (state === 'loading') return { status: 'loading' }
  if (state === 'error') return { status: 'error' }
  if (state === 'empty') return { status: 'ready', items: [] }
  return { status: 'ready', items: desktopRecentSessions }
}

export function DesktopHomePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [calendarPrompt, setCalendarPrompt] = useState(true)
  const openSettings = (section: string) => {
    const next = new URLSearchParams(params)
    next.set('settings', section)
    setParams(next)
  }
  return (
    <DesktopHomeView
      firstName={desktopUser.firstName}
      calendarPrompt={calendarPrompt}
      onConnectCalendar={() => openSettings('connectors')}
      onDismissCalendar={() => setCalendarPrompt(false)}
      onLaunch={(kind) => navigate(`/desktop/configure?kind=${kind}`)}
      sessions={readSessions(params.get('state'))}
      credits={params.get('state') === 'loading' ? undefined : desktopCredits}
      onOpenSession={() => openSettings('usage')}
      onViewAllSessions={() => openSettings('usage')}
      onManageCredits={() => openSettings('billing')}
      onRetry={() => setParams({})}
    />
  )
}
