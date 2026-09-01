import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mic, MonitorUp } from 'lucide-react'

import { cn } from '@/ui'

type PermissionId = 'screen' | 'microphone'

type PermissionStep = {
  readonly id: PermissionId
  readonly title: string
  readonly description: string
  readonly actionLabel: string
  readonly icon: typeof MonitorUp
}

const PERMISSION_STEPS: readonly PermissionStep[] = [
  {
    id: 'screen',
    title: 'Share your screen',
    description: 'Required so Jobwhisper can read your interview screen during the call.',
    actionLabel: 'Grant Access',
    icon: MonitorUp,
  },
  {
    id: 'microphone',
    title: 'Turn on your microphone',
    description: 'Required to hear the call audio and transcribe your responses.',
    actionLabel: 'Turn on Microphone',
    icon: Mic,
  },
]

const GRANT_DELAY_MS = 700

export function DesktopPermissionsView() {
  const navigate = useNavigate()
  const [grantedIds, setGrantedIds] = useState<ReadonlySet<PermissionId>>(new Set())
  const [pendingId, setPendingId] = useState<PermissionId | null>(null)

  const firstUngranted = PERMISSION_STEPS.find((step) => !grantedIds.has(step.id))
  const allGranted = grantedIds.size === PERMISSION_STEPS.length

  function handleGrant(id: PermissionId) {
    setPendingId(id)
    window.setTimeout(() => {
      setGrantedIds((prev) => new Set(prev).add(id))
      setPendingId(null)
    }, GRANT_DELAY_MS)
  }

  return (
    <div className="flex h-full min-h-[520px] items-center justify-center bg-live-workspace px-6 py-16">
      <div className="w-full max-w-[485px] overflow-hidden rounded-lg bg-[#0d1929] shadow-panel">
        <div className="flex items-center justify-center bg-[#101e32] py-8">
          <h1 className="text-xl font-medium text-white">Set up Permission</h1>
        </div>
        <div className="grid gap-3 p-8">
          {PERMISSION_STEPS.map((step, index) => {
            const isGranted = grantedIds.has(step.id)
            const isPending = pendingId === step.id
            const isAvailable = step.id === (firstUngranted?.id ?? step.id) && !isGranted
            const Icon = step.icon

            return (
              <div key={step.id} className="grid gap-3 pt-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-full bg-white text-xs font-bold',
                      isGranted ? 'text-positive' : 'text-[#0052ff]',
                    )}
                  >
                    {isGranted ? <Check aria-hidden="true" className="size-4" /> : index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5 text-white">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-4 text-[#d2d2d2]">{step.description}</p>
                  </div>
                </div>
                {isGranted ? (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-positive">
                    <Check aria-hidden="true" className="size-3.5" />
                    Access granted
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={!isAvailable || isPending}
                    onClick={() => handleGrant(step.id)}
                    className={cn(
                      'flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-white',
                      isAvailable ? 'bg-[#0052ff]' : 'bg-[#21a0fc]/25 text-white/50',
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {isPending ? 'Requesting…' : step.actionLabel}
                  </button>
                )}
              </div>
            )
          })}

          {allGranted ? (
            <button
              type="button"
              onClick={() => navigate('/desktop/configure')}
              className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-[#0052ff] text-sm font-medium text-white"
            >
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
