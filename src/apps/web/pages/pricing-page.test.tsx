import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { PricingPage } from './pricing-page'

const HEADLINE = 'One plan, everything unlimited'

function renderPricingPage() {
  return render(
    <MemoryRouter initialEntries={['/pricing']}>
      <PricingPage />
    </MemoryRouter>,
  )
}

describe('PricingPage', () => {
  it('presents the three plans with their design badges', () => {
    renderPricingPage()

    expect(screen.getByRole('heading', { level: 1, name: HEADLINE })).toBeInTheDocument()
    // 1130:20394 badges the plans deliberately — Pro carries the banner, the others a pill.
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
    expect(screen.getByText('Great to Start')).toBeInTheDocument()
    expect(screen.getByText('Best Value')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Premium' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/#features')
    expect(screen.getByRole('img', { name: 'Jobwhisper' })).toBeInTheDocument()
  })

  it('sells unlimited use instead of a credit allowance', () => {
    renderPricingPage()

    // The allowance was what separated the tiers; what a plan unlocks is the difference now.
    expect(screen.getAllByText('Unlimited')).toHaveLength(3)
    expect(screen.queryByText('1 interview credit = 1 minute')).not.toBeInTheDocument()
    expect(screen.queryByText(/interview credits each month/)).not.toBeInTheDocument()
    expect(screen.getByText('Interview Copilot on web and desktop')).toBeInTheDocument()
    expect(screen.getByText('Auto Apply and Resume Builder')).toBeInTheDocument()
    expect(screen.getByText('Call recording for every session')).toBeInTheDocument()
  })

  it('bills Starter by the week and leaves it out of the annual switch', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    const starter = screen.getByRole('heading', { level: 3, name: 'Starter' }).closest('article') as HTMLElement
    const pro = screen.getByRole('heading', { level: 3, name: 'Pro' }).closest('article') as HTMLElement

    // Annual is the default view, so Pro shows its annual rate and Starter its weekly one.
    expect(within(starter).getByText('$19')).toBeInTheDocument()
    expect(within(starter).getByText('/week')).toBeInTheDocument()
    expect(within(starter).getByText('Weekly')).toBeInTheDocument()
    expect(within(pro).getByText('$79')).toBeInTheDocument()
    expect(within(pro).getByText('/month')).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Toggle annual billing' }))

    // A year bought a week at a time is not an annual plan, so Starter does not move.
    await waitFor(() => expect(within(pro).getByText('$99')).toBeInTheDocument())
    expect(within(starter).getByText('$19')).toBeInTheDocument()
  })

  it('merges the three tabs into sections of one page', () => {
    renderPricingPage()

    expect(screen.queryByRole('tab', { name: 'Job-search credits' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Done for you' })).not.toBeInTheDocument()

    // Pay-as-you-go and Done For You are on the page from the start, not behind a click.
    expect(screen.getByRole('heading', { level: 2, name: 'No plan? Pay as you go' })).toBeInTheDocument()
    expect(screen.getByText('$0.10')).toBeInTheDocument()
    expect(screen.getByText('per AI prompt')).toBeInTheDocument()
    expect(screen.getByText('per successful application')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Or have it done for you' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '5 interviews guaranteed' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '20 interviews guaranteed' })).toBeInTheDocument()
  })

  it('answers plan, cadence and pay-as-you-go questions in one merged set', () => {
    renderPricingPage()

    const faqPanel = screen.getByRole('region', { name: 'Pricing questions' })
    expect(faqPanel).toHaveClass('bg-surface', 'border-border', 'rounded-sm')
    expect(faqPanel.querySelectorAll('details')).toHaveLength(20)
    expect(screen.getByText('What does unlimited mean on these plans?')).toBeInTheDocument()
    expect(screen.getByText('How does the Starter plan bill?')).toBeInTheDocument()
    expect(screen.getByText('Can I pay annually?')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'How billing works' })).toBeInTheDocument()
  })

  it('stays on the light palette however the reader\'s system is set', () => {
    renderPricingPage()

    // The page is built from the semantic tokens, which flip with prefers-color-scheme, so
    // without this hook it was the one marketing page that went dark on a dark phone.
    const heading = screen.getByRole('heading', { level: 1, name: HEADLINE })
    expect(heading.closest('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('shows the first-time Pro offer when the Pro card is hovered', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    await user.hover(screen.getByRole('heading', { level: 3, name: 'Pro' }))
    expect(screen.getByRole('region', { name: 'Pro plan offer' })).toBeInTheDocument()
    expect(screen.getByText('First Month Pro Offer')).toBeInTheDocument()
  })
})
