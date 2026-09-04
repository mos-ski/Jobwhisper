import { SupportView } from '@/features/account/account-view'
import { supportRequestTypes, supportTickets } from '@/mocks/account'

export function SupportPage() {
  return <SupportView homeHref="/v3/app" requestTypes={supportRequestTypes} tickets={supportTickets} />
}
