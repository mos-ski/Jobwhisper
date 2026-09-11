import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { PricingPage } from './pricing-page'

function renderPricingPage() {
  return render(
    <MemoryRouter initialEntries={['/pricing']}>
      <PricingPage />
    </MemoryRouter>,
  )
}

describe('PricingPage', () => {
  it('presents interview plans without recommending one', () => {
    renderPricingPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Pricing that follows how you use Jobwhisper' })).toBeInTheDocument()
    expect(screen.queryByText(/most popular|recommended|best value/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Premium' })).toBeInTheDocument()
    expect(screen.getByText('1 interview credit = 1 minute')).toBeInTheDocument()
  })

  it('updates interview prices when monthly billing is selected', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    expect(screen.getByText('$38')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Toggle annual billing' }))
    expect(screen.getByText('$47')).toBeInTheDocument()
  })

  it('explains prepaid and managed-service pricing in their tabs', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    await user.click(screen.getByRole('tab', { name: 'Job-search credits' }))
    expect(screen.getByText('$0.10 per AI prompt')).toBeInTheDocument()
    expect(screen.getByText('$1 per successful application')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Done for you' }))
    expect(screen.getByRole('heading', { level: 3, name: '10 interviews' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '20 interviews' })).toBeInTheDocument()
  })
})
