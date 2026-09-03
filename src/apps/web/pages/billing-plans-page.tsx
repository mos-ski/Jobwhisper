import { PlanCompareView } from '@/features/billing/plan-compare-view'
import { billingPlans } from '@/mocks/account'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingPlansPage() {
  return (
    <PlanCompareView
      homeHref="/v3/app"
      backHref="/v3/billing"
      plans={billingPlans}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
