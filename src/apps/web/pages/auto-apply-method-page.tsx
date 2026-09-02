import { AutoApplyMethodView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyMethodPage() {
  return (
    <AutoApplyMethodView
      homeHref="/v3/app"
      backHref="/v3/auto-apply/review"
      fullAutoHref="/v3/auto-apply/full-auto"
      jobsHref="/v3/auto-apply/jobs"
      extensionHref="/v3/extension"
    />
  )
}
