import { useState } from 'react'
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react'

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

/**
 * The phone menu. A full-page sheet rather than a dropdown: the inline links are hidden
 * below 900px and so is the download trigger, so everything the nav offers has to live
 * here, and that is more than a popup anchored to a 44px button wants to hold.
 */
function NavSheet({ onClose }: { readonly onClose: () => void }) {
  return <div className="landing-nav-sheet" role="dialog" aria-modal="true" aria-label="Menu">
    <div className="landing-nav-sheet-bar">
      <a href="/" aria-label="Jobwhisper home"><img src="/landing-logo.svg" alt="" className="landing-nav-logo" /></a>
      <button type="button" aria-label="Close menu" onClick={onClose}><X aria-hidden="true" /></button>
    </div>
    <nav className="landing-nav-sheet-links" aria-label="Menu">
      <a href={FEATURES_HREF} onClick={onClose}>Features</a>
      <a href="/pricing" onClick={onClose}>Pricing</a>
      <a href={FAQ_HREF} onClick={onClose}>FAQ</a>
    </nav>
    <p className="landing-nav-sheet-label">Download</p>
    <div className="landing-nav-sheet-downloads">
      {downloadItems.map((item) => <a key={item.id} href={item.href} onClick={onClose}><img src={item.imageSrc} alt="" /><span>{item.support}</span></a>)}
    </div>
    <a className="landing-nav-sheet-cta" href="/v3/auth/sign-in">Log in</a>
  </div>
}

// Plain anchors rather than navigate() calls: the nav then needs no Router context, so it
// renders in any page's tests, and the links can be middle-clicked or opened in a new tab.
export function MarketingNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return <>
    <nav className="landing-nav" aria-label="Main navigation"><a className="landing-nav-home" href="/" aria-label="Jobwhisper home"><img src="/landing-logo.svg" alt="" className="landing-nav-logo" /></a><div className="landing-nav-links"><a href={FEATURES_HREF}>Features <ChevronDown aria-hidden="true" /></a><a href="/pricing">Pricing</a><a href={FAQ_HREF}>FAQ</a></div><div className="landing-nav-actions"><DownloadMenu compact /><a className="landing-nav-auth" href="/v3/auth/sign-in">Log in</a><button type="button" className="landing-nav-menu" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><MenuIcon aria-hidden="true" /></button></div></nav>
    {menuOpen ? <NavSheet onClose={() => setMenuOpen(false)} /> : null}
  </>
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
