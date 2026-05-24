export const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Rice', 'Grill', 'Desserts', 'Drinks'];

export const menuItems = [
  { id: 1,  name: 'Margherita Pizza',     desc: 'Classic tomato & fresh mozzarella',    price: 1800, emoji: '🍕', cat: 'Pizza',    badge: 'popular' },
  { id: 2,  name: 'BBQ Chicken Pizza',    desc: 'Smoky BBQ sauce with grilled chicken', price: 2200, emoji: '🍕', cat: 'Pizza',    badge: 'spicy'   },
  { id: 3,  name: 'Veggie Supreme',       desc: 'Fresh garden vegetables on thin crust',price: 1600, emoji: '🍕', cat: 'Pizza',    badge: 'new'     },
  { id: 4,  name: 'Classic Cheeseburger', desc: 'Beef patty with aged cheddar',         price: 1200, emoji: '🍔', cat: 'Burgers',  badge: 'popular' },
  { id: 5,  name: 'Crispy Chicken Burger',desc: 'Fried chicken fillet with coleslaw',   price: 1350, emoji: '🍔', cat: 'Burgers',  badge: null      },
  { id: 6,  name: 'Double Smash Burger',  desc: 'Two smashed patties, special sauce',   price: 1600, emoji: '🍔', cat: 'Burgers',  badge: 'new'     },
  { id: 7,  name: 'Salmon Nigiri',        desc: 'Fresh Atlantic salmon on sushi rice',  price: 2400, emoji: '🍣', cat: 'Sushi',    badge: null      },
  { id: 8,  name: 'California Roll',      desc: 'Crab, avocado & cucumber',             price: 1800, emoji: '🍱', cat: 'Sushi',    badge: 'popular' },
  { id: 9,  name: 'Spicy Tuna Roll',      desc: 'Fresh tuna with sriracha aioli',       price: 2100, emoji: '🍣', cat: 'Sushi',    badge: 'spicy'   },
  { id: 10, name: 'Chocolate Lava Cake',  desc: 'Warm cake with vanilla ice cream',     price: 950,  emoji: '🍰', cat: 'Desserts', badge: 'popular' },
  { id: 11, name: 'Mango Cheesecake',     desc: 'Creamy Sri Lankan mango topping',      price: 850,  emoji: '🍮', cat: 'Desserts', badge: 'new'     },
  { id: 12, name: 'Chicken Fried Rice',   desc: 'Wok-tossed with fresh vegetables',     price: 1100, emoji: '🍛', cat: 'Rice',     badge: 'popular' },
  { id: 13, name: 'Egg Fried Rice',       desc: 'Classic with fluffy scrambled egg',    price: 900,  emoji: '🍚', cat: 'Rice',     badge: null      },
  { id: 14, name: 'Grilled Chicken',      desc: 'Herb-marinated chicken breast',        price: 1500, emoji: '🍗', cat: 'Grill',    badge: 'popular' },
  { id: 15, name: 'Grilled Ribs',         desc: 'Slow-cooked smoky BBQ pork ribs',      price: 2800, emoji: '🥩', cat: 'Grill',    badge: 'new'     },
  { id: 16, name: 'Fresh Lime Juice',     desc: 'Sri Lankan style with rock salt',      price: 350,  emoji: '🥤', cat: 'Drinks',   badge: null      },
  { id: 17, name: 'Mango Lassi',          desc: 'Thick & creamy yogurt drink',          price: 450,  emoji: '🥭', cat: 'Drinks',   badge: 'new'     },
  { id: 18, name: 'Strawberry Smoothie',  desc: 'Fresh blended with honey',             price: 500,  emoji: '🍓', cat: 'Drinks',   badge: null      },
];

export const orderHistory = [
  { id: '#FR-20240517-7721', items: 'Margherita Pizza + Coke', date: 'May 17, 2024', total: 2150, status: 'delivered' },
  { id: '#FR-20240515-6643', items: 'Chicken Burger + Fries',  date: 'May 15, 2024', total: 1680, status: 'delivered' },
  { id: '#FR-20240512-5512', items: 'Salmon Sushi Roll x2',    date: 'May 12, 2024', total: 3400, status: 'delivered' },
];

export const DELIVERY_FEE = 200;
