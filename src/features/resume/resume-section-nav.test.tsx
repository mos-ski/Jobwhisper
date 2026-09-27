import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ResumeEditorPage } from '@/apps/web/pages/resume-editor-page'

/**
 * The Edit tab's rows carry an anchor to the section on the canvas. The canvas is `lg:flex`,
 * so on a phone the anchor had nothing to jump to and a tap did nothing at all. The list and
 * the editor take turns on the one screen instead.
 */
// `overflow-hidden` contains the substring, so the class has to be matched as a whole word.
const HIDDEN = /(^|\s)hidden(\s|$)/

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
})
