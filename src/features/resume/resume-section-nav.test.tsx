import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ResumeEditorPage } from '@/apps/web/pages/resume-editor-page'

/**
 * The Edit tab's rows carry an anchor to the section on the canvas. The canvas is `lg:flex`,
 * so on a phone the anchor had nothing to jump to and a tap did nothing at all. The list and
 * the editor take turns on the one screen instead.
 */
// `overflow-hidden` contains the substring, so the class has to be matched as a whole word.
const HIDDEN = /(^|\s)hidden(\s|$)/

/**
 * The suite's matchMedia stub answers false to everything, so the view reads as a wide screen
 * by default. One section at a time is a phone behaviour, so that test says so explicitly.
 */
function useNarrowViewport() {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query.includes('max-width: 1023px'),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }) as MediaQueryList)
}

afterEach(() => vi.restoreAllMocks())

function renderEditTab() {
  return render(
    <MemoryRouter initialEntries={['/v3/resume/editor?tab=create']}>
      <ResumeEditorPage />
    </MemoryRouter>,
  )
}

describe('Resume Edit tab, section list', () => {
  it('starts on the list, with the editor kept off a phone screen', () => {
    renderEditTab()

    const nav = screen.getByRole('navigation', { name: 'Resume sections' })
    expect(nav.closest('aside')?.className).toContain('flex')
    expect(nav.closest('aside')?.className).not.toMatch(HIDDEN)
    expect(screen.queryByRole('button', { name: 'All sections' })?.className).toContain('lg:hidden')
  })

  it('swaps the list for the editor when a section is tapped, and back again', async () => {
    const user = userEvent.setup()
    renderEditTab()

    await user.click(screen.getByRole('link', { name: 'Experience' }))

    const nav = screen.getByRole('navigation', { name: 'Resume sections' })
    // The list steps aside on a phone; at lg both panes are on screen as before.
    expect(nav.closest('aside')?.className).toMatch(HIDDEN)
    expect(nav.closest('aside')?.className).toContain('lg:flex')

    await user.click(screen.getByRole('button', { name: 'All sections' }))
    expect(screen.getByRole('navigation', { name: 'Resume sections' }).closest('aside')?.className).not.toMatch(HIDDEN)
  })

  it('renders only the section that was tapped', async () => {
    useNarrowViewport()
    const user = userEvent.setup()
    renderEditTab()

    const rendered = () =>
      [...document.querySelectorAll('[data-slot="resume-inline-editor"] [id^="resume-edit-"]')].map((el) => el.id)

    await user.click(screen.getByRole('link', { name: 'Experience' }))
    // One section at a time: the rest are not collapsed, they are simply not on the phone screen.
    expect(rendered()).toEqual(['resume-edit-experience'])

    await user.click(screen.getByRole('button', { name: 'All sections' }))
    await user.click(screen.getByRole('link', { name: 'Skills' }))
    expect(rendered()).toEqual(['resume-edit-skills'])
  })
})
