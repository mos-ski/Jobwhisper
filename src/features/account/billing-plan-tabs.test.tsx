import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { BillingPage } from '@/apps/web/pages/billing-page'

/**
 * The three plan tabs share one grid cell so switching never moves the page. That made the
 * cell as wide as the widest panel's max-content — the plan carousel, three cards across —
 * and the whole billing page scrolled sideways on a phone. jsdom cannot measure layout, so
 * these assert the contract that keeps the cell shrinkable.
 */
describe('Billing plan tabs', () => {
  function renderBilling() {
    return render(
      <MemoryRouter initialEntries={['/v3/billing']}>
        <BillingPage />
      </MemoryRouter>,
    )
  }

  it('lets the shared tab cell shrink below its widest panel', () => {
    renderBilling()

    const subscription = document.querySelector('[data-plan-tab="subscription"]') as HTMLElement
    const track = subscription.parentElement as HTMLElement

    expect(track.className).toContain('grid-cols-[minmax(0,1fr)]')
    for (const tab of ['subscription', 'pay-as-you-go', 'done-for-you']) {
      expect(document.querySelector(`[data-plan-tab="${tab}"]`)?.className).toContain('min-w-0')
    }
  })

  it('keeps all three tabs reachable when they do not fit one line', () => {
    renderBilling()

    const tablist = screen.getByRole('tablist', { name: 'Plans' })
    // Scrolling is the fallback for a narrow screen; without it the last tab is cut mid-word.
    expect(tablist.className).toContain('overflow-x-auto')
    expect(screen.getByRole('tab', { name: 'Subscription plans' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Pay as you go' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Done for you' })).toBeInTheDocument()
  })
})
