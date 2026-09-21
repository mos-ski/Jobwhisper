import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import { MarketingProductView } from './marketing-product-view'

const product: MarketingProduct = {
  slug: 'resume-builder',
  label: 'AI Resume Builder',
  headline: 'Turn your experience into the resume this role needs.',
  summary: 'Build a focused resume around the job you want.',
  overview: [
    'Jobwhisper turns your existing experience into a resume shaped around a specific opportunity.',
    'You stay in control of every change before exporting the finished document.',
  ],
  workflow: [
    { title: 'Choose the role', body: 'Paste the job description you want to target.' },
    { title: 'Review the draft', body: 'Keep only the suggestions that sound like you.' },
  ],
  outcome: 'A focused resume that makes your fit easier to understand.',
  faqs: [
    { question: 'Will Jobwhisper invent experience?', answer: 'No. Suggestions stay grounded in the information you provide.' },
    { question: 'Can I edit the result?', answer: 'Yes. Every section remains editable before export.' },
  ],
  ctaLabel: 'Build my resume',
  ctaHref: '/v3/resume',
  sections: [
    {
      id: 'target',
      eyebrow: 'Start with the destination',
      title: 'Choose the role you want next.',
      body: 'Add the role and job description so every recommendation has a clear target.',
      steps: ['Add the job description', 'Confirm the role'],
      imageSrc: '/figma-landing/journey-resume.png',
      imageAlt: 'Resume tailored to a target role',
    },
    {
      id: 'finish',
      eyebrow: 'Ready to send',
      title: 'Leave with a stronger application.',
      body: 'Review the finished resume and export it when it sounds like you.',
      steps: ['Review the changes', 'Export the resume'],
      imageSrc: '/figma-landing/journey-jobs.png',
      imageAlt: 'Finished resume ready to export',
    },
  ],
}

describe('MarketingProductView', () => {
  it('presents the product outcome and a navigable product story', () => {
    render(
      <MarketingProductView
        product={product}
        activeSectionId="target"
        onSectionVisible={vi.fn()}
        onPrimaryAction={vi.fn()}
        onHome={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: product.headline })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jobwhisper home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('heading', { name: 'How it works' })).toBeInTheDocument()
    expect(screen.getByText(product.outcome, { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Will Jobwhisper invent experience?')).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(navigation).getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/#features')
    expect(within(navigation).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing')
    expect(within(navigation).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/#faq')
    expect(within(navigation).getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/v3/auth/sign-in')
    expect(within(navigation).getByRole('button', { name: 'Download' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download Now' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Leave with a stronger application.' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Finished resume ready to export' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
  })
})
