import { useSearchParams } from 'react-router-dom'

import { AdminKpisView } from '@/features/admin/admin-kpis-view'
import { adminDateRanges, adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminRevenueKpis } from '@/mocks/admin-kpis'

export function AdminKpisPage() {
  const [params] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  return (
    <AdminKpisView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      dateRanges={adminDateRanges}
      kpis={adminRevenueKpis}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
