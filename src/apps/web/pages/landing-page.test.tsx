import { render, screen } from '@testing-library/react'
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
  it('preserves the public Jobwhisper homepage experience', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: "Never leave an interview wishing you'd said something different.",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Rehearse against a role-aware AI, then bring a live copilot into the actual conversation.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Features' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
    expect(screen.getByRole('button', { name: /Download Now/ })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /See Pricing/ })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Open the interactive Jobwhisper demo' })).toBeInTheDocument()
  })
})
