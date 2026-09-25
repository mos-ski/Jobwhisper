import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { AdminAccountPlanFilter, AdminAccountStatusFilter } from '@/contracts/admin-accounts.draft'
import { AdminAccountsListView, type AdminAccountsListTab } from '@/features/admin/admin-accounts-view'
import { adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'
import { adminAccounts, adminAccountsSummary } from '@/mocks/admin-accounts'
import { adminDoneForYouLeads } from '@/mocks/admin-products'
import { adminInvites, adminInvitesSummary } from '@/mocks/admin-invites'
import { describeGrant } from '@/features/admin/admin-invites-panel'
import type { AdminInvite } from '@/contracts/admin-invites.draft'

const STATUS_FILTERS: readonly AdminAccountStatusFilter[] = ['all', 'active', 'suspended', 'pending']
const PLAN_FILTERS: readonly AdminAccountPlanFilter[] = ['all', 'starter', 'pro', 'premium', 'unsubscribed']
const LIST_TABS: readonly AdminAccountsListTab[] = ['subscribers', 'dfy-clients', 'invites']

export function AdminAccountsPage() {
  const [params, setParams] = useSearchParams()
  // Nothing persists in this mock, so an invite issued here is held in state to show the
  // row it produces and the link it hands back.
  const [invites, setInvites] = useState<readonly AdminInvite[]>(adminInvites)
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
      invites={invites}
      invitesSummary={adminInvitesSummary}
      onCreateInvite={(draft) =>
        setInvites((current) => [
          {
            id: `inv-${2100 + current.length}`,
            delivery: draft.delivery,
            email: draft.delivery === 'email' ? draft.email : undefined,
            url:
              draft.delivery === 'email'
                ? 'https://jobwhisper.org/join/new-invite'
                : `https://jobwhisper.org/join/${(draft.note || 'invite').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'invite'}`,
            grant: draft.grant,
            grantLabel: describeGrant(draft.grant),
            uses: draft.uses,
            acceptedCount: 0,
            status: 'pending',
            createdLabel: 'Just now',
            expiresLabel: draft.expiresOn,
            createdBy: user.name,
            note: draft.note || undefined,
          },
          ...current,
        ])
      }
      onRevokeInvite={(inviteId) =>
        setInvites((current) => current.map((invite) => (invite.id === inviteId ? { ...invite, status: 'revoked' } : invite)))
      }
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
