import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { BillingPricingGuideCard } from './billing-pricing-guide'

describe('BillingPricingGuideCard', () => {
  it('links each step to its plan', () => {
    render(<BillingPricingGuideCard step={0} learnMoreHref="/v3/billing/done-for-you" viewPlanHref="/v3/billing/plans" onNext={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Ace Your Interview Plan' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View plan' })).toHaveAttribute('href', '/v3/billing/plans')
    expect(screen.getByRole('button', { name: 'Skip Tutor' })).toBeInTheDocument()
  })
})
