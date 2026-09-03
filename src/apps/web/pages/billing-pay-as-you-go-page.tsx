import { PayAsYouGoView } from '@/features/billing/pay-as-you-go-view'
import { billingStandalonePurchases } from '@/mocks/account'

export function BillingPayAsYouGoPage() {
  return <PayAsYouGoView homeHref="/v3/app" backHref="/v3/billing" purchases={billingStandalonePurchases} />
}
