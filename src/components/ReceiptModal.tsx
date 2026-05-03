import React from 'react'
import { X, Printer } from 'lucide-react'
import type { CartItem, Totals } from '../types/pos'
import { formatCurrency } from '../utils/money'

export interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  onCompleteOrder: () => void
  cartItems: CartItem[]
  totals: Totals
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function formatDateTime(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = pad2(date.getMonth() + 1)
  const dd = pad2(date.getDate())
  const hh = pad2(date.getHours())
  const mi = pad2(date.getMinutes())
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

export function ReceiptModal(props: ReceiptModalProps): React.JSX.Element | null {
  const { isOpen, onClose, onCompleteOrder, cartItems, totals } = props

  const createdAt = React.useMemo(() => new Date(), [isOpen])

  React.useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="print-hidden absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg">
          <div className="print-hidden mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-100">Receipt preview</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCompleteOrder}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-950 ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 ring-1 ring-zinc-100 hover:bg-white"
              >
                <Printer className="size-4" aria-hidden="true" />
                Print
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-zinc-300 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                aria-label="Close receipt"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-zinc-900 shadow-2xl ring-1 ring-black/10">
            <div className="border-b border-zinc-200 p-5">
              <div className="text-center">
                <div className="text-base font-extrabold tracking-wide">Bill It Bistro</div>
                <div className="mt-1 text-xs text-zinc-500">Receipt • {formatDateTime(createdAt)}</div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
                <span>Item</span>
                <span>Total</span>
              </div>
              <div className="mt-3 space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{item.menuItem.name}</div>
                      <div className="text-xs text-zinc-500">
                        {item.quantity} × {formatCurrency(item.menuItem.price)}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatCurrency(item.menuItem.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-4 border-t border-dashed border-zinc-300" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(totals.subtotal)}</span>
                </div>
              </div>

              <div className="my-4 border-t border-zinc-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold">Grand total</span>
                <span className="text-base font-extrabold tabular-nums">{formatCurrency(totals.grandTotal)}</span>
              </div>

              <div className="mt-6 text-center text-xs text-zinc-500">
                Thank you! Please come again.
              </div>
            </div>
          </div>

          <div className="print-only hidden">
            <div className="mt-4 text-center text-xs text-zinc-600">Printed via Bill It</div>
          </div>
        </div>
      </div>
    </div>
  )
}

