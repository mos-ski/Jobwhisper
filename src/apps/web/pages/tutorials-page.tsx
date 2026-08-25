import { TutorialsView } from '@/features/account/account-view'
import { tutorialItems } from '@/mocks/account'

export function TutorialsPage() {
  return <TutorialsView homeHref="/v3/app" tutorials={tutorialItems} />
}
