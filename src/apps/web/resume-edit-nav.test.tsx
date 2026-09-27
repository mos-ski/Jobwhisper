import { render, screen, within } from '@testing-library/react'
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
