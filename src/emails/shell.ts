import { jobwhisperTokens } from '@/tokens/tokens'

// Real email markup stays table-based with inline styles for client portability.

const colors = jobwhisperTokens.light

export const brand = {
  accent: colors.accent,
  accentHover: colors.accentHover,
  ink: colors.paperInk,
  muted: colors.paperMuted,
  white: colors.surface,
  soft: colors.surfaceSubtle,
  line: colors.border,
  positive: colors.positive,
  positiveSurface: colors.positiveSurface,
  warning: colors.warning,
  warningSurface: colors.warningSurface,
  danger: colors.danger,
  dangerSurface: colors.dangerSurface,
  onAccent: colors.onAccent,
} as const

export const FONT = "'Rethink Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
export const DISPLAY_FONT = "'Gowun Batang',Georgia,'Times New Roman',serif"

type EmailShellOptions = { title: string; previewText: string; bodyHtml: string; recipient?: string }

export function renderEmailShell({ title, previewText, bodyHtml, recipient = 'ada@example.com' }: EmailShellOptions): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400&family=Rethink+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
@media only screen and (max-width: 680px) {
  .email-stage { padding: 32px 12px 48px !important; }
  .email-wrapper { width: 100% !important; }
  .email-logo-space { height: 112px !important; }
  .email-card { width: 100% !important; }
  .email-content { padding: 24px !important; }
  .email-greeting { font-size: 48px !important; line-height: 54px !important; letter-spacing: -2px !important; }
  .email-body { font-size: 18px !important; line-height: 28px !important; }
  .email-button-cell, .email-button { width: 100% !important; }
  .email-detail-label, .email-detail-value { display: block !important; width: 100% !important; text-align: left !important; }
  .email-detail-value { padding-top: 2px !important; }
  .email-code-gap { padding: 0 2px !important; }
  .email-code-box { width: 40px !important; }
  .email-code-cell { width: 40px !important; height: 50px !important; font-size: 32px !important; line-height: 40px !important; }
}
</style></head>
<body style="margin:0;padding:0;background-color:${brand.accent};"><div style="display:none;font-size:1px;color:${brand.accent};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(previewText)}&zwnj;&nbsp;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:${brand.accent};"><tr><td class="email-stage" align="center" style="padding:0 24px 64px;">
<table class="email-wrapper" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;"><tr><td class="email-logo-space" align="center" valign="middle" style="height:215px;"><img src="/Jobwhisper/Logo%20wordmark%20W.svg" width="265" height="52" alt="Jobwhisper" style="display:block;width:265px;height:52px;border:0;"></td></tr>
<tr><td class="email-card" style="width:640px;background-color:${brand.white};border-radius:20px;overflow:hidden;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="email-content" style="padding:32px 32px 0;font-family:${FONT};color:${brand.ink};">${bodyHtml}</td></tr>
<tr><td class="email-content" style="padding:32px;font-family:${DISPLAY_FONT};color:${brand.muted};"><p style="margin:0 0 24px;font-size:16px;line-height:24px;color:${brand.muted};">This email was sent to ${escapeHtml(recipient)}. If you&rsquo;d rather not receive this kind of email, you can <a href="#" style="color:${brand.muted};text-decoration:underline;">unsubscribe</a> or <a href="#" style="color:${brand.muted};text-decoration:underline;">manage your email preferences</a>.<br>&copy; 2026 Jobwhisper. All rights reserved.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 8px;"><a href="#" aria-label="X"><img src="/email-assets/social-x.svg" width="20" height="20" alt="" style="display:block;width:20px;height:20px;border:0;"></a></td><td style="padding:0 8px;"><a href="#" aria-label="Facebook"><img src="/email-assets/social-facebook.svg" width="20" height="20" alt="" style="display:block;width:20px;height:20px;border:0;"></a></td><td style="padding:0 8px;"><a href="#" aria-label="Instagram"><img src="/email-assets/social-instagram.svg" width="20" height="20" alt="" style="display:block;width:20px;height:20px;border:0;"></a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`
}

export function escapeHtml(value: string): string { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') }
export function heading(text: string): string { return `<h1 style="margin:32px 0 16px;font-family:${DISPLAY_FONT};font-size:34px;line-height:42px;font-weight:400;letter-spacing:-1px;color:${brand.ink};">${escapeHtml(text)}</h1>` }
export function greeting(name: string): string { return `<p class="email-greeting" style="margin:0;font-family:${DISPLAY_FONT};font-size:70px;line-height:78px;font-weight:400;letter-spacing:-3.5px;color:${brand.ink};">Hi ${escapeHtml(name)},</p>` }
export function paragraph(html: string, opts?: { muted?: boolean; marginBottom?: number }): string { const color = opts?.muted ? brand.muted : brand.ink; const marginBottom = opts?.marginBottom ?? 24; return `<p class="email-body" style="margin:0 0 ${marginBottom}px;font-family:${FONT};font-size:20px;line-height:30px;font-weight:400;color:${color};">${html}</p>` }
export function button(href: string, label: string): string { return `<table class="email-button" role="presentation" width="280" cellpadding="0" cellspacing="0" border="0" style="width:280px;margin:24px 0;"><tr><td class="email-button-cell" align="center" style="width:280px;border-radius:6px;background-color:${brand.accent};"><a href="${escapeHtml(href)}" style="display:block;padding:12px 20px;font-family:${FONT};font-size:14px;line-height:22px;font-weight:600;color:${brand.onAccent};text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a></td></tr></table>` }
export function divider(): string { return `<hr style="border:0;border-top:1px solid ${brand.line};margin:32px 0;">` }
export function infoTable(rows: Array<[string, string]>): string { const rowsHtml = rows.map(([label, value], index) => `<tr><td class="email-detail-label" style="padding:14px 16px;font-family:${FONT};font-size:14px;line-height:21px;color:${brand.muted};${index > 0 ? `border-top:1px solid ${brand.line};` : ''}">${escapeHtml(label)}</td><td class="email-detail-value" align="right" style="padding:14px 16px;font-family:${FONT};font-size:14px;line-height:21px;font-weight:600;color:${brand.ink};${index > 0 ? `border-top:1px solid ${brand.line};` : ''}">${value}</td></tr>`).join(''); return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background-color:${brand.soft};border-radius:10px;">${rowsHtml}</table>` }
export function pill(text: string, tone: 'live' | 'positive' | 'neutral' = 'neutral'): string { const background = tone === 'live' ? brand.dangerSurface : tone === 'positive' ? brand.positiveSurface : brand.soft; const color = tone === 'live' ? brand.danger : tone === 'positive' ? brand.positive : brand.muted; return `<span style="display:inline-block;padding:4px 10px;border-radius:9999px;background-color:${background};color:${color};font-family:${FONT};font-size:12px;line-height:18px;font-weight:600;">${escapeHtml(text)}</span>` }
export function verificationCode(code: string): string { const cells = [...code.replace(/\s/g, '')].map((character) => `<td class="email-code-gap" data-code-cell style="padding:0 3px;"><table class="email-code-box" role="presentation" width="48" cellpadding="0" cellspacing="0" border="0"><tr><td class="email-code-cell" align="center" valign="middle" style="width:48px;height:58px;border:2px solid ${brand.accent};border-radius:10px;font-family:${DISPLAY_FONT};font-size:38px;line-height:48px;color:${brand.ink};">${escapeHtml(character)}</td></tr></table></td>`).join(''); return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr>${cells}</tr></table>` }
