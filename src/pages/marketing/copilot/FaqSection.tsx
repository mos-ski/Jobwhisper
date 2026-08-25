import { Faq } from '@/components/marketing/ProofStrip'

const SUPPORT_EMAIL = 'support@lightforth.org'

export const NEW_FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'What is Lightforth Interview Copilot?',
    a: "An invisible overlay that only your display shows. It listens to the conversation and feeds you real-time answers across three moments — live interview questions, coding problems you screenshot, and multi-person meetings — without ever appearing on a screen share, recording, or the video feed you're sending out.",
  },
  {
    q: 'Will the interviewer see it?',
    a: "No. Copilot renders as an overlay only your display shows — it doesn't appear in screen shares, recordings, or the video feed you're sending out.",
  },
  {
    q: "What if I'm on camera the whole time?",
    a: 'Stealth Mode keeps the window invisible to screen-capture while staying fully visible to you, and the transparency slider lets you fade it further if you want it barely there.',
  },
  {
    q: 'Does it work on Zoom, Teams, and Google Meet?',
    a: "Yes — it runs as a separate window on your desktop, so it's compatible with any video call software, no plugin or extension required.",
  },
  {
    q: "What if there's more than one interviewer, or several people in the meeting?",
    a: "Copilot tells the other voices on the call apart and labels who's speaking, so the transcript stays accurate even with a multi-person panel or a full meeting room — you just need to know which voice is yours.",
  },
  {
    q: 'How do credits actually get used?',
    a: "Credits are based on session length, not session count: a session under an hour is 1 credit, and each additional full hour adds one more. We'll flag it on screen once you've got under an hour of credit left, so you're never caught off guard mid-session.",
  },
  {
    q: 'What if I want to cancel or switch plans?',
    a: "Cancel anytime, no questions asked, right from your account settings. Pro is $49/mo with 50 credits, Premium is $79/mo with 100 credits and adds Meeting Copilot — switch between them whenever you like, or go annual on either one for 20% off the monthly price.",
  },
]

export function FaqSection() {
  return (
    <section className="bg-slate-50/60">
      <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0494fc]">Get in touch</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Still curious? Reach out anytime at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0494fc] hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
      <Faq title="Before you ask" items={NEW_FAQ_ITEMS} />
    </section>
  )
}
