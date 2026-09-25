import { useEffect, useState } from 'react'

const MAX_RESUME_BYTES = 5 * 1024 * 1024
const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt'] as const

/** Why a resume file is refused, stated as the fix, or undefined when it is fine. */
export function resumeUploadError(file: File): string | undefined {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!RESUME_EXTENSIONS.some((allowed) => allowed === extension)) return 'That file type is not supported. Upload a PDF, DOC, DOCX or TXT file.'
  if (file.size > MAX_RESUME_BYTES) return 'That file is over 5 MB. Save it as a smaller PDF and try again.'
  if (file.size === 0) return 'That file is empty. Choose the saved copy of your resume and try again.'
  return undefined
}

/** Browser connectivity, with a review switch that forces the offline state. */
export function useOnline(forcedOffline: boolean): boolean {
  const [networkOnline, setNetworkOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const up = () => setNetworkOnline(true)
    const down = () => setNetworkOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  return networkOnline && !forcedOffline
}
