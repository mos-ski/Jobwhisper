// src/lib/api.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TOKEN_KEY } from './api'

describe('TOKEN_KEY', () => {
  it('is the string lf_token', () => {
    expect(TOKEN_KEY).toBe('lf_token')
  })
})

describe('localStorage integration', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('stores and retrieves a token under TOKEN_KEY', () => {
    localStorage.setItem(TOKEN_KEY, 'abc123')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('abc123')
  })

  it('returns null when no token is stored', () => {
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })
})
