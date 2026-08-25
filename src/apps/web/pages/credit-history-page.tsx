import { CreditHistoryView } from '@/features/account/account-view'
import { creditHistoryRows } from '@/mocks/account'

export function CreditHistoryPage() {
  return <CreditHistoryView homeHref="/v3/app" billingHref="/v3/billing" rows={creditHistoryRows} />
}
