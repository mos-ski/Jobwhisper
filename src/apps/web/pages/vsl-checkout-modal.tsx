import { useEffect, useState, type FormEvent } from 'react'

type Addon = {
  id: string
  name: string
  price: number
  desc: string
  tag?: string
}

const ADDONS: Addon[] = [
  {
    id: 'swipe',
    name: '5 Must-Master Interview Questions — Answer Swipe File',
    price: 19,
    desc: 'Word-for-word answer frameworks for the questions that end interviews early.',
  },
  {
    id: 'resumes',
    name: '10 Fully Customizable Resume Templates',
    price: 29,
    desc: 'ATS-safe templates for every industry, ready to fill in and send today.',
  },
  {
    id: 'coverletter',
    name: 'Cover Letter Swipe File',
    price: 15,
    desc: 'Proven cover letter openers and structures you can adapt in minutes.',
  },
  {
    id: 'salary',
    name: 'Salary Negotiation Word-for-Word Scripts',
    price: 15,
    desc: 'Exactly what to say when they ask your salary expectations — and when they make an offer.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Profile Optimization Checklist',
    price: 12,
    desc: 'The same checklist recruiters use to decide who gets a message.',
  },
  {
    id: 'starbank',
    name: 'Behavioural Question Story Bank (STAR Method)',
    price: 19,
    desc: 'Pre-built STAR stories you can adapt to almost any behavioural question.',
  },
  {
    id: 'followup',
    name: 'Post-Interview Follow-Up Email Templates',
    price: 9,
    desc: 'Send the right note within the hour, every time.',
  },
  {
    id: 'plan30',
    name: '30-Day Job Search Action Plan',
    price: 17,
    desc: 'A day-by-day plan so you always know exactly what to do next.',
  },
  {
    id: 'dfy',
    name: 'Done-For-You Resume & LinkedIn Overhaul',
    price: 999,
    desc: 'Our team rewrites your resume and LinkedIn profile from scratch, written by an ex-recruiter.',
    tag: 'White-glove service',
  },
]

const PLAN_PRICE = 40

type Details = {
  fname: string
  lname: string
  email: string
  country: string
  phone: string
}

const EMPTY_DETAILS: Details = { fname: '', lname: '', email: '', country: '', phone: '' }

function money(n: number) {
  return '$' + n.toLocaleString('en-US')
}

export function VslCheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS)
  const [addons, setAddons] = useState<Record<string, boolean>>({})
  const [payment, setPayment] = useState({ cardnum: '', expiry: '', cvc: '' })

  useEffect(() => {
    if (open) {
      setStep(1)
      setDetails(EMPTY_DETAILS)
      setAddons({})
      setPayment({ cardnum: '', expiry: '', cvc: '' })
    }
  }, [open])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const cartSum = ADDONS.reduce((sum, a) => sum + (addons[a.id] ? a.price : 0), PLAN_PRICE)

  function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault()
    setStep(2)
  }

  function handlePaymentSubmit(e: FormEvent) {
    e.preventDefault()
    // Mock checkout — no real payment is processed and no data leaves this page.
    setStep(4)
  }

  return (
    <div
      className="vsl-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="vsl-modal">
        <button className="vsl-modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>

        {step === 1 && (
          <div>
            <p className="vsl-step-label">Step 1 of 3</p>
            <h3>Your Interview Mastery Offer</h3>
            <p className="vsl-sub">Available exclusively to visitors today.</p>

            <div className="vsl-offer-card">
              <div className="vsl-offer-card-head">
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Jobwhisper Pro</h3>
                </div>
                <div className="vsl-offer-price">
                  <span className="vsl-badge-discount">60% OFF TODAY</span>
                  <span className="vsl-was">$100/mo</span>
                  <span className="vsl-now">$40 today</span>
                </div>
              </div>
              <ul className="vsl-offer-features">
                <li>Unlimited live Interview Copilot sessions</li>
                <li>Resume, role and job description context sync</li>
                <li>Real-time answer structuring during interviews</li>
                <li>Behavioural, technical and follow-up question support</li>
                <li>Priority setup support before your next interview</li>
              </ul>
              <p className="vsl-offer-fineprint">
                Charged $40 today, then renews automatically at $100/mo starting next month. Cancel anytime from your
                dashboard.
              </p>
            </div>

            <form onSubmit={handleDetailsSubmit}>
              <div className="vsl-field-row">
                <div className="vsl-field">
                  <label htmlFor="vsl-fname">First name</label>
                  <input
                    type="text"
                    id="vsl-fname"
                    required
                    value={details.fname}
                    onChange={(e) => setDetails({ ...details, fname: e.target.value })}
                  />
                </div>
                <div className="vsl-field">
                  <label htmlFor="vsl-lname">Last name</label>
                  <input
                    type="text"
                    id="vsl-lname"
                    required
                    value={details.lname}
                    onChange={(e) => setDetails({ ...details, lname: e.target.value })}
                  />
                </div>
              </div>
              <div className="vsl-field">
                <label htmlFor="vsl-email">Email</label>
                <input
                  type="email"
                  id="vsl-email"
                  required
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </div>
              <div className="vsl-field-row">
                <div className="vsl-field">
                  <label htmlFor="vsl-country">Country</label>
                  <select
                    id="vsl-country"
                    required
                    value={details.country}
                    onChange={(e) => setDetails({ ...details, country: e.target.value })}
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    <option>Nigeria</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Ghana</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>India</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="vsl-field">
                  <label htmlFor="vsl-phone">Phone number</label>
                  <input
                    type="tel"
                    id="vsl-phone"
                    required
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="vsl-btn vsl-btn-primary">
                Continue
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <button className="vsl-modal-back" onClick={() => setStep(1)}>
              &larr; Back
            </button>
            <p className="vsl-step-label">Step 2 of 3</p>
            <h3>Wait — Boost Your Results</h3>
            <p className="vsl-sub">One-time add-ons, available only on this page. Check anything you want.</p>

            <div>
              {ADDONS.map((a) => {
                const checked = Boolean(addons[a.id])
                return (
                  <label key={a.id} className={`vsl-addon-card${checked ? ' vsl-checked' : ''}`}>
                    <div className="vsl-addon-row">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setAddons({ ...addons, [a.id]: e.target.checked })}
                      />
                      <div className="vsl-addon-copy">
                        <div className="vsl-addon-title-row">
                          <span className="vsl-addon-title">{a.name}</span>
                          <span className="vsl-addon-price">+{money(a.price)}</span>
                        </div>
                        <div className="vsl-addon-desc">{a.desc}</div>
                        {a.tag && <span className="vsl-addon-tag">{a.tag}</span>}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="vsl-cart-total">
              <span className="vsl-lbl">Total due today</span>
              <span className="vsl-amt">{money(cartSum)}</span>
            </div>
            <button type="button" className="vsl-btn vsl-btn-primary" onClick={() => setStep(3)}>
              Continue to Payment
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <button className="vsl-modal-back" onClick={() => setStep(2)}>
              &larr; Back
            </button>
            <p className="vsl-step-label">Step 3 of 3</p>
            <h3>Payment</h3>

            <div className="vsl-order-summary">
              <div className="vsl-order-row">
                <span>Jobwhisper Pro — first month (60% off)</span>
                <span>{money(PLAN_PRICE)}</span>
              </div>
              {ADDONS.filter((a) => addons[a.id]).map((a) => (
                <div className="vsl-order-row" key={a.id}>
                  <span>{a.name}</span>
                  <span>{money(a.price)}</span>
                </div>
              ))}
              <div className="vsl-order-row vsl-total">
                <span>Total due today</span>
                <span>{money(cartSum)}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="vsl-field">
                <label htmlFor="vsl-cardnum">Card number</label>
                <input
                  type="text"
                  id="vsl-cardnum"
                  placeholder="4242 4242 4242 4242"
                  required
                  value={payment.cardnum}
                  onChange={(e) => setPayment({ ...payment, cardnum: e.target.value })}
                />
              </div>
              <div className="vsl-field-row">
                <div className="vsl-field">
                  <label htmlFor="vsl-expiry">Expiry</label>
                  <input
                    type="text"
                    id="vsl-expiry"
                    placeholder="MM/YY"
                    required
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  />
                </div>
                <div className="vsl-field">
                  <label htmlFor="vsl-cvc">CVC</label>
                  <input
                    type="text"
                    id="vsl-cvc"
                    placeholder="123"
                    required
                    value={payment.cvc}
                    onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="vsl-btn vsl-btn-primary">
                Pay {money(cartSum)} Securely
              </button>
            </form>
            <p className="vsl-modal-micro" style={{ textAlign: 'center' }}>
              Mock checkout — no real card is charged.
            </p>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div className="vsl-success-check">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M1 8L7 14L19 1"
                  stroke="#1c1d20"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>You're in!</h3>
            <p className="vsl-sub">
              We've created your Jobwhisper account and sent your login details to{' '}
              <strong style={{ color: 'var(--vsl-text-light)' }}>{details.email || 'your email'}</strong>.
            </p>
            <button type="button" className="vsl-btn vsl-btn-primary" onClick={onClose}>
              Go to My Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
