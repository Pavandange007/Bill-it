import React from 'react'
import { formatCurrency } from '../utils/money'

export interface OrderItemSnapshot {
  name: string
  price: number
  quantity: number
}

export interface OrderRecord {
  id: string
  createdAt: string
  items: OrderItemSnapshot[]
  total: number
}

export interface DailyRevenue {
  date: string
  revenue: number
  orderCount: number
}

export interface OrderHistoryProps {
  orders: OrderRecord[]
  onClearHistory: () => void
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function toDayKey(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso.slice(0, 10)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function computeDailyRevenue(orders: OrderRecord[]): DailyRevenue[] {
  const map: Record<string, { revenue: number; orderCount: number }> = {}
  for (const o of orders) {
    const key = toDayKey(o.createdAt)
    const existing = map[key]
    if (existing) {
      existing.revenue += o.total
      existing.orderCount += 1
    } else {
      map[key] = { revenue: o.total, orderCount: 1 }
    }
  }
  return Object.entries(map)
    .map(([date, v]) => ({ date, revenue: v.revenue, orderCount: v.orderCount }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function OrderHistory({ orders, onClearHistory }: OrderHistoryProps): React.JSX.Element {
  const daily = React.useMemo(() => computeDailyRevenue(orders), [orders])
  const todayKey = React.useMemo(() => toDayKey(new Date().toISOString()), [])
  const today = daily.find((d) => d.date === todayKey)
  const last7 = daily.slice(0, 7)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">History</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Orders and daily revenue</div>
          </div>
          <button
            type="button"
            onClick={onClearHistory}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Today revenue</div>
            <div className="text-sm font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
              {formatCurrency(today?.revenue ?? 0)}
            </div>
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {today ? `${today.orderCount} order(s)` : 'No orders today yet'}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">Last 7 days</div>
          {last7.length === 0 ? (
            <div className="text-xs text-zinc-500">No history yet.</div>
          ) : (
            <div className="space-y-2">
              {last7.map((d) => (
                <div key={d.date} className="flex items-center justify-between">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{d.date}</div>
                  <div className="text-xs font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
                    {formatCurrency(d.revenue)} <span className="text-zinc-500">({d.orderCount})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">Orders</div>
          {orders.length === 0 ? (
            <div className="text-xs text-zinc-500">Complete an order to see it here.</div>
          ) : (
            <ul className="space-y-2">
              {orders.slice(0, 12).map((o) => (
                <li key={o.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">{formatDateLabel(o.createdAt)}</div>
                      <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
                        {o.items
                          .slice(0, 2)
                          .map((i) => `${i.quantity}× ${i.name}`)
                          .join(', ')}
                        {o.items.length > 2 ? ` +${o.items.length - 2} more` : ''}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold tabular-nums text-zinc-950 dark:text-zinc-100">
                      {formatCurrency(o.total)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

