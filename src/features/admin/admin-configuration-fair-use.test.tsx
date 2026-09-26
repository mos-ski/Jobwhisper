import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AdminConfigurationPage } from '@/apps/web/pages/admin-configuration-page'

function renderConfiguration() {
  return render(
    <MemoryRouter initialEntries={['/admin/configuration?tab=pricing']}>
      <AdminConfigurationPage />
    </MemoryRouter>,
  )
}

function planCard(name: string): HTMLElement {
  return screen.getByRole('heading', { level: 3, name }).closest('section') as HTMLElement
}

describe('Admin configuration, fair use', () => {
  it('caps every unlimited feature the plan actually grants', () => {
    renderConfiguration()

    const starter = planCard('Starter')
    const pro = planCard('Pro')

    // Starter sells interviews and nothing else, so it has one stretch to cap.
    expect(within(starter).getByLabelText('Cap one Interview Prep and Copilot stretch, Starter plan')).toBeChecked()
    expect(within(starter).queryByLabelText(/Resume Builder stretch, Starter plan/)).not.toBeInTheDocument()
    expect(within(starter).queryByLabelText(/Auto Apply stretch, Starter plan/)).not.toBeInTheDocument()

    expect(within(pro).getByLabelText('Cap one Resume Builder stretch, Pro plan')).toBeChecked()
    expect(within(pro).getByLabelText('Cap one Auto Apply stretch, Pro plan')).toBeChecked()
    expect(within(pro).getByLabelText('Minutes in one stretch')).toHaveValue('120')
  })

  it('drops the fields when the cap is switched off, rather than disabling them', async () => {
    const user = userEvent.setup()
    renderConfiguration()

    const starter = planCard('Starter')
    expect(within(starter).getByLabelText('Minutes in one stretch')).toBeInTheDocument()

    await user.click(within(starter).getByLabelText('Cap one Interview Prep and Copilot stretch, Starter plan'))

    expect(within(starter).queryByLabelText('Minutes in one stretch')).not.toBeInTheDocument()
    expect(within(starter).getByText(/No stretch cap/)).toBeInTheDocument()
  })

  it('refuses a cooldown long enough to be a suspension', async () => {
    const user = userEvent.setup()
    renderConfiguration()

    const cooldown = within(planCard('Starter')).getByLabelText('Cooldown, hours')
    await user.clear(cooldown)
    await user.type(cooldown, '48')
    await user.click(screen.getByRole('button', { name: 'Review changes' }))

    expect(screen.getByText(/Longer than a day is a suspension, not fair use/)).toBeInTheDocument()
  })

  it('shows the whole rule in the review, and asks whether live subscribers feel it', async () => {
    const user = userEvent.setup()
    renderConfiguration()

    const stretch = within(planCard('Pro')).getByLabelText('Minutes in one stretch')
    await user.clear(stretch)
    await user.type(stretch, '60')
    await user.click(screen.getByRole('button', { name: 'Review changes' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Fair use — Interview Prep and Copilot')).toBeInTheDocument()
    // The diff is in the unit the admin typed in, not the one the product prints.
    expect(within(dialog).getByText('120 minutes, then 3 hours off, top-up unlocks')).toBeInTheDocument()
    expect(within(dialog).getByText('60 minutes, then 3 hours off, top-up unlocks')).toBeInTheDocument()
    // A tightened cap reaches people mid-cycle, so it asks the same question a price change does.
    expect(within(dialog).getByLabelText('Reset usage for existing subscribers')).toBeInTheDocument()
  })
})
