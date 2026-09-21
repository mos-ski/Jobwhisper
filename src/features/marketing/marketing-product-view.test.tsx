import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import { MarketingProductView } from './marketing-product-view'

const product: MarketingProduct = {
  slug: 'resume-builder',
  label: 'AI Resume Builder',
  headline: 'Turn your experience into the resume this role needs.',
  summary: 'Build a focused resume around the job you want.',
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
    expect(screen.getByRole('button', { name: product.ctaLabel })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to Jobwhisper home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Choose the role you want next.' })).toHaveAttribute('aria-current', 'step')
    expect(screen.getByRole('heading', { name: 'Leave with a stronger application.' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Finished resume ready to export' })).toBeInTheDocument()
  })
})
