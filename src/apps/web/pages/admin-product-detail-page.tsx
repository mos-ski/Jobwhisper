import { useSearchParams } from 'react-router-dom'

import type { AdminProductDetail, AdminProductSessionOutcome } from '@/contracts/admin-products.draft'
import { AdminProductDetailView } from '@/features/admin/admin-products-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminProductDetails, adminProductDetailsDense } from '@/mocks/admin-products'

const OUTCOMES: readonly (AdminProductSessionOutcome | 'all')[] = ['all', 'completed', 'abandoned', 'failed']

export type AdminProductDetailPageProps = {
  readonly productId: string
}

export function AdminProductDetailPage({ productId }: AdminProductDetailPageProps) {
  const [params, setParams] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  const state = params.get('state')
  const source: Readonly<Record<string, AdminProductDetail | undefined>> = state === 'dense' ? adminProductDetailsDense : adminProductDetails
  const product = state === 'missing' ? null : source[productId] ?? null
  const outcome = OUTCOMES.find((value) => value === params.get('outcome')) ?? 'all'
  const pageParam = Number(params.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  function setParam(key: string, value: string, resetPage = true) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  return (
    <AdminProductDetailView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      product={product}
      productsHref="/admin/products"
      outcome={outcome}
      onOutcomeChange={(value) => setParam('outcome', value)}
      q={params.get('q') ?? ''}
      onQChange={(value) => setParam('q', value)}
      page={page}
      onPageChange={(next) => setParam('page', String(next), false)}
      onClearFilters={() => setParams(new URLSearchParams(), { replace: true })}
      isLoading={state === 'loading'}
      errorMessage={state === 'error' ? 'The analytics service did not respond.' : undefined}
      onRetry={() => setParams(new URLSearchParams(), { replace: true })}
    />
  )
}
