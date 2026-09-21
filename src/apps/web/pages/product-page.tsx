import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MarketingProductView } from '@/features/marketing/marketing-product-view'
import { PRODUCTS, type ProductSlug } from '../product-content'

export type ProductPageProps = { readonly slug: ProductSlug }

export function ProductPage({ slug }: ProductPageProps) {
  const navigate = useNavigate()
  const product = PRODUCTS[slug]
  const [activeSectionId, setActiveSectionId] = useState(product.sections[0]?.id ?? '')

  useEffect(() => {
    setActiveSectionId(product.sections[0]?.id ?? '')
    window.scrollTo({ top: 0 })
  }, [product])

  const handleSectionVisible = useCallback((sectionId: string) => setActiveSectionId(sectionId), [])

  return (
    <MarketingProductView
      product={product}
      activeSectionId={activeSectionId}
      onSectionVisible={handleSectionVisible}
      onPrimaryAction={() => navigate(product.ctaHref)}
      onHome={() => navigate('/')}
    />
  )
}
