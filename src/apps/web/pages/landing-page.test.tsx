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
    expect(
      screen.getByText(
        /JobWhisper Copilot listens to every interview question and instantly gives you a tailored answer/,
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Features' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
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
  })
})
