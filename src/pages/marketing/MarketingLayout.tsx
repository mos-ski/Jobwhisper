import { Navbar } from '@/pages/marketing/lightforth-home/Navbar'
import { Footer } from '@/pages/marketing/lightforth-home/Footer'

function scrollToPricing() {
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onGetStarted={scrollToPricing} />
      {children}
      <Footer />
    </div>
  )
}
