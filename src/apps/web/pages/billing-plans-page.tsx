import { PlanCompareView } from '@/features/billing/plan-compare-view'
import { billingPlans } from '@/mocks/account'

export function BillingPlansPage() {
  return (
    <PlanCompareView
      homeHref="/v3/app"
      backHref="/v3/billing"
      plans={billingPlans}
    />
  )
}
