import { describe, expect, it } from 'vitest'

import { jobwhisperTokens } from '@/tokens/tokens'
import { EMAIL_CATALOG } from '../catalog'

describe('transactional email catalog', () => {
  it.each(EMAIL_CATALOG)('$label uses the shared Figma email system', (entry) => {
    const result = entry.build('Africa/Lagos')

    expect(result.subject.length).toBeGreaterThan(8)
    expect(result.previewText.length).toBeGreaterThan(8)
    expect(result.html).toContain('<!DOCTYPE html>')
    expect(result.html).toContain(`background-color:${jobwhisperTokens.light.accent}`)
    expect(result.html).toContain('class="email-card"')
    expect(result.html).toContain('class="email-greeting"')
    expect(result.html.match(/class="email-button"/g)).toHaveLength(1)
    expect(result.html).toContain('Thanks,<br>The Jobwhisper team')
    expect(result.html).not.toContain('figma.com/api/mcp/asset')
    expect(result.html).not.toContain('figma.com/api/mcp/asset')
    expect(result.html).not.toContain('Untitled UI')
    expect(result.html).not.toContain('border-left:4px solid')
    expect(result.html).not.toContain('>Security note<')
    expect(result.html).not.toContain('>Heads up<')
    expect(result.html).not.toContain('>Grace period<')
  })

  it('renders the sign-in code as six separate cells', () => {
    const entry = EMAIL_CATALOG.find((candidate) => candidate.slug === 'login-link')
    expect(entry).toBeDefined()

    const html = entry?.build('UTC').html ?? ''
    expect(html.match(/data-code-cell/g)).toHaveLength(6)
    expect(html).toContain('This code will only be valid for the next 15 minutes.')
  })


  it('keeps all eight intended transactional messages available', () => {
    expect(EMAIL_CATALOG.map((entry) => entry.slug)).toEqual([
      'login-link',
      'receipt',
      'payment-reminder',
      'payment-failed',
      'job-alert',
      'copilot-report',
      'interview-prep-report',
      'meeting-recap',
    ])
  })
})
