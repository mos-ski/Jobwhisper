import { useSearchParams } from 'react-router-dom'

import type { AdminAuditFilters, AdminSystemsTab } from '@/contracts/admin-systems.draft'
import { AdminSystemsView } from '@/features/admin/admin-systems-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import {
  adminAuditActionTypes,
  adminAuditActors,
  adminAuditEntries,
  adminAuditRanges,
  adminNotificationSettings,
  adminPermissionCatalog,
  adminSystemsDenseNotificationFeed,
  adminSystemsRestrictedUser,
  adminTeamMembers,
} from '@/mocks/admin-systems'

const TABS: readonly AdminSystemsTab[] = ['team', 'audit', 'notifications']

function isActionType(value: string | null): value is AdminAuditFilters['actionType'] {
  return value !== null && (value === 'all' || adminAuditActionTypes.some((entry) => entry.id === value))
}

function isRange(value: string | null): value is AdminAuditFilters['range'] {
  return value !== null && adminAuditRanges.some((entry) => entry.id === value)
}

export function AdminSystemsPage() {
  const [params, setParams] = useSearchParams()
  const sessionUser = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!sessionUser) return null

  const state = params.get('state')
  // `state=restricted` demos the permission-denied treatment for an admin without admin:users:manage.
  const user = state === 'restricted' ? adminSystemsRestrictedUser : sessionUser
  const tab = TABS.find((value) => value === params.get('tab')) ?? 'team'
  const resultParam = params.get('result')
  const pageParam = Number(params.get('page'))

  const auditFilters: AdminAuditFilters = {
    actorId: params.get('actor') ?? 'all',
    actionType: isActionType(params.get('action')) ? params.get('action') as AdminAuditFilters['actionType'] : 'all',
    result: resultParam === 'success' || resultParam === 'denied' ? resultParam : 'all',
    range: isRange(params.get('range')) ? params.get('range') as AdminAuditFilters['range'] : 'all',
    query: params.get('q') ?? '',
  }

  const paramKeys: Readonly<Record<keyof AdminAuditFilters, string>> = {
    actorId: 'actor',
    actionType: 'action',
    result: 'result',
    range: 'range',
    query: 'q',
  }

  return (
    <AdminSystemsView
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
      teamMembers={adminTeamMembers}
      permissionCatalog={adminPermissionCatalog}
      auditEntries={state === 'empty' ? [] : adminAuditEntries}
      auditActionTypes={adminAuditActionTypes}
      auditActors={adminAuditActors}
      auditRanges={adminAuditRanges}
      auditFilters={auditFilters}
      onAuditFiltersChange={(next) => {
        const params2 = new URLSearchParams(params)
        for (const [key, value] of Object.entries(next)) {
          const param = paramKeys[key as keyof AdminAuditFilters]
          if (value && value !== 'all') params2.set(param, String(value))
          else params2.delete(param)
        }
        params2.delete('page')
        setParams(params2, { replace: true })
      }}
      onClearAuditFilters={() => setParams(new URLSearchParams({ tab: 'audit' }), { replace: true })}
      auditPage={Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1}
      onAuditPageChange={(next) => {
        const params2 = new URLSearchParams(params)
        params2.set('page', String(next))
        setParams(params2, { replace: true })
      }}
      notificationSettings={adminNotificationSettings}
      notificationFeed={state === 'empty' ? [] : state === 'dense' ? adminSystemsDenseNotificationFeed : adminNotifications}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The audit service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams({ tab }), { replace: true })}
    />
  )
}
