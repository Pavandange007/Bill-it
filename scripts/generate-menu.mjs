const C = {
  coffee: 'Coffee & Shakes',
  bev: 'Beverages',
  pasta: 'Pasta',
  sand: 'Sandwiches',
  momo: 'Momos',
  mag: 'Maggie',
  snack: 'Snacks',
  burg: 'Burgers',
  vp: 'Veg Pizza',
  nvp: 'Non-Veg Pizza',
  combo: 'Combos',
  mania: 'Pizza Mania',
  extra: 'Extras',
}

const items = []
let n = 0

function add(name, price, category, description = '') {
  items.push({
    id: `pp-${++n}`,
    name,
    description,
    price,
    category,
    imageUrl: null,
  })
}

function pizza(name, p7, p10, description, category) {
  add(`${name} (7")`, p7, category, description)
  add(`${name} (10")`, p10, category, description)
}

;[
  ['Black Coffee', 20],
  ['Hot Coffee', 30],
  ['Thick Cold Coffee', 49],
  ['Coffee with Crush', 59],
  ['Coffee with Ice-Cream', 69],
  ['Orio Shake', 79],
  ['Kit-Kat Shake', 79],
  ['Strawberry Shake', 79],
].forEach(([name, price]) => add(name, price, C.coffee))

;[
  ['Virgin', 50],
  ['Mint', 50],
  ['Blue Curacao', 50],
  ['Green Apple', 50],
  ['Watermelon', 50],
  ['Sunrise', 50],
].forEach(([name, price]) => add(name, price, C.bev))
add('Coke (MRP)', 40, C.bev, 'Sold at MRP')
add('Sprite (MRP)', 40, C.bev, 'Sold at MRP')
add('Water Bottle (MRP)', 20, C.bev, 'Sold at MRP')

;[
  ['White Sauce Pasta', 119],
  ['Pink Sauce Pasta', 119],
  ['Red Sauce Pasta', 119],
  ['Chicken Tomato Pasta', 150],
  ['Chicken White Pasta', 199],
].forEach(([name, price]) => add(name, price, C.pasta))

;[
  ['Grilled Sandwich', 59],
  ['Cheese Grilled Sandwich', 69],
  ['Cheese Corn Grilled Sandwich', 79],
  ['Mix Veg Grilled Sandwich', 89],
  ['Chocolate Grilled Sandwich', 89],
  ['Cheese Chilly Garlic Sandwich', 89],
  ['Paneer Tandoori Grilled', 99],
  ['Club Sandwich', 119],
  ['Chocolate Sandwich', 119],
  ['Pizza Sandwich', 119],
].forEach(([name, price]) => add(name, price, C.sand))

;[
  ['Veg Momo (Steam)', 59],
  ['Veg Momo (Fried)', 69],
  ['Paneer Momo (Steam)', 79],
  ['Paneer Momo (Fried)', 89],
  ['Chicken Momo (Steam)', 79],
  ['Chicken Momo (Fried)', 89],
].forEach(([name, price]) => add(name, price, C.momo))

;[
  ['Plain Maggie', 49],
  ['Plain Cheese Maggie', 59],
  ['Veg Maggie', 69],
  ['Schezwan Maggie', 69],
  ['Veg Cheese Maggie', 79],
].forEach(([name, price]) => add(name, price, C.mag))

;[
  ['Salted Fries', 79],
  ['Peri Peri Fries', 89],
  ['Cheese Fries', 99],
  ['Cheese Garlic Bread', 99],
  ['Exotic Garlic Bread', 119],
  ['Stuff Garlic Bread', 109],
  ['Veg Tandoori Pocket', 129],
  ['Chicken Fries', 99],
  ['Chicken Popcorn', 79],
  ['Chicken Nuggets', 89],
  ['Chicken Tandoori Pocket', 149],
  ['Chicken Stuff Garlic Bread', 129],
].forEach(([name, price]) => add(name, price, C.snack))

;[
  ['Aloo Tikki Burger', 49],
  ['Aloo Tikki Cheese Burger', 59],
  ['Classic Veg Burger', 69],
  ['Veg Cheese Burger', 79],
  ['Veg Cheese Chilly Burger', 89],
  ['Veg Tandoori Burger', 89],
  ['Paneer Burger', 99],
  ['Chicken Herb Burger', 99],
  ['Spicy Chicken Burger', 109],
].forEach(([name, price]) => add(name, price, C.burg))

const vegPizzas = [
  ['Cheesy Margherita', 99, 219, 'Mozzarella Cheese'],
  ['Cheesy Corn', 109, 229, 'Mozzarella Cheese, Sweet Corn'],
  ['Makhani Tomato', 109, 229, 'Mozzarella Cheese, Tomato'],
  ['Garden Fresh', 139, 249, 'Mozzarella, Onion, Tomato, Capsicum, Red Peprika'],
  ['Veggie Lovers', 139, 249, 'Mozzarella, Onion, Capsicum, Tomato, Corn'],
  ['Peppy Paneer', 139, 249, 'Mozzarella, Onion, Tomato, Sweet Corn, Paneer'],
  ['Mushroom Fire', 139, 249, 'Mozzarella, Onion, Olive, Red Peprika, Mushroom'],
  ['Tandoori Paneer', 159, 269, 'Mozzarella, Onion, Green Capsicum, Tomato, Tandoori Paneer'],
  ['Makhani Paneer', 159, 269, 'Mozzarella, Onion, Red Capsicum, Corn, Olive, Makhani Paneer'],
  ['Kadai Paneer', 159, 269, 'Mozzarella, Onion, Green Capsicum, Jalapeno, Kadai Paneer'],
  ['Barbeque Paneer', 159, 269, 'Mozzarella, Onion, Capsicum, Olive, BBQ Paneer'],
  ['Peri Peri Paneer', 159, 269, 'Mozzarella, Onion, Capsicum, Tomato, Peri Peri Paneer'],
  ['Double Burst', 159, 269, 'Mozzarella Cheese, Burst Dressing'],
  ['Veggie Supreme', 219, 299, 'Mozzarella, Capsicum, Corn, Mushroom, Baby Corn'],
  ['Veg Temptation', 219, 299, 'Mozzarella, Capsicum, Paneer, Jalapeno, Olive, Pineapple'],
  ['Veg Exotic', 219, 299, 'Mozzarella, Capsicum, Black Olive, Jalapeno, Sweet Corn'],
  ['Veg Extravaganza', 219, 299, 'Mozzarella, Onion, Capsicum, Corn, Paneer, Olive, Pineapple'],
  ['Jain Pizza', 219, 299, 'Mozzarella, Capsicum, Sweet Corn, Olive, Paneer, Baby Corn'],
]
vegPizzas.forEach(([name, p7, p10, desc]) => pizza(name, p7, p10, desc, C.vp))

const nvPizzas = [
  ['Cheesy Chicken', 119, 229, 'Mozzarella Cheese, Plain Chicken'],
  ['Classic Chicken', 119, 229, 'Mozzarella, Sweet Corn, Plain Chicken'],
  ['Makhani Chicken', 119, 229, 'Mozzarella, Tomato, Makhani Chicken'],
  ['Spicy Chicken', 159, 269, 'Mozzarella, Onion, Tomato, Capsicum, Spicy Chicken'],
  ['Chicken Meat Ball', 159, 269, 'Mozzarella, Onion, Capsicum, Tomato, Chicken Meatball'],
  ['Chicken Salami', 159, 269, 'Mozzarella, Onion, Green Capsicum, Chicken Salami'],
  ['Chicken & Mushroom', 159, 269, 'Mozzarella, Onion, Olive, Mushroom, Chicken'],
  ['Chicken Tandoori', 209, 309, 'Mozzarella, Capsicum, Tomato, Tandoori Chicken'],
  ['Chicken Makhani', 209, 309, 'Mozzarella, Red Capsicum, Corn, Makhani Chicken'],
  ['Kadai Chicken', 209, 309, 'Mozzarella, Capsicum, Jalapeno, Kadai Chicken'],
  ['Barbeque Chicken', 209, 309, 'Mozzarella, Capsicum, Olive, BBQ Chicken'],
  ['Chicken Peri Peri', 209, 309, 'Mozzarella, Capsicum, Tomato, Peri Peri Chicken'],
  ['Chicken Pepperoni', 209, 309, 'Chicken Pepperoni & Mozzarella Cheese'],
  ['Chicken Supreme', 269, 379, 'Mozzarella, Capsicum, Broccoli, Mushroom, Meatball'],
  ['Chicken Temptation', 269, 379, 'Mozzarella, Capsicum, Olive, Pineapple, Spicy & Makhani Chicken'],
  ['Chicken Exotica', 269, 379, 'Mozzarella, Capsicum, Jalapeno, Olive, Plain & BBQ Chicken'],
  ['Chicken Extravaganza', 269, 379, 'Mozzarella, Capsicum, Olive, Salami, Tandoori Chicken, Meatball'],
]
nvPizzas.forEach(([name, p7, p10, desc]) => pizza(name, p7, p10, desc, C.nvp))

;[
  ['Aloo Tikki Burger + Fries + Coke', 129],
  ['Veg Grilled Sandwich + Fries + Coke', 129],
  ['Cheese Corn Pizza + Fries + Coke', 149],
  ['Chicken Corn Pizza + Fries + Coke', 179],
].forEach(([name, price]) => add(name, price, C.combo))

;[
  ['Corn with Cheese', 89, '12 PM - 5 PM'],
  ['Choco Lava Cake', 59, '12 PM - 5 PM'],
  ['Herb Chicken with Cheese', 99, '12 PM - 5 PM'],
].forEach(([name, price, desc]) => add(name, price, C.mania, desc))

add('Extra Topping (7")', 49, C.extra, 'Grilled/Kadai/Makhani/Tandoori Chicken, Pepperoni, Meatball')
add('Extra Topping (10")', 69, C.extra, 'Grilled/Kadai/Makhani/Tandoori Chicken, Pepperoni, Meatball')
add('Extra Cheese (7")', 59, C.extra, '')
add('Extra Cheese (10")', 79, C.extra, '')

function formatItem(item) {
  const desc = item.description.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `  {
    id: '${item.id}',
    name: '${item.name.replace(/'/g, "\\'")}',
    description: '${desc}',
    price: ${item.price},
    category: '${item.category}',
    imageUrl: null,
  }`
}

const out = `import type { MenuItem } from '../types/pos'

export const menuItems: MenuItem[] = [
${items.map(formatItem).join(',\n')}
]
`

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
writeFileSync(join(dir, '..', 'src', 'data', 'menu.ts'), out)
console.log(`Wrote ${items.length} menu items`)
