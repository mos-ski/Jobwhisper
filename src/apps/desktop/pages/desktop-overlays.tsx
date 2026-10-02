import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopSettingsDialog, type DesktopSettingsSection, type DesktopTheme } from '@/features/desktop/desktop-settings-dialog'
import { DesktopWhatsNewDialog } from '@/features/desktop/desktop-whats-new-dialog'
import { desktopCredits, desktopRecentSessions, desktopReleaseNote, desktopUser } from '@/mocks/desktop'

const SECTIONS: readonly DesktopSettingsSection[] = ['general', 'interview', 'coding', 'meeting', 'billing', 'usage', 'window', 'account', 'connectors']

const THEME_STORAGE_KEY = 'jobwhisper-theme'

function readStoredTheme(): DesktopTheme {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

// `system` drops the attribute so the CSS media query follows the OS live; light/dark pin it.
function applyTheme(theme: DesktopTheme) {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.dataset.theme = theme
}

/** Settings (`?settings=<section>`) and What's new (`?whatsnew=1`), openable from any window screen. */
export function DesktopOverlays({ onWhatsNewSeen }: { readonly onWhatsNewSeen: () => void }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<DesktopTheme>(readStoredTheme)
  const raw = params.get('settings')
  const section = SECTIONS.find((item) => item === raw)
  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const liveKind = window.location.pathname.endsWith('/session') ? (params.get('kind') === 'coding' ? 'coding' : params.get('kind') === 'meeting' ? 'meeting' : 'interview') : undefined

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  // The dialog opens from the URL, so mark the release note read there rather than in onOpenChange.
  const whatsNewOpen = params.get('whatsnew') === '1'
  useEffect(() => {
    if (whatsNewOpen) onWhatsNewSeen()
  }, [whatsNewOpen, onWhatsNewSeen])

  return (
    <>
      <DesktopSettingsDialog
        open={section !== undefined}
        onOpenChange={(open) => { if (!open) set('settings', null) }}
        section={section ?? 'general'}
        onSectionChange={(next) => set('settings', next)}
        liveKind={liveKind}
        theme={theme}
        onThemeChange={setTheme}
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
      <DesktopWhatsNewDialog
        open={whatsNewOpen}
        onOpenChange={(open) => { if (!open) set('whatsnew', null) }}
        note={desktopReleaseNote}
      />
    </>
  )
}
