import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MarketingProductView } from '@/features/marketing/marketing-product-view'
import { PRODUCTS, PRODUCT_WALKTHROUGHS, type ProductSlug } from '../product-content'

export type ProductPageProps = { readonly slug: ProductSlug }

export function ProductPage({ slug }: ProductPageProps) {
  const navigate = useNavigate()
  const product = PRODUCTS[slug]
  const firstWalkthroughId = `${product.slug}-walkthrough-1`
  const [activeSectionId, setActiveSectionId] = useState(firstWalkthroughId)

  useEffect(() => {
    setActiveSectionId(firstWalkthroughId)
    window.scrollTo({ top: 0 })
  }, [firstWalkthroughId, product])

  const handleSectionVisible = useCallback((sectionId: string) => setActiveSectionId(sectionId), [])

  return (
    <MarketingProductView
      product={product}
      walkthroughImages={PRODUCT_WALKTHROUGHS[slug]}
      activeSectionId={activeSectionId}
      onSectionVisible={handleSectionVisible}
      onPrimaryAction={() => navigate(product.ctaHref)}
      onDownload={() => navigate('/v3/downloads')}
    />
  )
}
