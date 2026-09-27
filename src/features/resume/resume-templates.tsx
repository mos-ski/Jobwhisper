import type { ReactNode } from 'react'

import type { ResumeDocument } from '@/contracts/resume.draft'
import { cn } from '@/ui'

function PageBreakLine({ top }: { readonly top: string }) {
  return (
    <div
      className="pointer-events-none absolute start-0 end-0 z-10 flex items-center gap-2 border-b-2 border-dashed border-accent py-1"
      style={{ top }}
      aria-hidden="true"
    >
      <span className="bg-paper px-1 text-[10px] font-medium uppercase tracking-wide text-accent-text">Page break</span>
    </div>
  )
}

function ResumePaper({ children, compact = false, showPageBreaks = true }: { readonly children: ReactNode; readonly compact?: boolean; readonly showPageBreaks?: boolean }) {
  const pageHeight = compact ? '42.35rem' : '56.94rem'
  return (
    <article
      className={cn(
        'relative mx-auto w-full bg-paper p-10 font-serif text-paper-ink shadow-xl ring-1 ring-paper-ink/10',
        compact ? 'max-w-3xl' : 'max-w-[44rem]',
      )}
      aria-label="Resume preview"
    >
      {showPageBreaks ? (
        <>
          <PageBreakLine top={pageHeight} />
          <PageBreakLine top={`calc(${pageHeight} * 2)`} />
          <PageBreakLine top={`calc(${pageHeight} * 3)`} />
        </>
      ) : null}
      {children}
    </article>
  )
}

export type ClassicResumeProps = {
  readonly document: ResumeDocument
  readonly showImproved: boolean
  readonly highlightChanges: boolean
  readonly typedSummary?: string | null
  readonly isTypingSummary?: boolean
  /** Dashed page-break guides for the editor; off where the page is shown as a sample. Defaults to true. */
  readonly showPageBreaks?: boolean
}

export function ClassicResume({
  document,
  showImproved,
  highlightChanges,
  typedSummary,
  isTypingSummary,
  showPageBreaks = true,
}: ClassicResumeProps) {
  return (
    <ResumePaper showPageBreaks={showPageBreaks}>
      <header className="border-b border-paper-ink pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">{document.candidateName}</h1>
        <p className="mt-2 text-xs text-paper-muted">
          <a href={`mailto:${document.email}`} className="text-accent-text underline">{document.email}</a> | {document.location} | {document.linkedinUrl} | {document.portfolioUrl}
        </p>
      </header>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Professional Summary</h2>
        <p
          className={cn(
            'mt-2 rounded-sm text-xs italic leading-5 transition-shadow duration-normal ease-default',
            highlightChanges ? 'bg-accent-subtle text-accent-text' : 'text-paper-ink',
            isTypingSummary && 'shadow-[0_0_0_3px_var(--lf-accent-subtle)]',
          )}
        >
          {typedSummary !== null && typedSummary !== undefined ? typedSummary : showImproved ? document.improvedSummary : document.summary}
          {isTypingSummary ? (
            <span aria-hidden="true" className="ms-0.5 inline-block h-3 w-px animate-pulse bg-accent-text align-middle motion-reduce:animate-none" />
          ) : null}
        </p>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Experience</h2>
        <div className="grid gap-5 pt-3">
          {document.roles.map((role, roleIndex) => {
            const bullets =
              showImproved && roleIndex === 0
                ? role.bullets.map((bullet, index) => (index < 2 ? document.improvedFirstRoleBullets[index] ?? bullet : bullet))
                : role.bullets
            return (
              <article key={`${role.company}-${role.period}`}>
                <div className="flex items-start justify-between gap-4 text-xs">
                  <div>
                    <h3 className="font-bold">{role.company}</h3>
                    <p className="italic text-paper-muted">{role.location}</p>
                    <p className="italic">{role.title}</p>
                  </div>
                  <p className="shrink-0 text-end text-paper-muted">{role.period}</p>
                </div>
                <ul className="mt-2 list-disc space-y-1.5 ps-5 text-xs leading-5">
                  {bullets.map((bullet, index) => (
                    <li key={bullet} className={cn(highlightChanges && roleIndex === 0 && index < 2 ? 'bg-accent-subtle text-accent-text' : '')}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Skills</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {(showImproved ? document.improvedSkills : document.skills).slice(0, showImproved ? 22 : 14).map((skill) => (
            <span key={skill} className={cn(highlightChanges && !document.skills.includes(skill) ? 'bg-accent-subtle font-semibold text-accent-text' : undefined)}>
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Certifications</h2>
        {document.certifications.map((certification) => (
          <div key={certification.name} className="mt-2 flex justify-between gap-4 text-xs">
            <div>
              <h3 className="font-bold">{certification.name}</h3>
              <p className="text-paper-muted">{certification.issuer}</p>
            </div>
            <p>{certification.year}</p>
          </div>
        ))}
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Projects</h2>
        <div className="grid gap-4 pt-3">
          {document.projects.map((project) => (
            <article key={project.name}>
              <div className="flex items-start justify-between gap-4 text-xs">
                <h3 className="font-bold">{project.name}</h3>
                <p className="shrink-0 text-end text-paper-muted">{project.year}</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-paper-ink">{project.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Languages</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {document.languages.map((item) => (
            <div key={item.language} className="flex justify-between gap-2">
              <span className="font-medium">{item.language}</span>
              <span className="text-paper-muted">{item.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    </ResumePaper>
  )
}
