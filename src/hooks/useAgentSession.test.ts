// src/hooks/useAgentSession.test.ts
import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAgentSession } from './useAgentSession'

describe('useAgentSession', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns initial session with 2 seed events and 4 agents', () => {
    const { result } = renderHook(() => useAgentSession('1'))
    expect(result.current.events).toHaveLength(2)
    expect(result.current.agents).toHaveLength(4)
    expect(result.current.stats).toEqual({ found: 0, matched: 0, tailored: 0, applied: 0 })
  })

  it('appends a new event after 4 seconds', () => {
    const { result } = renderHook(() => useAgentSession('1'))
    act(() => { vi.advanceTimersByTime(4000) })
    expect(result.current.events.length).toBeGreaterThan(2)
  })

  it('updates found stat when scout fires', () => {
    const { result } = renderHook(() => useAgentSession('1'))
    act(() => { vi.advanceTimersByTime(4000) })
    expect(result.current.stats.found).toBeGreaterThan(0)
  })
})
