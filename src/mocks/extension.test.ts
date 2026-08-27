import { describe, it, expect } from 'vitest'
import { extensionJobBoards } from './extension'

describe('extensionJobBoards', () => {
  it('includes all three connection states', () => {
    const states = extensionJobBoards.map((board) => board.state)
    expect(states).toContain('start')
    expect(states).toContain('connect')
    expect(states).toContain('in-progress')
  })

  it('has unique board ids', () => {
    const ids = extensionJobBoards.map((board) => board.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
