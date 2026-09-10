import { describe, expect, it } from 'vitest'

import { jobwhisperTokens } from '@/tokens/tokens'
import * as shell from './shell'

describe('email shell', () => {
  it('renders the Figma-derived responsive Jobwhisper frame', () => {
    const html = shell.renderEmailShell({
      title: 'Welcome',
      previewText: 'A useful preview',
      bodyHtml: '<p>Message</p>',
    })

    expect(html).toContain(`background-color:${jobwhisperTokens.light.accent}`)
    expect(html).toContain('width:640px;max-width:640px')
    expect(html).toContain('border-radius:20px')
    expect(html).toContain('@media only screen and (max-width: 680px)')
    expect(html).toContain('.email-wrapper { width: 100% !important; }')
    expect(html).toContain('.email-code-box { width: 40px !important; }')
    expect(html).toContain('/Jobwhisper/Logo%20wordmark%20W.svg')
    expect(html).toContain('/email-assets/social-x.svg')
    expect(html).toContain('/email-assets/social-facebook.svg')
    expect(html).toContain('/email-assets/social-instagram.svg')
    expect(html).toContain("'Gowun Batang'")
    expect(html).toContain("'Rethink Sans'")
    expect(html).not.toContain('figma.com/api/mcp/asset')
  })

  it('escapes personalized greeting text', () => {
    const greeting = (shell as Record<string, unknown>).greeting

    expect(typeof greeting).toBe('function')
    expect((greeting as (name: string) => string)('<Olivia & team>')).toContain('&lt;Olivia &amp; team&gt;')
  })

  it('renders one verification cell per digit and ignores formatting whitespace', () => {
    const verificationCode = (shell as Record<string, unknown>).verificationCode

    expect(typeof verificationCode).toBe('function')
    const html = (verificationCode as (code: string) => string)('482 917')

    expect(html.match(/data-code-cell/g)).toHaveLength(6)
    expect(html).toContain('>4<')
    expect(html).toContain('>7<')
  })
})
