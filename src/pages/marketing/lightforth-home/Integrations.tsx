export function Integrations() {
  const logos = [
    { src: '/lightforth-home/images/logo-lightforth-small.png', alt: 'Lightforth' },
    { src: '/lightforth-home/images/logo-linkedin.png', alt: 'LinkedIn' },
    { src: '/lightforth-home/images/logo-indeed.png', alt: 'Indeed' },
    { src: '/lightforth-home/images/logo-workable.png', alt: 'Workable' },
    { src: '/lightforth-home/images/logo-jooble.png', alt: 'Jooble' },
    { src: '/lightforth-home/images/logo-reed.png', alt: 'Reed' },
    { src: '/lightforth-home/images/logo-twitter.png', alt: 'Twitter' },
    { src: '/lightforth-home/images/logo-job.png', alt: 'Job' },
  ]

  return (
    <section className="border-y border-slate-100 bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Seamless Job Board
          <br />
          Integrations
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Lightforth integrates with LinkedIn, Indeed, Glassdoor, Workable, Jooble, Reed, and more to find and apply
          to opportunities across the web.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
