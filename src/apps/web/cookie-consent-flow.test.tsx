import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { LandingPage } from './pages/landing-page'

function clearConsentCookie() {
  document.cookie = 'jw_cookie_consent=; Max-Age=0; Path=/'
}

beforeEach(() => {
  clearConsentCookie()
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
  vi.stubGlobal('scrollTo', vi.fn())
})

afterAll(() => {
  clearConsentCookie()
  vi.unstubAllGlobals()
})

function renderHome() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('Homepage cookie consent', () => {
  it('asks on the first visit, remembers a rejection, and reopens from the footer', () => {
    const { unmount } = renderHome()

    expect(screen.getByRole('region', { name: 'Cookies on Jobwhisper' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reject all' }))
    expect(screen.queryByRole('region', { name: 'Cookies on Jobwhisper' })).not.toBeInTheDocument()
    expect(document.cookie).toContain('jw_cookie_consent=')
    expect(decodeURIComponent(document.cookie)).toContain('analytics=0&marketing=0')

    unmount()
    renderHome()
    expect(screen.queryByRole('region', { name: 'Cookies on Jobwhisper' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cookie settings' }))
    expect(screen.getByRole('switch', { name: 'Analytics cookies' })).not.toBeChecked()
    fireEvent.click(screen.getByRole('switch', { name: 'Analytics cookies' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save choices' }))
    expect(decodeURIComponent(document.cookie)).toContain('analytics=1&marketing=0')
  }, 20000)
})
