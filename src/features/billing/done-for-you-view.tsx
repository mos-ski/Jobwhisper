import { useState } from 'react'
import { BadgeCheck, CalendarCheck, FileText, MessageSquare, RotateCw, Search, Send, Star } from 'lucide-react'

import type { DfyApplicationStatus, DoneForYouEngagement, SuccessManager, SuccessManagerDirectory } from '@/contracts/done-for-you.draft'
import type { AutoApplyProfileSnapshot } from '@/features/auto-apply/auto-apply-view'
import { AppShell } from '@/features/dashboard/app-nav'
import { Avatar, Button, cn, EmptyState, ShellBar, Skeleton } from '@/ui'

import { DfySignupDialog, type DfySignupLead, type DfySignupPackage } from './dfy-signup-dialog'

export type DoneForYouViewProps = {
  readonly homeHref: string
  /** Breadcrumb parent and close target: Dashboard for the subscriber page, Billing for the directory. */
  readonly parent: { readonly href: string; readonly label: string }
  readonly setupHref: string
  readonly profile: AutoApplyProfileSnapshot
  readonly savedCard: { readonly label: string; readonly expiryLabel: string }
  readonly directory: SuccessManagerDirectory
  /** The client's active package. When absent the page lists every success manager and what they charge. */
  readonly engagement?: DoneForYouEngagement
  readonly onMessageManager?: () => void
  readonly onRetry?: () => void
  readonly onSignupComplete?: (lead: DfySignupLead & { readonly managerId: string }) => void
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function packageFor(manager: SuccessManager): DfySignupPackage {
  return {
    id: manager.interviewsGuaranteed >= 20 ? 'dfy-large' : 'dfy-small',
    guaranteeLabel: `${manager.interviewsGuaranteed} Interviews Guaranteed`,
    priceLabel: money.format(manager.price),
  }
}

const OFFERS = [
  { icon: FileText, title: 'A resume for every role', detail: 'Rewritten for each posting so it clears the screen' },
  { icon: Search, title: 'Roles picked for you', detail: 'Only jobs where you meet the bar, found early' },
  { icon: Send, title: 'Applications sent for you', detail: 'Submitted within 48 hours of a job going live' },
  { icon: CalendarCheck, title: 'A Friday update', detail: 'Every application, every reply, and next week’s plan' },
] as const

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const openingDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

function Tags({ manager }: { readonly manager: SuccessManager }) {
  return (
    <ul aria-label={`${manager.name}'s clients have interviewed at, and specialties`} className="flex flex-wrap gap-1.5">
      {manager.companies.map((company) => (
        <li key={company} className="rounded-md bg-positive-surface px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-positive">
          #{company}
        </li>
      ))}
      {manager.specialties.map((specialty) => (
        <li key={specialty} className="rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-ink">
          {specialty}
        </li>
      ))}
    </ul>
  )
}

function Rating({ value, className }: { readonly value: number; readonly className?: string }) {
  return (
    <div className={cn('grid justify-items-center gap-0.5', className)}>
      <span className="text-xl font-bold text-ink">{value.toFixed(2)}</span>
      <span className="flex text-warning" aria-label={`Rated ${value.toFixed(2)} out of 5`}>
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} aria-hidden="true" className="size-3 fill-current" />
        ))}
      </span>
    </div>
  )
}

function Name({ manager, as: Heading }: { readonly manager: SuccessManager; readonly as: 'h2' | 'h3' }) {
  return (
    <div className="min-w-0">
      <Heading className="flex items-center gap-1.5 font-gowun text-xl font-bold text-ink">
        {manager.name}
        <BadgeCheck aria-label="Verified" className="size-5 shrink-0 text-accent" />
      </Heading>
      <p className="text-sm text-ink-muted">
        {manager.title} ({manager.yearsExperience}+ years)
      </p>
    </div>
  )
}

function ManagerProfile({ manager, headingId }: { readonly manager: SuccessManager; readonly headingId: string }) {
  return (
    <div className="grid content-start gap-4">
      <div className="flex items-start gap-3">
        <Avatar name={manager.name} src={manager.photoUrl} alt="" size="xl" className="size-20 [&>img]:object-top" />
        <div className="grid min-w-0 flex-1 gap-2">
          <div id={headingId}>
            <Name manager={manager} as="h2" />
          </div>
          <Tags manager={manager} />
        </div>
      </div>
      {manager.review ? (
        <figure className="flex gap-4 border-t border-border pt-4">
          <div className="grid shrink-0 content-start justify-items-center gap-3">
            <Rating value={manager.rating} />
            <p className="grid justify-items-center leading-tight">
              <span className="text-xl font-bold text-ink">{manager.clientsPlaced}</span>
              <span className="text-xs text-ink-muted">clients placed</span>
            </p>
          </div>
          <div className="grid gap-1.5">
            <blockquote className="text-sm leading-6 text-ink">{manager.review.quote}</blockquote>
            <figcaption className="text-xs text-ink-muted">
              <span className="font-semibold text-ink">{manager.review.author}</span> / {shortDate.format(new Date(manager.review.date))}
            </figcaption>
          </div>
        </figure>
      ) : (
        <div className="flex gap-6 border-t border-border pt-4">
          <Rating value={manager.rating} />
          <p className="grid justify-items-center leading-tight">
            <span className="text-xl font-bold text-ink">{manager.clientsPlaced}</span>
            <span className="text-xs text-ink-muted">clients placed</span>
          </p>
        </div>
      )}
      <p className="rounded-xl bg-surface-subtle p-4 text-sm leading-6 text-ink">
        “{manager.bio}”
      </p>
    </div>
  )
}

function PackageIncludes() {
  return (
    <section aria-labelledby="package-includes" className="mt-8 rounded-panel bg-surface p-5 shadow-panel sm:p-6">
      <h2 id="package-includes" className="mb-3 text-center text-base font-semibold text-ink">Every success manager does this for you</h2>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {OFFERS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="grid content-start justify-items-center gap-1 rounded-xl bg-surface-subtle px-4 py-5 text-center">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Icon aria-hidden="true" className="size-4 text-ink-muted" />
              {title}
            </span>
            <span className="text-sm text-ink-muted">{detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ManagerRow({ manager, onStart }: { readonly manager: SuccessManager; readonly onStart: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const booked = manager.nextOpening !== undefined
  return (
    <li className="grid gap-4 rounded-panel bg-surface p-5 shadow-panel md:grid-cols-[1fr_auto]">
      <div className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={manager.name} src={manager.photoUrl} alt="" size="lg" className="size-14 [&>img]:object-top" />
            <Name manager={manager} as="h3" />
          </div>
          <dl className="flex gap-2">
            <div className="grid min-w-20 justify-items-center rounded-lg bg-surface-subtle px-3 py-1.5">
              <dt className="sr-only">Rating</dt>
              <dd><Rating value={manager.rating} /></dd>
            </div>
            <div className="grid min-w-20 content-center justify-items-center rounded-lg bg-surface-subtle px-3 py-1.5">
              <dd className="text-xl font-bold text-ink">{manager.clientsPlaced}</dd>
              <dt className="text-xs text-ink-muted">Clients placed</dt>
            </div>
          </dl>
        </div>
        <Tags manager={manager} />
        <p id={`bio-${manager.id}`} className={cn('text-sm leading-6 text-ink-muted', !expanded && 'line-clamp-2')}>“{manager.bio}”</p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`bio-${manager.id}`}
          onClick={() => setExpanded((current) => !current)}
          className="-my-2 min-h-11 justify-self-start rounded-md text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {expanded ? 'Show less' : `Read more about ${manager.name.split(' ')[0]}`}
        </button>
      </div>
      <div className="grid content-center gap-2 border-t border-border pt-4 md:w-56 md:border-s md:border-t-0 md:ps-5 md:pt-0">
        <p className="w-fit rounded-full bg-positive-surface px-3 py-0.5 text-xs font-semibold text-positive">{manager.interviewsGuaranteed} interviews guaranteed</p>
        <p className="flex items-baseline gap-1.5">
          <span className="font-gowun text-3xl font-bold text-ink">{money.format(manager.price)}</span>
          <span className="text-sm text-ink-muted">one payment</span>
        </p>
        {booked ? (
          <p className="rounded-lg bg-surface-subtle px-3 py-2.5 text-center text-sm font-medium text-ink">
            Fully booked. Next opening {openingDate.format(new Date(manager.nextOpening ?? ''))}
          </p>
        ) : (
          <Button onClick={onStart} className="w-full">Start with {manager.name.split(' ')[0]}</Button>
        )}
      </div>
    </li>
  )
}

const STATUS: Record<DfyApplicationStatus, { readonly label: string; readonly dot: string }> = {
  interview: { label: 'Interview booked', dot: 'bg-positive' },
  viewed: { label: 'Viewed by employer', dot: 'bg-info' },
  sent: { label: 'Sent', dot: 'bg-ink-muted' },
  rejected: { label: 'Not moving forward', dot: 'bg-danger' },
}

function ActivePackage({ manager, engagement, onMessage }: { readonly manager: SuccessManager; readonly engagement: DoneForYouEngagement; readonly onMessage?: () => void }) {
  const firstName = manager.name.split(' ')[0]
  const percent = Math.min(100, Math.round((engagement.interviewsLanded / engagement.interviewsGuaranteed) * 100))
  const stats = [
    { label: 'Applications sent', value: engagement.applicationsSent },
    { label: 'Employer replies', value: engagement.replies },
    { label: 'Interviews landed', value: engagement.interviewsLanded },
    { label: 'Next update', value: openingDate.format(new Date(engagement.nextUpdateOn)) },
  ]
  return (
    <>
      <section aria-labelledby="your-manager" className="relative mt-10">
        <p className="absolute inset-x-0 -top-4 z-10 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-ink shadow-control">
          <span className="grid size-6 place-items-center rounded-full bg-positive-surface text-positive">
            <Send aria-hidden="true" className="size-3.5" />
          </span>
          {engagement.interviewsGuaranteed} interviews guaranteed · started {shortDate.format(new Date(engagement.startedOn))}
        </p>
        <div className="grid gap-6 rounded-panel bg-surface p-5 pt-8 shadow-panel sm:p-6 sm:pt-8 lg:grid-cols-2">
          <ManagerProfile manager={manager} headingId="your-manager" />
          <div className="grid content-start gap-3">
            <div className="grid gap-2 rounded-xl bg-surface-subtle p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold text-ink">Your guarantee</h3>
                <p className="text-sm text-ink-muted">
                  <span className="font-gowun text-3xl font-bold text-ink">{engagement.interviewsLanded}</span> of {engagement.interviewsGuaranteed} interviews
                </p>
              </div>
              <div role="progressbar" aria-label="Interviews landed" aria-valuemin={0} aria-valuemax={engagement.interviewsGuaranteed} aria-valuenow={engagement.interviewsLanded} className="h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-positive" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-xs text-ink-muted">You keep full Jobwhisper access until all {engagement.interviewsGuaranteed} are booked.</p>
            </div>
            <dl className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="grid justify-items-center gap-0.5 rounded-xl bg-surface-subtle px-3 py-4 text-center">
                  <dd className="text-xl font-bold text-ink">{stat.value}</dd>
                  <dt className="text-sm text-ink-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <div className="grid gap-3 rounded-xl bg-surface-inverse p-4 text-surface sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">Latest update from {firstName} · {openingDate.format(new Date(engagement.latestUpdate.date))}</p>
              <p className="text-sm leading-6">{engagement.latestUpdate.note}</p>
              <button
                type="button"
                onClick={onMessage}
                className="inline-flex min-h-11 items-center justify-self-start rounded-lg bg-positive-surface px-5 text-sm font-bold text-positive transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
              >
                <MessageSquare aria-hidden="true" className="me-2 size-4" />
                Message {firstName}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="sent-applications" className="mt-12">
        <h2 id="sent-applications" className="mb-5 text-center font-gowun text-xl font-bold text-ink">Applications {firstName} Sent for You</h2>
        {engagement.applications.length === 0 ? (
          <EmptyState className="rounded-panel bg-surface shadow-panel" title={`${firstName} is picking your first roles`} description="Your first applications go out within 48 hours of your kickoff call. They will appear here as they are sent." />
        ) : (
          <div className="overflow-x-auto rounded-panel bg-surface shadow-panel">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-border text-start text-ink-muted">
                  <th scope="col" className="px-5 py-3 text-start font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 text-start font-semibold">Sent</th>
                  <th scope="col" className="px-5 py-3 text-start font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {engagement.applications.map((application) => (
                  <tr key={application.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-ink">{application.company}</p>
                      <p className="text-ink-muted">{application.role} · {application.location}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-muted">{openingDate.format(new Date(application.sentOn))}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-ink">
                        <span aria-hidden="true" className={cn('size-2 rounded-full', STATUS[application.status].dot)} />
                        {STATUS[application.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

function DirectorySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading success managers" className="mt-10 grid gap-8">
      <div className="grid gap-6 rounded-panel bg-surface p-6 shadow-panel lg:grid-cols-2">
        <div className="grid content-start gap-4">
          <div className="flex gap-3">
            <Skeleton className="size-16 rounded-full" />
            <div className="grid flex-1 gap-2"><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-64" /><Skeleton className="h-5 w-72" /></div>
          </div>
          <Skeleton className="h-24" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid content-start gap-3">
          <div className="grid gap-2 sm:grid-cols-2">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-24" />)}</div>
          <Skeleton className="h-36" />
        </div>
      </div>
      {[0, 1].map((item) => <Skeleton key={item} className="h-44 rounded-panel" />)}
    </div>
  )
}

export function DoneForYouView({ homeHref, parent, setupHref, profile, savedCard, directory, engagement, onRetry, onMessageManager, onSignupComplete }: DoneForYouViewProps) {
  const [signup, setSignup] = useState<{ readonly pkg: DfySignupPackage; readonly managerId: string } | null>(null)
  const managers = directory.status === 'ready' ? directory.managers : []
  const available = managers.filter((manager) => manager.nextOpening === undefined)
  const myManager = engagement ? managers.find((manager) => manager.id === engagement.managerId) : undefined
  const start = (manager: SuccessManager) => setSignup({ managerId: manager.id, pkg: packageFor(manager) })

  return (
    <AppShell>
      <ShellBar
        homeHref={homeHref}
        parent={parent}
        current="Done For You"
        closeHref={parent.href}
        closeLabel="Close Done For You"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="text-center font-gowun text-2xl leading-tight text-ink sm:text-4xl">
          {engagement ? 'Your Success Manager Is Applying for You,' : 'Choose a Success Manager Who Applies for You,'}
          <br />
          Built to <strong className="font-bold">Land Your Next Interview</strong>
        </h1>

        {directory.status === 'loading' ? <DirectorySkeleton /> : null}

        {directory.status === 'error' ? (
          <div role="alert" className="mx-auto mt-10 grid max-w-md justify-items-center gap-3 rounded-panel bg-surface p-8 text-center shadow-panel">
            <p className="font-gowun text-lg font-semibold text-ink">We couldn’t load the success managers</p>
            <p className="text-sm text-ink-muted">Your saved details are safe. Try again in a moment.</p>
            <Button variant="secondary" leadingIcon={<RotateCw aria-hidden="true" className="size-4" />} onClick={onRetry}>Try again</Button>
          </div>
        ) : null}

        {myManager && engagement ? <ActivePackage manager={myManager} engagement={engagement} onMessage={onMessageManager} /> : null}

        {directory.status === 'ready' && !engagement && available.length === 0 ? (
          <EmptyState
            className="mt-10 rounded-panel bg-surface shadow-panel"
            title="Every success manager is fully booked"
            description="New places open every week. Until then, Auto Apply can keep sending tailored applications for you."
            action={<a href={setupHref} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set up Auto Apply</a>}
          />
        ) : null}

        {directory.status === 'ready' && !engagement && available.length > 0 ? (
          <>
            <PackageIncludes />
            <section aria-labelledby="all-managers" className="mt-12">
              <h2 id="all-managers" className="mb-5 text-center font-gowun text-xl font-bold text-ink">Available Success Managers</h2>
              <ul className="grid gap-4">
                {managers.map((manager) => (
                  <ManagerRow key={manager.id} manager={manager} onStart={() => start(manager)} />
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </div>

      {signup ? (
        <DfySignupDialog
          open
          onOpenChange={(open) => {
            if (!open) setSignup(null)
          }}
          pkg={signup.pkg}
          profile={profile}
          setupHref={setupHref}
          savedCard={savedCard}
          onComplete={(lead) => onSignupComplete?.({ ...lead, managerId: signup.managerId })}
        />
      ) : null}
    </AppShell>
  )
}
