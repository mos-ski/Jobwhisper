import { useSearchParams } from 'react-router-dom'

import type { AdminTransactionStatusFilter, AdminTransactionsTab } from '@/contracts/admin-transactions.draft'
import { AdminTransactionsView } from '@/features/admin/admin-transactions-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import {
  adminDisputes,
  adminRefundRequests,
  adminTransactions,
  adminTransactionsDense,
  adminTransactionsSummary,
} from '@/mocks/admin-transactions'

const TABS: readonly AdminTransactionsTab[] = ['all', 'incoming', 'outgoing', 'disputes', 'refunds']
const STATUSES: readonly AdminTransactionStatusFilter[] = ['all', 'succeeded', 'pending', 'failed', 'refunded', 'disputed']

export function AdminTransactionsPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const tab = TABS.find((value) => value === params.get('tab')) ?? 'all'
  const status = STATUSES.find((value) => value === params.get('status')) ?? 'all'
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
    <AdminTransactionsView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      summary={adminTransactionsSummary}
      transactions={state === 'empty' ? [] : state === 'dense' ? adminTransactionsDense : adminTransactions}
      disputes={state === 'empty' ? [] : adminDisputes}
      refundRequests={state === 'empty' ? [] : adminRefundRequests}
      tab={tab}
      onTabChange={(next) => setParam('tab', next)}
      q={params.get('q') ?? ''}
      onQChange={(value) => setParam('q', value)}
      status={status}
      onStatusChange={(value) => setParam('status', value)}
      page={page}
      onPageChange={(next) => setParam('page', String(next), false)}
      onClearFilters={() => setParams(new URLSearchParams(), { replace: true })}
      transactionHref={(transactionId) => `/admin/transactions/${transactionId}`}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The billing service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
