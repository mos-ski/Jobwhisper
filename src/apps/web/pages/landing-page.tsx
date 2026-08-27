import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronDown } from 'lucide-react'
import { DemoModal } from './demo-modal'

const FEATURES = [
  {
    icon: '/landing-feature-autoapply.svg',
    title: 'Auto Apply AI Agents',
    subtitle: 'Apply to hundreds of jobs while you sleep',
    description:
      'Our agents browse job boards, match your profile to open roles, and submit tailored applications on your behalf — 24/7, no manual effort required.',
    href: '/v3/auto-apply',
  },
  {
    icon: '/landing-feature-resume.svg',
    title: 'AI Resume Builders',
    subtitle: 'Tailored for every role, in seconds',
    description:
      'Paste a job description and get a resume instantly rewritten to match — right keywords, right achievements, right format, every time.',
    href: '/v3/resume',
  },
  {
    icon: '/landing-feature-coding.svg',
    title: 'Coding Copilot',
    subtitle: 'Real-time help during technical screens',
    description:
      'Whispers hints, patterns, and solutions as the interviewer talks. Stay sharp and confident through any coding challenge, completely live.',
    href: '#',
  },
  {
    icon: '/landing-feature-meeting.svg',
    title: 'Meeting Copilots',
    subtitle: 'Live AI support in any video call',
    description:
      'Get real-time talking points, answers, and context surfaced during interviews or meetings — without the other side ever knowing.',
    href: '#',
  },
  {
    icon: '/landing-feature-topup.svg',
    title: 'Top Up credits anytime',
    subtitle: 'Pay only for what you use',
    description:
      'No subscriptions or surprise charges. Buy credits to power any Jobwhisper feature and use them at your own pace, whenever you need them.',
    href: '/v3/billing',
  },
  {
    icon: '/landing-feature-other.svg',
    title: 'Other Applications',
    subtitle: 'Desktop, mobile, and browser',
    description:
      'Take Jobwhisper everywhere — available as a Chrome extension, a macOS or Windows desktop app, and a mobile app on iOS and Android.',
    href: '#',
  },
]

function LandingNav() {
  const navigate = useNavigate()
  return (
    <nav className="fixed top-4 sm:top-9 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center h-[54px] bg-landing-nav rounded-[22px] pl-4 pr-2 shadow-[0px_2px_40px_rgba(0,0,0,0.25)] w-full max-w-fit">
        <img src="/landing-logo.svg" alt="Jobwhisper" className="h-6 w-auto" />

        <div className="hidden md:flex items-center gap-5 ml-10">
          <button className="flex items-center gap-1.5 text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors">
            Features
            <ChevronDown size={10} className="mt-px" />
          </button>
          <button className="text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors">
            Pricing
          </button>
          <button className="text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors">
            FAQ
          </button>
        </div>

        <div className="flex items-center gap-3.5 ml-4 md:ml-14">
          <button
            onClick={() => navigate('/v3/auth/sign-in')}
            className="hidden sm:block text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button className="flex items-center gap-1.5 bg-landing-bg rounded-[16px] px-4 h-[42px] overflow-hidden">
            <img src="/landing-logo-icon.svg" alt="" className="h-[18px] w-4 object-contain" />
            <span className="text-white text-base font-medium tracking-[-0.3px] leading-6">Download</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

function LandingHero() {
  const navigate = useNavigate()
  return (
    <section className="px-4 sm:px-8 lg:px-[113px] pt-[140px] sm:pt-[180px] lg:pt-[220px] pb-0">
      <div className="flex flex-col gap-6 lg:gap-8 max-w-[813px]">
        <h1
          className="text-white font-normal font-gowun"
          style={{ fontSize: 'clamp(40px, 6vw, 70.732px)', lineHeight: '1.112', letterSpacing: '-0.05em' }}
        >
          Never leave an interview wishing you'd said something different.
        </h1>
        <p
          className="text-white font-normal max-w-[504px]"
          style={{ fontSize: 'clamp(16px, 2vw, 24px)', letterSpacing: '-0.02em' }}
        >
          Rehearse against a role-aware AI, then bring a live copilot into the actual conversation.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-landing-btn rounded-[10px] h-12 px-8 text-white text-lg font-semibold whitespace-nowrap">
            Download Now
            <span className="flex items-center gap-1.5">
              <img src="/landing-apple.svg" alt="Apple" className="h-4 w-4" />
              <img src="/landing-windows.svg" alt="Windows" className="h-4 w-4" />
            </span>
          </button>
          <button
            onClick={() => navigate('/v3/auth/choose-plan')}
            className="flex items-center gap-2 bg-white rounded-[10px] h-12 px-8 text-landing-btn-text text-lg font-semibold whitespace-nowrap hover:bg-white/90 transition-colors"
          >
            See Pricing
            <img src="/landing-arrow.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function LandingDemo({ onOpenDemo }: { readonly onOpenDemo: () => void }) {
  return (
    <section className="relative mt-8 sm:mt-16 lg:mt-[120px] mx-4 sm:mx-8 lg:mx-[113px] h-[480px] sm:h-[680px] lg:h-[912px] rounded-xl overflow-hidden">
      <img
        src="/landing-demo.png"
        alt="Jobwhisper app interface"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute bottom-0 left-0 right-0 h-[540px] bg-gradient-to-b from-transparent to-landing-bg" />
      <div className="absolute bottom-[70px] left-0 right-0 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <p className="text-white text-sm font-normal leading-5 tracking-[-0.18px]">AI Demo</p>
          <h2
            className="text-white font-normal whitespace-nowrap"
            style={{ fontSize: '40px', lineHeight: '40px', letterSpacing: '-1.2px' }}
          >
            See how Jobwhisper works
          </h2>
          <p className="text-white/75 text-xs font-normal leading-4">
            Let our agent walk you through our product
          </p>
        </div>
        <button
          onClick={onOpenDemo}
          className="flex items-center gap-2 bg-white rounded-full h-10 px-4 border border-transparent hover:bg-white/90 transition-colors"
        >
          <Play size={14} fill="black" className="text-black" />
          <span className="text-black text-sm font-normal leading-5 tracking-[-0.13px]">Start demo</span>
        </button>
      </div>
    </section>
  )
}

function LandingFeatures() {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col items-center gap-4 sm:gap-8 pt-8 sm:pt-16 pb-12 sm:pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[44px]">
        <p
          className="text-white font-medium"
          style={{ fontSize: '28px', lineHeight: '36px', letterSpacing: '-0.84px' }}
        >
          Other Ads on
        </p>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[44px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="flex gap-4 p-4 rounded-[12px] bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.05] transition-colors no-underline group"
            >
              <div className="flex items-center justify-center size-14 rounded-[10px] bg-white/10 shrink-0 mt-0.5">
                <img src={feature.icon} alt="" className="size-5" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 gap-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-white font-semibold text-[15px] leading-[21px]">
                    {feature.title}
                  </p>
                  <img
                    src="/landing-arrow.svg"
                    alt=""
                    className="size-4 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-white/75 text-[13px] font-medium leading-[18px]">
                  {feature.subtitle}
                </p>
                <p className="text-white/50 text-[13px] font-normal leading-[1.55] mt-1">
                  {feature.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/v3/auth/choose-plan')}
        className="flex items-center gap-2 bg-white rounded-[10px] h-12 px-8 text-landing-btn-text text-lg font-semibold whitespace-nowrap hover:bg-white/90 transition-colors"
      >
        See Pricing
        <img src="/landing-arrow.svg" alt="" className="h-4 w-4" />
      </button>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="bg-landing-footer-frame rounded-t-[20px]">
      <div className="bg-white rounded-t-[20px] py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex items-center justify-between h-6">
            <div className="flex items-center gap-6">
              <img src="/landing-logo-dark.svg" alt="Jobwhisper" className="h-6 w-auto" />
              <a
                href="#"
                className="text-landing-ink text-base font-normal leading-[22px] tracking-[-0.16px] hover:opacity-70 transition-opacity"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-landing-ink text-base font-normal leading-[22px] tracking-[-0.16px] hover:opacity-70 transition-opacity"
              >
                Terms of Service
              </a>
            </div>
            <p className="text-landing-ink/60 text-base font-normal leading-[22px] tracking-[-0.16px]">
              © 2026 Weav.com, LLC
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-landing-bg font-rethink overflow-x-hidden">
      {demoOpen ? null : <LandingNav />}
      <LandingHero />
      <LandingDemo onOpenDemo={() => setDemoOpen(true)} />
      <LandingFeatures />
      <LandingFooter />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
