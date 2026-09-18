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
    expect(screen.getByRole('button', { name: 'Start demo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Built for the moment that matters.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Start to finish.' })).toBeInTheDocument()
    expect(within(screen.getByRole('tablist', { name: 'Job search stages' })).getAllByRole('tab')).toHaveLength(4)
    fireEvent.click(screen.getByRole('tab', { name: 'AI Job Application' }))
    expect(screen.getByText('Immigration Program Manager')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Interview Copilot' }))
    expect(screen.getByText('Live Response')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Interview Prep' }))
    expect(screen.getByText('Live Simulator')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Your copilot\.\s*Always within reach\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Jobwhisper,\s*wherever you need it\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Ready when you are\.\s*Let’s get you hired\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Frequently asked questions' })).toBeInTheDocument()
  })
})
