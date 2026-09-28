import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { ResumeCompare } from './resume-compare'

describe('ResumeCompare', () => {
  it('wipes the newer page in and speaks how much of it shows', () => {
    const onRevealChange = vi.fn()
    render(<ResumeCompare before={<p>Old summary</p>} after={<p>New summary</p>} beforeLabel="Your original" afterLabel="Now" sliderLabel="Show your edited resume" onRevealChange={onRevealChange} />)
    const slider = screen.getByRole('slider', { name: 'Show your edited resume' })
    expect(slider).toHaveAttribute('aria-valuetext', '50% of Now shown')
    fireEvent.change(slider, { target: { value: '100' } })
    expect(onRevealChange).toHaveBeenCalledWith(100)
    expect(slider).toHaveAttribute('aria-valuetext', 'Now fully shown')
  })
})
