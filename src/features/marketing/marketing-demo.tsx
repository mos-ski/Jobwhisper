export type MarketingDemoProps = {
  readonly className?: string
}

export function MarketingDemo({ className = '' }: MarketingDemoProps) {
  return (
    <section data-slot="marketing-demo" aria-label="Jobwhisper live copilot demo" className={`relative mx-auto aspect-[1510/912] w-full overflow-hidden rounded-panel bg-landing-bg ${className}`}>
      <video src="/landing-demo.mp4" poster="/landing-demo.png" autoPlay muted loop playsInline className="size-full object-cover object-top" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-landing-transparent to-landing-bg" />
    </section>
  )
}
