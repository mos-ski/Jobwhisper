import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

export function ProofStrip({ items, tone = 'light' }: { items: string[]; tone?: 'light' | 'dark' }) {
  return (
    <div
      className={
        tone === 'dark'
          ? 'border-y border-white/10 bg-white/5'
          : 'border-y border-slate-100 bg-slate-50/60'
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 text-center">
        {items.map(item => (
          <p
            key={item}
            className={
              tone === 'dark'
                ? 'text-sm font-semibold text-white/80'
                : 'text-sm font-semibold text-slate-700'
            }
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

export interface FaqItem {
  q: string
  a: string
}

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-t border-slate-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <div className="mt-8 divide-y divide-slate-100">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900">{item.q}</span>
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
