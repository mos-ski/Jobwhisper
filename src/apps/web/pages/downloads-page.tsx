import { DownloadsView } from '@/features/account/account-view'
import { downloadItems } from '@/mocks/account'

export function DownloadsPage() {
  return <DownloadsView homeHref="/v3/app" downloads={downloadItems} />
}
