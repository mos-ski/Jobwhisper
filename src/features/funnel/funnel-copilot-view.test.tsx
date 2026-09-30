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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Pass your next interview with an answer ready when you need it')
    expect(screen.getByText(/drafts a tailored answer in real time using your resume and the job description/)).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Job seeker results' })).not.toBeInTheDocument()
  })
})
