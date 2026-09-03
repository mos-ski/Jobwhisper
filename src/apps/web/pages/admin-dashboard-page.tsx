import { useSearchParams } from 'react-router-dom'

import { AdminDashboardView } from '@/features/admin/admin-dashboard-view'
import {
  adminAlerts,
  adminDateRanges,
  adminKpis,
  adminNavItems,
  adminNotifications,
  adminPlanMix,
  adminProductMix,
  adminSearchResults,
  adminSession,
  adminTrendPoints,
} from '@/mocks/admin'

export function AdminDashboardPage() {
  const [params] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  return (
    <AdminDashboardView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      dateRanges={adminDateRanges}
      kpis={adminKpis}
      trendPoints={adminTrendPoints}
      productMix={adminProductMix}
      planMix={adminPlanMix}
      alerts={adminAlerts}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
