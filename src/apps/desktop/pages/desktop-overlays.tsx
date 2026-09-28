import { useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopSettingsDialog, type DesktopSettingsSection } from '@/features/desktop/desktop-settings-dialog'
import { DesktopWhatsNewDialog } from '@/features/desktop/desktop-whats-new-dialog'
import { desktopCredits, desktopRecentSessions, desktopReleaseNote, desktopUser } from '@/mocks/desktop'

const SECTIONS: readonly DesktopSettingsSection[] = ['general', 'interview', 'coding', 'meeting', 'billing', 'usage', 'window', 'account', 'connectors']

/** Settings (`?settings=<section>`) and What's new (`?whatsnew=1`), openable from any window screen. */
export function DesktopOverlays() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const raw = params.get('settings')
  const section = SECTIONS.find((item) => item === raw)
  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const liveKind = window.location.pathname.endsWith('/session') ? (params.get('kind') === 'coding' ? 'coding' : params.get('kind') === 'meeting' ? 'meeting' : 'interview') : undefined

  return (
    <>
      <DesktopSettingsDialog
        open={section !== undefined}
        onOpenChange={(open) => { if (!open) set('settings', null) }}
        section={section ?? 'general'}
        onSectionChange={(next) => set('settings', next)}
        liveKind={liveKind}
        user={desktopUser}
        credits={desktopCredits}
        planLabel="Free"
        planNote="Cancelled."
        sessions={desktopRecentSessions}
        version="1.0.14"
        platform="macOS"
        calendarConnected={false}
        onConnectCalendar={() => undefined}
        onAddCredits={() => navigate('/v3/billing/credits')}
        onOpenBilling={() => navigate('/v3/billing')}
        onOpenWhatsNew={() => {
          const next = new URLSearchParams(params)
          next.delete('settings')
          next.set('whatsnew', '1')
          setParams(next, { replace: true })
        }}
        onSignOut={() => navigate('/desktop')}
      />
      <DesktopWhatsNewDialog open={params.get('whatsnew') === '1'} onOpenChange={(open) => { if (!open) set('whatsnew', null) }} note={desktopReleaseNote} />
    </>
  )
}
