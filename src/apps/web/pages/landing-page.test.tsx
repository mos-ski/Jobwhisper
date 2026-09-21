import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { LandingPage } from './landing-page'

const intersectionVisibilityCallbacks = new Map<Element, (isIntersecting: boolean) => void>()

beforeEach(() => {
  intersectionVisibilityCallbacks.clear()
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      private readonly callback: IntersectionObserverCallback

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
      }
      observe(target: Element) {
        intersectionVisibilityCallbacks.set(target, (isIntersecting) => this.callback(
          [{ isIntersecting, target } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ))
      }
      unobserve() {}
      disconnect() {}
    },
  )
  vi.stubGlobal('scrollTo', vi.fn())
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('LandingPage', () => {
  it('starts at the hero when the landing URL opens without a section hash', () => {
    render(
      <MemoryRouter initialEntries={['/?review=announcement-overlay']}>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
  })

  it('keeps deliberate landing-page section links intact', () => {
    render(
      <MemoryRouter initialEntries={['/#features']}>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('renders the Figma landing-page experience', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Pass Your Next Interview\.\s*Land the Job\. Or Don’t Pay!/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/We’ve moved on from Lightforth/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', 'https://lightforth.ai/')
    expect(screen.queryByText('Join 57,000+ job seekers landing better roles')).not.toBeInTheDocument()
    expect(
      screen.getByText(
        /Jobwhisper Copilot listens to every interview question and instantly gives you a tailored answer/,
      ),
    ).toBeInTheDocument()
    const mainNavigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(mainNavigation).getByRole('link', { name: 'Features' })).toBeInTheDocument()
    expect(within(mainNavigation).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
    const navDownload = within(mainNavigation).getByRole('button', { name: 'Download' })
    expect(navDownload).toBeInTheDocument()
    expect(navDownload.querySelector('img')).not.toBeInTheDocument()
    expect(navDownload.querySelectorAll('svg')).toHaveLength(1)
    expect(within(mainNavigation).getAllByRole('button', { name: 'Log in' })).toHaveLength(1)
    expect(within(mainNavigation).queryByRole('button', { name: 'Sign up' })).not.toBeInTheDocument()
    const heroActions = document.querySelector('.landing-hero-actions')
    expect(heroActions).not.toBeNull()
    expect(within(heroActions as HTMLElement).getAllByRole('button')).toHaveLength(1)
    expect(within(heroActions as HTMLElement).getByRole('button', { name: 'Ace your Interview' })).toBeInTheDocument()
    const hero = document.querySelector('.landing-hero')
    expect(hero).not.toBeNull()
    act(() => intersectionVisibilityCallbacks.get(hero as Element)?.(false))
    const socialProof = screen.getByLabelText('Join Jobwhisper')
    expect(within(socialProof).getByText('Join 57,000+ job seekers landing better roles')).toBeInTheDocument()
    const socialDownload = within(socialProof).getByRole('button', { name: 'Download' })
    expect(socialDownload.querySelector('img[src="/landing-apple.svg"]')).toBeInTheDocument()
    expect(socialDownload.querySelector('img[src="/landing-windows.svg"]')).toBeInTheDocument()
    const demo = screen.getByLabelText('Jobwhisper live copilot demo')
    expect(within(demo).queryByRole('button', { name: 'Get Started' })).not.toBeInTheDocument()
    expect(within(demo).queryByText('Land the role, or pay nothing')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Start to finish.' })).toBeInTheDocument()
    const journeyCopy = screen.getByLabelText(/Jobwhisper is built to help you through every stage/)
    expect(journeyCopy.querySelectorAll('[data-reveal-word]').length).toBeGreaterThan(30)
    expect(journeyCopy.querySelector('strong')).toHaveTextContent('landing your next role.')
    const factsCopy = screen.getByLabelText(/Meet the AI copilot built for the moments/)
    expect(factsCopy.querySelectorAll('[data-reveal-word]').length).toBeGreaterThan(50)
    expect(factsCopy.querySelector('strong')).toHaveTextContent('AI copilot built for the moments when the right answer matters.')
    expect(within(screen.getByLabelText('Job search stages')).getAllByRole('button')).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: 'AI Job Application' }))
    expect(screen.getByRole('img', { name: 'AI Job Application preview' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Interview Copilot' }))
    expect(screen.getByRole('img', { name: 'Interview Copilot preview' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Interview Prep' }))
    expect(screen.getByRole('img', { name: 'Interview Prep preview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Your copilot\.\s*Always within reach\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Ready when you are\.\s*Let’s get you hired\./ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get started free/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'See pricing' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Try Interview Copilot/ })).toBeInTheDocument()
    expect(screen.queryByText('Your next role')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'AI Resume Builder' })).toHaveAttribute('href', '/products/resume-builder')
    expect(screen.getByRole('link', { name: 'Interview Copilot' })).toHaveAttribute('href', '/products/interview-copilot')
    expect(screen.getByRole('link', { name: 'Interview Prep' })).toHaveAttribute('href', '/products/interview-prep')
    expect(screen.getByRole('link', { name: 'Auto Apply' })).toHaveAttribute('href', '/products/auto-apply')
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Careers' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'TikTok' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
  })
})
