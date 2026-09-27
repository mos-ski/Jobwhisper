import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { GripVertical, Link as LinkIcon, Mail, MapPin, Phone, Plus, X } from 'lucide-react'

import type { ResumeDocument, ResumeIssue, ResumeIssueSeverity, ResumeRole, ResumeSectionId } from '@/contracts/resume.draft'
import { Button, cn } from '@/ui'

export type ResumeInlineEditorProps = {
  readonly document: ResumeDocument
  readonly issues: readonly ResumeIssue[]
  /** Chat's rewrite is waiting on Accept or Reject: show it in place, highlighted. */
  readonly pendingSuggestion?: boolean
  /** Chat's rewrite was accepted: fold it into the resume. */
  readonly acceptedSuggestion?: boolean
  /** The summary as it types out while Chat's rewrite arrives. */
  readonly typedSummary?: string | null
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

const SEVERITY_DOTS: Record<ResumeIssueSeverity, string> = { urgent: 'bg-danger', critical: 'bg-warning', optional: 'bg-info' }

// Inputs that read as the resume itself until you point at or focus them.
const field = 'w-full rounded-lg border border-transparent bg-transparent px-2.5 py-1.5 font-medium text-ink outline-none transition-colors duration-normal ease-default placeholder:font-normal placeholder:text-ink-muted hover:border-accent-muted hover:bg-accent-subtle focus:border-focus focus:bg-surface focus:ring-2 focus:ring-focus motion-reduce:transition-none'

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

/** The canvas id for a section, so the Edit panel can link straight to it. */
export function resumeSectionAnchor(section: ResumeSectionId): string {
  return `resume-edit-${section}`
}

function issueKey(section: BodySection, roleIndex?: number): string {
  return roleIndex === undefined ? section : `${section}:${roleIndex}`
}

export function ResumeInlineEditor({ document, issues, pendingSuggestion = false, acceptedSuggestion = false, typedSummary }: ResumeInlineEditorProps) {
  const [draft, setDraft] = useState<ResumeDocument>(document)
  const [order, setOrder] = useState<readonly BodySection[]>(DEFAULT_ORDER)
  const [resolved, setResolved] = useState<ReadonlySet<string>>(new Set())
  const [openFix, setOpenFix] = useState<string | null>(null)
  const [dragging, setDragging] = useState<BodySection | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [phone, setPhone] = useState('')
  const [newSkill, setNewSkill] = useState('')

  // Accepting Chat's rewrite writes it into the resume once, like accepting a Fix does.
  useEffect(() => {
    if (!acceptedSuggestion) return
    setDraft((current) => ({
      ...current,
      summary: document.improvedSummary,
      skills: document.improvedSkills,
      roles: current.roles.map((role, index) => (index === 0 ? { ...role, bullets: [...document.improvedFirstRoleBullets, ...role.bullets.slice(document.improvedFirstRoleBullets.length)] } : role)),
    }))
  }, [acceptedSuggestion])

  // While Chat's rewrite waits, the resume shows it in place, highlighted and read-only.
  const shown: ResumeDocument = pendingSuggestion
    ? {
        ...draft,
        summary: typedSummary ?? document.improvedSummary,
        skills: document.improvedSkills,
        roles: draft.roles.map((role, index) => (index === 0 ? { ...role, bullets: [...document.improvedFirstRoleBullets, ...role.bullets.slice(document.improvedFirstRoleBullets.length)] } : role)),
      }
    : draft
  const changed = 'bg-accent-subtle text-accent-text'

  const openIssues = issues.filter((issue) => !resolved.has(issueKey(issue.section as BodySection, issue.roleIndex)))

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
    const summary = SEVERITIES.flatMap((severity) => {
      const count = found.filter((issue) => issue.severity === severity).length
      return count > 0 ? [`${count} ${SEVERITY_LABELS[severity].toLowerCase()}`] : []
    }).join(', ')
    return (
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm text-ink-muted">{summary}</span>
        <Button size="sm" variant={open ? 'secondary' : 'primary'} aria-expanded={open} aria-controls={`fix-${key}`} aria-label={`${open ? 'Close' : 'Fix'} ${summary}`} onClick={() => setOpenFix(open ? null : key)}>
          {open ? 'Close' : 'Fix'}
        </Button>
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
          <GrowingTextarea aria-label="Summary" value={shown.summary} readOnly={pendingSuggestion} onChange={(event) => update({ summary: event.target.value })} className={cn(field, 'resize-none text-sm leading-6', pendingSuggestion && changed)} />
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'experience') {
      return (
        <div className="grid gap-6">
          {shown.roles.map((role, roleIndex) => (
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
                      readOnly={pendingSuggestion && roleIndex === 0 && bulletIndex < document.improvedFirstRoleBullets.length}
                      onChange={(event) => updateRole(roleIndex, { bullets: role.bullets.map((b, i) => (i === bulletIndex ? event.target.value : b)) })}
                      className={cn(field, 'resize-none text-sm leading-6', pendingSuggestion && roleIndex === 0 && bulletIndex < document.improvedFirstRoleBullets.length && changed)}
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
            {shown.skills.map((skill) => (
              <li key={skill} className={cn('inline-flex items-center gap-1 rounded-md ps-3 text-sm', pendingSuggestion && !draft.skills.includes(skill) ? changed : 'bg-surface-subtle text-ink')}>
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
      <div className="min-h-0 flex-1 scroll-smooth overflow-y-auto px-4 py-6 motion-reduce:scroll-auto sm:px-6">
        <div className="mx-auto w-full max-w-5xl rounded-panel border border-border bg-surface px-4 py-6 shadow-panel sm:px-10 sm:py-8">
          <h1 className="sr-only">{draft.candidateName}</h1>
          <header id={resumeSectionAnchor('personal-information')} className="grid scroll-mt-4 gap-2 border-b border-border pb-6">
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
                id={resumeSectionAnchor(section)}
                aria-labelledby={`resume-section-${section}`}
                draggable={dragging === section}
                onDragOver={(event) => { if (dragging) event.preventDefault() }}
                onDrop={(event) => { event.preventDefault(); if (dragging) move(dragging, order.indexOf(section)); setDragging(null) }}
                onDragEnd={() => setDragging(null)}
                className={cn('scroll-mt-4 border-b border-border py-6 last:border-b-0', dragging === section && 'opacity-60')}
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
