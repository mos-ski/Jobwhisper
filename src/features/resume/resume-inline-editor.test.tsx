import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { resumeDocument, resumeIssues } from '@/mocks/resume'
import { ResumeInlineEditor, type ResumeInlineEditorProps } from './resume-inline-editor'

function renderEditor(overrides: Partial<ResumeInlineEditorProps> = {}) {
  const props: ResumeInlineEditorProps = {
    document: resumeDocument,
    issues: resumeIssues,
    ...overrides,
  }
  render(<ResumeInlineEditor {...props} />)
  return props
}

describe('ResumeInlineEditor', () => {
  it("shows each section's issues on its Fix button, with no score strip", () => {
    renderEditor()
    expect(screen.queryByText('Urgent fix')).not.toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Summary' })).getByRole('button', { name: 'Fix 1 critical' })).toHaveTextContent('Fix')
    expect(within(screen.getByRole('region', { name: 'Skills' })).getByRole('button', { name: 'Fix 1 urgent' })).toBeInTheDocument()
  })

  it('offers a rewrite on Fix and applies it on Accept', async () => {
    const user = userEvent.setup()
    renderEditor()
    const summary = within(screen.getByRole('region', { name: 'Summary' }))
    await user.click(summary.getByRole('button', { name: 'Fix 1 critical' }))
    expect(summary.getByRole('button', { name: 'Close 1 critical' })).toHaveAttribute('aria-expanded', 'true')
    expect(summary.getByText('Suggested summary')).toBeInTheDocument()
    await user.click(summary.getByRole('button', { name: 'Accept' }))

    expect(screen.getByRole('textbox', { name: 'Summary' })).toHaveValue(resumeDocument.improvedSummary)
    expect(summary.queryByRole('button', { name: /^(Fix|Close)/ })).not.toBeInTheDocument()
  })

  it('adds, removes and reorders skills within a group', async () => {
    const user = userEvent.setup()
    renderEditor()
    await user.type(screen.getByRole('textbox', { name: 'Add skill to Core skills' }), 'Amplitude{Enter}')
    const group = () => within(screen.getByRole('list', { name: 'Core skills' }))
    expect(group().getByText('Amplitude')).toBeInTheDocument()

    const first = resumeDocument.skills[0] ?? ''
    fireEvent.keyDown(screen.getByRole('button', { name: `Move ${first}. Use the arrow keys.` }), { key: 'ArrowRight' })
    expect(screen.getByRole('status')).toHaveTextContent(`${first} moved to position 2`)

    await user.click(screen.getByRole('button', { name: 'Remove Amplitude' }))
    expect(group().queryByText('Amplitude')).not.toBeInTheDocument()
  })

  it('collapses a section and adds items to the standard ones', async () => {
    const user = userEvent.setup()
    renderEditor()
    const toggle = screen.getByRole('button', { name: 'Projects' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('resume-body-projects')).not.toBeVisible()

    const before = screen.getAllByRole('textbox', { name: /^Company, role/ }).length
    await user.click(screen.getByRole('button', { name: 'Add experience' }))
    expect(screen.getAllByRole('textbox', { name: /^Company, role/ })).toHaveLength(before + 1)
    expect(screen.getByRole('button', { name: 'Add education' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Add language' })).toBeInTheDocument()
  })

  it('reorders sections from the keyboard', () => {
    renderEditor()
    fireEvent.keyDown(screen.getByRole('button', { name: /Move Skills/ }), { key: 'ArrowUp' })
    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings.slice(0, 3)).toEqual(['Summary', 'Skills', 'Experience'])
    expect(screen.getByRole('status')).toHaveTextContent('Skills moved to position 2 of 7.')
  })

  it('shows a pending Chat rewrite in place, and keeps it once accepted', () => {
    const { rerender } = render(<ResumeInlineEditor document={resumeDocument} issues={[]} pendingSuggestion />)
    const summaries = screen.getAllByRole('textbox', { name: 'Summary' })
    expect(summaries.at(-1)).toHaveValue(resumeDocument.improvedSummary)
    expect(summaries.at(-1)).toHaveAttribute('readonly')

    rerender(<ResumeInlineEditor document={resumeDocument} issues={[]} acceptedSuggestion />)
    expect(screen.getAllByRole('textbox', { name: 'Summary' }).at(-1)).toHaveValue(resumeDocument.improvedSummary)
    expect(screen.getAllByRole('textbox', { name: 'Summary' }).at(-1)).not.toHaveAttribute('readonly')
  })

  it('fills an empty bullet from Suggest for me, and never offers the same one twice', async () => {
    const user = userEvent.setup()
    renderEditor()
    const role = resumeDocument.roles[0]
    const experience = screen.getByRole('region', { name: 'Experience' })
    await user.click(within(experience).getAllByRole('button', { name: 'Bullet point' })[0]!)
    const empty = within(experience).getByRole('textbox', { name: `Bullet ${role!.bullets.length + 1}, ${role!.company}` })
    await user.click(within(experience).getAllByRole('button', { name: 'Suggest for me' })[0]!)
    expect(empty).toHaveValue(resumeDocument.suggestedBullets![0])
    await user.click(within(experience).getAllByRole('button', { name: 'Suggest for me' })[0]!)
    expect(within(experience).getByRole('textbox', { name: `Bullet ${role!.bullets.length + 2}, ${role!.company}` })).toHaveValue(resumeDocument.suggestedBullets![1])
  })
})
