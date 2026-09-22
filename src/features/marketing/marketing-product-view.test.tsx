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
  narrative: 'Start with the role you want. Bring in your existing experience. Review every suggested change. Keep only what is accurate. Check the finished document. Leave with a focused resume that is ready to send.',
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
        walkthroughImages={['/walkthrough-1.jpg', '/walkthrough-2.jpg']}
        activeSectionId="resume-builder-walkthrough-1"
        onSectionVisible={vi.fn()}
        onPrimaryAction={vi.fn()}
        onDownload={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: product.headline })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: product.ctaLabel })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Download' })).toHaveLength(2)
    expect(screen.queryByRole('link', { name: 'Download Now' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jobwhisper home' })).toHaveAttribute('href', '/')
    expect(screen.getByText((content) => content.startsWith(product.summary))).toBeInTheDocument()
    expect(screen.getByText('Will Jobwhisper invent experience?')).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(navigation).getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/#features')
    expect(within(navigation).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing')
    expect(within(navigation).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/#faq')
    expect(within(navigation).getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/v3/auth/sign-in')
    expect(within(navigation).getByRole('button', { name: 'Download' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Choose the role you want next.' })).toBeInTheDocument()
    expect(screen.getByText('Add the role and job description so every recommendation has a clear target.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /walkthrough step 2: Leave with a stronger application/ })).toBeInTheDocument()
    // The footer sits outside the two-column grid: as a child of the story column it was
    // rendering at that column's width, inside a layout built for the full page.
    const walkthrough = document.querySelector('.marketing-product-story')
    expect(walkthrough).not.toBeNull()
    expect(within(walkthrough as HTMLElement).queryByRole('contentinfo')).toBeNull()
    expect(screen.getByRole('contentinfo').closest('.marketing-product-layout')).toBeNull()
    // The nav needs its own centring row; on its own it stretches edge to edge.
    expect(screen.getByRole('navigation', { name: 'Main navigation' }).parentElement).toHaveClass('marketing-product-nav')
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
  })

  it('pairs every walkthrough image with concise supporting copy', () => {
    render(
      <MarketingProductView
        product={product}
        walkthroughImages={['/walkthrough-1.jpg', '/walkthrough-2.jpg', '/walkthrough-3.jpg', '/walkthrough-4.jpg']}
        activeSectionId="resume-builder-walkthrough-2"
        onSectionVisible={vi.fn()}
        onPrimaryAction={vi.fn()}
        onDownload={vi.fn()}
      />,
    )

    expect(screen.getAllByTestId('product-walkthrough-copy')).toHaveLength(4)
    expect(screen.queryByTestId('product-narrative')).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4)
  })
})
