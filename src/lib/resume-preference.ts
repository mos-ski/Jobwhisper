const DEFAULT_RESUME_KEY = 'lf_default_resume'

export type DefaultResumePreference = {
  readonly fileName: string
}

export function getDefaultResumePreference(): DefaultResumePreference | null {
  try {
    const raw = localStorage.getItem(DEFAULT_RESUME_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.fileName !== 'string') return null
    return { fileName: parsed.fileName }
  } catch {
    return null
  }
}

export function setDefaultResumePreference(fileName: string): void {
  try {
    localStorage.setItem(DEFAULT_RESUME_KEY, JSON.stringify({ fileName }))
  } catch {
    // ignore write failures (private browsing, storage disabled, etc.)
  }
}

export function clearDefaultResumePreference(): void {
  try {
    localStorage.removeItem(DEFAULT_RESUME_KEY)
  } catch {
    // ignore
  }
}
