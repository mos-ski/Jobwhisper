import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { successManagers } from '@/mocks/done-for-you'
import { SuccessManagerPicker, type SuccessManagerPickerProps } from './success-manager-picker'

function renderView(overrides: Partial<SuccessManagerPickerProps> = {}) {
  const props: SuccessManagerPickerProps = {
    setupHref: '/v3/auto-apply/contact',
    profile: { country: 'Nigeria', desiredRole: ['Product Manager'], locations: ['Lagos'] },
    savedCard: { label: 'Mastercard •••• 4242', expiryLabel: '08/29' },
    directory: { status: 'ready', managers: successManagers },
    ...overrides,
  }
  return render(<MemoryRouter><SuccessManagerPicker {...props} /></MemoryRouter>)
}

describe('SuccessManagerPicker', () => {
  it('shows one success manager per price', () => {
    renderView()
    expect(screen.queryByRole('radiogroup', { name: 'Interview guarantee' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start with Marcus' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start with Daniel' })).toBeInTheDocument()
    expect(screen.getByText('$497')).toBeInTheDocument()
    expect(screen.getByText('$1,997')).toBeInTheDocument()
    expect(screen.getByText('20 interviews guaranteed')).toBeInTheDocument()
    expect(screen.getByText('Save 29%')).toBeInTheDocument()
    expect(screen.getByLabelText('Was $697')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Watch Intro/ })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'About Marcus T.: read the full bio' })).toBeInTheDocument()
  })

  it('names the chosen manager through signup', async () => {
    renderView()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Start with Daniel' }))
    expect(screen.getByText(/20 Interviews Guaranteed · with Daniel K\./)).toBeInTheDocument()
    expect(screen.getByText('How should Daniel K. reach you?')).toBeInTheDocument()
  })

  it('offers a retry when managers fail to load, and Auto Apply when all are booked', async () => {
    const onRetry = vi.fn()
    const { unmount } = renderView({ directory: { status: 'error' }, onRetry })
    await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalled()
    unmount()
    renderView({ directory: { status: 'ready', managers: successManagers.map((manager) => ({ ...manager, nextOpening: '2026-10-14' })) } })
    expect(screen.getByRole('link', { name: 'Set up Auto Apply' })).toHaveAttribute('href', '/v3/auto-apply/contact')
  })
})
