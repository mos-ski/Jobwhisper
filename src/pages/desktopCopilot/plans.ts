// src/pages/desktopCopilot/plans.ts
import type { UseCaseId } from './useCases'

export type PlanId = 'starter' | 'pro' | 'premium'
export type BillingCycle = 'monthly' | 'annual'
export type AppFeature = 'resume' | 'auto-apply' | 'interview-prep'

export interface PlanConfig {
  id: PlanId
  label: string
  monthlyPrice: number
  credits: number
  popular: boolean
  bullets: string[]
  bestForNote: string
  /** Main web-app features unlocked (resume builder, auto-apply, interview prep). */
  appFeatures: AppFeature[]
  /** Desktop Copilot use cases unlocked. Empty means no Desktop Copilot access at all. */
  unlockedUseCases: UseCaseId[]
}

export const PLANS: PlanConfig[] = [
  {
    id: 'starter',
    label: 'Starter',
    monthlyPrice: 27,
    credits: 15,
    popular: false,
    bullets: ['Resume builder', 'Download resumes'],
    bestForNote: 'Ideal for light or occasional job applications',
    appFeatures: ['resume'],
    unlockedUseCases: [],
  },
  {
    id: 'pro',
    label: 'Pro',
    monthlyPrice: 49,
    credits: 50,
    popular: false,
    bullets: ['Everything in Starter', 'Auto-Apply', 'AI Interview prep', 'Interview & Coding Copilot'],
    bestForNote: 'Best for users who want AI + autopilot help consistently',
    appFeatures: ['resume', 'auto-apply', 'interview-prep'],
    unlockedUseCases: ['interview', 'coding'],
  },
  {
    id: 'premium',
    label: 'Premium',
    monthlyPrice: 79,
    credits: 100,
    popular: true,
    bullets: ['Everything in Pro, plus Meeting Copilot', 'Automate job applications with a daily quota', 'Ideal for high-volume applications, daily resume updates, or intensive interview prep'],
    bestForNote: 'Best value for serious job hunters',
    appFeatures: ['resume', 'auto-apply', 'interview-prep'],
    unlockedUseCases: ['interview', 'coding', 'meeting'],
  },
]

export function getPlan(id: PlanId): PlanConfig {
  const found = PLANS.find(p => p.id === id)
  if (!found) throw new Error(`Unknown plan: ${id}`)
  return found
}

export function annualMonthlyEquivalent(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 0.8)
}

export function planHasAppFeature(plan: PlanConfig, feature: AppFeature): boolean {
  return plan.appFeatures.includes(feature)
}
