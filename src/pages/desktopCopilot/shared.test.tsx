// src/pages/desktopCopilot/shared.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { formatTime, MacWindow, Toggle } from './shared'

describe('formatTime', () => {
  it('formats seconds as mm:ss, zero-padded', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(5)).toBe('00:05')
  })
})

describe('MacWindow', () => {
  it('renders its children inside the window frame', () => {
    render(<MacWindow><p>Hello</p></MacWindow>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

describe('Toggle', () => {
  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<Toggle on={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
