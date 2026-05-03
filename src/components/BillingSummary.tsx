import React from 'react'
import { Printer, ReceiptText } from 'lucide-react'
import { formatCurrency } from '../utils/money'

export interface BillingSummaryProps {
  subtotal: number
  grandTotal: number
  onGenerateReceipt: () => void
  isGenerateDisabled: boolean
}

export function BillingSummary(props: BillingSummaryProps): React.JSX.Element {
  const { subtotal, grandTotal, onGenerateReceipt, isGenerateDisabled } = props

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Billing</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Totals</div>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Subtotal</div>
            <div className="text-sm font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
              {formatCurrency(subtotal)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Grand total</div>
            <div className="text-lg font-bold tabular-nums text-zinc-950 dark:text-zinc-100">
              {formatCurrency(grandTotal)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerateReceipt}
          disabled={isGenerateDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-zinc-900 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:ring-zinc-100 dark:hover:bg-white"
        >
          <ReceiptText className="size-4" aria-hidden="true" />
          Generate receipt
          <Printer className="size-4 opacity-70" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

