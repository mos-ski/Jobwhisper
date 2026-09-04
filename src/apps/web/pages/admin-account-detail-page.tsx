import { useSearchParams } from 'react-router-dom'

import type { AdminAccountDetailTab } from '@/contracts/admin-accounts.draft'
import { AdminAccountDetailView } from '@/features/admin/admin-accounts-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminAccountDetail, adminAccountDetailSuspended } from '@/mocks/admin-accounts'

const DETAIL_TABS: readonly AdminAccountDetailTab[] = ['credits', 'activity', 'audit']

export type AdminAccountDetailPageProps = {
  readonly accountId: string
}

export function AdminAccountDetailPage({ accountId }: AdminAccountDetailPageProps) {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tabParam = params.get('tab')
  const tab = DETAIL_TABS.find((value) => value === tabParam) ?? 'credits'
  const state = params.get('state')
  // `state=suspended` demos the suspended treatment; `state=missing` demos an id that matched nothing.
  const account = state === 'missing' ? null : state === 'suspended' ? adminAccountDetailSuspended : adminAccountDetail

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <AdminAccountDetailView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      account={account ? { ...account, id: accountId || account.id } : null}
      accountsHref="/admin/accounts"
      tab={tab}
      onTabChange={(next) => setParam('tab', next)}
      impersonating={params.get('impersonating') === 'true'}
      onStartImpersonation={() => setParam('impersonating', 'true')}
      onExitImpersonation={() => setParam('impersonating', null)}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'Could not load this account.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
