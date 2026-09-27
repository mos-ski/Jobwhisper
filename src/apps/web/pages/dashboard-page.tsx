import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ProOfferBanner, ProOfferDialog } from '@/features/billing/pro-offer-widget'
import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'
import { AUTO_APPLY_WALLET, CREDIT_WALLET, RESUME_BUILDER_WALLET } from '@/mocks/wallet'

export function DashboardPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const welcome = params.get('welcome') === '1'
  const offerBanner = params.get('offer') === 'banner'
  // One deadline for the dialog and the banner, so closing the dialog does not restart the clock.
  const [offerEndsAt] = useState(() => Date.now() + 60 * 60 * 1000)
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

  // Closing the dialog swaps it for the top banner, and the URL keeps the banner through a refresh.
  function closeWelcome() {
    const next = new URLSearchParams(params)
    next.delete('welcome')
    next.set('offer', 'banner')
    setParams(next, { replace: true })
  }

  const claimOffer = () => navigate('/v3/billing?plan=pro&offer=welcome-60')

  return (
    <>
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
      announcement={offerBanner ? <ProOfferBanner onClaim={claimOffer} endsAt={offerEndsAt} /> : undefined}
    />
    <ProOfferDialog open={welcome} onDismiss={closeWelcome} onClaim={claimOffer} endsAt={offerEndsAt} />
    </>
  )
}
