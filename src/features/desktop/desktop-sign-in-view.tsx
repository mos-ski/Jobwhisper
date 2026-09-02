import { useNavigate } from 'react-router-dom'

import { JobwhisperMark } from '@/ui'

export function DesktopSignInView() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-full min-h-[520px] flex-col items-center justify-center gap-10 overflow-hidden bg-[#0a1220] px-8 pt-9 pb-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-[480px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#0052ff]/25 blur-[100px]"
      />
      <JobwhisperMark className="relative h-8 w-auto text-white" />
      <h1 className="relative max-w-md font-gowun text-4xl font-normal leading-[1.15] text-white">
        Ease into your interview like it&rsquo;s nothing.
      </h1>
      <button
        type="button"
        onClick={() => navigate('/desktop/permissions')}
        className="relative inline-flex min-h-11 w-full max-w-80 items-center justify-center rounded-lg border-2 border-white/12 bg-[#0052ff] px-4 text-base font-semibold text-white shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]"
      >
        Sign In to Jobwhisper
      </button>
    </div>
  )
}
