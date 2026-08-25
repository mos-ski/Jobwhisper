import { motion } from 'framer-motion'
import { Zap, Layers, Brain, Rocket } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Application Automation',
    tag: 'Auto-Apply',
    stat: '1000+',
    description: 'Apply to 1000+ jobs automatically across platforms',
  },
  {
    icon: Layers,
    title: 'Complete Career Toolkit',
    tag: 'All-in-One',
    description: 'Resume optimization, auto-apply, and interview mastery',
  },
  {
    icon: Brain,
    title: 'AI Resume Tailoring',
    tag: 'Interview Prep',
    description: 'Optimize your resume for any job in seconds with our AI Resume Tailoring.',
  },
  {
    icon: Rocket,
    title: 'Interview Copilot',
    tag: 'Auto-Apply',
    description: 'Get real-time guidance during live interviews.',
  },
]

export function Stats({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">Proven Impact</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Real Results. Real Careers. Real Impact.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Every number reflects the success of job seekers who accelerated their careers with Lightforth.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <feature.icon className="h-5 w-5 text-[#0494fc]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
              {feature.stat && (
                <p className="mt-2 text-3xl font-bold text-[#0494fc]">{feature.stat}</p>
              )}
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/50 p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/lightforth-home/images/coin.png" alt="Coin" className="h-8 w-8" />
            <p className="text-base font-semibold text-slate-800">
              <span className="text-[#0494fc]">Get 5 monthly credits</span> as a non-subscriber — explore Lightforth before choosing a plan
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-600">Access premium features and apply to top roles with your available credits.</p>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0380e0] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            Activate Pro for $10
          </button>
        </div>
      </div>
    </section>
  )
}
