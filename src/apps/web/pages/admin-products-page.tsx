import { useSearchParams } from 'react-router-dom'

import type { AdminProductStatusFilter } from '@/contracts/admin-products.draft'
import { AdminProductsView } from '@/features/admin/admin-products-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminProductRangeLabel, adminProducts, adminProductsDense, adminProductSummary } from '@/mocks/admin-products'

const STATUSES: readonly AdminProductStatusFilter[] = ['all', 'live', 'beta', 'degraded', 'disabled']

export function AdminProductsPage() {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const status = STATUSES.find((value) => value === params.get('status')) ?? 'all'
  const state = params.get('state')

  return (
    <AdminProductsView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      rangeLabel={adminProductRangeLabel}
      summary={adminProductSummary}
      products={state === 'dense' ? adminProductsDense : adminProducts}
      status={status}
      onStatusChange={(value) => {
        const next = new URLSearchParams(params)
        if (value === 'all') next.delete('status')
        else next.set('status', value)
        setParams(next, { replace: true })
      }}
      onClearFilters={() => setParams(new URLSearchParams(), { replace: true })}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The analytics service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
