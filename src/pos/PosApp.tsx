import React, { useMemo, useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { menuItems as defaultMenuItems } from '../data/menu'
import { MenuGrid } from '../components/MenuGrid'
import { Cart } from '../components/Cart'
import { BillingSummary } from '../components/BillingSummary'
import { ReceiptModal } from '../components/ReceiptModal'
import { OrderHistory, type OrderRecord } from '../components/OrderHistory'
import type { CartById, CartItem, MenuItem } from '../types/pos'
import { computeTotals } from '../utils/calculations'
import { formatCurrency } from '../utils/money'
import { useLocalStorageState } from '../utils/storage'

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const imageBitmap = await createImageBitmap(file)

  const maxSize = 900
  const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height))
  const targetWidth = Math.max(1, Math.round(imageBitmap.width * scale))
  const targetHeight = Math.max(1, Math.round(imageBitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('CanvasRenderingContext2D not available')

  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight)

  return canvas.toDataURL('image/jpeg', 0.82)
}

function upsertCartItem(prev: CartById, menuItem: MenuItem): CartById {
  const existing = prev[menuItem.id]
  if (!existing) {
    const next: CartById = { ...prev }
    next[menuItem.id] = { id: menuItem.id, menuItem, quantity: 1 }
    return next
  }

  const next: CartById = { ...prev }
  next[menuItem.id] = { ...existing, quantity: existing.quantity + 1 }
  return next
}

function updateQuantity(prev: CartById, itemId: string, nextQuantity: number): CartById {
  const existing = prev[itemId]
  if (!existing) return prev

  if (nextQuantity <= 0) {
    const next: CartById = { ...prev }
    delete next[itemId]
    return next
  }

  const next: CartById = { ...prev }
  next[itemId] = { ...existing, quantity: nextQuantity }
  return next
}

function removeItem(prev: CartById, itemId: string): CartById {
  const existing = prev[itemId]
  if (!existing) return prev

  const next: CartById = { ...prev }
  delete next[itemId]
  return next
}

export function PosApp(): React.JSX.Element {
  const [cartById, setCartById] = useLocalStorageState<CartById>('billit.cartById.v1', {})
  const [menuItems, setMenuItems] = useLocalStorageState<MenuItem[]>('billit.menuItems.v1', defaultMenuItems)
  const [orderHistory, setOrderHistory] = useLocalStorageState<OrderRecord[]>('billit.orderHistory.v1', [])
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false)
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null)
  const [isAddingMenuItem, setIsAddingMenuItem] = useState<boolean>(false)

  const cartItems: CartItem[] = useMemo(
    () => Object.values(cartById).filter((item): item is CartItem => item !== undefined),
    [cartById],
  )

  const totals = useMemo(() => computeTotals(cartItems), [cartItems])

  const hasItems = cartItems.length > 0
  const editingMenuItem = useMemo(
    () => (editingMenuItemId ? menuItems.find((m) => m.id === editingMenuItemId) ?? null : null),
    [editingMenuItemId, menuItems],
  )

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <header className="print-hidden border-b border-zinc-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-zinc-100 ring-1 ring-zinc-200">
              <ReceiptText className="size-5 text-zinc-900" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-950">Bill It</div>
              <div className="text-xs text-zinc-500">Restaurant POS Billing</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-zinc-500">Grand total</div>
              <div className="text-sm font-semibold tabular-nums text-zinc-950">{formatCurrency(totals.grandTotal)}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="print-hidden mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <section className="lg:col-span-7">
            <MenuGrid
              items={menuItems}
              onAddItem={(item) => setCartById((prev) => upsertCartItem(prev, item))}
              onAddMenuItem={() => setIsAddingMenuItem(true)}
              onEditMenuItem={(id) => setEditingMenuItemId(id)}
            />
          </section>

          <aside className="lg:col-span-5">
            <div className="space-y-4">
              <Cart
                items={cartItems}
                onIncrement={(id) =>
                  setCartById((prev) => {
                    const existing = prev[id]
                    if (!existing) return prev
                    return updateQuantity(prev, id, existing.quantity + 1)
                  })
                }
                onDecrement={(id) =>
                  setCartById((prev) => {
                    const existing = prev[id]
                    if (!existing) return prev
                    return updateQuantity(prev, id, existing.quantity - 1)
                  })
                }
                onRemove={(id) => setCartById((prev) => removeItem(prev, id))}
              />

              <BillingSummary
                subtotal={totals.subtotal}
                grandTotal={totals.grandTotal}
                onGenerateReceipt={() => setIsReceiptOpen(true)}
                isGenerateDisabled={!hasItems}
              />

              <OrderHistory orders={orderHistory} onClearHistory={() => setOrderHistory([])} />
            </div>
          </aside>
        </div>
      </main>

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onCompleteOrder={() => {
          if (cartItems.length === 0) return
          const record: OrderRecord = {
            id: createId(),
            createdAt: new Date().toISOString(),
            items: cartItems.map((i) => ({
              name: i.menuItem.name,
              price: i.menuItem.price,
              quantity: i.quantity,
            })),
            total: totals.grandTotal,
          }
          setOrderHistory((prev) => [record, ...prev].slice(0, 500))
          setCartById({})
          setIsReceiptOpen(false)
        }}
        cartItems={cartItems}
        totals={totals}
      />

      {(isAddingMenuItem || editingMenuItem !== null) && (
        <div className="print-hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setIsAddingMenuItem(false)
              setEditingMenuItemId(null)
            }}
          />
          <div className="absolute inset-0 grid place-items-center p-4">
            <MenuItemEditor
              mode={isAddingMenuItem ? 'add' : 'edit'}
              initialItem={editingMenuItem}
              onCancel={() => {
                setIsAddingMenuItem(false)
                setEditingMenuItemId(null)
              }}
              onSave={(next) => {
                setMenuItems((prev) => {
                  const exists = prev.some((m) => m.id === next.id)
                  if (exists) return prev.map((m) => (m.id === next.id ? next : m))
                  return [next, ...prev]
                })
                setIsAddingMenuItem(false)
                setEditingMenuItemId(null)
              }}
              createId={createId}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemEditorProps {
  mode: 'add' | 'edit'
  initialItem: MenuItem | null
  onCancel: () => void
  onSave: (next: MenuItem) => void
  createId: () => string
}

function MenuItemEditor(props: MenuItemEditorProps): React.JSX.Element {
  const { mode, initialItem, onCancel, onSave, createId } = props

  const [name, setName] = useState<string>(initialItem?.name ?? '')
  const [description, setDescription] = useState<string>(initialItem?.description ?? '')
  const [price, setPrice] = useState<string>(String(initialItem?.price ?? ''))
  const [category, setCategory] = useState<MenuItem['category']>(initialItem?.category ?? 'Appetizers')
  const [imageUrl, setImageUrl] = useState<string>(initialItem?.imageUrl ?? '')
  const [photoError, setPhotoError] = useState<string>('')

  const isValid = name.trim().length > 0 && Number(price) > 0

  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{mode === 'add' ? 'Add menu item' : 'Edit menu item'}</div>
          <div className="text-xs text-zinc-500">Name, description, price, photo</div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <div className="mb-1 text-xs font-semibold text-zinc-700">Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </label>

        <label className="sm:col-span-2">
          <div className="mb-1 text-xs font-semibold text-zinc-700">Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </label>

        <label>
          <div className="mb-1 text-xs font-semibold text-zinc-700">Price (₹)</div>
          <input
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </label>

        <label>
          <div className="mb-1 text-xs font-semibold text-zinc-700">Category</div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MenuItem['category'])}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
          >
            <option value="Appetizers">Appetizers</option>
            <option value="Mains">Mains</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
          </select>
        </label>

        <div className="sm:col-span-2">
          <div className="mb-1 text-xs font-semibold text-zinc-700">Photo</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return

                setPhotoError('')

                const maxBytes = 2_000_000
                if (file.size > maxBytes) {
                  setPhotoError('Please choose an image under 2MB.')
                  e.target.value = ''
                  return
                }

                try {
                  const dataUrl = await fileToCompressedDataUrl(file)
                  setImageUrl(dataUrl)
                } catch {
                  setPhotoError('Could not load that image. Try a different file.')
                } finally {
                  e.target.value = ''
                }
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
            />

            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Remove photo
            </button>
          </div>
          {photoError.length > 0 ? <div className="mt-1 text-xs text-red-600">{photoError}</div> : null}
        </div>

        <div className="sm:col-span-2">
          <div className="mb-1 text-xs font-semibold text-zinc-700">Preview</div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="size-14 overflow-hidden rounded-xl bg-zinc-200">
              {imageUrl.trim().length > 0 ? (
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-100" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-900">{name.trim().length > 0 ? name : 'Dish name'}</div>
              <div className="line-clamp-2 text-xs text-zinc-600">
                {description.trim().length > 0 ? description : 'Short description…'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => {
            const nextPrice = Number(price)
            if (!Number.isFinite(nextPrice) || nextPrice <= 0) return
            const next: MenuItem = {
              id: initialItem?.id ?? createId(),
              name: name.trim(),
              description: description.trim(),
              price: nextPrice,
              category,
              imageUrl: imageUrl.trim().length > 0 ? imageUrl.trim() : null,
            }
            onSave(next)
          }}
          className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  )
}

