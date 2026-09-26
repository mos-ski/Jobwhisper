import { fireEvent, render, screen } from '@testing-library/react'
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
    render(<FunnelShell label="Timing" stepCount={4} currentStep={1} onClose={onClose}><p>Body</p></FunnelShell>)

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

    await user.type(screen.getByRole('combobox', { name: text.ask }), 'D')
    expect(onChange).toHaveBeenCalledWith('D')
  })

  it('picks an answer from its letter key', () => {
    const onChange = vi.fn()
    render(<FunnelQuestion question={options} value="" onChange={onChange} />)
    fireEvent.keyDown(window, { key: 'b' })
    expect(onChange).toHaveBeenCalledWith('Within a month')
  })

  it('moves on the moment a choice is picked', () => {
    const onChange = vi.fn()
    const onAutoAdvance = vi.fn()
    render(<FunnelQuestion question={options} value="" onChange={onChange} onAutoAdvance={onAutoAdvance} />)
    fireEvent.click(screen.getByRole('radio', { name: /Right away/ }))
    expect(onChange).toHaveBeenCalledWith('Right away')
    expect(onAutoAdvance).toHaveBeenCalledTimes(1)
  })

  it('submits a typed answer with Enter', () => {
    const onAutoAdvance = vi.fn()
    const text: FunnelQuestionData = { id: 'title', tab: 'Title', ask: 'What job title are you going for?', kind: 'text', placeholder: '' }
    render(<FunnelQuestion question={text} value="Designer" onChange={() => {}} onAutoAdvance={onAutoAdvance} />)
    fireEvent.submit(screen.getByRole('combobox', { name: text.ask }))
    expect(onAutoAdvance).toHaveBeenCalled()
  })

  it('offers matching suggestions as you type and moves on when one is picked', () => {
    const onChange = vi.fn()
    const onAutoAdvance = vi.fn()
    const text: FunnelQuestionData = { id: 'role', tab: 'Role', ask: 'What role do you want next?', kind: 'text', placeholder: '', suggestions: ['Product Manager', 'Product Designer', 'Data Analyst'] }
    render(<FunnelQuestion question={text} value="prod" onChange={onChange} onAutoAdvance={onAutoAdvance} />)

    const input = screen.getByRole('combobox', { name: text.ask })
    fireEvent.focus(input)
    const list = screen.getByRole('listbox')
    expect(list).toBeVisible()
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Product Manager', 'Product Designer'])

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenLastCalledWith('Product Designer')
    expect(onAutoAdvance).toHaveBeenCalledTimes(1)
  })

  it('answers in one click from a popular pick', () => {
    const onChange = vi.fn()
    const onAutoAdvance = vi.fn()
    const text: FunnelQuestionData = { id: 'role', tab: 'Role', ask: 'What role do you want next?', kind: 'text', placeholder: '', suggestions: ['Product Manager', 'Data Analyst'] }
    render(<FunnelQuestion question={text} value="" onChange={onChange} onAutoAdvance={onAutoAdvance} />)

    fireEvent.click(screen.getByRole('button', { name: 'Data Analyst' }))
    expect(onChange).toHaveBeenCalledWith('Data Analyst')
    expect(onAutoAdvance).toHaveBeenCalled()
  })

  it('closes the suggestions on Escape without leaving the funnel', () => {
    const onClose = vi.fn()
    const text: FunnelQuestionData = { id: 'role', tab: 'Role', ask: 'What role do you want next?', kind: 'text', placeholder: '', suggestions: ['Product Manager'] }
    render(<FunnelShell label="Role" stepCount={2} currentStep={1} onClose={onClose}><FunnelQuestion question={text} value="prod" onChange={() => {}} /></FunnelShell>)

    const input = screen.getByRole('combobox', { name: text.ask })
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('asks salary as a two-handle range that starts answered', () => {
    const onChange = vi.fn()
    const salary: FunnelQuestionData = { id: 'salary', tab: 'Salary', ask: 'What base salary are you aiming for?', kind: 'range', min: 30000, max: 250000, step: 5000, defaultRange: [80000, 130000] }
    const { rerender } = render(<FunnelQuestion question={salary} value="" onChange={onChange} />)

    expect(onChange).toHaveBeenCalledWith('80000-130000')
    rerender(<FunnelQuestion question={salary} value="80000-250000" onChange={onChange} />)
    expect(screen.getByText('$250k+')).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Minimum salary' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Maximum salary' })).toHaveAttribute('aria-valuetext', '$250,000 or more a year')
  })
})
