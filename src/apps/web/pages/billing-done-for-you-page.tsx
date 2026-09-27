import { Navigate } from 'react-router-dom'

/** Old links to the success manager list land on Billing's Done for you tab. */
export function BillingDoneForYouPage() {
  return <Navigate to="/v3/billing?plan=done-for-you" replace />
}
