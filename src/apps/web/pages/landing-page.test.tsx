import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { LandingPage } from './landing-page'

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('LandingPage', () => {
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
    expect(screen.getByText(/Join 57,000\+ job seekers/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    expect(
      screen.getByText(
        /JobWhisper Copilot listens to every interview question and instantly gives you a tailored answer/,
      ),
    ).toBeInTheDocument()
    const mainNavigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(mainNavigation).getByRole('link', { name: 'Features' })).toBeInTheDocument()
    expect(within(mainNavigation).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
    expect(screen.getByRole('button', { name: /Download Now/ })).toBeInTheDocument()
    expect(within(screen.getByLabelText('Jobwhisper live copilot demo')).getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Built for the moment that matters.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Start to finish.' })).toBeInTheDocument()
    const journeyCopy = screen.getByLabelText(/Jobwhisper is built to help you through every stage/)
    expect(journeyCopy.querySelectorAll('[data-reveal-word]').length).toBeGreaterThan(30)
    expect(journeyCopy.querySelector('strong')).toHaveTextContent('landing your next role.')
    const factsCopy = screen.getByLabelText(/Meet the AI copilot built for the moments/)
    expect(factsCopy.querySelectorAll('[data-reveal-word]').length).toBeGreaterThan(50)
    expect(factsCopy.querySelector('strong')).toHaveTextContent('AI copilot built for the moments when the right answer matters.')
    expect(screen.getByRole('button', { name: 'Play Jay’s story' })).toBeInTheDocument()
    expect(within(screen.getByLabelText('Job search stages')).getAllByRole('button')).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: 'AI Job Application' }))
    expect(screen.getByRole('img', { name: 'AI Job Application preview' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Interview Copilot' }))
    expect(screen.getByRole('img', { name: 'Interview Copilot preview' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Interview Prep' }))
    expect(screen.getByRole('img', { name: 'Interview Prep preview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Your copilot\.\s*Always within reach\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Jobwhisper,\s*wherever you need it\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Ready when you are\.\s*Let’s get you hired\./ })).toBeInTheDocument()
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
