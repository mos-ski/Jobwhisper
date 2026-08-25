import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import { lazy, Suspense } from 'react'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import LightforthHomePage from '@/pages/marketing/lightforth-home/LightforthHomePage'

const OnboardingFlow = lazy(() => import('@/pages/OnboardingFlow'))
const MyDocuments = lazy(() => import('@/pages/MyDocuments'))
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder'))
const AutoApply = lazy(() => import('@/pages/AutoApply'))
const InterviewCopilot = lazy(() => import('@/pages/InterviewCopilot'))
const InterviewPrep = lazy(() => import('@/pages/InterviewPrep'))
const JobProfile = lazy(() => import('@/pages/JobProfile'))
const Explore = lazy(() => import('@/pages/Explore'))
const HowToUse = lazy(() => import('@/pages/HowToUse'))
const DesktopCopilotPreview = lazy(() => import('@/pages/DesktopCopilotPreview'))
const FigmaInteriorLanding = lazy(() => import('@/pages/marketing/FigmaInteriorLanding'))
const RegularCheckoutPage = lazy(() => import('@/pages/marketing/checkout/RegularCheckoutPage'))
const MobileAppPreview = lazy(() => import('@/pages/MobileAppPreview'))
const V3WebRoutes = lazy(() => import('@/apps/web/routes').then((module) => ({ default: module.WebRoutes })))
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'))
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'))
const AdminRevenue = lazy(() => import('@/pages/admin/AdminRevenue'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminResumeBuilder = lazy(() => import('@/pages/admin/AdminResumeBuilder'))
const AdminActivityLogs = lazy(() => import('@/pages/admin/AdminActivityLogs'))
const AdminAutoApply = lazy(() => import('@/pages/admin/AdminAutoApply'))
const AdminInterviewCopilot = lazy(() => import('@/pages/admin/AdminInterviewCopilot'))
const AdminCodingCopilot = lazy(() => import('@/pages/admin/AdminCodingCopilot'))
const AdminInterviewPrep = lazy(() => import('@/pages/admin/AdminInterviewPrep'))
const AdminAtsChecker = lazy(() => import('@/pages/admin/AdminAtsChecker'))
const AdminMeeting = lazy(() => import('@/pages/admin/AdminMeeting'))
const AdminFunnels = lazy(() => import('@/pages/admin/AdminFunnels'))
const AdminPricing = lazy(() => import('@/pages/admin/AdminPricing'))
const AdminPartners = lazy(() => import('@/pages/admin/AdminPartners'))
const AdminEnterprises = lazy(() => import('@/pages/admin/AdminEnterprises'))
const AdminPromotions = lazy(() => import('@/pages/admin/AdminPromotions'))
const AdminBroadcast = lazy(() => import('@/pages/admin/AdminBroadcast'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'))
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport'))
const AdminUserDetail = lazy(() => import('@/pages/admin/AdminUserDetail'))
const CareerSpecialistLayout = lazy(() => import('@/pages/career-specialist/CareerSpecialistLayout'))
const CareerSpecialistPage = lazy(() => import('@/pages/career-specialist/CareerSpecialistPage'))
const AllSpecialistsPage = lazy(() => import('@/pages/career-specialist/AllSpecialistsPage'))
const SpecialistProfilePage = lazy(() => import('@/pages/career-specialist/SpecialistProfilePage'))
const AllStudentsPage = lazy(() => import('@/pages/career-specialist/AllStudentsPage'))
const StudentProfilePage = lazy(() => import('@/pages/career-specialist/StudentProfilePage'))
const AllApplicationsPage = lazy(() => import('@/pages/career-specialist/AllApplicationsPage'))
const ApplicationDetailPage = lazy(() => import('@/pages/career-specialist/ApplicationDetailPage'))
const JobsPage = lazy(() => import('@/pages/career-specialist/JobsPage'))
const SettingsPage = lazy(() => import('@/pages/career-specialist/SettingsPage'))
const CreateStudentPage = lazy(() => import('@/pages/career-specialist/CreateStudentPage'))

const AtsCheckerPage = lazy(() => import('@/pages/marketing/products/AtsCheckerPage'))
const AutoApplyMarketingPage = lazy(() => import('@/pages/marketing/products/AutoApplyMarketingPage'))
const ResumeMarketingPage = lazy(() => import('@/pages/marketing/products/ResumeMarketingPage'))
const InterviewPrepMarketingPage = lazy(() => import('@/pages/marketing/products/InterviewPrepMarketingPage'))
const CopilotMarketingPage = lazy(() => import('@/pages/marketing/products/CopilotMarketingPage'))
const PricingPage = lazy(() => import('@/pages/marketing/pricing/PricingPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/marketing/legal/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/pages/marketing/legal/TermsPage'))
const RefundPolicyPage = lazy(() => import('@/pages/marketing/legal/RefundPolicyPage'))

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

function AppRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LightforthHomePage />} />
            <Route path="/ats-checker" element={<Suspense fallback={null}><AtsCheckerPage /></Suspense>} />
            <Route path="/resume" element={<Suspense fallback={null}><ResumeMarketingPage /></Suspense>} />
            <Route path="/co-pilot" element={<Suspense fallback={null}><CopilotMarketingPage /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={null}><PricingPage /></Suspense>} />
            <Route path="/privacy-policy" element={<Suspense fallback={null}><PrivacyPolicyPage /></Suspense>} />
            <Route path="/terms-condition" element={<Suspense fallback={null}><TermsPage /></Suspense>} />
            <Route path="/refund-policy" element={<Suspense fallback={null}><RefundPolicyPage /></Suspense>} />
            <Route path="/auth/*" element={<Navigate to="/v3/auth/sign-in" replace />} />
            <Route path="/onboarding" element={<Suspense fallback={null}><OnboardingFlow /></Suspense>} />
            <Route path="/app" element={<AppRoute><Dashboard /></AppRoute>} />
            <Route path="/documents" element={<AppRoute><Suspense fallback={null}><MyDocuments /></Suspense></AppRoute>} />
            <Route path="/documents/context" element={<Navigate to="/v3/documents" replace />} />
            <Route path="/resume-builder" element={<ProtectedRoute><Suspense fallback={null}><ResumeBuilder /></Suspense></ProtectedRoute>} />
            <Route path="/auto-apply" element={<Suspense fallback={null}><AutoApplyMarketingPage /></Suspense>} />
            <Route path="/app/auto-apply" element={<AppRoute><Suspense fallback={null}><AutoApply /></Suspense></AppRoute>} />
            <Route path="/interview-prep" element={<Suspense fallback={null}><InterviewPrepMarketingPage /></Suspense>} />
            <Route path="/app/interview-prep" element={<AppRoute><Suspense fallback={null}><InterviewPrep /></Suspense></AppRoute>} />
            <Route path="/interview-copilot" element={<AppRoute><Suspense fallback={null}><InterviewCopilot /></Suspense></AppRoute>} />
            <Route path="/billing" element={<Navigate to="/v3/billing" replace />} />
            <Route path="/billings-and-subscription" element={<Navigate to="/v3/billing" replace />} />
            <Route path="/billing/usage" element={<Navigate to="/v3/billing/usage" replace />} />
            <Route path="/settings" element={<Navigate to="/v3/settings" replace />} />
            <Route path="/job-profile" element={<AppRoute><Suspense fallback={null}><JobProfile /></Suspense></AppRoute>} />
            <Route path="/explore" element={<AppRoute><Suspense fallback={null}><Explore /></Suspense></AppRoute>} />
            <Route path="/downloads" element={<Navigate to="/v3/downloads" replace />} />
            <Route path="/how-to-use" element={<AppRoute><Suspense fallback={null}><HowToUse /></Suspense></AppRoute>} />
            <Route path="/career-specialist" element={<Suspense fallback={null}><CareerSpecialistLayout /></Suspense>}>
              <Route index element={<Suspense fallback={null}><CareerSpecialistPage /></Suspense>} />
              <Route path="specialists" element={<Suspense fallback={null}><AllSpecialistsPage /></Suspense>} />
              <Route path="specialists/:id" element={<Suspense fallback={null}><SpecialistProfilePage /></Suspense>} />
              <Route path="students" element={<Suspense fallback={null}><AllStudentsPage /></Suspense>} />
              <Route path="students/create" element={<Suspense fallback={null}><CreateStudentPage /></Suspense>} />
              <Route path="students/:id" element={<Suspense fallback={null}><StudentProfilePage /></Suspense>} />
              <Route path="applications" element={<Suspense fallback={null}><AllApplicationsPage /></Suspense>} />
              <Route path="applications/:id" element={<Suspense fallback={null}><ApplicationDetailPage /></Suspense>} />
              <Route path="jobs" element={<Suspense fallback={null}><JobsPage /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={null}><SettingsPage /></Suspense>} />
            </Route>
            <Route path="/desktop-copilot-preview" element={<Suspense fallback={null}><DesktopCopilotPreview /></Suspense>} />
            <Route path="/figma-interiors" element={<Suspense fallback={null}><FigmaInteriorLanding /></Suspense>} />
            <Route path="/checkout/:planId" element={<Suspense fallback={null}><RegularCheckoutPage /></Suspense>} />
            <Route path="/mobile-app" element={<Suspense fallback={null}><MobileAppPreview /></Suspense>} />
            <Route path="/v3/*" element={<Suspense fallback={null}><V3WebRoutes /></Suspense>} />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<Suspense fallback={null}><AdminOverview /></Suspense>} />
              <Route path="revenue" element={<Suspense fallback={null}><AdminRevenue /></Suspense>} />
              <Route path="users" element={<Suspense fallback={null}><AdminUsers /></Suspense>} />
              <Route path="users/:id" element={<Suspense fallback={null}><AdminUserDetail /></Suspense>} />
              <Route path="users/partners" element={<Suspense fallback={null}><AdminPartners /></Suspense>} />
              <Route path="users/enterprises" element={<Suspense fallback={null}><AdminEnterprises /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={null}><AdminAnalytics /></Suspense>} />
              <Route path="funnels" element={<Suspense fallback={null}><AdminFunnels /></Suspense>} />
              <Route path="auto-apply" element={<Suspense fallback={null}><AdminAutoApply /></Suspense>} />
              <Route path="interview-copilot" element={<Suspense fallback={null}><AdminInterviewCopilot /></Suspense>} />
              <Route path="coding-copilot" element={<Suspense fallback={null}><AdminCodingCopilot /></Suspense>} />
              <Route path="interview-prep" element={<Suspense fallback={null}><AdminInterviewPrep /></Suspense>} />
              <Route path="meeting" element={<Suspense fallback={null}><AdminMeeting /></Suspense>} />
              <Route path="resume-builder" element={<Suspense fallback={null}><AdminResumeBuilder /></Suspense>} />
              <Route path="activity-logs" element={<Suspense fallback={null}><AdminActivityLogs /></Suspense>} />
              <Route path="promotions" element={<Suspense fallback={null}><AdminPromotions /></Suspense>} />
              <Route path="broadcast" element={<Suspense fallback={null}><AdminBroadcast /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={null}><AdminSettings /></Suspense>} />
              <Route path="pricing" element={<Suspense fallback={null}><AdminPricing /></Suspense>} />
              <Route path="notifications" element={<Suspense fallback={null}><AdminNotifications /></Suspense>} />
              <Route path="support" element={<Suspense fallback={null}><AdminSupport /></Suspense>} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
