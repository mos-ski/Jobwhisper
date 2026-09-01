import { Navigate, Route, Routes } from 'react-router-dom'

import { DesktopCompleteView } from '@/features/desktop/desktop-complete-view'
import { DesktopConfigureView } from '@/features/desktop/desktop-configure-view'
import { DesktopPermissionsView } from '@/features/desktop/desktop-permissions-view'
import { DesktopSessionView } from '@/features/desktop/desktop-session-view'
import { DesktopShell } from '@/features/desktop/desktop-shell'
import { DesktopSignInView } from '@/features/desktop/desktop-sign-in-view'

export default function DesktopApp() {
  return (
    <DesktopShell>
      <Routes>
        <Route index element={<DesktopSignInView />} />
        <Route path="permissions" element={<DesktopPermissionsView />} />
        <Route path="configure" element={<DesktopConfigureView />} />
        <Route path="session" element={<DesktopSessionView />} />
        <Route path="complete" element={<DesktopCompleteView />} />
        <Route path="*" element={<Navigate to="/desktop" replace />} />
      </Routes>
    </DesktopShell>
  )
}
