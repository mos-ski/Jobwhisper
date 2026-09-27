import { useEffect, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { ArrowRight, ChevronDown, GripVertical, Link as LinkIcon, Mail, MapPin, Phone, Plus, Trash2, X } from 'lucide-react'

import type { ResumeDocument, ResumeEducation, ResumeExtraEntry, ResumeExtraSection, ResumeExtraSectionKind, ResumeIssue, ResumeIssueSeverity, ResumeRole, ResumeSectionId, ResumeSkillGroup } from '@/contracts/resume.draft'
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
  /** Sections added from the Edit panel's Add Section, after the standard ones. */
  readonly extraSections?: readonly ResumeExtraSection[]
  /** Standard sections the person removed; Add Section can bring them back. */
  readonly hiddenSections?: readonly ResumeSectionId[]
  readonly onRenameSection?: (id: string, title: string) => void
  /** Called with a standard section id or an added section's id. */
  readonly onRemoveSection?: (id: string) => void
  /** Reports the section holding focus, so the Edit panel can mark it. */
  readonly onActiveSectionChange?: (id: string) => void
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

const EXTRA_PLACEHOLDERS: Record<ResumeExtraSectionKind, { readonly title: string; readonly subtitle: string }> = {
  awards: { title: 'Award', subtitle: 'Awarded by' },
  volunteering: { title: 'Role', subtitle: 'Organisation' },
  publications: { title: 'Title', subtitle: 'Publisher' },
  courses: { title: 'Course', subtitle: 'Provider' },
  interests: { title: 'Interest', subtitle: 'Detail' },
  references: { title: 'Name', subtitle: 'Role and contact' },
  custom: { title: 'Title', subtitle: 'Subtitle' },
}

// Blue text actions for adding a row, so they read as something to press.
const addAction = 'inline-flex min-h-10 items-center gap-1.5 justify-self-start rounded-lg px-3 text-sm font-semibold text-accent-text transition-colors duration-normal ease-default hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none'
const addItemAction = 'inline-flex min-h-10 items-center gap-1.5 justify-self-start rounded-lg border border-input bg-surface px-4 text-sm font-semibold text-ink transition-colors duration-normal ease-default hover:border-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none'
const removeAction = 'grid size-9 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

// Shared empty defaults: a fresh [] per render would re-run the effects that depend on these.
const NO_EXTRA_SECTIONS: readonly ResumeExtraSection[] = []
const NO_HIDDEN_SECTIONS: readonly ResumeSectionId[] = []

function blankEntry(): ResumeExtraEntry {
  return { id: `entry-${Math.random().toString(36).slice(2, 10)}`, title: '', subtitle: '', date: '', description: '' }
}

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

/**
 * A one-line field as wide as what is in it (or its placeholder), not the whole row. `field-sizing`
 * sizes it exactly where supported; the `size` attribute is the fallback everywhere else.
 */
function HugInput({ value, placeholder, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { readonly value: string }) {
  const characters = Math.max((value || placeholder || '').length, 4) + 1
  return (
    <input
      value={value}
      placeholder={placeholder}
      size={characters}
      className={cn(className, 'w-auto max-w-full [field-sizing:content]', className?.includes('sm:text-end') && 'sm:justify-self-end')}
      {...props}
    />
  )
}

/** The canvas id for a section, so the Edit panel can link straight to it. */
export function resumeSectionAnchor(section: ResumeSectionId | string): string {
  return `resume-edit-${section}`
}

function issueKey(section: BodySection, roleIndex?: number): string {
  return roleIndex === undefined ? section : `${section}:${roleIndex}`
}

export function ResumeInlineEditor({ document, issues, pendingSuggestion = false, acceptedSuggestion = false, typedSummary, extraSections = NO_EXTRA_SECTIONS, hiddenSections = NO_HIDDEN_SECTIONS, onRenameSection, onRemoveSection, onActiveSectionChange }: ResumeInlineEditorProps) {
  const [draft, setDraft] = useState<ResumeDocument>(document)
  const [order, setOrder] = useState<readonly string[]>(DEFAULT_ORDER)
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set())
  const [extraEntries, setExtraEntries] = useState<Readonly<Record<string, readonly ResumeExtraEntry[]>>>({})
  const [resolved, setResolved] = useState<ReadonlySet<string>>(new Set())
  const [openFix, setOpenFix] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [phone, setPhone] = useState('')
  const [skillGroups, setSkillGroups] = useState<readonly ResumeSkillGroup[]>(() => document.skillGroups ?? [{ id: 'group-core', title: 'Core skills', skills: document.skills }])
  const [newSkills, setNewSkills] = useState<Readonly<Record<string, string>>>({})
  const [newLanguage, setNewLanguage] = useState('')
  const [draggingLanguage, setDraggingLanguage] = useState<number | null>(null)
  const [draggingSkill, setDraggingSkill] = useState<{ readonly groupId: string; readonly index: number } | null>(null)

  // Added sections join the end of the order; removed ones leave it.
  useEffect(() => {
    const ids = extraSections.map((section) => section.id)
    setOrder((current) => {
      const next = [...current.filter((key) => isStandard(key) || ids.includes(key)), ...ids.filter((id) => !current.includes(id))]
      return next.length === current.length && next.every((key, index) => key === current[index]) ? current : next
    })
  }, [extraSections])

  // Jumping to a section from the Edit panel opens it if it was collapsed.
  useEffect(() => {
    const open = () => {
      const key = window.location.hash.replace('#resume-edit-', '')
      setCollapsed((current) => {
        if (!current.has(key)) return current
        const next = new Set(current)
        next.delete(key)
        return next
      })
    }
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])

  // Accepting Chat's rewrite writes it into the resume once, like accepting a Fix does.
  useEffect(() => {
    if (!acceptedSuggestion) return
    setDraft((current) => ({
      ...current,
      summary: document.improvedSummary,
      skills: document.improvedSkills,
      roles: current.roles.map((role, index) => (index === 0 ? { ...role, bullets: [...document.improvedFirstRoleBullets, ...role.bullets.slice(document.improvedFirstRoleBullets.length)] } : role)),
    }))
    setSkillGroups((current) => current.map((group, index) => (index === 0 ? { ...group, skills: document.improvedSkills } : group)))
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

  function isStandard(key: string): key is BodySection {
    return key in SECTION_LABELS
  }

  function labelFor(key: string): string {
    if (isStandard(key)) return SECTION_LABELS[key]
    return extraSections.find((section) => section.id === key)?.title || 'Untitled section'
  }

  function toggle(key: string) {
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function entriesFor(id: string): readonly ResumeExtraEntry[] {
    return extraEntries[id] ?? [blankEntry()]
  }

  function setEntries(id: string, entries: readonly ResumeExtraEntry[]) {
    setExtraEntries((current) => ({ ...current, [id]: entries }))
  }

  function updateGroup(groupId: string, patch: Partial<ResumeSkillGroup>) {
    setSkillGroups((current) => current.map((group) => (group.id === groupId ? { ...group, ...patch } : group)))
  }

  function moveSkill(groupId: string, from: number, to: number) {
    const group = skillGroups.find((item) => item.id === groupId)
    if (!group || to < 0 || to >= group.skills.length || from === to) return
    const skills = [...group.skills]
    const [skill] = skills.splice(from, 1)
    if (skill === undefined) return
    skills.splice(to, 0, skill)
    updateGroup(groupId, { skills })
    setAnnouncement(`${skill} moved to position ${to + 1} of ${skills.length} in ${group.title}.`)
  }

  function moveLanguage(from: number, to: number) {
    if (to < 0 || to >= draft.languages.length || from === to) return
    const languages = [...draft.languages]
    const [item] = languages.splice(from, 1)
    if (item === undefined) return
    languages.splice(to, 0, item)
    update({ languages })
    setAnnouncement(`${item.language || 'Language'} moved to position ${to + 1} of ${languages.length}.`)
  }

  function updateEducation(index: number, patch: Partial<ResumeEducation>) {
    setDraft((current) => ({ ...current, education: current.education.map((item, i) => (i === index ? { ...item, ...patch } : item)) }))
  }

  function move(section: string, to: number) {
    const from = order.indexOf(section)
    if (from < 0 || to < 0 || to >= order.length || from === to) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, section)
    setOrder(next)
    setAnnouncement(`${labelFor(section)} moved to position ${to + 1} of ${order.length}.`)
  }

  function onHandleKeyDown(event: KeyboardEvent<HTMLButtonElement>, section: string) {
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
    if (key === 'skills') {
      return {
        label: 'Suggested skills',
        text: document.improvedSkills.join(' · '),
        apply: () => setSkillGroups((current) => current.map((group, index) => (index === 0 ? { ...group, skills: document.improvedSkills } : group))),
      }
    }
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
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {SEVERITIES.map((severity) => {
          const count = found.filter((issue) => issue.severity === severity).length
          return count > 0 ? (
            <span key={severity} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-subtle px-3 text-xs font-semibold text-ink">
              <span aria-hidden="true" className={cn('size-2 rounded-full', SEVERITY_DOTS[severity])} />
              {count} {SEVERITY_LABELS[severity]}
            </span>
          ) : null
        })}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`fix-${key}`}
          aria-label={`${open ? 'Close' : 'Fix'} ${summary}`}
          onClick={() => setOpenFix(open ? null : key)}
          className={cn(
            'relative inline-flex h-8 min-w-11 items-center justify-center rounded-full border px-4 after:absolute after:-inset-1.5 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none',
            open ? 'border-border bg-surface text-ink hover:bg-surface-subtle' : 'border-positive/30 bg-positive-surface text-positive hover:border-positive/60',
          )}
        >
          {open ? 'Close' : 'Fix'}
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
          <GrowingTextarea aria-label="Summary" value={shown.summary} readOnly={pendingSuggestion} onChange={(event) => update({ summary: event.target.value })} className={cn(field, 'resize-none text-sm leading-6', pendingSuggestion && changed)} />
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'experience') {
      return (
        <div className="grid gap-6">
          {shown.roles.map((role, roleIndex) => (
            <article key={roleIndex} className="grid gap-1 border-b border-border pb-5 last:border-b-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid min-w-0 flex-1 gap-1">
                  <div className="flex flex-wrap items-center gap-x-1">
                    <HugInput aria-label={`Company, role ${roleIndex + 1}`} placeholder="Company" value={role.company} onChange={(event) => updateRole(roleIndex, { company: event.target.value })} className={cn(field, 'font-semibold')} />
                    <HugInput aria-label={`Dates, role ${roleIndex + 1}`} placeholder="Start - End" value={role.period} onChange={(event) => updateRole(roleIndex, { period: event.target.value })} className={cn(field, 'text-sm text-ink-muted')} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1">
                    <HugInput aria-label={`Job title, role ${roleIndex + 1}`} placeholder="Job title" value={role.title} onChange={(event) => updateRole(roleIndex, { title: event.target.value })} className={cn(field, 'text-sm italic')} />
                    <HugInput aria-label={`Location, role ${roleIndex + 1}`} placeholder="Location" value={role.location} onChange={(event) => updateRole(roleIndex, { location: event.target.value })} className={cn(field, 'text-sm text-ink-muted')} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {sectionTools(section, roleIndex)}
                  <button type="button" aria-label={`Remove ${role.company || `role ${roleIndex + 1}`}`} onClick={() => update({ roles: draft.roles.filter((_, i) => i !== roleIndex) })} className={removeAction}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
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
                className={addAction}
              >
                <Plus aria-hidden="true" className="size-4" />
                Bullet point
              </button>
              {fixPanel(section, roleIndex)}
            </article>
          ))}
          <button type="button" onClick={() => update({ roles: [...draft.roles, { company: '', location: '', title: '', period: '', bullets: [''] }] })} className={addItemAction}>
            <Plus aria-hidden="true" className="size-4" />
            Add experience
          </button>
        </div>
      )
    }
    if (section === 'skills') {
      return (
        <div className="grid gap-5">
          {skillGroups.map((group, groupIndex) => {
            // While Chat's rewrite waits, the first group shows the suggested skills.
            const shownSkills = pendingSuggestion && groupIndex === 0 ? document.improvedSkills : group.skills
            const newSkill = newSkills[group.id] ?? ''
            const addSkill = () => {
              const value = newSkill.trim()
              if (!value || group.skills.includes(value)) return
              updateGroup(group.id, { skills: [...group.skills, value] })
              setNewSkills((current) => ({ ...current, [group.id]: '' }))
            }
            return (
              <div key={group.id} className="grid gap-2 border-b border-border pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <HugInput aria-label={`Skill group ${groupIndex + 1} title`} placeholder="Group title" value={group.title} onChange={(event) => updateGroup(group.id, { title: event.target.value })} className={cn(field, 'max-w-sm font-semibold')} />
                  <button type="button" aria-label={`Remove ${group.title || 'skill group'}`} onClick={() => setSkillGroups((current) => current.filter((item) => item.id !== group.id))} className={removeAction}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <ul aria-label={group.title || `Skill group ${groupIndex + 1}`} className="flex flex-wrap gap-2">
                  {shownSkills.map((skill, index) => {
                    const isNew = pendingSuggestion && groupIndex === 0 && !group.skills.includes(skill)
                    return (
                      <li
                        key={skill}
                        draggable={draggingSkill?.groupId === group.id && draggingSkill.index === index}
                        onDragOver={(event) => { if (draggingSkill?.groupId === group.id) event.preventDefault() }}
                        onDrop={(event) => { event.preventDefault(); if (draggingSkill?.groupId === group.id) moveSkill(group.id, draggingSkill.index, index); setDraggingSkill(null) }}
                        onDragEnd={() => setDraggingSkill(null)}
                        className={cn('inline-flex min-h-10 items-center rounded-lg text-sm font-medium', isNew ? changed : 'bg-surface-subtle text-ink', draggingSkill?.groupId === group.id && draggingSkill.index === index && 'opacity-60')}
                      >
                        <button
                          type="button"
                          aria-label={`Move ${skill}. Use the arrow keys.`}
                          onPointerDown={() => setDraggingSkill({ groupId: group.id, index })}
                          onPointerUp={() => setDraggingSkill(null)}
                          onKeyDown={(event) => {
                            const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : 0
                            if (step === 0) return
                            event.preventDefault()
                            moveSkill(group.id, index, index + step)
                          }}
                          className="grid h-10 w-7 cursor-grab place-items-center rounded-s-lg text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          <GripVertical aria-hidden="true" className="size-3.5" />
                        </button>
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => updateGroup(group.id, { skills: group.skills.filter((item) => item !== skill) })}
                          className="grid size-9 place-items-center rounded-e-lg text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          <X aria-hidden="true" className="size-3.5" />
                        </button>
                      </li>
                    )
                  })}
                  <li>
                    <HugInput
                      aria-label={`Add skill to ${group.title || `group ${groupIndex + 1}`}`}
                      placeholder="Add skill…"
                      value={newSkill}
                      onChange={(event) => setNewSkills((current) => ({ ...current, [group.id]: event.target.value }))}
                      onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill() } }}
                      className={cn(field, 'min-h-10 w-44 bg-surface-subtle text-sm')}
                    />
                  </li>
                </ul>
              </div>
            )
          })}
          <button type="button" onClick={() => setSkillGroups((current) => [...current, { id: `group-${Math.random().toString(36).slice(2, 10)}`, title: '', skills: [] }])} className={addItemAction}>
            <Plus aria-hidden="true" className="size-4" />
            Add skill group
          </button>
          {fixPanel(section)}
        </div>
      )
    }
    if (section === 'education') {
      return (
        <div className="grid gap-5">
          {draft.education.map((item, index) => {
            const bullets = item.bullets ?? []
            const name = item.school || `education ${index + 1}`
            return (
              <article key={index} className="grid gap-1 border-b border-border pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <HugInput aria-label={`School ${index + 1}`} placeholder="School" value={item.school} onChange={(event) => updateEducation(index, { school: event.target.value })} className={cn(field, 'font-semibold')} />
                  <button type="button" aria-label={`Remove ${name}`} onClick={() => update({ education: draft.education.filter((_, i) => i !== index) })} className={removeAction}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <HugInput aria-label={`Start year, ${name}`} placeholder="Start" value={item.startYear ?? ''} onChange={(event) => updateEducation(index, { startYear: event.target.value })} className={cn(field, 'w-28 text-sm')} />
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted rtl:rotate-180" />
                  <HugInput aria-label={`End year, ${name}`} placeholder="End" value={item.year} onChange={(event) => updateEducation(index, { year: event.target.value })} className={cn(field, 'w-28 text-sm')} />
                </div>
                <HugInput aria-label={`GPA, ${name}`} placeholder="GPA…" value={item.gpa ?? ''} onChange={(event) => updateEducation(index, { gpa: event.target.value })} className={cn(field, 'max-w-xs bg-surface-subtle text-sm')} />
                <HugInput aria-label={`Location, ${name}`} placeholder="Location" value={item.location ?? ''} onChange={(event) => updateEducation(index, { location: event.target.value })} className={cn(field, 'max-w-sm text-sm')} />
                <HugInput aria-label={`Degree, ${name}`} placeholder="Degree" value={item.degree} onChange={(event) => updateEducation(index, { degree: event.target.value })} className={cn(field, 'max-w-md text-sm')} />
                <HugInput aria-label={`Achievements, ${name}`} placeholder="Add achievement…" value={item.achievements ?? ''} onChange={(event) => updateEducation(index, { achievements: event.target.value })} className={cn(field, 'max-w-md bg-surface-subtle text-sm')} />
                <HugInput aria-label={`Coursework, ${name}`} placeholder="Add coursework…" value={item.coursework ?? ''} onChange={(event) => updateEducation(index, { coursework: event.target.value })} className={cn(field, 'max-w-md bg-surface-subtle text-sm')} />
                {bullets.length > 0 ? (
                  <ul className="grid gap-1">
                    {bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start gap-1">
                        <span aria-hidden="true" className="mt-3.5 size-1.5 shrink-0 rounded-full bg-ink" />
                        <GrowingTextarea aria-label={`Bullet ${bulletIndex + 1}, ${name}`} value={bullet} onChange={(event) => updateEducation(index, { bullets: bullets.map((b, i) => (i === bulletIndex ? event.target.value : b)) })} className={cn(field, 'resize-none text-sm leading-6')} />
                        <button type="button" aria-label={`Remove bullet ${bulletIndex + 1}, ${name}`} onClick={() => updateEducation(index, { bullets: bullets.filter((_, i) => i !== bulletIndex) })} className={removeAction}><X aria-hidden="true" className="size-4" /></button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <button type="button" onClick={() => updateEducation(index, { bullets: [...bullets, ''] })} className={addAction}>
                  <Plus aria-hidden="true" className="size-4" />
                  Bullet point
                </button>
              </article>
            )
          })}
          <button type="button" onClick={() => update({ education: [...draft.education, { school: '', degree: '', year: '' }] })} className={addItemAction}>
            <Plus aria-hidden="true" className="size-4" />
            Add education
          </button>
          {fixPanel(section)}
        </div>
      )
    }
    if (section === 'certifications') {
      return (
        <>
          <div className="grid gap-2">
            {draft.certifications.map((item, index) => (
              <div key={index} className="flex flex-wrap items-center gap-x-1 gap-y-1">
                <HugInput aria-label={`Certification ${index + 1}`} placeholder="Certification" value={item.name} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, name: event.target.value } : c)) })} className={cn(field, 'font-semibold')} />
                <HugInput aria-label={`Issuer ${index + 1}`} placeholder="Issuer" value={item.issuer} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, issuer: event.target.value } : c)) })} className={cn(field, 'text-sm')} />
                <HugInput aria-label={`Certification year ${index + 1}`} placeholder="Year" value={item.year} onChange={(event) => update({ certifications: draft.certifications.map((c, i) => (i === index ? { ...c, year: event.target.value } : c)) })} className={cn(field, 'text-sm text-ink-muted')} />
                <button type="button" aria-label={`Remove ${item.name || `certification ${index + 1}`}`} onClick={() => update({ certifications: draft.certifications.filter((_, i) => i !== index) })} className={removeAction}><X aria-hidden="true" className="size-4" /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => update({ certifications: [...draft.certifications, { name: '', issuer: '', year: '' }] })} className={addItemAction}>
            <Plus aria-hidden="true" className="size-4" />
            Add certification
          </button>
          {fixPanel(section)}
        </>
      )
    }
    if (section === 'projects') {
      return (
        <div className="grid gap-3">
          {draft.projects.map((item, index) => (
            <div key={index} className="grid gap-1">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                <HugInput aria-label={`Project ${index + 1}`} placeholder="Project" value={item.name} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, name: event.target.value } : p)) })} className={cn(field, 'font-semibold')} />
                <HugInput aria-label={`Project year ${index + 1}`} placeholder="Year" value={item.year} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, year: event.target.value } : p)) })} className={cn(field, 'text-sm text-ink-muted')} />
                <button type="button" aria-label={`Remove ${item.name || `project ${index + 1}`}`} onClick={() => update({ projects: draft.projects.filter((_, i) => i !== index) })} className={removeAction}><X aria-hidden="true" className="size-4" /></button>
              </div>
              <GrowingTextarea aria-label={`Project description ${index + 1}`} placeholder="What you built and what it changed" value={item.description} onChange={(event) => update({ projects: draft.projects.map((p, i) => (i === index ? { ...p, description: event.target.value } : p)) })} className={cn(field, 'resize-none text-sm leading-6')} />
            </div>
          ))}
          <button type="button" onClick={() => update({ projects: [...draft.projects, { name: '', year: '', description: '' }] })} className={addItemAction}>
            <Plus aria-hidden="true" className="size-4" />
            Add project
          </button>
        </div>
      )
    }
    const addLanguage = () => {
      const value = newLanguage.trim()
      if (!value || draft.languages.some((item) => item.language === value)) return
      update({ languages: [...draft.languages, { language: value, proficiency: '' }] })
      setNewLanguage('')
    }
    return (
      <ul aria-label="Languages" className="flex flex-wrap gap-2">
        {draft.languages.map((item, index) => (
          <li
            key={index}
            draggable={draggingLanguage === index}
            onDragOver={(event) => { if (draggingLanguage !== null) event.preventDefault() }}
            onDrop={(event) => { event.preventDefault(); if (draggingLanguage !== null) moveLanguage(draggingLanguage, index); setDraggingLanguage(null) }}
            onDragEnd={() => setDraggingLanguage(null)}
            className={cn('inline-flex min-h-10 items-center rounded-lg bg-surface-subtle text-sm font-medium text-ink', draggingLanguage === index && 'opacity-60')}
          >
            <button
              type="button"
              aria-label={`Move ${item.language || `language ${index + 1}`}. Use the arrow keys.`}
              onPointerDown={() => setDraggingLanguage(index)}
              onPointerUp={() => setDraggingLanguage(null)}
              onKeyDown={(event) => {
                const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : 0
                if (step === 0) return
                event.preventDefault()
                moveLanguage(index, index + step)
              }}
              className="grid h-10 w-7 cursor-grab place-items-center rounded-s-lg text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <GripVertical aria-hidden="true" className="size-3.5" />
            </button>
            {item.language}
            <button
              type="button"
              aria-label={`Remove ${item.language || `language ${index + 1}`}`}
              onClick={() => update({ languages: draft.languages.filter((_, i) => i !== index) })}
              className="grid size-9 place-items-center rounded-e-lg text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </li>
        ))}
        <li>
          <HugInput
            aria-label="Add language"
            placeholder="Add language…"
            value={newLanguage}
            onChange={(event) => setNewLanguage(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addLanguage() } }}
            className={cn(field, 'min-h-10 w-44 bg-surface-subtle text-sm')}
          />
        </li>
      </ul>
    )
  }

  function extraBody(section: ResumeExtraSection): ReactNode {
    const entries = entriesFor(section.id)
    const hints = EXTRA_PLACEHOLDERS[section.kind]
    const patch = (entryId: string, change: Partial<ResumeExtraEntry>) => setEntries(section.id, entries.map((entry) => (entry.id === entryId ? { ...entry, ...change } : entry)))
    return (
      <div className="grid gap-3">
        {section.kind === 'custom' ? (
          <HugInput aria-label="Section title" placeholder="Section title" value={section.title} onChange={(event) => onRenameSection?.(section.id, event.target.value)} className={cn(field, 'max-w-sm border-border text-sm')} />
        ) : null}
        {entries.map((entry, index) => (
          <div key={entry.id} className="grid gap-1">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              <HugInput aria-label={`${hints.title} ${index + 1}, ${labelFor(section.id)}`} placeholder={hints.title} value={entry.title} onChange={(event) => patch(entry.id, { title: event.target.value })} className={cn(field, 'font-semibold')} />
              <HugInput aria-label={`${hints.subtitle} ${index + 1}, ${labelFor(section.id)}`} placeholder={hints.subtitle} value={entry.subtitle} onChange={(event) => patch(entry.id, { subtitle: event.target.value })} className={cn(field, 'text-sm')} />
              <HugInput aria-label={`Date ${index + 1}, ${labelFor(section.id)}`} placeholder="Date" value={entry.date} onChange={(event) => patch(entry.id, { date: event.target.value })} className={cn(field, 'text-sm text-ink-muted')} />
              <button type="button" aria-label={`Remove entry ${index + 1}, ${labelFor(section.id)}`} onClick={() => setEntries(section.id, entries.filter((item) => item.id !== entry.id))} className={removeAction}><X aria-hidden="true" className="size-4" /></button>
            </div>
            <GrowingTextarea aria-label={`Description ${index + 1}, ${labelFor(section.id)}`} placeholder="A line on what it was and why it matters" value={entry.description} onChange={(event) => patch(entry.id, { description: event.target.value })} className={cn(field, 'resize-none text-sm leading-6')} />
          </div>
        ))}
        <button type="button" onClick={() => setEntries(section.id, [...entries, blankEntry()])} className={addItemAction}>
          <Plus aria-hidden="true" className="size-4" />
          Add entry
        </button>
      </div>
    )
  }

  return (
    <div data-slot="resume-inline-editor" className="flex min-h-0 flex-1 flex-col bg-canvas">
      <div className="min-h-0 flex-1 scroll-smooth overflow-y-auto px-4 py-6 motion-reduce:scroll-auto sm:px-6">
        <div className="mx-auto w-full max-w-5xl rounded-panel border border-border bg-surface px-4 py-6 shadow-panel sm:px-10 sm:py-8">
          <h1 className="sr-only">{draft.candidateName}</h1>
          <header id={resumeSectionAnchor('personal-information')} onFocus={() => onActiveSectionChange?.('personal-information')} className="grid scroll-mt-4 gap-2 border-b border-border pb-6">
            <HugInput aria-label="Full name" value={draft.candidateName} onChange={(event) => update({ candidateName: event.target.value })} className={cn(field, 'font-gowun text-3xl font-bold')} />
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-sm text-ink-muted"><Mail aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Email</span><HugInput value={draft.email} onChange={(event) => update({ email: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><Phone aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Phone</span><HugInput value={phone} placeholder="Phone" onChange={(event) => setPhone(event.target.value)} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><MapPin aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Location</span><HugInput value={draft.location} onChange={(event) => update({ location: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><LinkIcon aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">LinkedIn</span><HugInput value={draft.linkedinUrl} onChange={(event) => update({ linkedinUrl: event.target.value })} className={cn(field, 'text-sm')} /></label>
              <label className="flex items-center gap-2 text-sm text-ink-muted"><LinkIcon aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Website</span><HugInput value={draft.portfolioUrl} onChange={(event) => update({ portfolioUrl: event.target.value })} className={cn(field, 'text-sm')} /></label>
            </div>
          </header>

          <p role="status" className="sr-only">{announcement}</p>

          {order.map((key) => {
            const label = labelFor(key)
            const extra = isStandard(key) ? undefined : extraSections.find((section) => section.id === key)
            if (isStandard(key) ? hiddenSections.includes(key) : !extra) return null
            const isCollapsed = collapsed.has(key)
            return (
              <section
                key={key}
                id={resumeSectionAnchor(key)}
                aria-labelledby={`resume-section-${key}`}
                draggable={dragging === key}
                onDragOver={(event) => { if (dragging) event.preventDefault() }}
                onDrop={(event) => { event.preventDefault(); if (dragging) move(dragging, order.indexOf(key)); setDragging(null) }}
                onDragEnd={() => setDragging(null)}
                onFocus={() => onActiveSectionChange?.(key)}
                className={cn('scroll-mt-4 border-b border-border py-5 last:border-b-0', dragging === key && 'opacity-60')}
              >
                <div className={cn('flex flex-wrap items-center justify-between gap-3', !isCollapsed && 'mb-3')}>
                  <div className="flex min-w-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Move ${label}. Use the up and down arrow keys.`}
                      onPointerDown={() => setDragging(key)}
                      onPointerUp={() => setDragging((current) => (current === key ? null : current))}
                      onKeyDown={(event) => onHandleKeyDown(event, key)}
                      className="grid size-9 shrink-0 cursor-grab place-items-center rounded-md text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <GripVertical aria-hidden="true" className="size-4" />
                    </button>
                    <h2 id={`resume-section-${key}`} className="min-w-0 text-sm font-bold uppercase tracking-wide text-ink">
                      <button
                        type="button"
                        aria-expanded={!isCollapsed}
                        aria-controls={`resume-body-${key}`}
                        onClick={() => toggle(key)}
                        className="flex min-h-9 items-center gap-2 rounded-md px-1 text-start uppercase hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      >
                        <span className="truncate">{label}</span>
                        <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted', isCollapsed && '-rotate-90 rtl:rotate-90')} />
                      </button>
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    {isStandard(key) && key !== 'experience' ? sectionTools(key) : null}
                    {onRemoveSection ? (
                      <button type="button" aria-label={`Remove ${label} section`} onClick={() => onRemoveSection(key)} className={removeAction}>
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div id={`resume-body-${key}`} hidden={isCollapsed}>
                  {isStandard(key) ? sectionBody(key) : extra ? extraBody(extra) : null}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
