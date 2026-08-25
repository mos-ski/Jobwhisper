const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const usdWholeFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

export function formatUsd(cents: number): string {
  return usdFormatter.format(cents / 100)
}

export function formatUsdWhole(cents: number): string {
  return usdWholeFormatter.format(cents / 100)
}
