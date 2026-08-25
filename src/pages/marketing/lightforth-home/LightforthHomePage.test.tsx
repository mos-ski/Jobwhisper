import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LightforthHomePage from './LightforthHomePage'

const downloadUrls = [
  'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_arm64.dmg',
  'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_x64.dmg',
  'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth-Copilot-Windows-Installer.exe',
]

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: true }),
  })

  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  })

  class IntersectionObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }

  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
})

it('links each download option directly to the latest installer', () => {
  render(
    <MemoryRouter>
      <LightforthHomePage />
    </MemoryRouter>,
  )

  fireEvent.click(screen.getAllByRole('button', { name: /download now/i })[0])

  const dialog = screen.getByRole('dialog', { name: 'Download Lightforth Copilot' })
  const links = within(dialog).getAllByRole('link')

  expect(links.map((link) => link.getAttribute('href'))).toEqual(downloadUrls)
})

it('opens and closes the selected Google Drive quick demo', () => {
  render(
    <MemoryRouter>
      <LightforthHomePage />
    </MemoryRouter>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Watch Quick Demo' }))

  const dialog = screen.getByRole('dialog', { name: 'Lightforth quick demo' })
  const player = within(dialog).getByTitle('Lightforth quick demo video')
  const playerFrame = within(dialog).getByTestId('quick-demo-player')

  expect(player).toHaveAttribute(
    'src',
    'https://drive.google.com/file/d/118_lmiPcoUBvDzsglUGqZc2uZDDmIJQs/preview',
  )
  expect(playerFrame).toHaveAttribute('data-mobile-layout', 'fullscreen')
  expect(within(dialog).getByTestId('drive-popout-mask')).toBeInTheDocument()

  fireEvent.click(within(dialog).getByRole('button', { name: 'Close quick demo' }))
  expect(screen.queryByRole('dialog', { name: 'Lightforth quick demo' })).not.toBeInTheDocument()
})

it('groups the three copilot feature sections for scroll overlap', () => {
  render(
    <MemoryRouter>
      <LightforthHomePage />
    </MemoryRouter>,
  )

  const overlapGroup = screen.getByTestId('copilot-overlap-group')
  const sections = ['interview-copilot', 'coding-copilot', 'meeting-copilot'].map((id) => document.getElementById(id))

  expect(sections).toHaveLength(3)
  sections.forEach((section, index) => {
    expect(overlapGroup).toContainElement(section)
    expect(section).toHaveClass('lf-overlap-section')
    expect(section).toHaveAttribute('data-overlap-index', String(index))
  })
  expect(overlapGroup).not.toContainElement(document.getElementById('how-it-works'))
})
