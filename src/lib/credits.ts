// Credits are the user-facing usage unit across the product. Internally every balance and
// rate is still tracked in cents (see src/mocks/wallet.ts) so the backend accounting stays
// in real currency — this module is the one place that converts cents to the credit numbers
// shown on screen, at a fixed rate of 1 credit = 40 cents.
//
// Credits are always communicated as whole numbers, rounded away from zero (never floored to
// a smaller-looking balance, never a deduction that rounds down to "0 credits" spent). The
// dollar figure shown alongside a credit amount is always an exact multiplication, never an
// approximation — never label it with "~".
const CENTS_PER_CREDIT = 40
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function centsToCredits(cents: number): number {
  return cents / CENTS_PER_CREDIT
}

export function creditsToCents(credits: number): number {
  return Math.round(credits * CENTS_PER_CREDIT)
}

function roundAwayFromZero(value: number): number {
  return Math.sign(value) * Math.ceil(Math.abs(value))
}

function creditLabel(value: number): string {
  return Math.abs(value) === 1 ? 'credit' : 'credits'
}

/** Always a whole number — e.g. 3 -> "1 credit", -3 -> "-1 credit", 16 -> "3 credits". */
export function formatCredits(cents: number): string {
  const value = roundAwayFromZero(centsToCredits(cents))
  return `${value} ${creditLabel(value)}`
}

/** For amounts that are already a whole credits number (not cents), e.g. the top-up dialog. */
export function formatCreditAmountWithUsd(credits: number): string {
  return `${credits} ${creditLabel(credits)} (${usdFormatter.format(creditsToCents(credits) / 100)})`
}

/** 0-100 integer percentage of balance remaining out of total. */
export function usagePercent(remainingCents: number, totalCents: number): number {
  if (totalCents <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((remainingCents / totalCents) * 100)))
}
