import { useSearchParams } from 'react-router-dom'

import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'
import { AUTO_APPLY_WALLET, CREDIT_WALLET, RESUME_BUILDER_WALLET } from '@/mocks/wallet'

export function DashboardPage() {
  const [params] = useSearchParams()
  const dropdownParam = params.get('dropdown')
  const creditParam = params.get('credit')
  const activeDropdown = dropdownParam === 'help' || dropdownParam === 'credits' || dropdownParam === 'profile' ? dropdownParam : undefined
  const creditNotice = creditParam === 'low' || creditParam === 'empty' ? creditParam : undefined
  const creditBalanceCents = activeDropdown === 'credits' || creditNotice === 'empty'
    ? 0
    : creditNotice === 'low'
      ? 12
      : CREDIT_WALLET.balanceCents
  const user = candidateSession.status === 'authenticated' ? candidateSession.user : {
    id: 'review-user',
    email: 'review@jobwhisper.ai',
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
      totalCreditsCents={CREDIT_WALLET.totalCents}
      autoApplyBalanceCredits={AUTO_APPLY_WALLET.balanceCredits}
      autoApplyTotalCredits={AUTO_APPLY_WALLET.totalCredits}
      resumeBuilderBalanceCredits={RESUME_BUILDER_WALLET.balanceCredits}
      resumeBuilderTotalCredits={RESUME_BUILDER_WALLET.totalCredits}
      isLoading={params.get('state') === 'loading'}
      activeDropdown={activeDropdown}
      creditNotice={creditNotice}
    />
  )
}
