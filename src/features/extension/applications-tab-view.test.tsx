import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ExtensionApplicationsTabView } from './applications-tab-view'
import type { ExtensionApplicationRow } from '@/contracts/extension.draft'

function makeRow(overrides: Partial<ExtensionApplicationRow>): ExtensionApplicationRow {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    dateLabel: 'Aug 1',
    outcome: 'success',
    ...overrides,
  }
}

describe('ExtensionApplicationsTabView', () => {
  it('shows the empty state when there are no applications', () => {
    render(<ExtensionApplicationsTabView applications={[]} />)
    expect(screen.getByText('Nothing applied for yet')).toBeInTheDocument()
    expect(screen.getByText('Every attempt shows up here, including the ones that did not work.')).toBeInTheDocument()
  })

  it('lists each application with its outcome', () => {
    render(<ExtensionApplicationsTabView applications={[makeRow({ id: '1', title: 'Backend Engineer', outcome: 'failed' })]} />)
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Did not work')).toBeInTheDocument()
  })
})
