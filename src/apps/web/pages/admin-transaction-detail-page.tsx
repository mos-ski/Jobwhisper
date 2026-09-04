import { useSearchParams } from 'react-router-dom'

import { AdminTransactionDetailView } from '@/features/admin/admin-transactions-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminPrimaryTransactionId, adminTransactionDetails } from '@/mocks/admin-transactions'

export type AdminTransactionDetailPageProps = {
  readonly transactionId: string
}

export function AdminTransactionDetailPage({ transactionId }: AdminTransactionDetailPageProps) {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const state = params.get('state')
  const transaction = state === 'missing'
    ? null
    : adminTransactionDetails[transactionId] ?? adminTransactionDetails[adminPrimaryTransactionId] ?? null

  return (
    <AdminTransactionDetailView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      transaction={transaction}
      transactionsHref="/admin/transactions"
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The billing service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
