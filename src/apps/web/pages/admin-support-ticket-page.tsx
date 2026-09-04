import { useSearchParams } from 'react-router-dom'

import { AdminSupportTicketView } from '@/features/admin/admin-support-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminSupportPrimaryTicketId, adminSupportTicketDetails } from '@/mocks/admin-support'

export type AdminSupportTicketPageProps = {
  readonly ticketId: string
}

export function AdminSupportTicketPage({ ticketId }: AdminSupportTicketPageProps) {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const state = params.get('state')
  const ticket = state === 'missing'
    ? null
    : adminSupportTicketDetails[ticketId] ?? adminSupportTicketDetails[adminSupportPrimaryTicketId] ?? null

  return (
    <AdminSupportTicketView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      ticket={ticket}
      ticketsHref="/admin/support"
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The support service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
