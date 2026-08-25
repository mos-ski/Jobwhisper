import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContextPickerField } from './ContextPickerField'
import type { ContextDoc } from './resolveContextDocs'

const DOCS: ContextDoc[] = [
  { id: '1', name: 'Sales Playbook 2026.pdf', type: 'Knowledge Base' },
  { id: '2', name: 'Pricing & Packaging Guide.pdf', type: 'Knowledge Base' },
]

describe('ContextPickerField', () => {
  it('shows an "Add context" trigger when nothing is selected', () => {
    render(<ContextPickerField docs={DOCS} selected={[]} onChange={() => {}} />)
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  })

  it('opens a checklist of all docs, and calls onChange with the ticked ones on Done', () => {
    const onChange = vi.fn()
    render(<ContextPickerField docs={DOCS} selected={[]} onChange={onChange} />)
    fireEvent.click(screen.getByText(/Add context from your documents/))
    expect(screen.getByText('Sales Playbook 2026.pdf')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Sales Playbook 2026.pdf'))
    fireEvent.click(screen.getByText('Done'))
    expect(onChange).toHaveBeenCalledWith([DOCS[0]])
  })

  it('renders already-selected docs as removable chips, and removing one calls onChange without it', () => {
    const onChange = vi.fn()
    render(<ContextPickerField docs={DOCS} selected={[DOCS[0], DOCS[1]]} onChange={onChange} />)
    expect(screen.getByText('Sales Playbook 2026.pdf')).toBeInTheDocument()
    expect(screen.getByText('Pricing & Packaging Guide.pdf')).toBeInTheDocument()
    fireEvent.click(screen.getAllByLabelText('Remove')[0])
    expect(onChange).toHaveBeenCalledWith([DOCS[1]])
  })
})
