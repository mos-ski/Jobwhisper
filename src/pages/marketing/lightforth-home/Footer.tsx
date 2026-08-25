import { Link } from 'react-router-dom'

const footerLinks = {
  products: [
    { label: 'Watch Demo', href: 'https://youtube.com/playlist?list=PL53nAg9VnMz38WxJIAB3XVW6rKm9ioYJ2&feature=shared' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Vision Board', href: '/vision-board' },
  ],
  partner: [
    { label: 'Refer with Friends', href: '#' },
    { label: 'Become a Partner', href: 'https://partners.lightforth.org' },
  ],
  solutions: [
    { label: 'AI Resume Builder', href: '/resume' },
    { label: 'AI Auto Apply', href: '/auto-apply' },
    { label: 'AI Cover letter', href: '/resume' },
    { label: 'AI Copilot', href: '/co-pilot' },
    { label: 'ATS Checker', href: '/ats-checker' },
    { label: 'AI Interview Prep', href: '/interview-prep' },
  ],
  social: [
    { label: 'Twitter', href: 'https://twitter.com/joinLightforth' },
    { label: 'Instagram', href: 'https://www.instagram.com/iamlightforth/' },
    { label: 'Tiktok', href: 'https://www.tiktok.com/@lightforth' },
    { label: 'Facebook', href: 'https://m.facebook.com/Lightforth.org' },
    { label: 'Youtube', href: 'https://youtube.com/@iamlightforth' },
  ],
  resources: [
    { label: 'Blog', href: 'https://blog.lightforth.org/' },
    { label: 'Guides', href: 'https://youtube.com/playlist?list=PL53nAg9VnMz38WxJIAB3XVW6rKm9ioYJ2&feature=shared' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Privacy & Terms', href: '/privacy-policy' },
  ],
  company: [
    { label: 'Jobs', href: '/career' },
    { label: 'Vision Board', href: '/vision-board' },
  ],
  support: [
    { label: 'Help Center', href: 'https://help.lightforth.org' },
    { label: 'Contact Sales', href: '/contact-us' },
    { label: 'Support Center', href: '/contact-us' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0A2A60] py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src="/lightforth-home/images/lightforth-logo-2.svg" alt="Lightforth" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400">
              14160 N Dallas Parkway, Suite 760
              <br />
              Dallas TX 75254
            </p>
            <a href="mailto:support@lightforth.org" className="block text-sm text-gray-400 hover:text-white">
              support@lightforth.org
            </a>
            <p className="text-xs text-gray-500">© 2025 Lightforth, Inc.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Partner With US</h3>
            <ul className="space-y-2">
              {footerLinks.partner.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Follow Us</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
