# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 🍕 FlavorRush — Online Food Ordering System

Professional React food ordering website with red & white theme.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          ← Sticky navigation bar
│   └── FoodCard.jsx        ← Reusable food item card
├── context/
│   ├── CartContext.jsx     ← Global cart state management
│   └── ToastContext.jsx    ← Toast notification system
├── data/
│   └── menuData.js         ← All menu items & categories
├── pages/
│   ├── HomePage.jsx        ← Landing page with hero & popular items
│   ├── MenuPage.jsx        ← Full menu with search & filter
│   ├── CartPage.jsx        ← Cart with promo codes
│   ├── CheckoutPage.jsx    ← Delivery & payment form
│   ├── TrackingPage.jsx    ← Live order tracking
│   └── ProfilePage.jsx     ← User profile & order history
├── styles/
│   └── global.css          ← Global CSS variables & styles
├── App.jsx                 ← Main app with routing
└── main.jsx                ← React entry point
```

## 🚀 Setup Instructions

### Step 1: Copy files to your project
Copy the entire `src/` folder into your existing React + Vite project.

### Step 2: Install dependencies (if not already installed)
```bash
npm install
```

### Step 3: Run the project
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## ✅ Features

| Feature | Status |
|---|---|
| 🏠 Home page with hero | ✅ Done |
| 🍕 Menu with search & filter | ✅ Done |
| 🛒 Cart with quantity controls | ✅ Done |
| 🎫 Promo codes (FLAVOR10, RUSH20) | ✅ Done |
| 💳 Checkout with payment | ✅ Done |
| 📦 Order tracking with steps | ✅ Done |
| 👤 Profile & order history | ✅ Done |
| 🔔 Toast notifications | ✅ Done |
| 📱 Responsive design | ✅ Done |

## 🎨 Theme

- **Primary:** `#D82B2B` (Red)
- **Accent:** `#FFD700` (Gold)
- **Background:** `#f7f4f2` (Off-white)
- **Font Display:** Playfair Display
- **Font Body:** DM Sans

## 🔧 Customization

### Add new menu items
Edit `src/data/menuData.js` and add to the `menuItems` array:
```js
{ id: 19, name: 'Your Dish', desc: 'Description', price: 1200, emoji: '🍜', cat: 'Rice', badge: 'new' }
```

### Change promo codes
Edit `src/context/CartContext.jsx`, find this line and update:
```js
const valid = { FLAVOR10: 10, RUSH20: 20 };
// key = promo code, value = discount percentage
```

### Add new category
Edit `src/data/menuData.js`:
```js
export const categories = ['All', 'Pizza', ..., 'YourNewCategory'];
```

## 🔮 Next Steps (Future Features)

- [ ] Connect to a backend (Node.js / Firebase)
- [ ] Real user authentication (Supabase / Firebase Auth)
- [ ] Google Maps integration for live tracking
- [ ] Payment gateway (PayHere for Sri Lanka)
- [ ] Admin dashboard for restaurant owners
- [ ] Push notifications for order updates
