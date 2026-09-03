import { MarketplaceView } from '@/features/account/account-view'
import { marketplaceItems } from '@/mocks/marketplace'

export function MarketplacePage() {
  return <MarketplaceView homeHref="/v3/app" items={marketplaceItems} />
}
