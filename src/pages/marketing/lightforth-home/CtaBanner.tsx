import { Sparkles } from 'lucide-react'

export function CtaBanner({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Join the 10,000+ who said goodbye to job rejections in 21 days.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Take the first step toward your dream job today—sign up for Lightforth and let us handle the hard work
          while you focus on landing your next big opportunity!
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0380e0] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Sparkles className="h-5 w-5" />
          Activate Pro for $10
        </button>
      </div>
    </section>
  )
}
