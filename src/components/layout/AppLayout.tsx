import { useState } from 'react'
import Sidebar, { MobileSidebar } from './Sidebar'
import TopNav from './TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen overflow-hidden bg-background md:h-screen">
      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-white px-4 pt-6 sm:px-6 sm:py-8 pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}