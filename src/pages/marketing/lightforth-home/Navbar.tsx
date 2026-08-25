import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  {
    label: 'Solutions',
    children: [
      { label: 'AI Resume Builder', href: '/resume' },
      { label: 'AI Auto Apply', href: '/auto-apply' },
      { label: 'AI Interview Prep', href: '/interview-prep' },
      { label: 'AI Copilot', href: '/co-pilot' },
      { label: 'ATS Checker', href: '/ats-checker' },
    ],
  },
  {
    label: 'Product',
    children: [
      { label: 'Watch Demo', href: 'https://youtube.com/playlist?list=PL53nAg9VnMz38WxJIAB3XVW6rKm9ioYJ2&feature=shared' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Vision Board', href: '/vision-board' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Blog', href: 'https://blog.lightforth.org/' },
      { label: 'Guides', href: 'https://youtube.com/playlist?list=PL53nAg9VnMz38WxJIAB3XVW6rKm9ioYJ2&feature=shared' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
]

export function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lightforth-home/images/lightforth-logo-2.svg" alt="Lightforth" className="h-7 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((nav) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(nav.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#0494fc]">
                {nav.label}
                <svg className={`h-3 w-3 transition-transform ${openDropdown === nav.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openDropdown === nav.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-lg"
                  >
                    {nav.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0494fc]"
                        target={child.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                      >
                        {child.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <a href="/pricing" className="text-sm font-medium text-slate-700 hover:text-[#0494fc]">
            Pricing
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/v3/auth/sign-in" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Login
          </a>
          <button
            onClick={onGetStarted}
            className="rounded-full bg-[#0494fc] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0380e0]"
          >
            Get Started
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((nav) => (
                <div key={nav.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === nav.label ? null : nav.label)}
                    className="flex w-full items-center justify-between py-2 text-sm font-medium text-slate-700"
                  >
                    {nav.label}
                    <svg className={`h-3 w-3 transition-transform ${openDropdown === nav.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === nav.label && (
                    <div className="ml-4 space-y-1">
                      {nav.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block py-1.5 text-sm text-slate-500 hover:text-[#0494fc]"
                          target={child.href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="/pricing" className="block py-2 text-sm font-medium text-slate-700">
                Pricing
              </a>
              <div className="flex gap-3 pt-2">
                <a href="/v3/auth/sign-in" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700">
                  Login
                </a>
                <button onClick={onGetStarted} className="rounded-full bg-[#0494fc] px-5 py-2 text-sm font-semibold text-white">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
