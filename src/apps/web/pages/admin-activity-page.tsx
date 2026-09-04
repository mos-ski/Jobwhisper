import { useSearchParams } from 'react-router-dom'

import { AdminActivityView } from '@/features/admin/admin-activity-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminActivityFeed } from '@/mocks/admin-activity'

export function AdminActivityPage() {
  const [params] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  return (
    <AdminActivityView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      feed={adminActivityFeed}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
