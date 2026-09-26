import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { PricingPage } from './pricing-page'

const HEADLINE = 'Three ways to buy Jobwhisper'

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

  it('sells unlimited interviews, and Auto Apply volume as the ladder', () => {
    renderPricingPage()

    // The credit allowance was what separated the tiers; Auto Apply volume is now.
    expect(screen.queryByText('1 interview credit = 1 minute')).not.toBeInTheDocument()
    expect(screen.queryByText(/interview credits each month/)).not.toBeInTheDocument()
    expect(screen.getByText('Interview Prep and Interview Copilot')).toBeInTheDocument()
    expect(screen.getByText('Web, desktop and mobile')).toBeInTheDocument()
    // Call recording is on every plan, so it is listed on the one the others inherit from.
    expect(screen.getByText('Call recording for every session')).toBeInTheDocument()

    const pro = screen.getByRole('heading', { level: 3, name: 'Pro' }).closest('article') as HTMLElement
    const premium = screen.getByRole('heading', { level: 3, name: 'Premium' }).closest('article') as HTMLElement
    expect(within(pro).getByText('Auto Apply — 500 jobs a month')).toBeInTheDocument()
    expect(within(pro).getByText('Resume Builder')).toBeInTheDocument()
    expect(within(premium).getByText('Unlimited Auto Apply')).toBeInTheDocument()
    // Starter runs on one model; the paid plans pick between five.
    const starter = screen.getByRole('heading', { level: 3, name: 'Starter' }).closest('article') as HTMLElement
    expect(within(starter).getByText('One model — OpenAI')).toBeInTheDocument()
    expect(within(pro).getByText('Multi-agent models — OpenAI, Claude, Grok, Kimi and Qwen')).toBeInTheDocument()
    // The plan cards carry no terms table: the features say what is covered, the price row
    // says how often it charges, and the row of label/value pairs said neither twice.
    expect(pro.querySelector('.pricing-plan-credits')).toBeNull()
    expect(premium.querySelector('.pricing-plan-credits')).toBeNull()
  })

  it('tells Starter out of the annual switch instead of silently ignoring it', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    const starter = () => screen.getByRole('heading', { level: 3, name: 'Starter' }).closest('article') as HTMLElement
    const pro = () => screen.getByRole('heading', { level: 3, name: 'Pro' }).closest('article') as HTMLElement
    const premium = () => screen.getByRole('heading', { level: 3, name: 'Premium' }).closest('article') as HTMLElement

    // Annual is the default view: the monthly plans show their annual rate, the weekly one
    // shows its own price and says why it did not move.
    expect(within(starter()).getByText('$47')).toBeInTheDocument()
    expect(within(starter()).getByText('/week')).toBeInTheDocument()
    expect(within(starter()).getByText('Annual billing does not apply to weekly plans')).toBeInTheDocument()
    expect(within(pro()).getByText('$79')).toBeInTheDocument()
    expect(within(premium()).getByText('$398')).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Toggle annual billing' }))

    // The figures tween between the two rates, so both have to settle.
    await waitFor(() => expect(within(pro()).getByText('$99')).toBeInTheDocument())
    await waitFor(() => expect(within(premium()).getByText('$497')).toBeInTheDocument())
    expect(within(starter()).getByText('$47')).toBeInTheDocument()
    // The note is the answer to "why didn't this one change?", so it goes when nothing asked.
    expect(within(starter()).queryByText('Annual billing does not apply to weekly plans')).not.toBeInTheDocument()
  })

  it('sells the three ways to buy as three tabs', async () => {
    const user = userEvent.setup()
    renderPricingPage()

    expect(screen.getByRole('tab', { name: 'Subscription plans' })).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('tab', { name: 'Pay as you go' }))

    // Interview credits cover both the live session and the practice one.
    expect(screen.getByRole('heading', { level: 3, name: 'Interview' })).toBeInTheDocument()
    expect(screen.getByText('per interview minute')).toBeInTheDocument()
    expect(screen.getByText('Works for Interview Prep and Interview Copilot')).toBeInTheDocument()
    expect(screen.getByText('per AI prompt')).toBeInTheDocument()
    expect(screen.getByText('per successful application')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Done for you' }))

    expect(screen.getByRole('heading', { level: 3, name: '5 interviews guaranteed' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: '20 interviews guaranteed' })).toBeInTheDocument()
  })

  it('answers plan, cadence and pay-as-you-go questions in one merged set', () => {
    renderPricingPage()

    const faqPanel = screen.getByRole('region', { name: 'Pricing questions' })
    expect(faqPanel).toHaveClass('bg-surface', 'border-border', 'rounded-sm')
    expect(faqPanel.querySelectorAll('details')).toHaveLength(23)
    expect(screen.getByText('What does unlimited mean on these plans?')).toBeInTheDocument()
    expect(screen.getByText('What happens after 500 Auto Apply jobs on Pro?')).toBeInTheDocument()
    expect(screen.getByText('How does the Starter plan bill?')).toBeInTheDocument()
    expect(screen.getByText('Can I buy interview minutes without a plan?')).toBeInTheDocument()
    // Fair use is deliberately not sold on this page: the caps are explained in the product,
    // where someone meets them, not in the FAQ where they read as fine print on "unlimited".
    expect(screen.queryByText(/fair-use cap/)).not.toBeInTheDocument()
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
