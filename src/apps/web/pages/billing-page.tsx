import { BillingView } from '@/features/account/account-view'
import { billingPlans, creditUsageRows } from '@/mocks/account'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingPage() {
  return (
    <BillingView
      homeHref="/v3/app"
      plans={billingPlans}
      usageRows={creditUsageRows}
      wallet={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents, resetDateLabel: CREDIT_WALLET.resetDateLabel }}
    />
  )
}
