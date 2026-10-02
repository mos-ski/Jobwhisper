import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { DesktopAppearance, DesktopCredits } from '@/contracts/desktop.draft'
import { AddCreditsDialog } from '@/features/billing/add-credits-dialog'
import { DesktopSettingsDialog, type DesktopSettingsSection, type DesktopTheme } from '@/features/desktop/desktop-settings-dialog'
import { DesktopWhatsNewDialog } from '@/features/desktop/desktop-whats-new-dialog'
import { desktopRecentSessions, desktopReleaseNote, desktopUser } from '@/mocks/desktop'

const SECTIONS: readonly DesktopSettingsSection[] = ['general', 'interview', 'coding', 'meeting', 'billing', 'usage', 'window', 'account', 'connectors']

// Same rate as the web top-up: $0.40 a credit, $10 minimum.
const TOPUP_CENTS_PER_CREDIT = 40
const TOPUP_MINIMUM_DOLLARS = 10
const TOPUP_PRESET_DOLLARS = [10, 20, 50]

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

export type DesktopOverlaysProps = {
  readonly onWhatsNewSeen: () => void
  readonly credits: DesktopCredits
  /** Credits handed to the live wallet after a successful top-up. */
  readonly onTopUp: (credits: number) => void
  readonly appearance: DesktopAppearance
  readonly onAppearanceChange: (appearance: DesktopAppearance) => void
  readonly stealth: boolean
  readonly onToggleStealth: () => void
}

/** Settings (`?settings=`), What's new (`?whatsnew=1`) and the top-up dialog (`?topup=1`), openable from any window screen. */
export function DesktopOverlays({ onWhatsNewSeen, credits, onTopUp, appearance, onAppearanceChange, stealth, onToggleStealth }: DesktopOverlaysProps) {
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
        appearance={appearance}
        onAppearanceChange={onAppearanceChange}
        stealth={stealth}
        onToggleStealth={onToggleStealth}
        user={desktopUser}
        credits={credits}
        planLabel="Free"
        planNote="Cancelled."
        sessions={desktopRecentSessions}
        version="1.0.14"
        platform="macOS"
        calendarConnected={false}
        onConnectCalendar={() => undefined}
        onAddCredits={() => {
          // One dialog at a time: settings steps aside for the top-up.
          const next = new URLSearchParams(params)
          next.delete('settings')
          next.set('topup', '1')
          setParams(next, { replace: true })
        }}
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
      <AddCreditsDialog
        open={params.get('topup') === '1'}
        onOpenChange={(open) => { if (!open) set('topup', null) }}
        title="Add Interview Copilot credits"
        description="Interview Copilot"
        centsPerCredit={TOPUP_CENTS_PER_CREDIT}
        unitNoun="minute"
        minimumDollars={TOPUP_MINIMUM_DOLLARS}
        presetDollars={TOPUP_PRESET_DOLLARS}
        currentBalanceCredits={credits.balance}
        autoReloadHint="Buy more automatically if you run out mid-session."
        onPurchase={onTopUp}
      />
    </>
  )
}
