import { Bell } from 'lucide-react'

export function NotificationsPromptScreen({ onEnable, onSkip }: { onEnable: () => void; onSkip: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
        <Bell size={32} />
        <span className="absolute right-2 top-2 h-4 w-4 rounded-full bg-red-500" />
      </span>
      <h1 className="mt-6 text-xl font-bold text-neutral-900">Stay in the loop</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        Get notified when you get matches, interviews, and application updates.
      </p>
      <button
        onClick={onEnable}
        className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
      >
        Enable notifications
      </button>
      <button
        onClick={onSkip}
        className="mt-3 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
      >
        Maybe later
      </button>
    </div>
  )
}
