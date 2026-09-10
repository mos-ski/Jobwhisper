import { AdminFeatureFlagsView } from '@/features/admin/admin-feature-flags-view'
import { adminFeatureFlags } from '@/mocks/admin-feature-flags'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'

export function AdminFeatureFlagsPage() {
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  return (
    <AdminFeatureFlagsView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      flags={adminFeatureFlags}
    />
  )
}
