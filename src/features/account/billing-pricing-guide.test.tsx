import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { BillingPricingGuideCard } from './billing-pricing-guide'

describe('BillingPricingGuideCard', () => {
  it('runs two steps, usage then credits', () => {
    render(<BillingPricingGuideCard step={0} learnMoreHref="/v3/billing/done-for-you" linkLabel="View usage details" linkHref="/v3/billing/usage" onNext={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'View usage' })).toBeInTheDocument()
    expect(screen.getByLabelText('Step 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View usage details' })).toHaveAttribute('href', '/v3/billing/usage')
    expect(screen.getByRole('button', { name: 'Skip tour' })).toBeInTheDocument()
  })
})
