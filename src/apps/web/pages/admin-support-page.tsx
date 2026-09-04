import { useSearchParams } from 'react-router-dom'

import type { AdminTicketAssigneeFilter, AdminTicketPriorityFilter, AdminTicketStatusFilter } from '@/contracts/admin-support.draft'
import { AdminSupportView } from '@/features/admin/admin-support-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminSupportSummary, adminSupportTickets } from '@/mocks/admin-support'

const STATUSES: readonly AdminTicketStatusFilter[] = ['all', 'open', 'in-progress', 'waiting', 'resolved', 'closed']
const PRIORITIES: readonly AdminTicketPriorityFilter[] = ['all', 'low', 'medium', 'high', 'urgent']

export function AdminSupportPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tab = (STATUSES.find((value) => value === params.get('tab')) ?? 'all') as AdminTicketStatusFilter
  const priority = (PRIORITIES.find((value) => value === params.get('priority')) ?? 'all') as AdminTicketPriorityFilter
  const assignee = (params.get('assignee') ?? 'all') as AdminTicketAssigneeFilter
  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  const state = params.get('state')

  function setParam(key: string, value: string, resetPage = true) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  return (
    <AdminSupportView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      summary={adminSupportSummary}
      tickets={state === 'empty' ? [] : adminSupportTickets}
      tab={tab}
      onTabChange={(next) => setParam('tab', next)}
      q={params.get('q') ?? ''}
      onQChange={(value) => setParam('q', value)}
      priority={priority}
      onPriorityChange={(next) => setParam('priority', next)}
      assignee={assignee}
      onAssigneeChange={(next) => setParam('assignee', next)}
      page={page}
      onPageChange={(next) => setParam('page', String(next), false)}
      onClearFilters={() => setParams(new URLSearchParams(), { replace: true })}
      ticketHref={(ticketId) => `/admin/support/${ticketId}`}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The support service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
