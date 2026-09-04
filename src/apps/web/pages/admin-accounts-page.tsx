import { useSearchParams } from 'react-router-dom'

import type { AdminAccountPlanFilter, AdminAccountStatusFilter } from '@/contracts/admin-accounts.draft'
import { AdminAccountsListView, type AdminAccountsListTab } from '@/features/admin/admin-accounts-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminAccounts, adminAccountsSummary } from '@/mocks/admin-accounts'
import { adminDoneForYouLeads } from '@/mocks/admin-products'

const STATUS_FILTERS: readonly AdminAccountStatusFilter[] = ['all', 'active', 'suspended', 'pending']
const PLAN_FILTERS: readonly AdminAccountPlanFilter[] = ['all', 'starter', 'pro', 'premium', 'unsubscribed']
const LIST_TABS: readonly AdminAccountsListTab[] = ['subscribers', 'dfy-clients']

export function AdminAccountsPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const statusParam = params.get('status')
  const planParam = params.get('plan')
  const status = STATUS_FILTERS.find((value) => value === statusParam) ?? 'all'
  const plan = PLAN_FILTERS.find((value) => value === planParam) ?? 'all'
  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  const tab = LIST_TABS.find((value) => value === params.get('tab')) ?? 'subscribers'

  function setParam(key: string, value: string, resetPage = true) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  return (
    <AdminAccountsListView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      accounts={params.get('state') === 'empty' ? [] : adminAccounts}
      summary={adminAccountsSummary}
      tab={tab}
      onTabChange={(next) => setParam('tab', next)}
      dfyClients={adminDoneForYouLeads}
      q={params.get('q') ?? ''}
      onQChange={(value) => setParam('q', value)}
      status={status}
      onStatusChange={(value) => setParam('status', value)}
      plan={plan}
      onPlanChange={(value) => setParam('plan', value)}
      page={page}
      onPageChange={(next) => setParam('page', String(next), false)}
      onClearFilters={() => setParams(new URLSearchParams(), { replace: true })}
      accountHref={(accountId) => `/admin/accounts/${accountId}`}
      isLoading={params.get('state') === 'loading'}
      errorMessage={params.get('state') === 'error' ? 'Could not load accounts.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
