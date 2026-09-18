import { useSearchParams } from 'react-router-dom'
import type { AdminMessagingTab } from '@/contracts/admin-messaging.draft'
import { AdminMessagingView } from '@/features/admin/admin-messaging-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminBroadcasts, adminMessagingMetrics } from '@/mocks/admin-messaging'

const MESSAGING_TABS: readonly AdminMessagingTab[] = ['all', 'sent', 'draft', 'scheduled', 'failed']

export function AdminMessagingPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tab = MESSAGING_TABS.find((value) => value === params.get('tab')) ?? 'all'

  return (
    <AdminMessagingView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      tab={tab}
      onTabChange={(value) => {
        const next = new URLSearchParams(params)
        if (value === 'all') next.delete('tab')
        else next.set('tab', value)
        setParams(next, { replace: true })
      }}
      broadcasts={adminBroadcasts}
      metrics={adminMessagingMetrics}
    />
  )
}
