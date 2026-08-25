import { motion } from 'framer-motion'

const logos = [
  { src: '/lightforth-home/images/odeaolabs.svg', alt: 'OdeaoLabs' },
  { src: '/lightforth-home/images/kintsugi.svg', alt: 'Kintsugi' },
  { src: '/lightforth-home/images/stackedlab.svg', alt: 'StackedLab' },
  { src: '/lightforth-home/images/magnolia.svg', alt: 'Magnolia' },
  { src: '/lightforth-home/images/warpspeed.svg', alt: 'Warpspeed' },
  { src: '/lightforth-home/images/sisyphus.svg', alt: 'Sisyphus' },
]

export function LogoCloud() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm text-slate-500">Our users have secured roles at leading companies:</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <motion.img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-7 w-auto opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
