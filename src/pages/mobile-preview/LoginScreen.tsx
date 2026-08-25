import { Apple, Globe, Mail } from 'lucide-react'

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 pb-8 pt-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome to Lightforth</h1>
        <p className="mt-2 text-sm text-neutral-500">Find your next opportunity</p>
      </div>

      <div className="mt-12 flex flex-1 flex-col justify-center gap-3">
        <button
          onClick={onLogin}
          className="flex items-center justify-center gap-3 rounded-xl bg-neutral-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <Apple size={18} fill="white" />
          Continue with Apple
        </button>
        <button
          onClick={onLogin}
          className="flex items-center justify-center gap-3 rounded-xl border border-neutral-300 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          <Globe size={18} />
          Continue with Google
        </button>
        <button
          onClick={onLogin}
          className="flex items-center justify-center gap-3 rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          <Mail size={18} />
          Continue with Email
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400 leading-relaxed">
        By continuing, you agree to our{' '}
        <span className="text-[#2563EB]">Terms of Service</span> and{' '}
        <span className="text-[#2563EB]">Privacy Policy</span>.
      </p>
    </div>
  )
}
