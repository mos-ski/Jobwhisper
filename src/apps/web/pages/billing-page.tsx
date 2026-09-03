import { BillingView } from '@/features/account/account-view'
import { billingPlans, billingStandalonePurchases, creditHistoryRows, creditUsageRows } from '@/mocks/account'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingPage() {
  return (
    <BillingView
      homeHref="/v3/app"
      plans={billingPlans}
      standalonePurchases={billingStandalonePurchases}
      usageRows={creditUsageRows}
      historyRows={creditHistoryRows}
      wallet={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents, resetDateLabel: CREDIT_WALLET.resetDateLabel }}
    />
  )
}
