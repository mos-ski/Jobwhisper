import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { DesktopCompleteView } from '@/features/desktop/desktop-complete-view'
import { DesktopConfigureView } from '@/features/desktop/desktop-configure-view'
import { DesktopHomeView } from '@/features/desktop/desktop-home-view'
import { DesktopPageTransition } from '@/features/desktop/desktop-page-transition'
import { DesktopPermissionsView } from '@/features/desktop/desktop-permissions-view'
import { DesktopSessionView } from '@/features/desktop/desktop-session-view'
import { DesktopShell } from '@/features/desktop/desktop-shell'
import { DesktopSignInView } from '@/features/desktop/desktop-sign-in-view'

export default function DesktopApp() {
  const location = useLocation()

  return (
    <DesktopShell>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<DesktopPageTransition><DesktopSignInView /></DesktopPageTransition>} />
          <Route path="permissions" element={<DesktopPageTransition><DesktopPermissionsView /></DesktopPageTransition>} />
          <Route path="home" element={<DesktopPageTransition><DesktopHomeView /></DesktopPageTransition>} />
          <Route path="configure" element={<DesktopPageTransition><DesktopConfigureView /></DesktopPageTransition>} />
          <Route path="session" element={<DesktopPageTransition><DesktopSessionView /></DesktopPageTransition>} />
          <Route path="complete" element={<DesktopPageTransition><DesktopCompleteView /></DesktopPageTransition>} />
          <Route path="*" element={<Navigate to="/desktop" replace />} />
        </Routes>
      </AnimatePresence>
    </DesktopShell>
  )
}
