import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { CookieConsent, type CookieConsentProps } from './cookie-consent'

function renderConsent(overrides: Partial<CookieConsentProps> = {}) {
  const props: CookieConsentProps = {
    preferences: { analytics: false, marketing: false },
    privacyHref: '/privacy',
    onAcceptAll: vi.fn(),
    onRejectAll: vi.fn(),
    onSave: vi.fn(),
    ...overrides,
  }
  render(<CookieConsent {...props} />)
  return props
}

describe('CookieConsent', () => {
  it('leads with Accept, keeps Reject beside it at the same size', async () => {
    const user = userEvent.setup()
    const props = renderConsent()

    expect(screen.getByRole('region', { name: 'Cookies on Jobwhisper' })).toBeInTheDocument()
    const accept = screen.getByRole('button', { name: 'Accept all' })
    const reject = screen.getByRole('button', { name: 'Reject all' })
    expect(accept.dataset.variant).toBe('primary')
    expect(reject.dataset.variant).toBe('secondary')
    expect(accept.dataset.size).toBe(reject.dataset.size)

    await user.click(reject)
    expect(props.onRejectAll).toHaveBeenCalled()
    await user.click(accept)
    expect(props.onAcceptAll).toHaveBeenCalled()
  })

  it('saves a choice per category, with essential always on', async () => {
    const user = userEvent.setup()
    const props = renderConsent()

    await user.click(screen.getByRole('button', { name: 'Choose which cookies' }))
    expect(screen.getByText('Always on')).toBeInTheDocument()
    await user.click(screen.getByRole('switch', { name: 'Analytics cookies' }))
    await user.click(screen.getByRole('button', { name: 'Save choices' }))
    expect(props.onSave).toHaveBeenCalledWith({ analytics: true, marketing: false })
  })

  it('opens on the toggles, preset to the current choice, from Cookie settings', () => {
    renderConsent({ startWithChoices: true, preferences: { analytics: true, marketing: false } })
    expect(screen.getByRole('switch', { name: 'Analytics cookies' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Marketing cookies' })).not.toBeChecked()
  })
})
