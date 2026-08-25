import { Check } from 'lucide-react'

export function OnboardingCompleteScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <Check size={36} className="text-green-600" />
      </div>
      <h1 className="mt-6 text-xl font-bold text-neutral-900">You're all set!</h1>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        Start exploring opportunities with Lightforth. Your matches are waiting.
      </p>
      <button
        onClick={onStart}
        className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
      >
        Go to Home
      </button>
    </div>
  )
}
