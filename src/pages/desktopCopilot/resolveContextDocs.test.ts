import { describe, it, expect, beforeEach } from 'vitest'
import { resolveContextDocs } from './resolveContextDocs'
import { setAccount } from './mockAccounts'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

describe('resolveContextDocs', () => {
  beforeEach(() => localStorage.clear())

  it('returns the personal Context library for a regular account', () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    const docs = resolveContextDocs('me@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns the personal Context library when there is no account on record', () => {
    const docs = resolveContextDocs('nobody@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })
})
