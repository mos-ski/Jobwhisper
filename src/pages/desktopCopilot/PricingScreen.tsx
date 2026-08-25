import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from './plans'
import { BG } from './shared'

const PRO_CARD_BG = '#08285c'
const PREMIUM_CARD_BG = 'rgba(255,255,255,0.1)'
const PREMIUM_BORDER = '#21a0fc'
const BUTTON_BLUE = '#0494fc'

export function PricingScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: PlanId) => void }) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual')
  const isAnnual = billingCycle === 'annual'
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)

  return (
    <div className="relative flex min-h-[580px]" style={{ background: BG }}>
      <button onClick={onBack} className="absolute right-5 top-4 z-10 text-white/50 hover:text-white" title="Back">
        <X className="h-5 w-5" />
      </button>

      <div
        className="flex w-[300px] flex-shrink-0 flex-col justify-between p-10"
        style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.12) 0%, rgba(10,42,96,0) 60%)' }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-white">Level Up</h1>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            More credits, more freedom. Every feature still costs 1 credit per use, but you have 5× more room to job-hunt aggressively.
          </p>
        </div>

        <button
          onClick={() => setBillingCycle(c => (c === 'monthly' ? 'annual' : 'monthly'))}
          className="flex items-center gap-2.5 self-start"
        >
          <span className={cn('relative flex h-5 w-9 items-center rounded-full px-0.5 transition-colors', isAnnual ? 'bg-white' : 'bg-white/30')}>
            <span className={cn('h-4 w-4 rounded-full shadow transition-transform', isAnnual ? 'translate-x-4' : 'translate-x-0')} style={{ background: '#08285c' }} />
          </span>
          <span className="text-sm">
            <span className="text-white">Annual</span>{' '}
            <span style={{ color: BUTTON_BLUE }}>(save 20%)</span>
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={cn('flex flex-1 flex-col justify-center gap-4 px-10 py-6 text-left transition-colors hover:brightness-110', plan.popular && 'border-2')}
            style={{
              background: plan.popular ? PREMIUM_CARD_BG : PRO_CARD_BG,
              borderColor: plan.popular ? PREMIUM_BORDER : 'transparent',
            }}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-lg font-bold text-white">{plan.label}</p>
                {plan.popular && (
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: PREMIUM_BORDER }}>
                    Most Popular
                  </p>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${priceFor(plan.monthlyPrice)}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>/mo</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-white">{plan.credits} Credits</p>
              {plan.bullets.map(bullet => (
                <div key={bullet} className="flex items-start gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                  <span>{bullet}</span>
                </div>
              ))}
              <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.6)' }}>{plan.bestForNote}</p>
            </div>

            {plan.popular && (
              <div className="flex h-10 w-full items-center justify-center rounded-md text-sm font-semibold text-white" style={{ background: BUTTON_BLUE }}>
                Upgrade to Premium
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
