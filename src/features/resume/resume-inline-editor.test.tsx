import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { resumeDocument, resumeIssues } from '@/mocks/resume'
import { ResumeInlineEditor, type ResumeInlineEditorProps } from './resume-inline-editor'

function renderEditor(overrides: Partial<ResumeInlineEditorProps> = {}) {
  const props: ResumeInlineEditorProps = {
    document: resumeDocument,
    issues: resumeIssues,
    analysedLabel: 'Last analysed 2 days ago',
    onOpenReport: vi.fn(),
    onReanalyze: vi.fn(),
    ...overrides,
  }
  render(<ResumeInlineEditor {...props} />)
  return props
}

function tile(label: string) {
  return screen.getByText(`${label} fix`).parentElement
}

describe('ResumeInlineEditor', () => {
  it('grades the resume and counts fixes by severity', async () => {
    const user = userEvent.setup()
    const props = renderEditor()
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(tile('Urgent')).toHaveTextContent('8')
    expect(tile('Critical')).toHaveTextContent('1')
    expect(tile('Optional')).toHaveTextContent('1')
    await user.click(screen.getByRole('button', { name: 'View full report' }))
    expect(props.onOpenReport).toHaveBeenCalled()
  })

  it('offers a rewrite on Fix and applies it on Accept', async () => {
    const user = userEvent.setup()
    renderEditor()
    const summary = within(screen.getByRole('region', { name: 'Summary' }))
    await user.click(summary.getByRole('button', { name: 'Fix' }))
    expect(summary.getByText('Suggested summary')).toBeInTheDocument()
    await user.click(summary.getByRole('button', { name: 'Accept' }))

    expect(screen.getByRole('textbox', { name: 'Summary' })).toHaveValue(resumeDocument.improvedSummary)
    expect(tile('Critical')).toHaveTextContent('0')
  })

  it('adds and removes skills as chips', async () => {
    const user = userEvent.setup()
    renderEditor()
    await user.type(screen.getByRole('textbox', { name: 'Add skill' }), 'Amplitude{Enter}')
    expect(within(screen.getByRole('list', { name: 'Skills' })).getByText('Amplitude')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove Amplitude' }))
    expect(within(screen.getByRole('list', { name: 'Skills' })).queryByText('Amplitude')).not.toBeInTheDocument()
  })

  it('reorders sections from the keyboard', () => {
    renderEditor()
    fireEvent.keyDown(screen.getByRole('button', { name: /Move Skills/ }), { key: 'ArrowUp' })
    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings.slice(0, 3)).toEqual(['Summary', 'Skills', 'Experience'])
    expect(screen.getByRole('status')).toHaveTextContent('Skills moved to position 2 of 7.')
  })

  it('shows a pending Chat rewrite in place, and keeps it once accepted', () => {
    const { rerender } = render(<ResumeInlineEditor document={resumeDocument} issues={[]} analysedLabel="" onOpenReport={vi.fn()} onReanalyze={vi.fn()} pendingSuggestion />)
    const summaries = screen.getAllByRole('textbox', { name: 'Summary' })
    expect(summaries.at(-1)).toHaveValue(resumeDocument.improvedSummary)
    expect(summaries.at(-1)).toHaveAttribute('readonly')

    rerender(<ResumeInlineEditor document={resumeDocument} issues={[]} analysedLabel="" onOpenReport={vi.fn()} onReanalyze={vi.fn()} acceptedSuggestion />)
    expect(screen.getAllByRole('textbox', { name: 'Summary' }).at(-1)).toHaveValue(resumeDocument.improvedSummary)
    expect(screen.getAllByRole('textbox', { name: 'Summary' }).at(-1)).not.toHaveAttribute('readonly')
  })
})
