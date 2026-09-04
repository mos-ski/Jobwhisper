import { useSearchParams } from 'react-router-dom'

import { AdminConfigurationView, type AdminConfigurationTab } from '@/features/admin/admin-configuration-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import {
  adminConfigFeatureDefinitions,
  adminCouponScopeOptions,
  adminCoupons,
  adminCreditEconomics,
  adminDoneForYouPackages,
  adminMarketplacePricing,
  adminOnboardingSurvey,
  adminPlanConfigs,
  adminTrialConfig,
  adminUnsubscribedAllowance,
} from '@/mocks/admin-configuration'

const CONFIG_TABS: readonly AdminConfigurationTab[] = ['pricing', 'coupons', 'trials']

export function AdminConfigurationPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tabParam = params.get('tab')
  const tab = CONFIG_TABS.find((value) => value === tabParam) ?? 'pricing'

  return (
    <AdminConfigurationView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      tab={tab}
      onTabChange={(next) => {
        const params2 = new URLSearchParams(params)
        params2.set('tab', next)
        setParams(params2, { replace: true })
      }}
      plans={adminPlanConfigs}
      featureDefinitions={adminConfigFeatureDefinitions}
      creditEconomics={adminCreditEconomics}
      doneForYouPackages={adminDoneForYouPackages}
      marketplacePricing={adminMarketplacePricing}
      unsubscribedAllowance={adminUnsubscribedAllowance}
      coupons={params.get('state') === 'empty' ? [] : adminCoupons}
      couponScopeOptions={adminCouponScopeOptions}
      trial={adminTrialConfig}
      survey={adminOnboardingSurvey}
      today="2026-09-04"
      isLoading={params.get('state') === 'loading'}
    />
  )
}
