import type { CartItem, Totals } from '../types/pos'

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

export function computeTotals(items: CartItem[]): Totals {
  const subtotal = roundToCents(
    items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
  )
  const grandTotal = subtotal

  return { subtotal, grandTotal }
}

