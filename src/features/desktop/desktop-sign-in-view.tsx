import { useNavigate } from 'react-router-dom'

import { JobwhisperMark } from '@/ui'

export function DesktopSignInView() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full min-h-[520px] flex-col items-center justify-center gap-10 bg-landing-bg px-8 pt-9 pb-16 text-center">
      <JobwhisperMark className="h-8 w-auto text-white" />
      <h1 className="max-w-md font-gowun text-4xl font-normal leading-[1.15] text-white">Ease Interview like its nothing.</h1>
      <button
        type="button"
        onClick={() => navigate('/desktop/permissions')}
        className="inline-flex min-h-11 w-full max-w-80 items-center justify-center rounded-lg border-2 border-white/12 bg-white px-4 text-base font-semibold text-[#0052ff] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]"
      >
        Sign In to Jobwhisper
      </button>
    </div>
  )
}
