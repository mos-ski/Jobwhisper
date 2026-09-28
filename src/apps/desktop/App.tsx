import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopHeader } from '@/features/desktop/desktop-header'
import { DesktopPageTransition } from '@/features/desktop/desktop-page-transition'
import { DesktopPermissionsView } from '@/features/desktop/desktop-permissions-view'
import { DesktopShell } from '@/features/desktop/desktop-shell'
import { DesktopSignInView } from '@/features/desktop/desktop-sign-in-view'
import { desktopUser } from '@/mocks/desktop'

import { DesktopOverlays } from './pages/desktop-overlays'
import { DesktopCompletePage } from './pages/desktop-complete-page'
import { DesktopConfigurePage } from './pages/desktop-configure-page'
import { DesktopHomePage } from './pages/desktop-home-page'
import { DesktopOverlayPage } from './pages/desktop-overlay-page'
import { DesktopSessionPage } from './pages/desktop-session-page'

export default function DesktopApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [stealth, setStealth] = useState(false)
  const page = location.pathname.replace(/^\/desktop\/?/, '')

  // The floating overlay is not a window, so it sits outside the shell entirely.
  if (page === 'overlay') return <DesktopOverlayPage />

  const openParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next)
  }

  return (
    <DesktopShell
      chrome={page === 'session' ? 'bare' : page === 'complete' ? 'accent' : 'standard'}
      header={
        page === 'home' || page === 'configure' ? (
          <DesktopHeader
            userName={desktopUser.firstName}
            avatarSrc={desktopUser.avatarSrc}
            stealth={stealth}
            onToggleStealth={() => setStealth((value) => !value)}
            onOpenSettings={() => openParam('settings', 'general')}
            onOpenWhatsNew={() => openParam('whatsnew', '1')}
            onSignOut={() => navigate('/desktop')}
          />
        ) : undefined
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<DesktopPageTransition><DesktopSignInView onSignIn={() => navigate('/desktop/permissions')} /></DesktopPageTransition>} />
          <Route path="permissions" element={<DesktopPageTransition><DesktopPermissionsView /></DesktopPageTransition>} />
          <Route path="home" element={<DesktopPageTransition><DesktopHomePage /></DesktopPageTransition>} />
          <Route path="configure" element={<DesktopPageTransition><DesktopConfigurePage /></DesktopPageTransition>} />
          <Route path="session" element={<DesktopPageTransition><DesktopSessionPage stealth={stealth} onToggleStealth={() => setStealth((value) => !value)} /></DesktopPageTransition>} />
          <Route path="complete" element={<DesktopPageTransition><DesktopCompletePage /></DesktopPageTransition>} />
          <Route path="*" element={<Navigate to="/desktop" replace />} />
        </Routes>
      </AnimatePresence>
      <DesktopOverlays />
    </DesktopShell>
  )
}
