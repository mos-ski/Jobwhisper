import { useState } from 'react'
import { Gift } from 'lucide-react'

export function ReferralCodeScreen({ onContinue }: { onContinue: () => void }) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <Gift size={28} />
      </span>
      <h1 className="mt-6 text-xl font-bold text-neutral-900">Have a referral code?</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Enter a friend's code and you'll both get bonus credits.
      </p>

      <div className="mt-8 w-full">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter referral code"
          disabled={applied}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-center text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] disabled:bg-neutral-50 disabled:text-neutral-400"
        />
        {!applied ? (
          <button
            onClick={() => {
              if (code.trim()) setApplied(true)
            }}
            disabled={!code.trim()}
            className="mt-3 w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            Apply code
          </button>
        ) : (
          <p className="mt-3 text-sm font-medium text-green-600">Code applied! You earned 2 bonus credits.</p>
        )}
      </div>

      <button
        onClick={onContinue}
        className="mt-8 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-600"
      >
        {code.trim() && !applied ? 'Skip' : 'Continue'}
      </button>
    </div>
  )
}
