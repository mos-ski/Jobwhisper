export type ResumeBuilderTab = 'chat' | 'edit'

export type ResumeChatState = 'empty' | 'suggestions'

export type ResumeSectionId =
  | 'personal-information'
  | 'professional-summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'languages'

export type ResumeDocument = {
  readonly id: string
  readonly candidateName: string
  readonly email: string
  readonly location: string
  readonly linkedinUrl: string
  readonly portfolioUrl: string
  readonly summary: string
  readonly improvedSummary: string
  readonly atsScore: number
  readonly atsBreakdown: readonly { readonly label: string; readonly score: number }[]
  readonly atsContext: string
  readonly atsStrengths: readonly string[]
  readonly atsGaps: readonly string[]
  readonly atsPrompt: string
  readonly roles: readonly ResumeRole[]
  /** Tailored rewrites of roles[0].bullets[0] and [1] — the AI suggestion targets the current role's top two highlights. */
  readonly improvedFirstRoleBullets: readonly string[]
  readonly education: readonly ResumeEducation[]
  readonly skills: readonly string[]
  readonly improvedSkills: readonly string[]
  /** Grouped skills; when absent, `skills` shows as one group. */
  readonly skillGroups?: readonly ResumeSkillGroup[]
  readonly certifications: readonly ResumeCertification[]
  readonly projects: readonly ResumeProject[]
  readonly languages: readonly ResumeLanguage[]
}

export type ResumeProject = {
  readonly name: string
  readonly description: string
  readonly year: string
}

export type ResumeLanguage = {
  readonly language: string
  readonly proficiency: string
}

export type ResumeRole = {
  readonly company: string
  readonly location: string
  readonly title: string
  readonly period: string
  readonly bullets: readonly string[]
}

export type ResumeEducation = {
  readonly school: string
  readonly degree: string
  /** Year finished, or expected. */
  readonly year: string
  readonly startYear?: string
  readonly gpa?: string
  readonly location?: string
  readonly achievements?: string
  readonly coursework?: string
  readonly bullets?: readonly string[]
}

/** Skills under a heading, e.g. "Tools & Platforms", in the order the person set. */
export type ResumeSkillGroup = {
  readonly id: string
  readonly title: string
  readonly skills: readonly string[]
}

export type ResumeCertification = {
  readonly name: string
  readonly issuer: string
  readonly year: string
}

export type ResumeHistoryRow = {
  readonly id: string
  readonly title: string
  readonly company: string
  readonly atsScore: number
  readonly duration: string
  readonly createdAtLabel: string
}

export type ResumeBuilderSession = {
  readonly id: string
  readonly uploadedFileName: string
  readonly uploadedFileUrl?: string
  readonly resumeName: string
  readonly companyName: string
  readonly jobDescription: string
  readonly promptSuggestions: readonly string[]
  readonly chatPrompt: string
  readonly aiResponse: string
  readonly aiDraft: string
  readonly zoomLabel: string
}

export type ResumeIssueSeverity = 'urgent' | 'critical' | 'optional'

/** One thing the ATS check flagged, pinned to the section (and role) it is about. */
export type ResumeIssue = {
  readonly id: string
  readonly section: ResumeSectionId
  /** For experience issues, which role in `ResumeDocument.roles`. */
  readonly roleIndex?: number
  readonly severity: ResumeIssueSeverity
  readonly detail: string
}

/** Sections a person can add beyond the standard ones; `custom` takes a title of their own. */
export type ResumeExtraSectionKind = 'awards' | 'volunteering' | 'publications' | 'courses' | 'interests' | 'references' | 'custom'

export type ResumeExtraSection = {
  readonly id: string
  readonly kind: ResumeExtraSectionKind
  readonly title: string
}

/** One item in an added section, e.g. an award: title, who gave it, when, and a line on why. */
export type ResumeExtraEntry = {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly date: string
  readonly description: string
}
