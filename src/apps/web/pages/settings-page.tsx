import { useSearchParams } from 'react-router-dom'

import { SettingsView, type SettingsTab } from '@/features/account/account-view'
import { referralRows, settingsProfile } from '@/mocks/account'

const settingsTabs: readonly SettingsTab[] = ['profile', 'security', 'referral']

export function SettingsPage() {
  const [params] = useSearchParams()
  const tabParam = params.get('tab')
  const activeTab = settingsTabs.includes(tabParam as SettingsTab) ? (tabParam as SettingsTab) : 'profile'

  return <SettingsView homeHref="/v3/app" activeTab={activeTab} profile={settingsProfile} referrals={referralRows} />
}
