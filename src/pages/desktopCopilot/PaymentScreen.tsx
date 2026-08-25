import { useState } from 'react'
import { getPlan, type PlanId } from './plans'
import { BG, CARD, BORDER, INPUT_BG, INPUT_BD, BLUE } from './shared'

export function PaymentScreen({ planId, onPaid, onBack }: { planId: PlanId; onPaid: () => void; onBack: () => void }) {
  const plan = getPlan(planId)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const
  const canPay = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvc.trim().length > 0

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-4 text-sm font-semibold text-blue-400 hover:underline">
          ← Back
        </button>
        <h1 className="mb-2 text-2xl font-bold text-white">Confirm payment</h1>
        <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ${plan.monthlyPrice}/mo — {plan.label} Plan
        </p>

        <div className="space-y-4 rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Card number</label>
            <input
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="1234 1234 1234 1234"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">Expiry</label>
              <input
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">CVC</label>
              <input
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (canPay) onPaid() }}
          className="mt-5 h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
          style={{ background: BLUE, opacity: canPay ? 1 : 0.45 }}
        >
          Pay ${plan.monthlyPrice}/mo
        </button>
      </div>
    </div>
  )
}
