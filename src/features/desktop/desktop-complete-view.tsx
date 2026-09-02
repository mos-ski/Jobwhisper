import { useNavigate } from 'react-router-dom'

export function DesktopCompleteView() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-full min-h-[520px] flex-col items-center justify-center gap-10 overflow-hidden bg-[#0a1220] px-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-[480px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#0052ff]/25 blur-[100px]"
      />
      <h1 className="relative max-w-md font-gowun text-4xl font-normal leading-[1.15] text-white">Interview completed!</h1>
      <button
        type="button"
        onClick={() => navigate('/v3/interview-copilot/report')}
        className="relative inline-flex min-h-11 w-full max-w-80 items-center justify-center rounded-lg border-2 border-white/12 bg-[#0052ff] px-4 text-base font-semibold text-white shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]"
      >
        See Reports
      </button>
    </div>
  )
}
