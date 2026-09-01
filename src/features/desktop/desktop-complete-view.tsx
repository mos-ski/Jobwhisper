import { useNavigate } from 'react-router-dom'

export function DesktopCompleteView() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full min-h-[520px] flex-col items-center justify-center gap-10 bg-landing-bg px-8 text-center">
      <h1 className="max-w-md font-gowun text-4xl font-normal leading-[1.15] text-white">Interview completed!</h1>
      <button
        type="button"
        onClick={() => navigate('/v3/interview-copilot/report')}
        className="inline-flex min-h-11 w-full max-w-80 items-center justify-center rounded-lg border-2 border-white/12 bg-white px-4 text-base font-semibold text-[#0052ff] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]"
      >
        See Reports
      </button>
    </div>
  )
}
