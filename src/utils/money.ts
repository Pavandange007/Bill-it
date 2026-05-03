export function formatCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(safeAmount)
}

