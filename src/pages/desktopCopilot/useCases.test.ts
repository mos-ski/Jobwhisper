import { describe, it, expect } from 'vitest'
import { USE_CASES, getUseCase } from './useCases'

describe('useCases config', () => {
  it('has all 3 use cases in order', () => {
    expect(USE_CASES.map(u => u.id)).toEqual(['interview', 'meeting', 'coding'])
  })

  it('marks interview and meeting as conversational with answer length', () => {
    for (const id of ['interview', 'meeting'] as const) {
      const config = getUseCase(id)
      expect(config.canvasPattern).toBe('conversational')
      expect(config.hasAnswerLength).toBe(true)
    }
  })

  it('marks coding as screenshot-qa without answer length', () => {
    const config = getUseCase('coding')
    expect(config.canvasPattern).toBe('screenshot-qa')
    expect(config.hasAnswerLength).toBe(false)
  })

  it('throws for an unknown use case id', () => {
    expect(() => getUseCase('unknown' as never)).toThrow('Unknown use case: unknown')
  })
})
