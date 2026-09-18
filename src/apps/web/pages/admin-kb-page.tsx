import { AdminKBView } from '@/features/admin/admin-kb-view'
import { kbArticles, kbCategories } from '@/mocks/support-chat'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'

export function AdminKBPage() {
  return (
    <AdminKBView
      user={adminSession.user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      articles={kbArticles}
      categories={kbCategories}
    />
  )
}
