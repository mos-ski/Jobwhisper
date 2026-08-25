import { cn } from '@/lib/utils'

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile: full-screen native feel */}
      <div className="flex h-screen flex-col md:hidden">
        {children}
      </div>
      {/* Desktop: phone mockup */}
      <div
        className="hidden min-h-screen items-center justify-center p-6 md:flex"
        style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 50%, #eef2ff 100%)' }}
      >
        <div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[48px] border-[6px] border-neutral-900 bg-white shadow-2xl">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-neutral-900" />
          {/* Status bar */}
          <div className="flex h-12 flex-shrink-0 items-center justify-between px-7 pt-2 text-xs font-medium text-neutral-900">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="h-3 w-6 rounded-sm border border-neutral-900" />
            </div>
          </div>
          {/* Screen content */}
          <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
          {/* Home indicator */}
          <div className="flex h-8 flex-shrink-0 items-center justify-center">
            <div className="h-1 w-32 rounded-full bg-neutral-900" />
          </div>
        </div>
      </div>
    </>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        on ? 'bg-[#2563EB]' : 'bg-neutral-300'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
