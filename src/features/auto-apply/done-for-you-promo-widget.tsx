import { X } from 'lucide-react'

export type DoneForYouPromoWidgetProps = {
  readonly signupHref: string
  readonly onDismiss: () => void
}

export function DoneForYouPromoWidget({ signupHref, onDismiss }: DoneForYouPromoWidgetProps) {
  return (
    <aside
      role="region"
      aria-label="Done For You"
      className="fixed bottom-4 end-4 z-sticky w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-panel bg-surface shadow-xl"
    >
      <div className="relative flex aspect-[863/551] w-full flex-col items-center overflow-hidden px-6 pt-8 text-brand-bar-text">
        <img
          data-testid="done-for-you-campaign-background"
          src="/v3-assets/figma/dfy-widget-background.svg"
          alt=""
          className="pointer-events-none absolute inset-0 size-full"
        />
        <img
          src="/v3-assets/figma/dfy-widget-wordmark.svg"
          alt="Jobwhisper"
          className="absolute top-8 h-[1.15rem] w-[5.85rem]"
        />
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close Done For You promotion"
          className="absolute end-3 top-3 grid size-11 place-items-center rounded-soft text-brand-bar-text transition-colors hover:bg-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bar-text"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="absolute inset-x-0 top-[5.53rem] flex flex-col items-center text-center font-gowun font-normal leading-[1.112]">
          <p
            data-testid="done-for-you-guarantee"
            className="mb-[-0.08rem] w-full text-[2.53rem] tracking-[-0.2rem]"
          >
            5 Interviews
          </p>
          <p className="w-full text-[1.43rem] tracking-[-0.07rem]">Guaranteed!</p>
        </div>
      </div>

      <div className="pb-7 pe-10 ps-6 pt-5">
        <h2 className="whitespace-nowrap font-gowun text-[1.34rem] font-bold leading-[1.112] tracking-[-0.067rem] text-accent-text">
          Your job search, done for you.
        </h2>
        <p
          data-testid="done-for-you-description"
          className="mt-4 font-rethink text-[1.12rem] font-normal leading-[1.4rem] text-ink-muted"
        >
          A dedicated success manager finds suitable roles, tailors your resume, and applies on your behalf. You focus on the interviews. We'll handle the work that gets you there.
        </p>
        <div className="mt-4 grid grid-cols-[10.375rem_1fr] items-center gap-3">
          <a
            href={signupHref}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Sign Up Now
          </a>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex min-h-12 items-center justify-center rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Maybe Later.
          </button>
        </div>
      </div>
    </aside>
  )
}
