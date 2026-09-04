import { useSearchParams } from 'react-router-dom'

import type { AdminContentTab } from '@/contracts/admin-content.draft'
import { AdminContentView } from '@/features/admin/admin-content-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminDownloadItems, adminFaqItems, adminMarketplaceItems, adminTutorialItems } from '@/mocks/admin-content'

const CONTENT_TABS: readonly AdminContentTab[] = ['marketplace', 'downloads', 'tutorials', 'faq']

export function AdminContentPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tab = CONTENT_TABS.find((value) => value === params.get('tab')) ?? 'marketplace'

  return (
    <AdminContentView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      tab={tab}
      onTabChange={(value) => {
        const next = new URLSearchParams(params)
        if (value === 'marketplace') next.delete('tab')
        else next.set('tab', value)
        setParams(next, { replace: true })
      }}
      marketplaceItems={adminMarketplaceItems}
      downloadItems={adminDownloadItems}
      tutorialItems={adminTutorialItems}
      faqItems={adminFaqItems}
    />
  )
}
