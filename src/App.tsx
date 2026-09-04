import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { WebRoutes } from '@/apps/web/routes'
import { LandingPage } from '@/apps/web/pages/landing-page'
import { VslLandingPage } from '@/apps/web/pages/vsl-landing-page'
import { BrandingGuidePage } from '@/apps/web/pages/branding-guide-page'
import { EmailsIndexPage } from '@/apps/web/pages/emails-index-page'
import { EmailPreviewPage } from '@/apps/web/pages/email-preview-page'
import DesktopApp from '@/apps/desktop/App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vsl" element={<VslLandingPage />} />
          <Route path="/branding-guide" element={<BrandingGuidePage />} />
          <Route path="/emails" element={<EmailsIndexPage />} />
          <Route path="/emails/:slug" element={<EmailPreviewPage />} />
          <Route path="/v3/*" element={<Suspense fallback={null}><WebRoutes /></Suspense>} />
          <Route path="/admin/*" element={<Suspense fallback={null}><WebRoutes /></Suspense>} />
          <Route path="/desktop/*" element={<DesktopApp />} />
          <Route path="*" element={<Navigate to="/v3" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
