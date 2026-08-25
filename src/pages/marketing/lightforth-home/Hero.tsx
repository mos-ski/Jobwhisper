import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const avatars = [
  '/lightforth-home/images/avatar1.png',
  '/lightforth-home/images/avatar2.png',
  '/lightforth-home/images/avatar3.png',
  '/lightforth-home/images/avatar4.png',
  '/lightforth-home/images/avatar5.png',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f7ff] to-white pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            AI-Powered Career Acceleration
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Land Your Dream Job
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">Faster</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-200/60 -rotate-1 z-0" />
          </span>{' '}
          with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-slate-600 md:text-lg"
        >
          Lightforth is an AI-powered career acceleration platform. We optimize your resume for any job,
          automatically apply to matching opportunities, and prepare you to ace every interview – all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <a
            href="/v3/auth/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-[#0494fc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#0380e0] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            Activate Pro for $10
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`User ${i + 1}`}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-amber-500">★</span>
            <span className="text-sm font-bold text-slate-900">4.8</span>
          </div>
          <span className="text-sm text-slate-500">Trusted by thousands of job seekers landing interviews faster.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50"
        >
          <img
            src="/lightforth-home/images/hero-image.png"
            alt="Lightforth Dashboard"
            className="w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}
