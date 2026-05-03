import React from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '../types/pos'
import { formatCurrency } from '../utils/money'

export interface CartProps {
  items: CartItem[]
  onIncrement: (itemId: string) => void
  onDecrement: (itemId: string) => void
  onRemove: (itemId: string) => void
}

export function Cart({ items, onIncrement, onDecrement, onRemove }: CartProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Current order</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{items.length} item(s)</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-800">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Cart is empty</div>
            <div className="mt-1 text-xs text-zinc-500">Add items from the menu to begin.</div>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {item.menuItem.name}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {formatCurrency(item.menuItem.price)} each
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-white hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus:ring-zinc-700"
                    aria-label={`Remove ${item.menuItem.name}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.id)}
                      className="rounded-l-xl p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:focus:ring-zinc-700"
                      aria-label={`Decrease quantity of ${item.menuItem.name}`}
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <div className="w-10 select-none text-center text-sm font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.id)}
                      className="rounded-r-xl p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:focus:ring-zinc-700"
                      aria-label={`Increase quantity of ${item.menuItem.name}`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
                    {formatCurrency(item.menuItem.price * item.quantity)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

