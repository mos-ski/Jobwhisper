import { useSearchParams } from 'react-router-dom'

import { BillingView, type BillingPlanTab } from '@/features/account/account-view'
import { accountFaqs, billingPlans, billingStandalonePurchases, creditUsageRows } from '@/mocks/account'
import { AUTO_APPLY_WALLET, CREDIT_WALLET, RESUME_BUILDER_WALLET } from '@/mocks/wallet'

function readPlanTab(value: string | null): BillingPlanTab {
  return value === 'pay-as-you-go' || value === 'done-for-you' ? value : 'subscription'
}

export function BillingPage() {
  const [params, setParams] = useSearchParams()
  return (
    <BillingView
      homeHref="/v3/app"
      plans={billingPlans}
      standalonePurchases={billingStandalonePurchases}
      usageRows={creditUsageRows}
      wallet={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents, resetDateLabel: CREDIT_WALLET.resetDateLabel }}
      faqs={accountFaqs}
      planTab={readPlanTab(params.get('plan'))}
      onPlanTabChange={(tab) => setParams(tab === 'subscription' ? {} : { plan: tab }, { replace: true, preventScrollReset: true })}
      autoApplyCredits={{ balance: AUTO_APPLY_WALLET.balanceCredits, total: AUTO_APPLY_WALLET.totalCredits }}
      resumeBuilderCredits={{ balance: RESUME_BUILDER_WALLET.balanceCredits, total: RESUME_BUILDER_WALLET.totalCredits }}
    />
  )
}
