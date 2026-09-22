import { render, screen, waitFor, within } from '@testing-library/react'
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
  it('presents the three interview plans with their design badges', () => {
    renderPricingPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Pricing that follows how you use Jobwhisper' })).toBeInTheDocument()
    // 1130:20394 badges the plans deliberately — Pro carries the banner, the others a pill.
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
    expect(screen.getByText('Great to Start')).toBeInTheDocument()
    expect(screen.getByText('Best Value')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Starter' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Pro' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Premium' })).toBeInTheDocument()
    expect(screen.getByText('1 interview credit = 1 minute')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/#features')
    expect(screen.getByText('Interview Copilot on desktop and web')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Jobwhisper' })).toBeInTheDocument()
  })

  it('stays on the light palette however the reader\'s system is set', () => {
    renderPricingPage()

    // The page is built from the semantic tokens, which flip with prefers-color-scheme, so
    // without this hook it was the one marketing page that went dark on a dark phone.
    const heading = screen.getByRole('heading', { level: 1, name: 'Pricing that follows how you use Jobwhisper' })
    expect(heading.closest('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('presents pricing questions inside the shared surface treatment', () => {
    renderPricingPage()

    const faqPanel = screen.getByRole('region', { name: 'Interview plan questions' })
    expect(faqPanel).toHaveClass('bg-surface', 'border-border', 'rounded-sm')
    expect(faqPanel).not.toHaveClass('rounded-panel')
    expect(faqPanel.querySelectorAll('details')).toHaveLength(20)
  })

  it('updates interview prices when monthly billing is selected', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    expect(screen.getByText('$38')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Toggle annual billing' }))
    await waitFor(() => expect(screen.getByText('$47')).toBeInTheDocument())
  })

  it('shows the first-time Pro offer when the Pro card is hovered', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    await user.hover(screen.getByRole('heading', { level: 3, name: 'Pro' }))
    expect(screen.getByRole('region', { name: 'Pro plan offer' })).toBeInTheDocument()
    expect(screen.getByText('First Month Pro Offer')).toBeInTheDocument()
    expect(screen.getByText('Get 60% off your first month')).toBeInTheDocument()
  })

  it('explains prepaid and managed-service pricing in their tabs', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    await user.click(screen.getByRole('tab', { name: 'Job-search credits' }))
    // The rate splits across the card's price row: the figure, then its unit.
    expect(screen.getByText('$0.10')).toBeInTheDocument()
    expect(screen.getByText('per AI prompt')).toBeInTheDocument()
    expect(screen.getByText('$1')).toBeInTheDocument()
    expect(screen.getByText('per successful application')).toBeInTheDocument()
    expect(screen.getAllByText('30 days')).toHaveLength(2)
    expect(screen.queryByText(/12 months/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'How job-search credits work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Job-search credit questions' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Job-search credit questions' }).querySelectorAll('details')).toHaveLength(20)
    expect(screen.queryByText('How are interview plans billed?')).not.toBeInTheDocument()
    // All three tabs share the interview plans' card now.
    const resumeCard = screen.getByRole('heading', { level: 3, name: 'Resume Builder' }).closest('article')
    expect(resumeCard).toHaveClass('pricing-plan')
    expect(within(resumeCard as HTMLElement).getByRole('button', { name: 'Buy credits' })).toHaveClass('pricing-plan-cta')
    expect(screen.getByText('$0.10').closest('[data-slot="tabs-content"]')).toHaveClass('animate-ease-in-bottom')

    await user.click(screen.getByRole('tab', { name: 'Done for you' }))
    expect(screen.getByRole('heading', { level: 3, name: '5 interviews guaranteed' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '20 interviews guaranteed' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'How Done For You works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Done For You questions' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Done For You questions' }).querySelectorAll('details')).toHaveLength(20)
    expect(screen.queryByText('How long do prepaid credits last?')).not.toBeInTheDocument()
  })
})
