import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { FunnelCopilotView, type FunnelCopilotViewProps } from './funnel-copilot-view'

function renderView(overrides: Partial<FunnelCopilotViewProps> = {}) {
  const props: FunnelCopilotViewProps = {
    step: 'landing',
    role: '',
    dates: [{ value: '2026-09-30', weekday: 'Wed', month: 'Sep', day: '30' }],
    selectedDate: '2026-09-30',
    onDateChange: vi.fn(),
    onLandingContinue: vi.fn(),
    onRoleChange: vi.fn(),
    onRoleContinue: vi.fn(),
    onFile: vi.fn(),
    onUploadContinue: vi.fn(),
    onStageSelect: vi.fn(),
    onStartTrial: vi.fn(),
    ...overrides,
  }
  render(<FunnelCopilotView {...props} />)
  return props
}

describe('FunnelCopilotView', () => {
  it('explains the live interview outcome before setup', () => {
    renderView()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Pass Your Next Interview\.\s*Land the Job\. Or Don’t Pay!/)
    expect(screen.getByText(/drafts a tailored answer in real time using your resume and the job description/)).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Job seeker results' })).not.toBeInTheDocument()
  })

  it('uses a subtle selected state for the interview date', () => {
    renderView()

    const selectedDate = screen.getByRole('button', { name: 'Wed30Sep' })
    expect(selectedDate).toHaveAttribute('aria-pressed', 'true')
    expect(selectedDate).toHaveClass('aria-pressed:bg-accent-subtle', 'aria-pressed:text-accent-text')
    expect(selectedDate).not.toHaveClass('aria-pressed:bg-accent')
  })

  it('uses the large Figma CTA treatment for the interview action', () => {
    renderView()

    expect(screen.getByRole('button', { name: 'Ace my Interview' })).toHaveClass('min-h-[72px]', 'px-8', 'text-[26px]')
  })
})
