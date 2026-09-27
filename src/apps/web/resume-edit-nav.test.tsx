import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { WebRoutes } from './routes'

describe('Resume Builder Edit tab', () => {
  it('lists the sections as links that jump to them on the canvas', () => {
    render(
      <MemoryRouter initialEntries={['/v3/resume/editor?tab=edit']}>
        <WebRoutes />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: 'Resume sections' })
    const experience = within(nav).getByRole('link', { name: 'Experience' })
    expect(experience).toHaveAttribute('href', '#resume-edit-experience')
    expect(document.getElementById('resume-edit-experience')).toHaveAccessibleName('Experience')
    expect(within(nav).getByRole('link', { name: 'Personal Information' })).toHaveAttribute('href', '#resume-edit-personal-information')
    expect(document.getElementById('resume-edit-personal-information')).not.toBeNull()
    expect(within(nav).queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('Resume Builder Edit sections', () => {
  it('adds an Awards section from Add Section, and removes and restores a standard one', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    render(
      <MemoryRouter initialEntries={['/v3/resume/editor?tab=edit']}>
        <WebRoutes />
      </MemoryRouter>,
    )
    const nav = () => within(screen.getByRole('navigation', { name: 'Resume sections' }))

    await user.click(screen.getByRole('button', { name: 'Add Section' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Awards' }))
    expect(nav().getByRole('link', { name: 'Awards' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Awards' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Languages section' }))
    expect(screen.queryByRole('region', { name: 'Languages' })).not.toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Languages' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Section' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Languages' }))
    expect(screen.getByRole('region', { name: 'Languages' })).toBeInTheDocument()
  })
})

describe('Resume Builder Edit panel highlight', () => {
  it('marks the section being edited', () => {
    render(
      <MemoryRouter initialEntries={['/v3/resume/editor?tab=edit']}>
        <WebRoutes />
      </MemoryRouter>,
    )
    const nav = within(screen.getByRole('navigation', { name: 'Resume sections' }))
    act(() => { screen.getAllByRole('textbox', { name: /^Company, role/ })[0]?.focus() })
    expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute('aria-current', 'location')
    expect(nav.getByRole('link', { name: 'Skills' })).not.toHaveAttribute('aria-current')
  })
})
