export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  imageUrl: string | null
}

export const MENU_CATEGORIES = ['Appetizers', 'Mains', 'Drinks', 'Desserts'] as const
export type MenuCategory = (typeof MENU_CATEGORIES)[number]

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
}

export interface CartById {
  [id: string]: CartItem | undefined
}

export interface Totals {
  subtotal: number
  grandTotal: number
}

