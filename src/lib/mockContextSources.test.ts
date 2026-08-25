import { describe, it, expect } from 'vitest'
import { MOCK_CONTEXT_SOURCES } from './mockContextSources'

describe('MOCK_CONTEXT_SOURCES', () => {
  it('has at least one entry, each with id/name/type', () => {
    expect(MOCK_CONTEXT_SOURCES.length).toBeGreaterThan(0)
    for (const src of MOCK_CONTEXT_SOURCES) {
      expect(typeof src.id).toBe('string')
      expect(typeof src.name).toBe('string')
      expect(typeof src.type).toBe('string')
    }
  })
})
