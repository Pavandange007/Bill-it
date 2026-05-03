import React from 'react'
import { MoreVertical, Plus, Search } from 'lucide-react'
import type { MenuCategory, MenuItem } from '../types/pos'
import { MENU_CATEGORIES } from '../types/pos'
import { formatCurrency } from '../utils/money'

export interface MenuGridProps {
  items: MenuItem[]
  onAddItem: (item: MenuItem) => void
  onAddMenuItem: () => void
  onEditMenuItem: (itemId: string) => void
}

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function MenuGrid({ items, onAddItem, onAddMenuItem, onEditMenuItem }: MenuGridProps): React.JSX.Element {
  const [activeCategory, setActiveCategory] = React.useState<MenuCategory>('Appetizers')
  const [query, setQuery] = React.useState<string>('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (item.category !== activeCategory) return false
      if (q.length === 0) return true
      return item.name.toLowerCase().includes(q)
    })
  }, [activeCategory, items, query])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Menu</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Tap an item to add to order</div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-700 dark:focus:ring-2"
              />
            </div>
            <button
              type="button"
              onClick={onAddMenuItem}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add item
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={classNames(
                  'rounded-xl px-3 py-1.5 text-xs font-medium ring-1 transition',
                  isActive
                    ? 'bg-zinc-900 text-white ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:ring-zinc-100'
                    : 'bg-zinc-50 text-zinc-700 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-200 dark:ring-zinc-800 dark:hover:bg-zinc-900',
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-800">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">No items found</div>
            <div className="mt-1 text-xs text-zinc-500">Try a different search or category.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onAddItem(item)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/40 dark:focus:ring-zinc-700"
              >
                <div className="absolute right-2 top-2 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onEditMenuItem(item.id)
                    }}
                    className="rounded-lg bg-white/80 p-2 text-zinc-700 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-zinc-950/80 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-950"
                    aria-label={`Edit ${item.name}`}
                  >
                    <MoreVertical className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="-mx-3 -mt-3 mb-3 h-28 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 sm:h-24">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </div>
                  <div className="mt-2 text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">{item.category}</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-white opacity-90 transition group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-950">
                    <Plus className="size-3" aria-hidden="true" />
                    Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

