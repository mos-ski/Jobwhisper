import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { autoApplyFunnelMatches, autoApplyFunnelQuestions } from '@/mocks/funnel'
import { FunnelAutoApplyView, type FunnelAutoApplyViewProps } from './funnel-auto-apply-view'

function renderView(overrides: Partial<FunnelAutoApplyViewProps> = {}) {
  const props: FunnelAutoApplyViewProps = {
    step: 'upload',
    questions: autoApplyFunnelQuestions,
    questionIndex: 0,
    answers: {},
    online: true,
    matches: autoApplyFunnelMatches,
    onFile: vi.fn(),
    onAnswer: vi.fn(),
    onBack: vi.fn(),
    onContinue: vi.fn(),
    onClose: vi.fn(),
    onSelectJob: vi.fn(),
    onApply: vi.fn(),
    onEditAnswer: vi.fn(),
    onCreateAccount: vi.fn(),
    onGoogleSignUp: vi.fn(),
    ...overrides,
  }
  render(<FunnelAutoApplyView {...props} />)
  return props
}

describe('FunnelAutoApplyView', () => {
  it('opens with the light Auto Apply resume-import page from the approved design', () => {
    renderView()
    expect(screen.getByRole('main')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Find your next role\.\s*Land the Job\. Or Don’t Pay!/)
    expect(screen.getByText('Apply to jobs in 1-click.')).toBeInTheDocument()
    expect(screen.getByText('Trusted by 2M+ job seekers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jobwhisper home' })).toHaveAttribute('href', '/')
    const hero = document.querySelector('[data-slot="auto-apply-upload-hero"]')
    expect(hero).toHaveClass('min-h-dvh')
    expect(hero).not.toHaveClass('items-center')
    expect(screen.getByText('Drop a resume here, or browse files')).toBeInTheDocument()
    const searchButton = screen.getByRole('button', { name: 'Start Your Remote Job Search Now!' })
    expect(searchButton).toBeDisabled()
    expect(searchButton).toHaveClass('rounded', 'px-4', 'py-2', 'text-xl', 'font-bold', 'leading-[30px]', 'disabled:bg-disabled-surface', 'disabled:text-disabled-text')
    expect(document.querySelector('[data-slot="auto-apply-upload-content"]')).toHaveClass('justify-center')
    expect(screen.getAllByText('Start Your Remote Job Search Now!')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Higher Quality Listings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Personalized Tools' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Save Time' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument()
  })

  it('enables the search action and offers a text-only resume replacement after upload', () => {
    renderView({ fileName: 'product-designer.pdf' })

    expect(screen.getByText('product-designer.pdf')).toBeInTheDocument()
    expect(screen.queryByText('Import resume')).not.toBeInTheDocument()
    expect(screen.getByText('Change resume')).toHaveClass('text-accent-text')
    expect(screen.getByRole('button', { name: 'Start Your Remote Job Search Now!' })).toBeEnabled()
  })

  it('keeps benefit copy and testimonial regions aligned', () => {
    renderView()

    expect(document.querySelectorAll('[data-slot="auto-apply-benefit-body"]')).toHaveLength(3)
    expect(document.querySelectorAll('[data-slot="auto-apply-benefit-testimonial"]')).toHaveLength(3)
    for (const testimonial of document.querySelectorAll('[data-slot="auto-apply-benefit-testimonial"]')) {
      expect(testimonial.textContent?.length).toBeGreaterThan(115)
    }
  })

  it('moves through the footer benefit cards with accessible controls', async () => {
    const user = userEvent.setup()
    renderView()
    await user.click(screen.getByRole('button', { name: 'Next benefits' }))
    expect(screen.getByRole('heading', { name: 'Better Matches' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'One Search Workspace' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Privacy & Support' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous benefits' }))
    expect(screen.getByRole('heading', { name: 'Higher Quality Listings' })).toBeInTheDocument()
  })

  it('asks the matching questions one per page', () => {
    renderView({ step: 'quiz', questionIndex: 1 })
    expect(screen.getByText('3 of 11')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('I’m looking for')
  })

  it('lists every match with its score in words', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', answers: { role: 'Customer Success Manager' } })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('8 jobs we’d apply to for you')
    const list = screen.getByRole('list', { name: 'Matched jobs' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getByText('94% match')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Apply to all 8' }))
    expect(props.onApply).toHaveBeenCalledWith('all')
  })

  it('opens a job with why it matched, and applies to that one', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', selectedJobId: 'lattice-csm' })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Customer Success Manager, Mid-Market')
    expect(screen.getByText('Your churn reduction pilot matches their retention goal')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Apply to this job' }))
    expect(props.onApply).toHaveBeenCalledWith('lattice-csm')
    await user.click(screen.getByRole('button', { name: 'All matches' }))
    expect(props.onSelectJob).toHaveBeenCalledWith(null)
  })

  it('suggests which answers to widen when nothing matches', async () => {
    const user = userEvent.setup()
    const props = renderView({ step: 'matches', matches: [] })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No roles match every answer yet')
    await user.click(screen.getByRole('button', { name: 'Widen the location' }))
    expect(props.onEditAnswer).toHaveBeenCalledWith('location')
  })

  it('names the jobs waiting behind the sign-up gate', () => {
    renderView({ step: 'gate', applyTarget: 'all' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign up and your agent applies for you')
    expect(screen.getByText(/all 8 matches/)).toBeInTheDocument()
  })
})
