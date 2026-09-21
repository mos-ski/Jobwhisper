import { ChevronDown, Menu as MenuIcon } from 'lucide-react'

import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/ui'
import { downloadItems } from '@/mocks/account'

// The public pages had three different navigations between them — the landing page's dark
// pill, a white one on pricing carrying a "Help Center" link nothing else had, and a third
// on the product pages — so this is the one both the landing page and the rest now use.
// It carries the landing page's stylesheet with it, since that is where these classes live.
import '@/apps/web/pages/landing-page.css'

/** Absolute so they still resolve from /pricing and /products/*, not just from home. */
const FEATURES_HREF = '/#features'
const FAQ_HREF = '/#faq'

export function DownloadMenu({ compact = false }: { readonly compact?: boolean }) {
  return <Menu><MenuTrigger render={<button className={compact ? 'landing-nav-download' : 'landing-primary-button'} aria-label={compact ? 'Download' : undefined} />}>
    {compact ? null : <span>Download Now</span>}
    {compact ? <><span>Download</span><ChevronDown aria-hidden="true" /></> : <span className="landing-platform-icons" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span>}
  </MenuTrigger><MenuContent align="end" sideOffset={8} className="landing-download-menu">{downloadItems.map((item) => <MenuItem key={item.id} render={<a href={item.href} className="landing-download-item" />}><img src={item.imageSrc} alt="" /><span>{item.support}</span></MenuItem>)}</MenuContent></Menu>
}

/** The inline Features/Pricing/FAQ links are hidden below 900px, so the same destinations
 *  move into this menu rather than being unreachable from a phone. */
function NavLinksMenu() {
  return <Menu><MenuTrigger render={<button className="landing-nav-menu" aria-label="Open menu" />}><MenuIcon aria-hidden="true" /></MenuTrigger><MenuContent align="end" className="landing-download-menu">
    <MenuItem className="landing-download-item"><a href={FEATURES_HREF}>Features</a></MenuItem>
    <MenuItem className="landing-download-item"><a href="/pricing">Pricing</a></MenuItem>
    <MenuItem className="landing-download-item"><a href={FAQ_HREF}>FAQ</a></MenuItem>
  </MenuContent></Menu>
}

// Plain anchors rather than navigate() calls: the nav then needs no Router context, so it
// renders in any page's tests, and the links can be middle-clicked or opened in a new tab.
export function MarketingNav() {
  return <nav className="landing-nav" aria-label="Main navigation"><a href="/" aria-label="Jobwhisper home"><img src="/landing-logo.svg" alt="" className="landing-nav-logo" /></a><div className="landing-nav-links"><a href={FEATURES_HREF}>Features <ChevronDown aria-hidden="true" /></a><a href="/pricing">Pricing</a><a href={FAQ_HREF}>FAQ</a></div><div className="landing-nav-actions"><DownloadMenu compact /><a className="landing-nav-auth" href="/v3/auth/sign-in">Log in</a><NavLinksMenu /></div></nav>
}

/** [label, href]. '#' where the page does not exist yet. */
const FOOTER_PRODUCT = [
  ['AI Resume Builder', '/products/resume-builder'],
  ['Interview Copilot', '/products/interview-copilot'],
  ['Interview Prep', '/products/interview-prep'],
  ['Auto Apply', '/products/auto-apply'],
  ['Pricing', '/pricing'],
  ['FAQ', FAQ_HREF],
] as const

const FOOTER_DOWNLOAD = [
  ['Download Extension', '/v3/downloads'],
  ['Download for Mac', '/v3/downloads'],
  ['Download for Windows', '/v3/downloads'],
  ['Download for Linux', '/v3/downloads'],
] as const

const FOOTER_COMPANY = [
  ['Contact', '#'],
  ['Help center', '/help'],
  ['LinkedIn', '#'],
  ['Twitter', '#'],
  ['TikTok', '#'],
  ['Instagram', '#'],
] as const

export function MarketingFooter() {
  const links = (items: readonly (readonly [string, string])[]) => items.map(([label, href]) => <a href={href} key={label}>{label}</a>)
  return <footer className="landing-footer">
    <div className="landing-footer-inner">
      <div className="landing-footer-brand">
        <img className="landing-footer-logo" src="/figma-landing/footer-logo.svg" alt="Jobwhisper" />
        <p>From job search to job offer, with the right support at every step.</p>
      </div>
      <nav className="landing-footer-links" aria-label="Footer navigation">
        <div className="landing-footer-column">{links(FOOTER_PRODUCT)}</div>
        <div className="landing-footer-column">{links(FOOTER_DOWNLOAD)}</div>
        <div className="landing-footer-column">{links(FOOTER_COMPANY)}</div>
      </nav>
      <div className="landing-footer-meta">
        <span>© Jobwhisper 2026</span>
        <div><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a></div>
      </div>
    </div>
  </footer>
}
