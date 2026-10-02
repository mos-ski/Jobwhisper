import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import DesktopApp from './App'

// Mirrors src/App.tsx: the desktop routes resolve under the /desktop/* parent.
function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/desktop/*" element={<DesktopApp />} />
      </Routes>
    </MemoryRouter>,
  )
}

async function continueToStep2() {
  fireEvent.change(await screen.findByLabelText('Target role'), { target: { value: 'Product Manager' } })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('desktop credits and setup', () => {
  it('opens the What’s new dialog from the notifications bell and clears the dot', async () => {
    renderAt('/desktop/home')

    expect(screen.getByRole('button', { name: 'Notifications, new' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Notifications, new' }))

    expect(await screen.findByText('Version 1.0.14')).toBeInTheDocument()
    expect(screen.getByText('A bell for updates')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }))
    expect(await screen.findByRole('button', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('shows the same period count on the home card as the usage report', () => {
    renderAt('/desktop/home')
    renderAt('/desktop/home?settings=usage')

    expect(screen.getAllByText('983 of 2,000 credits this period').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText(/1,017 credits/).length).toBeGreaterThan(0)
  })

  it('tops up from the home credits card and raises the balance', async () => {
    renderAt('/desktop/home')
    fireEvent.click(screen.getByRole('button', { name: 'Top up' }))

    expect(await screen.findByText('Add Interview Copilot credits')).toBeInTheDocument()
    expect(screen.getByText('Current balance:')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /\$10/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue to checkout' }))

    expect(await screen.findByText('25 credits added', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText('Your new balance is 1042 credits.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(await screen.findByText('1,042 credits')).toBeInTheDocument()
  })

  it('warns before a session when the balance covers under an hour', async () => {
    renderAt('/desktop/configure?kind=interview&state=lowcredits')
    await continueToStep2()

    fireEvent.click(screen.getByRole('button', { name: 'Start session' }))
    expect(await screen.findByText('Low on credits')).toBeInTheDocument()
    expect(screen.getByText(/under an hour of Copilot/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Start anyway' }))
    expect(await screen.findByRole('button', { name: 'End Session' })).toBeInTheDocument()
  })

  it('offers the top-up dialog from the low-credit warning', async () => {
    renderAt('/desktop/configure?kind=interview&state=lowcredits')
    await continueToStep2()

    fireEvent.click(screen.getByRole('button', { name: 'Start session' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Top up' }))

    expect(await screen.findByText('Add Interview Copilot credits')).toBeInTheDocument()
    expect(screen.getByText(/Current balance:/)).toBeInTheDocument()
  })

  it('jumps straight into a session without setup', async () => {
    renderAt('/desktop/configure?kind=interview')
    fireEvent.click(screen.getByRole('button', { name: 'Start without setup' }))

    expect(await screen.findByRole('button', { name: 'End Session' })).toBeInTheDocument()
  })

  it('turns stealth on the moment a session opens', async () => {
    renderAt('/desktop/session?kind=interview')
    expect(await screen.findByRole('button', { name: 'Stealth mode on' })).toBeInTheDocument()
  })
})
