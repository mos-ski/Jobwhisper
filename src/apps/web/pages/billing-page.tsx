import { useNavigate, useSearchParams } from 'react-router-dom'

import { BillingView, type BillingPlanTab } from '@/features/account/account-view'
import { accountFaqs, billingPlans, billingStandalonePurchases, creditUsageRows } from '@/mocks/account'
import { AUTO_APPLY_WALLET, CREDIT_WALLET, RESUME_BUILDER_WALLET } from '@/mocks/wallet'

function readPlanTab(value: string | null): BillingPlanTab {
  return value === 'pay-as-you-go' || value === 'done-for-you' ? value : 'subscription'
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
      onDoneForYou={() => navigate('/v3/billing/done-for-you')}
      onPlanTabChange={(tab) => setParams(tab === 'subscription' ? {} : { plan: tab }, { replace: true, preventScrollReset: true })}
      autoApplyCredits={{ balance: AUTO_APPLY_WALLET.balanceCredits, total: AUTO_APPLY_WALLET.totalCredits }}
      resumeBuilderCredits={{ balance: RESUME_BUILDER_WALLET.balanceCredits, total: RESUME_BUILDER_WALLET.totalCredits }}
    />
  )
}
