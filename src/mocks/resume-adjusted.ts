import type { ResumeDocument } from '@/contracts/resume.draft'
import { resumeDocument } from './resume'

// Rewrites keyed by role, then bullet index; bullets without one stay as written.
const REWRITES: readonly Readonly<Record<number, string>>[] = [
  {
    0: 'Directed strategy for 5 AI career products, shipping the Resume Builder and Interview Copilot MVP in 5 months at 95% scope and growing to 12,000+ monthly users.',
    1: 'Scaled a generative-AI resume builder to 8,000+ resumes, raising parsing accuracy 40% and application-to-interview conversion 25%.',
    2: 'Launched Interview Copilot after research with 50+ early adopters, reaching a 4.6/5 session rating in its first quarter.',
    3: 'Designed tiered pricing that earned $2,000 in its first 3 months and set up a repeatable free-to-paid funnel.',
    4: 'Built and led an 8-person product team across engineering, design and data, introducing OKRs that made quarterly delivery predictable.',
    5: 'Grew active users 30% month over month through onboarding redesigns and a referral loop.',
  },
  {
    0: 'Grew monthly transaction volume to a $150k-$200k run rate with 15% month-over-month growth by reworking payments and merchant acquisition.',
    1: 'Cut merchant onboarding time 66% with automated identity checks, lifting activation 50%.',
    2: 'Shipped 2FA, wallet transfers and real-time fraud alerts, reducing support tickets 20%.',
    3: 'Expanded banking coverage from 3 to 12 institutions in 18 months by leading API partnerships end to end.',
    5: 'Launched a merchant analytics dashboard adopted by 70% of active merchants, turning days of reporting into minutes.',
    6: 'Opened a developer portal and API docs that brought in 20% of new merchant sign-ups.',
  },
  {
    0: 'Led a 12-person squad through expansion into three cities, setting up roadmapping, sprint planning and performance tracking.',
    1: 'Redesigned the merchant dashboard to a 4.7/5 satisfaction score using interview-led, real-time reporting.',
    2: 'Raised core task completion 35% by consolidating fragmented workflows found through funnel analysis.',
    3: 'Launched inventory management with low-stock alerts and purchase orders, increasing platform stickiness 25%.',
    5: 'Built A/B testing and event tracking that doubled experiment velocity and cut decisions from weeks to days.',
    7: 'Wrote specs and acceptance criteria for 20+ features, reducing engineering blockers at handoff.',
  },
  {
    0: 'Helped launch a mobile wallet to 10,000+ customers in 6 months across specification, user flows and go-to-market.',
    1: 'Fixed onboarding drop-off points found in funnel data, lifting completion 18% and reducing setup support requests.',
    2: 'Delivered a savings and budgeting MVP that reached 22% weekly active use within 60 days.',
    5: 'Drove a 12% reactivation lift among dormant users with in-app and push campaigns.',
  },
]

/** The sample resume after a heavy tailoring pass: about three quarters of it rewritten, for the before/after compare. */
export const resumeDocumentAdjusted: ResumeDocument = {
  ...resumeDocument,
  summary:
    'Product leader with 6+ years building fintech and AI products, from a 10,000-user mobile wallet to an AI career platform with 12,000+ monthly users. Known for shipping MVPs in months, pricing that converts, and teams that deliver on schedule.',
  skills: resumeDocument.improvedSkills,
  roles: resumeDocument.roles.map((role, roleIndex) => ({
    ...role,
    bullets: role.bullets.map((bullet, index) => REWRITES[roleIndex]?.[index] ?? bullet),
  })),
}
