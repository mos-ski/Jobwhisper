import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { doneForYouEngagement, successManagers } from '@/mocks/done-for-you'
import { DoneForYouView, type DoneForYouViewProps } from './done-for-you-view'

function renderView(overrides: Partial<DoneForYouViewProps> = {}) {
  const props: DoneForYouViewProps = {
    homeHref: '/v3/app',
    parent: { href: '/v3/app', label: 'Dashboard' },
    setupHref: '/v3/auto-apply/contact',
    profile: { country: 'Nigeria', desiredRole: ['Product Manager'], locations: ['Lagos'] },
    savedCard: { label: 'Mastercard •••• 4242', expiryLabel: '08/29' },
    directory: { status: 'ready', managers: successManagers },
    ...overrides,
  }
  render(<MemoryRouter><DoneForYouView {...props} /></MemoryRouter>)
  return props
}

describe('DoneForYouView', () => {
  it('shows a subscriber their manager, guarantee progress and the applications sent', async () => {
    const onMessageManager = vi.fn()
    renderView({ engagement: doneForYouEngagement, onMessageManager })
    expect(screen.getByRole('heading', { level: 2, name: /Adaeze O\./ })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Interviews landed' })).toHaveAttribute('aria-valuenow', '2')
    const table = screen.getByRole('table')
    expect(within(table).getByText('Paystack')).toBeInTheDocument()
    expect(within(table).getAllByText('Interview booked')).toHaveLength(2)
    expect(screen.queryByRole('heading', { name: 'Available Success Managers' })).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Message Adaeze' }))
    expect(onMessageManager).toHaveBeenCalled()
  })

  it('lists every success manager with what they charge', () => {
    renderView()
    const list = screen.getByRole('heading', { name: 'Available Success Managers' }).nextElementSibling as HTMLElement
    expect(within(list).getAllByRole('listitem', { name: undefined }).filter((item) => item.parentElement === list)).toHaveLength(4)
    expect(screen.getAllByText('$497')).toHaveLength(2)
    expect(screen.getAllByText('$1,997')).toHaveLength(2)
    expect(screen.getAllByText('20 interviews guaranteed')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Start with Adaeze' })).toBeInTheDocument()
  })

  it('offers a retry when managers fail to load, and Auto Apply when all are booked', async () => {
    const onRetry = vi.fn()
    const { unmount } = render(<MemoryRouter><DoneForYouView homeHref="/" parent={{ href: '/', label: 'Billing' }} setupHref="/setup" profile={{ country: '', desiredRole: [], locations: [] }} savedCard={{ label: '', expiryLabel: '' }} directory={{ status: 'error' }} onRetry={onRetry} /></MemoryRouter>)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalled()
    unmount()
    renderView({ directory: { status: 'ready', managers: successManagers.map((manager) => ({ ...manager, nextOpening: '2026-10-14' })) } })
    expect(screen.getByRole('link', { name: 'Set up Auto Apply' })).toHaveAttribute('href', '/v3/auto-apply/contact')
  })
})
