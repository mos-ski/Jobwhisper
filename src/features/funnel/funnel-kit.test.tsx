import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { FunnelQuestion } from './funnel-question'
import { FunnelShell } from './funnel-shell'

const options: FunnelQuestionData = {
  id: 'timing',
  tab: 'Timing',
  ask: 'How soon are you looking to start?',
  kind: 'options',
  options: [
    { label: 'Right away', hint: 'I could start within a fortnight.' },
    { label: 'Within a month', hint: 'I have notice to work, or a date in mind.' },
  ],
}

describe('FunnelShell', () => {
  it('names the step, reports progress, and closes on Escape or the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<FunnelShell label="Timing" progress={0.25} onClose={onClose}><p>Body</p></FunnelShell>)

    expect(screen.getByText('Timing')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Setup progress' })).toHaveAttribute('aria-valuenow', '25')

    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Leave setup' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('pins itself to the light palette, so a dark app session cannot repaint the funnel', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<FunnelShell label="Timing" progress={0.25} onClose={() => {}}><p>Body</p></FunnelShell>)

    // The funnel is the public website. Dark mode is the web app's preference, so the
    // whole subtree restates the light tokens rather than inheriting dark ones.
    const shell = screen.getByText('Body').closest('[data-slot="funnel-shell"]')
    expect(shell).toHaveAttribute('data-theme', 'light')
  })
})

describe('FunnelQuestion', () => {
  it('asks option questions as a radio group', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FunnelQuestion question={options} value="" onChange={onChange} />)

    expect(screen.getByRole('heading', { level: 1, name: options.ask })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: options.ask })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /Within a month/ }))
    expect(onChange).toHaveBeenCalledWith('Within a month')
  })

  it('marks the chosen pill with more than colour', () => {
    const pills: FunnelQuestionData = { id: 'source', tab: 'About you', ask: 'How did you hear about us?', kind: 'pills', choices: ['Search', 'A friend'] }
    render(<FunnelQuestion question={pills} value="A friend" onChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'A friend' })).toBeChecked()
    expect(screen.getByTestId('funnel-pill-check')).toBeInTheDocument()
  })

  it('labels a text answer with its question', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const text: FunnelQuestionData = { id: 'title', tab: 'Title', ask: 'What job title are you going for?', kind: 'text', placeholder: 'e.g. Senior Product Designer' }
    render(<FunnelQuestion question={text} value="" onChange={onChange} />)

    await user.type(screen.getByRole('textbox', { name: text.ask }), 'D')
    expect(onChange).toHaveBeenCalledWith('D')
  })
})
