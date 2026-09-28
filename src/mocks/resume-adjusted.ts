import type { ResumeDocument } from '@/contracts/resume.draft'
import { resumeDocument } from './resume'

// The Chat rewrite (resumeDocument.improvedBullets, about 65%) plus three more, keyed role-bullet.
const MORE: Readonly<Record<string, string>> = {
  '0-5': 'Grew active users 30% month over month through onboarding redesigns and a referral loop.',
  '1-6': 'Opened a developer portal and API docs that brought in 20% of new merchant sign-ups.',
  '2-7': 'Wrote specs and acceptance criteria for 20+ features, reducing engineering blockers at handoff.',
}

/** The sample resume after a heavy tailoring pass: about three quarters of it rewritten, for the before/after compare. */
export const resumeDocumentAdjusted: ResumeDocument = {
  ...resumeDocument,
  summary:
    'Product leader with 6+ years building fintech and AI products, from a 10,000-user mobile wallet to an AI career platform with 12,000+ monthly users. Known for shipping MVPs in months, pricing that converts, and teams that deliver on schedule.',
  skills: resumeDocument.improvedSkills,
  roles: resumeDocument.roles.map((role, roleIndex) => ({
    ...role,
    bullets: role.bullets.map((bullet, index) => MORE[`${roleIndex}-${index}`] ?? resumeDocument.improvedBullets?.[roleIndex]?.[index] ?? bullet),
  })),
}
