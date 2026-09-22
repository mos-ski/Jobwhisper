import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MarketingNav } from './marketing-chrome'

const FEATURE_PAGES = [
  ['AI Resume Builder', '/products/resume-builder'],
  ['Interview Copilot', '/products/interview-copilot'],
  ['Interview Prep', '/products/interview-prep'],
  ['Auto Apply', '/products/auto-apply'],
] as const

describe('MarketingNav', () => {
  it('opens the feature pages under the desktop Features link and closes them again', () => {
    render(<MarketingNav />)

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    const features = within(navigation).getByRole('link', { name: 'Features' })
    // The chevron always promised a menu; the link still has to reach the landing
    // page's own section for anyone who taps it instead of hovering it.
    expect(features).toHaveAttribute('href', '/#features')
    expect(features).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: /AI Resume Builder/ })).not.toBeInTheDocument()

    fireEvent.pointerEnter(features.parentElement as HTMLElement)

    expect(features).toHaveAttribute('aria-expanded', 'true')
    const menu = document.getElementById('landing-nav-features-menu') as HTMLElement
    for (const [label, href] of FEATURE_PAGES) {
      expect(within(menu).getByRole('link', { name: new RegExp(label) })).toHaveAttribute('href', href)
    }
    expect(within(menu).getByRole('link', { name: /All features/ })).toHaveAttribute('href', '/#features')

    fireEvent.keyDown(menu, { key: 'Escape' })

    expect(features).toHaveAttribute('aria-expanded', 'false')
  })

  it('hangs the feature pages off the phone sheet as a thread under Features', () => {
    render(<MarketingNav />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const sheet = screen.getByRole('dialog', { name: 'Menu' })
    const features = within(sheet).getByRole('button', { name: 'Features' })

    expect(features).toHaveAttribute('aria-expanded', 'false')
    expect(within(sheet).queryByRole('link', { name: 'Interview Copilot' })).not.toBeInTheDocument()

    fireEvent.click(features)

    expect(features).toHaveAttribute('aria-expanded', 'true')
    const thread = document.getElementById('landing-nav-sheet-features') as HTMLElement
    for (const [label, href] of FEATURE_PAGES) {
      expect(within(thread).getByRole('link', { name: label })).toHaveAttribute('href', href)
    }

    // Following a feature page has to take the full-screen sheet down with it.
    fireEvent.click(within(thread).getByRole('link', { name: 'Auto Apply' }))

    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
  })
})
