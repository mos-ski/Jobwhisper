import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import DesktopApp from './App'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/desktop/*" element={<DesktopApp />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('desktop live session', () => {
  it('pauses the transcript scroll when an answer is hovered and shades it at rest', async () => {
    renderAt('/desktop/session?kind=interview')

    const shaded = await screen.findAllByRole('listitem')
    expect(shaded.some((row) => row.className.includes('bg-surface-subtle/40'))).toBe(true)
    expect(screen.queryByRole('button', { name: 'Jump to latest' })).not.toBeInTheDocument()

    fireEvent.mouseEnter(shaded[0]!)
    expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument()
  })

  it('attaches a screenshot to the AI chat and lets it be removed', async () => {
    renderAt('/desktop/session?kind=interview')

    fireEvent.click(await screen.findByRole('button', { name: 'Capture the screen and answer' }))
    expect(await screen.findByText(/Screenshot · \d{2}:\d{2}/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Remove screenshot' }))
    expect(screen.queryByText(/Screenshot · \d{2}:\d{2}/)).not.toBeInTheDocument()
  })

  it('swaps to an external microphone from the session toolbar', async () => {
    renderAt('/desktop/session?kind=interview')

    fireEvent.click(await screen.findByRole('button', { name: /Microphone, System default/ }))
    fireEvent.click(await screen.findByRole('radio', { name: 'Blue Yeti USB Microphone' }))
    expect(screen.getByRole('radio', { name: 'Blue Yeti USB Microphone' })).toHaveAttribute('aria-checked', 'true')
  })

  it('lists external microphones in settings, next to the same selection', async () => {
    renderAt('/desktop/home?settings=general')

    const select = (await screen.findByLabelText('Input source')) as HTMLSelectElement
    expect(select.value).toBe('System default')
    fireEvent.change(select, { target: { value: 'Scarlett Solo (USB)' } })
    expect(select.value).toBe('Scarlett Solo (USB)')
  })

  it('resumes a past session from the home screen, with a banner', async () => {
    renderAt('/desktop/home')

    fireEvent.click(await screen.findByRole('button', { name: /Relics/ }))
    expect(await screen.findByText(/Resumed from history/)).toBeInTheDocument()
    expect(screen.getByText('Product Manager', { selector: 'span.truncate' })).toBeInTheDocument()
  })
})
