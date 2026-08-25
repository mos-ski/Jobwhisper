import { useSearchParams } from 'react-router-dom'

import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'
import { CREDIT_WALLET, TRIAL_BALANCE_CENTS, TRIAL_TOTAL_CENTS } from '@/mocks/wallet'

export function DashboardPage() {
  const [params] = useSearchParams()
  const dropdownParam = params.get('dropdown')
  const creditParam = params.get('credit')
  const activeDropdown = dropdownParam === 'help' || dropdownParam === 'credits' || dropdownParam === 'profile' ? dropdownParam : undefined
  const creditNotice = creditParam === 'low' || creditParam === 'empty' ? creditParam : undefined
  // `credit=trial` demos a user with no active plan: Lightforth still grants 5 free credits every month by default.
  const isTrial = creditParam === 'trial'
  const totalCreditsCents = isTrial ? TRIAL_TOTAL_CENTS : CREDIT_WALLET.totalCents
  const creditBalanceCents = activeDropdown === 'credits' || creditNotice === 'empty'
    ? 0
    : creditNotice === 'low'
      ? 12
      : isTrial
        ? TRIAL_BALANCE_CENTS
        : CREDIT_WALLET.balanceCents
  const user = candidateSession.status === 'authenticated' ? candidateSession.user : {
    id: 'review-user',
    email: 'review@lightforth.ai',
    name: 'Review User',
    role: 'candidate' as const,
    permissions: ['app:view'] as const,
  }

  return (
    <DashboardView
      user={user}
      navItems={dashboardNavItems}
      actions={dashboardActions}
      installPrompt={dashboardInstallPrompt}
      creditBalanceCents={creditBalanceCents}
      totalCreditsCents={totalCreditsCents}
      isLoading={params.get('state') === 'loading'}
      activeDropdown={activeDropdown}
      creditNotice={creditNotice}
    />
  )
}
