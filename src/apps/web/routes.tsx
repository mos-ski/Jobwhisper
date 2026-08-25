import { useLocation } from 'react-router-dom'

import { AuthCreateAccountPage } from './pages/auth-create-account-page'
import { AuthForgotPasswordPage } from './pages/auth-forgot-password-page'
import { AuthPlanPage } from './pages/auth-plan-page'
import { AuthSignInPage } from './pages/auth-sign-in-page'
import { AutoApplyAdditionalPage } from './pages/auto-apply-additional-page'
import { AutoApplyAgentPage } from './pages/auto-apply-agent-page'
import { AutoApplyAppliedPage } from './pages/auto-apply-applied-page'
import { AutoApplyContactPage } from './pages/auto-apply-contact-page'
import { AutoApplyJobsPage } from './pages/auto-apply-jobs-page'
import { AutoApplyPreferencesPage } from './pages/auto-apply-preferences-page'
import { AutoApplyReviewPage } from './pages/auto-apply-review-page'
import { AutoApplyUploadPage } from './pages/auto-apply-upload-page'
import { BillingPage } from './pages/billing-page'
import { CreditHistoryPage } from './pages/credit-history-page'
import { CopilotCompletePage } from './pages/copilot-complete-page'
import { CopilotConfigurePage } from './pages/copilot-configure-page'
import { CopilotHistoryPage } from './pages/copilot-history-page'
import { CopilotReportPage } from './pages/copilot-report-page'
import { CopilotPreferencesPage } from './pages/copilot-preferences-page'
import { CopilotReadyPage } from './pages/copilot-ready-page'
import { CopilotSessionPage } from './pages/copilot-session-page'
import { CopilotShareScreenPage } from './pages/copilot-share-screen-page'
import { CopilotUploadPage } from './pages/copilot-upload-page'
import { DashboardPage } from './pages/dashboard-page'
import { DocumentsAddPage } from './pages/documents-add-page'
import { DocumentsManualPage } from './pages/documents-manual-page'
import { DocumentsPage } from './pages/documents-page'
import { DownloadsPage } from './pages/downloads-page'
import { TutorialsPage } from './pages/tutorials-page'
import { InterviewCompletePage } from './pages/interview-complete-page'
import { InterviewConfigurePage } from './pages/interview-configure-page'
import { InterviewHistoryPage } from './pages/interview-history-page'
import { InterviewPreparingReportPage } from './pages/interview-preparing-report-page'
import { InterviewReportPage } from './pages/interview-report-page'
import { InterviewSessionPage } from './pages/interview-session-page'
import { InterviewUploadPage } from './pages/interview-upload-page'
import { InterviewVoicePage } from './pages/interview-voice-page'
import { OnboardingInterestsPage } from './pages/onboarding-interests-page'
import { OnboardingProfilePage } from './pages/onboarding-profile-page'
import { ResumeConfigurePage } from './pages/resume-configure-page'
import { ResumeEditorPage } from './pages/resume-editor-page'
import { ResumeHistoryPage } from './pages/resume-history-page'
import { ResumeUploadPage } from './pages/resume-upload-page'
import { RouteIndexPage } from './pages/route-index-page'
import { LibraryPage } from './pages/library-page'
import { SettingsPage } from './pages/settings-page'

export function WebRoutes() {
  const { pathname } = useLocation()
  const routePath = pathname.startsWith('/v3') ? pathname.slice(3) || '/' : pathname

  if (routePath === '/auth/sign-in') {
    return <AuthSignInPage />
  }

  if (routePath === '/auth/create-account') {
    return <AuthCreateAccountPage />
  }

  if (routePath === '/auth/forgot-password') {
    return <AuthForgotPasswordPage />
  }

  if (routePath === '/auth/choose-plan') {
    return <AuthPlanPage />
  }

  if (routePath === '/onboarding/profile') {
    return <OnboardingProfilePage />
  }

  if (routePath === '/onboarding/interests') {
    return <OnboardingInterestsPage />
  }

  if (routePath === '/app') {
    return <DashboardPage />
  }

  if (routePath === '/resume') {
    return <ResumeUploadPage />
  }

  if (routePath === '/documents/add') {
    return <DocumentsAddPage />
  }

  if (routePath === '/documents/manual') {
    return <DocumentsManualPage />
  }

  if (routePath === '/documents') {
    return <DocumentsPage />
  }

  if (routePath === '/downloads') {
    return <DownloadsPage />
  }

  if (routePath === '/tutorials') {
    return <TutorialsPage />
  }

  if (routePath === '/billing') {
    return <BillingPage />
  }

  if (routePath === '/billing/usage') {
    return <CreditHistoryPage />
  }

  if (routePath === '/settings') {
    return <SettingsPage />
  }

  if (routePath === '/resume/configure') {
    return <ResumeConfigurePage />
  }

  if (routePath === '/resume/editor') {
    return <ResumeEditorPage />
  }

  if (routePath === '/resume/history') {
    return <ResumeHistoryPage />
  }

  if (routePath === '/interview-prep') {
    return <InterviewUploadPage />
  }

  if (routePath === '/interview-prep/configure') {
    return <InterviewConfigurePage />
  }

  if (routePath === '/interview-prep/voice') {
    return <InterviewVoicePage />
  }

  if (routePath === '/interview-prep/session') {
    return <InterviewSessionPage />
  }

  if (routePath === '/interview-prep/complete') {
    return <InterviewCompletePage />
  }

  if (routePath === '/interview-prep/preparing-report') {
    return <InterviewPreparingReportPage />
  }

  if (routePath === '/interview-prep/history') {
    return <InterviewHistoryPage />
  }

  if (routePath === '/interview-prep/report') {
    return <InterviewReportPage />
  }

  if (routePath === '/interview-copilot') {
    return <CopilotUploadPage />
  }

  if (routePath === '/interview-copilot/configure') {
    return <CopilotConfigurePage />
  }

  if (routePath === '/interview-copilot/preferences') {
    return <CopilotPreferencesPage />
  }

  if (routePath === '/interview-copilot/share-screen') {
    return <CopilotShareScreenPage />
  }

  if (routePath === '/interview-copilot/ready') {
    return <CopilotReadyPage />
  }

  if (routePath === '/interview-copilot/session') {
    return <CopilotSessionPage />
  }

  if (routePath === '/interview-copilot/complete') {
    return <CopilotCompletePage />
  }

  if (routePath === '/interview-copilot/history') {
    return <CopilotHistoryPage />
  }

  if (routePath === '/interview-copilot/report') {
    return <CopilotReportPage />
  }

  if (routePath === '/auto-apply') {
    return <AutoApplyUploadPage />
  }

  if (routePath === '/auto-apply/contact') {
    return <AutoApplyContactPage />
  }

  if (routePath === '/auto-apply/preferences') {
    return <AutoApplyPreferencesPage />
  }

  if (routePath === '/auto-apply/additional') {
    return <AutoApplyAdditionalPage />
  }

  if (routePath === '/auto-apply/review') {
    return <AutoApplyReviewPage />
  }

  if (routePath === '/auto-apply/agent') {
    return <AutoApplyAgentPage />
  }

  if (routePath === '/auto-apply/jobs') {
    return <AutoApplyJobsPage />
  }

  if (routePath.startsWith('/auto-apply/jobs/')) {
    return <AutoApplyJobsPage selectedJobId={routePath.replace('/auto-apply/jobs/', '')} />
  }

  if (routePath === '/auto-apply/applied') {
    return <AutoApplyAppliedPage />
  }

  if (routePath === '/library') {
    return <LibraryPage />
  }

  return <RouteIndexPage />
}
