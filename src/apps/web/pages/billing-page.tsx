import { useNavigate, useSearchParams } from 'react-router-dom'

import type { SuccessManagerDirectory } from '@/contracts/done-for-you.draft'
import { BillingView, type BillingPlanTab } from '@/features/account/account-view'
import { accountFaqs, billingPlans, billingStandalonePurchases, creditUsageRows } from '@/mocks/account'
import { autoApplySetup } from '@/mocks/auto-apply'
import { successManagers } from '@/mocks/done-for-you'
import { AUTO_APPLY_WALLET, CREDIT_WALLET, RESUME_BUILDER_WALLET } from '@/mocks/wallet'

function readPlanTab(value: string | null): BillingPlanTab {
  return value === 'pay-as-you-go' || value === 'done-for-you' ? value : 'subscription'
}

function readDirectory(state: string | null): SuccessManagerDirectory {
  if (state === 'managers-loading') return { status: 'loading' }
  if (state === 'managers-error') return { status: 'error' }
  if (state === 'managers-booked') return { status: 'ready', managers: successManagers.map((manager) => ({ ...manager, nextOpening: '2026-10-14' })) }
  return { status: 'ready', managers: successManagers }
}

export function BillingPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  return (
    <BillingView
      homeHref="/v3/app"
      plans={billingPlans}
      standalonePurchases={billingStandalonePurchases}
      usageRows={creditUsageRows}
      wallet={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents, resetDateLabel: CREDIT_WALLET.resetDateLabel }}
      faqs={accountFaqs}
      planTab={readPlanTab(params.get('plan'))}
      onBuyCredits={() => navigate('/v3/billing/credits')}
      interviewLimitResetLabel={params.get('state') === 'active' ? undefined : '4:58 PM, June 4'}
      doneForYou={{
        setupHref: '/v3/auto-apply/contact',
        profile: { country: autoApplySetup.country, desiredRole: autoApplySetup.desiredRole, locations: autoApplySetup.locations },
        savedCard: { label: 'Mastercard •••• 4242', expiryLabel: '08/29' },
        directory: readDirectory(params.get('state')),
        onRetry: () => setParams({ plan: 'done-for-you' }),
      }}
      onPlanTabChange={(tab) => setParams(tab === 'subscription' ? {} : { plan: tab }, { replace: true, preventScrollReset: true })}
      autoApplyCredits={{ balance: AUTO_APPLY_WALLET.balanceCredits, total: AUTO_APPLY_WALLET.totalCredits }}
      resumeBuilderCredits={{ balance: RESUME_BUILDER_WALLET.balanceCredits, total: RESUME_BUILDER_WALLET.totalCredits }}
    />
  )
}
