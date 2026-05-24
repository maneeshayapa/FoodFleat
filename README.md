# 🍕 FoodFleat — Online Food Ordering System

FoodFleat is a modern online food ordering web application built using React + Vite with a clean and responsive UI.  
This project includes food browsing, cart management, checkout flow, order tracking, and user profile features.

---

# 🚀 Features

- 🏠 Modern Home Page
- 🍔 Food Menu with Search & Filters
- 🛒 Shopping Cart System
- 🎫 Promo Code Discounts
- 💳 Checkout & Payment UI
- 📦 Live Order Tracking
- 👤 User Profile & Order History
- 🔔 Toast Notifications
- 🌐 Multi-language Support
- 📱 Fully Responsive Design

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- CSS3
- Context API

## Backend
- Node.js
- Express.js

---

# 📁 Project Structure

```bash
FoodFleat/
│
├── backend/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
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
Open:
```bash
[http://localhost:5173]
(http://localhost:5173)
```
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

-  Connect MongoDB Database
-  Real User Authentication
-  Google Maps Live Tracking
-  Online Payment Gateway
-  Admin Dashboard
-  Push Notifications

 # 👨‍💻 Developer
 
Developed by Maneesha Yapa
```
