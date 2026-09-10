export type JobBoardFocus =
  | 'General'
  | 'Startups'
  | 'Remote'
  | 'Technology'
  | 'Impact'
  | 'Africa'

export type JobWorkStyle = 'Remote' | 'Hybrid' | 'On-site'

export type JobEmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'

export type DirectoryJob = {
  readonly id: string
  readonly title: string
  readonly company: string
  readonly location: string
  readonly workStyle: JobWorkStyle
  readonly employmentType: JobEmploymentType
  readonly salaryLabel: string
  readonly postedLabel: string
  readonly summary: string
  readonly responsibilities: readonly string[]
  readonly skills: readonly string[]
  readonly applyUrl: string
}

export type JobBoard = {
  readonly id: string
  readonly name: string
  readonly shortName: string
  readonly description: string
  readonly websiteUrl: string
  readonly focus: JobBoardFocus
  readonly regions: readonly string[]
  readonly workStyles: readonly JobWorkStyle[]
  readonly jobs: readonly DirectoryJob[]
}

export type JobDirectoryStatus = 'ready' | 'loading' | 'error' | 'offline'
