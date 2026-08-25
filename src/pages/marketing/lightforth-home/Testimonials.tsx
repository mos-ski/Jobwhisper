import { motion } from 'framer-motion'

const testimonials = [
  {
    quote:
      "I had been applying for months with no callbacks. Lightforth's AI Resume Tailoring helped me customize my resume for each application, and Auto-Apply handled the submissions. Two weeks later, I landed a startup role in New York above my expected salary.",
    name: 'Jessica M.',
    title: 'Startup Employee at New York, USA',
    image: '/lightforth-home/images/woman-testimonial.png',
  },
  {
    quote:
      "I kept freezing in interviews despite having the skills. Lightforth's Interview Prep with STAR method training helped me structure my answers confidently. Within two weeks, I received three offers in London.",
    name: 'Omar K.',
    title: 'Professional at London, UK',
    image: '/lightforth-home/images/woman-testimonial.png',
  },
  {
    quote:
      "My CV was getting ignored. Lightforth's AI Resume Tailoring optimized it for ATS and matched it to my dream roles. Within a week, I had three interview invites and now I'm a Product Manager at an international firm.",
    name: 'Chinonso E.',
    title: 'Product Manager at Lagos, Nigeria',
    image: '/lightforth-home/images/woman-testimonial.png',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">Success Stories</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Join Thousands Who
            <br />
            Accelerated Their Careers
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 text-[#0494fc]">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H10V18H0Z" />
                </svg>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-slate-700">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-[#0494fc]">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
