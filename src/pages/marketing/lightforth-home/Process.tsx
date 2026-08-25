import { motion } from 'framer-motion'

const steps = [
  {
    icon: '/lightforth-home/images/process-icon-1.svg',
    title: 'Upload Your Resume',
    description: 'Upload your existing PDF resume or build one instantly with our AI-powered templates. ATS-friendly formats that impress employers.',
    image: '/lightforth-home/images/process-1.png',
  },
  {
    icon: '/lightforth-home/images/process-icon-2.svg',
    title: 'Tailor With AI',
    description: 'Paste any job description and our AI analyzes it against your resume, optimizing every section to match what employers are looking for.',
    image: '/lightforth-home/images/process-2.png',
  },
  {
    icon: '/lightforth-home/images/process-icon-3.svg',
    title: 'Activate Auto-Apply',
    description: 'Set up your job preferences once. Auto-Apply finds matching opportunities across multiple job boards and submits tailored applications on your behalf.',
    image: '/lightforth-home/images/process-3.png',
  },
  {
    icon: '/lightforth-home/images/process-icon-4.svg',
    title: 'Ace Your Interviews',
    description: 'Practice with our voice-enabled AI interviewer. Get real-time feedback, performance reports, and use Interview Copilot during live interviews for guidance.',
    image: '/lightforth-home/images/process-4.png',
  },
]

export function Process({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Your Path to Your Dream Job
            <br />
            in 4 Steps
          </h2>
        </div>

        <div className="mt-16 space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col items-center gap-8 md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={step.icon} alt="" className="h-10 w-10" />
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-slate-600">{step.description}</p>
              </div>
              <div className="flex-1">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
