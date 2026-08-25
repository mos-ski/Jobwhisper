import { useState } from 'react'
import { Activity, Briefcase, Check, ListChecks, Mic, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhoneFrame } from './mobile-preview/PhoneFrame'
import { HomeScreen } from './mobile-preview/HomeScreen'
import { CopilotModule } from './mobile-preview/CopilotModule'
import { NotificationsModule } from './mobile-preview/NotificationsModule'
import { MOCK_NOTIFICATIONS, type MockNotification } from './mobile-preview/mockData'
import { SplashScreen } from './mobile-preview/SplashScreen'
import { LoginScreen } from './mobile-preview/LoginScreen'
import { OnboardingPreviewScreen } from './mobile-preview/OnboardingPreviewScreen'
import { ResumeUploadScreen } from './mobile-preview/ResumeUploadScreen'
import { ContactDetailsScreen, type ContactData } from './mobile-preview/ContactDetailsScreen'
import { JobPreferencesScreen, type PreferencesData } from './mobile-preview/JobPreferencesScreen'
import { AdditionalInfoScreen, type AdditionalInfoData } from './mobile-preview/AdditionalInfoScreen'
import { NotificationsPromptScreen } from './mobile-preview/NotificationsPromptScreen'
import { ReferralCodeScreen } from './mobile-preview/ReferralCodeScreen'
import { OnboardingCompleteScreen } from './mobile-preview/OnboardingCompleteScreen'
import { JobFeedsScreen } from './mobile-preview/JobFeedsScreen'
import { ApplicationTrackerScreen } from './mobile-preview/ApplicationTrackerScreen'
import { ActivitiesScreen } from './mobile-preview/ActivitiesScreen'
import { ProfileScreen } from './mobile-preview/ProfileScreen'

export type ActiveTab = 'feeds' | 'tracker' | 'copilot' | 'activities' | 'profile'

type OnboardingStep =
  | 'splash'
  | 'login'
  | 'onboarding'
  | 'resume-upload'
  | 'contact-details'
  | 'job-preferences'
  | 'additional-info'
  | 'notifications'
  | 'referral'
  | 'complete'
  | 'main'

type SetupStep = 1 | 2 | 3 | 4

const TABS: { id: ActiveTab; label: string; icon: typeof Briefcase }[] = [
  { id: 'feeds', label: 'Job Feeds', icon: Briefcase },
  { id: 'tracker', label: 'Tracker', icon: ListChecks },
  { id: 'copilot', label: 'Copilot', icon: Mic },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'profile', label: 'Profile', icon: User },
]

const STEP_LABELS: Record<SetupStep, string> = {
  1: 'Upload your resume',
  2: 'Fill in your contact details',
  3: 'Set your job preferences',
  4: 'Additional details for applications',
}

export default function MobileAppPreview() {
  const [step, setStep] = useState<OnboardingStep>('splash')
  const [setupStep, setSetupStep] = useState<SetupStep>(1)
  const [contact, setContact] = useState<ContactData>({
    firstName: 'Darnell', lastName: 'Smith', email: 'darnell.smith@email.com',
    phone: '+1 (555) 123-4567', gender: '', dob: '', country: 'United States',
    city: 'San Francisco', streetAddress: '', postalCode: '', linkedIn: '', github: '', portfolio: '',
  })
  const [preferences, setPreferences] = useState<PreferencesData>({
    desiredRole: 'Product Designer', experienceLevel: 'Senior', salary: '',
    locations: '', employmentTypes: [], locationTypes: ['Remote'], openToRelocate: false,
  })
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData>({
    race: '', citizenship: '', veteran: '', disability: '', securityClearance: '',
    usWorkAuth: '', willingToStart: '', workSchedule: '', willingToTravel: false,
    drugTestConsent: false, backgroundCheckConsent: false,
  })

  const [activeTab, setActiveTab] = useState<ActiveTab>('feeds')
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length

  const advance = (next: OnboardingStep) => {
    setStep(next)
    setSetupStep((s) => (s + 1) as SetupStep)
  }

  if (step === 'splash') {
    return <PhoneFrame><SplashScreen onComplete={() => setStep('login')} /></PhoneFrame>
  }

  if (step === 'login') {
    return <PhoneFrame><LoginScreen onLogin={() => setStep('onboarding')} /></PhoneFrame>
  }

  if (step === 'onboarding') {
    return <PhoneFrame><OnboardingPreviewScreen onComplete={() => { setStep('resume-upload'); setSetupStep(1) }} /></PhoneFrame>
  }

  if (step === 'resume-upload') {
    return <PhoneFrame><><SetupStepHeader step={1} label={STEP_LABELS[1]} /><ResumeUploadScreen onComplete={() => advance('contact-details')} /></></PhoneFrame>
  }

  if (step === 'contact-details') {
    return (
      <PhoneFrame>
        <><SetupStepHeader step={2} label={STEP_LABELS[2]} /><ContactDetailsScreen data={contact} onChange={setContact} onContinue={() => advance('job-preferences')} /></>
      </PhoneFrame>
    )
  }

  if (step === 'job-preferences') {
    return (
      <PhoneFrame>
        <><SetupStepHeader step={3} label={STEP_LABELS[3]} /><JobPreferencesScreen data={preferences} onChange={setPreferences} onContinue={() => advance('additional-info')} /></>
      </PhoneFrame>
    )
  }

  if (step === 'additional-info') {
    return (
      <PhoneFrame>
        <><SetupStepHeader step={4} label={STEP_LABELS[4]} /><AdditionalInfoScreen data={additionalInfo} onChange={setAdditionalInfo} onContinue={() => { setStep('notifications'); setSetupStep(1) }} /></>
      </PhoneFrame>
    )
  }

  if (step === 'notifications') {
    return (
      <PhoneFrame>
        <NotificationsPromptScreen onEnable={() => setStep('referral')} onSkip={() => setStep('referral')} />
      </PhoneFrame>
    )
  }

  if (step === 'referral') {
    return <PhoneFrame><ReferralCodeScreen onContinue={() => setStep('complete')} /></PhoneFrame>
  }

  if (step === 'complete') {
    return <PhoneFrame><OnboardingCompleteScreen onStart={() => setStep('main')} /></PhoneFrame>
  }

  return (
    <PhoneFrame>
        <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'feeds' && <JobFeedsScreen />}
          {activeTab === 'tracker' && <ApplicationTrackerScreen />}
          {activeTab === 'copilot' && <CopilotModule />}
          {activeTab === 'activities' && <ActivitiesScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>
        <nav className="relative flex flex-shrink-0 items-center justify-around border-t border-neutral-200 bg-white px-2 pb-2 pt-1 md:px-2 md:py-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isCopilot = id === 'copilot'
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium transition-colors md:px-2 md:py-1 md:text-[10px]',
                  activeTab === id ? 'text-[#2563EB]' : 'text-neutral-400'
                )}
              >
                {isCopilot ? (
                  <span className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors md:h-9 md:w-9',
                    activeTab === 'copilot' ? 'bg-[#2563EB] text-white shadow-sm' : 'bg-neutral-100 text-neutral-400'
                  )}>
                    <Icon size={20} />
                  </span>
                ) : (
                  <Icon size={22} />
                )}
                {id === 'activities' && unreadCount > 0 && !isCopilot && (
                  <span className="absolute -right-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-center text-[9px] font-bold text-white md:h-3.5 md:w-3.5 md:text-[8px]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </PhoneFrame>
  )
}

function SetupStepHeader({ step, label }: { step: SetupStep; label: string }) {
  return (
    <div className="border-b border-neutral-100 px-6 pt-4 pb-3">
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4] as SetupStep[]).map((s, i) => (
          <span key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <span className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
              s < step ? 'bg-[#2563EB] text-white' : s === step ? 'bg-[#2563EB] text-white' : 'border-2 border-neutral-300 text-neutral-400'
            )}>
              {s < step ? <Check size={12} /> : s}
            </span>
            {i < 3 && <div className={cn('h-0.5 flex-1', s <= step ? 'bg-[#2563EB]' : 'bg-neutral-200')} />}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-500">{label}</p>
    </div>
  )
}
