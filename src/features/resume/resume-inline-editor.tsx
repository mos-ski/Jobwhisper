import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { ChevronRight, GripVertical, Link as LinkIcon, Mail, MapPin, Phone, Plus, X } from 'lucide-react'

import type { ResumeDocument, ResumeIssue, ResumeIssueSeverity, ResumeRole, ResumeSectionId } from '@/contracts/resume.draft'
import { Button, cn } from '@/ui'

export type ResumeInlineEditorProps = {
  readonly document: ResumeDocument
  readonly issues: readonly ResumeIssue[]
  /** e.g. "Last analysed 2 days ago". */
  readonly analysedLabel: string
  /** The Chat / Edit switch, rendered by the editor shell so both tabs share it. */
  readonly tabSwitch: ReactNode
  readonly onOpenReport: () => void
  readonly onReanalyze: () => void
}

type BodySection = Exclude<ResumeSectionId, 'personal-information'>

const SECTION_LABELS: Record<BodySection, string> = {
  'professional-summary': 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  certifications: 'Certifications',
  projects: 'Projects',
  languages: 'Languages',
}

const DEFAULT_ORDER: readonly BodySection[] = ['professional-summary', 'experience', 'skills', 'education', 'certifications', 'projects', 'languages']

const SEVERITIES: readonly ResumeIssueSeverity[] = ['urgent', 'critical', 'optional']

const SEVERITY_LABELS: Record<ResumeIssueSeverity, string> = { urgent: 'Urgent', critical: 'Critical', optional: 'Optional' }

const SEVERITY_TILES: Record<ResumeIssueSeverity, string> = {
  urgent: 'bg-danger-surface border-danger',
  critical: 'bg-warning-surface border-warning',
  optional: 'bg-info-surface border-info',
}

const SEVERITY_DOTS: Record<ResumeIssueSeverity, string> = { urgent: 'bg-danger', critical: 'bg-warning', optional: 'bg-info' }

// Inputs that read as the resume itself until you point at or focus them.
const field = 'w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-ink outline-none placeholder:text-ink-muted hover:bg-surface-subtle focus:border-focus focus:bg-surface focus:ring-2 focus:ring-focus'

function gradeFor(score: number): { readonly letter: string; readonly verdict: string } {
  if (score >= 90) return { letter: 'A', verdict: 'Excellent' }
  if (score >= 80) return { letter: 'B', verdict: 'Good' }
  if (score >= 70) return { letter: 'C', verdict: 'Fair' }
  return { letter: 'D', verdict: 'Needs work' }
}

/** A textarea as tall as its text, at any width, so no part of a resume line hides behind a scrollbar. */
function GrowingTextarea({ value, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { readonly value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const fit = () => {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight + element.offsetHeight - element.clientHeight}px`
    }
    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    return () => observer.disconnect()
  }, [value])

  return <textarea ref={ref} rows={1} value={value} className={cn('overflow-hidden', className)} {...props} />
}

function issueKey(section: BodySection, roleIndex?: number): string {
  return roleIndex === undefined ? section : `${section}:${roleIndex}`
}

export function ResumeInlineEditor({ document, issues, analysedLabel, tabSwitch, onOpenReport, onReanalyze }: ResumeInlineEditorProps) {
  const [draft, setDraft] = useState<ResumeDocument>(document)
  const [order, setOrder] = useState<readonly BodySection[]>(DEFAULT_ORDER)
  const [resolved, setResolved] = useState<ReadonlySet<string>>(new Set())
  const [openFix, setOpenFix] = useState<string | null>(null)
  const [dragging, setDragging] = useState<BodySection | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [phone, setPhone] = useState('')
  const [newSkill, setNewSkill] = useState('')

  const openIssues = issues.filter((issue) => !resolved.has(issueKey(issue.section as BodySection, issue.roleIndex)))
  const grade = gradeFor(document.atsScore)

  function update(patch: Partial<ResumeDocument>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function updateRole(index: number, patch: Partial<ResumeRole>) {
    setDraft((current) => ({ ...current, roles: current.roles.map((role, i) => (i === index ? { ...role, ...patch } : role)) }))
  }

  function move(section: BodySection, to: number) {
    const from = order.indexOf(section)
    if (from < 0 || to < 0 || to >= order.length || from === to) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, section)
    setOrder(next)
    setAnnouncement(`${SECTION_LABELS[section]} moved to position ${to + 1} of ${order.length}.`)
  }

  function onHandleKeyDown(event: KeyboardEvent<HTMLButtonElement>, section: BodySection) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    move(section, order.indexOf(section) + (event.key === 'ArrowUp' ? -1 : 1))
  }

  function resolve(key: string) {
    setResolved((current) => new Set(current).add(key))
    setOpenFix(null)
  }

  function issuesFor(section: BodySection, roleIndex?: number) {
    return openIssues.filter((issue) => issue.section === section && (roleIndex === undefined ? issue.roleIndex === undefined : issue.roleIndex === roleIndex))
  }

  // Where Jobwhisper already has a rewrite, FIX shows it to accept; elsewhere it explains what to change.
  function rewriteFor(key: string): { readonly label: string; readonly text: string; readonly apply: () => void } | undefined {
    if (key === 'professional-summary') return { label: 'Suggested summary', text: document.improvedSummary, apply: () => update({ summary: document.improvedSummary }) }
    if (key === 'experience:0') {
      const bullets = document.improvedFirstRoleBullets
      return {
        label: 'Suggested bullets',
        text: bullets.join('\n'),
        apply: () => updateRole(0, { bullets: [...bullets, ...(draft.roles[0]?.bullets.slice(bullets.length) ?? [])] }),
      }
    }
    if (key === 'skills') return { label: 'Suggested skills', text: document.improvedSkills.join(' · '), apply: () => update({ skills: document.improvedSkills }) }
    return undefined
  }

  function sectionTools(section: BodySection, roleIndex?: number) {
    const key = issueKey(section, roleIndex)
    const found = issuesFor(section, roleIndex)
    if (found.length === 0) return null
    const open = openFix === key
    return (
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {SEVERITIES.map((severity) => {
          const count = found.filter((issue) => issue.severity === severity).length
          if (count === 0) return null
          return (
            <span key={severity} className="inline-flex items-center gap-1.5 rounded-pill bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-ink">
              <span aria-hidden="true" className={cn('size-2 rounded-full', SEVERITY_DOTS[severity])} />
              {count} {SEVERITY_LABELS[severity]}
            </span>
          )
        })}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`fix-${key}`}
          onClick={() => setOpenFix(open ? null : key)}
          className="inline-flex min-h-9 items-center rounded-pill bg-positive-surface px-4 text-xs font-bold uppercase tracking-wide text-positive hover:bg-positive hover:text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Fix
        </button>
      </div>
    )
  }

  function fixPanel(section: BodySection, roleIndex?: number) {
    const key = issueKey(section, roleIndex)
    if (openFix !== key) return null
    const rewrite = rewriteFor(key)
    return (
      <div id={`fix-${key}`} className="mt-3 grid gap-3 rounded-lg border border-accent bg-accent-subtle p-4">
        <ul className="grid gap-2">
          {issuesFor(section, roleIndex).map((issue) => (
            <li key={issue.id} className="flex gap-2 text-sm text-ink">
              <span aria-hidden="true" className={cn('mt-1.5 size-2 shrink-0 rounded-full', SEVERITY_DOTS[issue.severity])} />
              <span><span className="font-semibold">{SEVERITY_LABELS[issue.severity]}:</span> {issue.detail}</span>
            </li>
          ))}
        </ul>
        {rewrite ? (
          <div className="grid gap-2 rounded-md bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-text">{rewrite.label}</p>
            <p className="whitespace-pre-line text-sm leading-6 text-ink">{rewrite.text}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {rewrite ? (
            <>
              <Button size="sm" onClick={() => { rewrite.apply(); resolve(key) }}>Accept</Button>
              <Button size="sm" variant="secondary" onClick={() => setOpenFix(null)}>Reject</Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => resolve(key)}>Mark as fixed</Button>
          )}
        </div>
      </div>
    )
  }

  function sectionBody(section: BodySection): ReactNode {
    if (section === 'professional-summary') {
      return (
        <>
          <GrowingTextarea aria-label="Summary" value={draft.summary} onChange={(event) => update({ summary: event.target.value })} className={cn(field, 'resize-none text-sm leading-6')} />
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'experience') {
      return (
        <div className="grid gap-6">
          {draft.roles.map((role, roleIndex) => (
            <article key={`${role.company}-${roleIndex}`} className="grid gap-1 border-b border-border pb-5 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-2">
                  <input aria-label={`Company, role ${roleIndex + 1}`} value={role.company} onChange={(event) => updateRole(roleIndex, { company: event.target.value })} className={cn(field, 'font-semibold')} />
                  <input aria-label={`Dates, role ${roleIndex + 1}`} value={role.period} onChange={(event) => updateRole(roleIndex, { period: event.target.value })} className={cn(field, 'text-sm text-ink-muted sm:text-end')} />
                  <input aria-label={`Job title, role ${roleIndex + 1}`} value={role.title} onChange={(event) => updateRole(roleIndex, { title: event.target.value })} className={cn(field, 'text-sm italic')} />
                  <input aria-label={`Location, role ${roleIndex + 1}`} value={role.location} onChange={(event) => updateRole(roleIndex, { location: event.target.value })} className={cn(field, 'text-sm text-ink-muted sm:text-end')} />
                </div>
                {sectionTools(section, roleIndex)}
              </div>
              <ul className="grid gap-1">
                {role.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="group flex items-start gap-1">
                    <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-ink" />
                    <GrowingTextarea
                      aria-label={`Bullet ${bulletIndex + 1}, ${role.company}`}
                      value={bullet}
                      onChange={(event) => updateRole(roleIndex, { bullets: role.bullets.map((b, i) => (i === bulletIndex ? event.target.value : b)) })}
                      className={cn(field, 'resize-none text-sm leading-6')}
                    />
                    <button
                      type="button"
                      aria-label={`Remove bullet ${bulletIndex + 1}, ${role.company}`}
                      onClick={() => updateRole(roleIndex, { bullets: role.bullets.filter((_, i) => i !== bulletIndex) })}
                      className="grid size-9 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <X aria-hidden="true" className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => updateRole(roleIndex, { bullets: [...role.bullets, ''] })}
                className="inline-flex min-h-9 items-center gap-1.5 justify-self-start rounded-md border border-border px-3 text-sm font-medium text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <Plus aria-hidden="true" className="size-4" />
                Bullet point
              </button>
              {fixPanel(section, roleIndex)}
            </article>
          ))}
        </div>
      )
    }
    if (section === 'skills') {
      const addSkill = () => {
        const value = newSkill.trim()
        if (!value || draft.skills.includes(value)) return
        update({ skills: [...draft.skills, value] })
        setNewSkill('')
      }
      return (
        <>
          <ul aria-label="Skills" className="flex flex-wrap gap-2">
            {draft.skills.map((skill) => (
              <li key={skill} className="inline-flex items-center gap-1 rounded-md bg-surface-subtle ps-3 text-sm text-ink">
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => update({ skills: draft.skills.filter((item) => item !== skill) })}
                  className="grid size-8 place-items-center rounded-md text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <input
            aria-label="Add skill"
            placeholder="Add skill…"
            value={newSkill}
            onChange={(event) => setNewSkill(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill() } }}
            className={cn(field, 'mt-2 max-w-xs border-border text-sm')}
          />
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'education') {
      return (
        <>
          <div className="grid gap-2">
            {draft.education.map((item, index) => (
              <div key={index} className="grid gap-1 sm:grid-cols-[1fr_1fr_6rem]">
                <input aria-label={`School ${index + 1}`} value={item.school} onChange={(event) => update({ education: draft.education.map((e, i) => (i === index ? { ...e, school: event.target.value } : e)) })} className={cn(field, 'font-semibold')} />
                <input aria-label={`Degree ${index + 1}`} value={item.degree} onChange={(event) => update({ education: draft.education.map((e, i) => (i === index ? { ...e, degree: event.target.value } : e)) })} className={cn(field, 'text-sm')} />
                <input aria-label={`Year ${index + 1}`} value={item.year} onChange={(event) => update({ education: draft.education.map((e, i) => (i === index ? { ...e, year: event.target.value } : e)) })} className={cn(field, 'text-sm text-ink-muted sm:text-end')} />
              </div>
            ))}
          </div>
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'certifications') {
      return (
        <>
          <div className="grid gap-2">
            {draft.certifications.map((item, index) => (
              <div key={index} className="grid gap-1 sm:grid-cols-[1fr_1fr_6rem]">
                <input aria-label={`Certification ${index + 1}`} value={item.name} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, name: event.target.value } : c)) })} className={cn(field, 'font-semibold')} />
                <input aria-label={`Issuer ${index + 1}`} value={item.issuer} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, issuer: event.target.value } : c)) })} className={cn(field, 'text-sm')} />
                <input aria-label={`Certification year ${index + 1}`} value={item.year} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, year: event.target.value } : c)) })} className={cn(field, 'text-sm text-ink-muted sm:text-end')} />
              </div>
            ))}
          </div>
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'projects') {
      return (
        <div className="grid gap-3">
          {draft.projects.map((item, index) => (
            <div key={index} className="grid gap-1">
              <div className="grid gap-1 sm:grid-cols-[1fr_6rem]">
                <input aria-label={`Project ${index + 1}`} value={item.name} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, name: event.target.value } : p)) })} className={cn(field, 'font-semibold')} />
                <input aria-label={`Project year ${index + 1}`} value={item.year} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, year: event.target.value } : p)) })} className={cn(field, 'text-sm text-ink-muted sm:text-end')} />
              </div>
              <GrowingTextarea aria-label={`Project description ${index + 1}`} value={item.description} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, description: event.target.value } : p)) })} className={cn(field, 'resize-none text-sm leading-6')} />
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className="grid gap-1 sm:grid-cols-2">
        {draft.languages.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-1">
            <input aria-label={`Language ${index + 1}`} value={item.language} onChange={(event) => update({ languages: draft.languages.map((l, i) => (i === index ? { ...l, language: event.target.value } : l)) })} className={cn(field, 'text-sm font-medium')} />
            <input aria-label={`Proficiency ${index + 1}`} value={item.proficiency} onChange={(event) => update({ languages: draft.languages.map((l, i) => (i === index ? { ...l, proficiency: event.target.value } : l)) })} className={cn(field, 'text-sm text-ink-muted')} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div data-slot="resume-inline-editor" className="flex min-h-0 flex-1 flex-col bg-canvas">
      <div className="shrink-0 border-b border-border bg-surface px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-3">
          <div className="w-full max-w-56 sm:w-56">{tabSwitch}</div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-12 place-items-center rounded-lg bg-warning-surface font-gowun text-2xl font-bold text-ink">{grade.letter}</span>
            <div className="grid gap-0.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink">
                <span className="sr-only">ATS grade {grade.letter}, </span>{grade.verdict}
              </span>
              <button type="button" onClick={onOpenReport} className="inline-flex min-h-8 items-center gap-1 text-sm font-medium text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                View full report
                <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
          <dl className="ms-auto flex gap-2">
            {SEVERITIES.map((severity) => (
              <div key={severity} className={cn('grid min-w-20 justify-items-center rounded-lg border-b-2 px-3 py-1.5', SEVERITY_TILES[severity])}>
                <dd className="order-1 text-lg font-bold leading-6 text-ink">{openIssues.filter((issue) => issue.severity === severity).length}</dd>
                <dt className="order-2 text-xs font-semibold uppercase tracking-wide text-ink">{SEVERITY_LABELS[severity]} fix</dt>
              </div>
            ))}
          </dl>
          <div className="grid justify-items-center gap-0.5">
            <Button onClick={onReanalyze} className="bg-surface-inverse text-surface hover:bg-ink-muted">Re-analyze</Button>
            <span className="text-xs text-ink-muted">{analysedLabel}</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-5xl rounded-panel border border-border bg-surface px-4 py-6 shadow-panel sm:px-10 sm:py-8">
          <h1 className="sr-only">Edit resume, {draft.candidateName}</h1>
          <header className="grid gap-2 border-b border-border pb-6">
            <input aria-label="Full name" value={draft.candidateName} onChange={(event) => update({ candidateName: event.target.value })} className={cn(field, 'font-gowun text-3xl font-bold')} />
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-sm text-ink-muted"><Mail aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Email</span><input value={draft.email} onChange={(event) => update({ email: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><Phone aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Phone</span><input value={phone} placeholder="Phone" onChange={(event) => setPhone(event.target.value)} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><MapPin aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Location</span><input value={draft.location} onChange={(event) => update({ location: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><LinkIcon aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">LinkedIn</span><input value={draft.linkedinUrl} onChange={(event) => update({ linkedinUrl: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><LinkIcon aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Website</span><input value={draft.portfolioUrl} onChange={(event) => update({ portfolioUrl: event.target.value })} className={cn(field, 'text-sm')} /></label>
            </div>
          </header>

          <p role="status" className="sr-only">{announcement}</p>

          {order.map((section) => {
            const label = SECTION_LABELS[section]
            return (
              <section
                key={section}
                aria-labelledby={`resume-section-${section}`}
                draggable={dragging === section}
                onDragOver={(event) => { if (dragging) event.preventDefault() }}
                onDrop={(event) => { event.preventDefault(); if (dragging) move(dragging, order.indexOf(section)); setDragging(null) }}
                onDragEnd={() => setDragging(null)}
                className={cn('border-b border-border py-6 last:border-b-0', dragging === section && 'opacity-60')}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Move ${label}. Use the up and down arrow keys.`}
                      onPointerDown={() => setDragging(section)}
                      onPointerUp={() => setDragging((current) => (current === section ? null : current))}
                      onKeyDown={(event) => onHandleKeyDown(event, section)}
                      className="grid size-9 cursor-grab place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <GripVertical aria-hidden="true" className="size-4" />
                    </button>
                    <h2 id={`resume-section-${section}`} className="text-sm font-bold uppercase tracking-wide text-ink">{label}</h2>
                  </div>
                  {section === 'experience' ? null : sectionTools(section)}
                </div>
                {sectionBody(section)}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
