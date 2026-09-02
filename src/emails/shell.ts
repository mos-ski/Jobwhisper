// Real, developer-handoff-ready email markup: table-based layout with inline styles
// only, since Gmail/Outlook/etc. strip <style> blocks and don't support flexbox/grid.
// Do not "clean this up" with Tailwind classes — it will break in real inboxes.

export const brand = {
  ink: '#1c1d20',
  inkSoft: '#232427',
  paper: '#f6f7fb',
  paperSoft: '#eceef4',
  paperLine: '#dcdfe6',
  textLight: '#14161c',
  mutedLight: '#5b6270',
  live: '#ef4444',
  positive: '#15803d',
  positiveSurface: '#ecfdf3',
  liveSurface: '#fdeceb',
} as const

const FONT = "'Rethink Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const DISPLAY_FONT = "'Gowun Batang',Georgia,'Times New Roman',serif"

// The logo <img> below points at a relative path so it resolves in this app's own
// preview. Before wiring real sending, swap it for an absolute HTTPS URL, and add a
// PNG fallback since Outlook desktop doesn't render SVG images in email.
export function renderEmailShell(opts: { title: string; previewText: string; bodyHtml: string }): string {
  const { title, previewText, bodyHtml } = opts
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Rethink+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${brand.paper};">
<div style="display:none;font-size:1px;color:${brand.paper};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
${escapeHtml(previewText)}
&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${brand.paper};">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr>
<td style="padding:28px 32px;border-bottom:1px solid ${brand.paperLine};">
<img src="/Jobwhisper/Logo%20wordmark%20B.svg" width="121" height="24" alt="Jobwhisper" style="display:block;height:24px;width:121px;border:0;">
</td>
</tr>
<tr>
<td style="padding:36px 32px;font-family:${FONT};color:${brand.textLight};">
${bodyHtml}
</td>
</tr>
<tr>
<td style="padding:24px 32px;background-color:${brand.paperSoft};font-family:${FONT};">
<p style="margin:0 0 6px;font-size:12px;line-height:18px;color:${brand.mutedLight};">
Jobwhisper &middot; AI Interview Copilot
</p>
<p style="margin:0;font-size:12px;line-height:18px;color:${brand.mutedLight};">
You're receiving this email because it relates to your Jobwhisper account.
<a href="#" style="color:${brand.mutedLight};text-decoration:underline;">Manage email preferences</a>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${DISPLAY_FONT};font-size:24px;line-height:30px;font-weight:700;color:${brand.ink};">${escapeHtml(text)}</h1>`
}

export function paragraph(html: string, opts?: { muted?: boolean; marginBottom?: number }): string {
  const color = opts?.muted ? brand.mutedLight : brand.textLight
  const mb = opts?.marginBottom ?? 16
  return `<p style="margin:0 0 ${mb}px;font-family:${FONT};font-size:15px;line-height:23px;color:${color};">${html}</p>`
}

export function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr>
<td style="border-radius:8px;background-color:${brand.ink};">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 28px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(label)}</a>
</td>
</tr>
</table>`
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${brand.paperLine};margin:24px 0;">`
}

export function infoTable(rows: Array<[string, string]>): string {
  const rowsHtml = rows
    .map(
      ([label, value], i) => `<tr>
<td style="padding:${i === 0 ? '0' : '10px'} 0 10px;font-family:${FONT};font-size:13px;color:${brand.mutedLight};${i > 0 ? `border-top:1px solid ${brand.paperLine};` : ''}">${escapeHtml(label)}</td>
<td align="right" style="padding:${i === 0 ? '0' : '10px'} 0 10px;font-family:${FONT};font-size:13px;font-weight:600;color:${brand.textLight};${i > 0 ? `border-top:1px solid ${brand.paperLine};` : ''}">${value}</td>
</tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">${rowsHtml}</table>`
}

export function calloutBox(html: string, tone: 'live' | 'positive' | 'neutral' = 'neutral'): string {
  const bg = tone === 'live' ? brand.liveSurface : tone === 'positive' ? brand.positiveSurface : brand.paperSoft
  const borderColor = tone === 'live' ? brand.live : tone === 'positive' ? brand.positive : brand.paperLine
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;background-color:${bg};border-left:3px solid ${borderColor};border-radius:4px;">
<tr><td style="padding:14px 16px;font-family:${FONT};font-size:14px;line-height:21px;color:${brand.textLight};">${html}</td></tr>
</table>`
}

export function pill(text: string, tone: 'live' | 'positive' | 'neutral' = 'neutral'): string {
  const bg = tone === 'live' ? brand.liveSurface : tone === 'positive' ? brand.positiveSurface : brand.paperSoft
  const color = tone === 'live' ? brand.live : tone === 'positive' ? brand.positive : brand.mutedLight
  return `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background-color:${bg};color:${color};font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;">${escapeHtml(text)}</span>`
}
