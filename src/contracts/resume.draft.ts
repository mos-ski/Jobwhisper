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
  readonly year: string
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
