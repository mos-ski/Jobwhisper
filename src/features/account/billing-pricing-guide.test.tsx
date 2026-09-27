import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { BillingPricingGuideCard } from './billing-pricing-guide'

describe('BillingPricingGuideCard', () => {
  it('is one card that explains unlimited and extra credits, and closes on Got it', async () => {
    const onDismiss = vi.fn()
    render(<BillingPricingGuideCard linkLabel="View usage details" linkHref="/v3/billing/usage" onDismiss={onDismiss} />)
    expect(screen.getByRole('dialog', { name: 'Your credits and balances' })).toHaveTextContent(/extra credits keep you going/)
    expect(screen.getByRole('link', { name: 'View usage details' })).toHaveAttribute('href', '/v3/billing/usage')
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Got it' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
