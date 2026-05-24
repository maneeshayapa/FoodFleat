import { useState, useReducer, useCallback, createContext, useContext } from 'react';
import axios from "axios";
import { useEffect } from "react";

const categories = ['All', 'Pizza', 'Burgers', 'Sushi', 'Rice', 'Grill', 'Desserts', 'Drinks'];
const menuItems = [
  { id: 1,  name: 'Margherita Pizza',      desc: 'Classic tomato & fresh mozzarella',     price: 1800, emoji: '🍕', cat: 'Pizza',    badge: 'popular' },
  { id: 2,  name: 'BBQ Chicken Pizza',     desc: 'Smoky BBQ sauce with grilled chicken',  price: 2200, emoji: '🍕', cat: 'Pizza',    badge: 'spicy'   },
  { id: 3,  name: 'Veggie Supreme',        desc: 'Fresh garden vegetables on thin crust', price: 1600, emoji: '🍕', cat: 'Pizza',    badge: 'new'     },
  { id: 4,  name: 'Classic Cheeseburger', desc: 'Beef patty with aged cheddar',           price: 1200, emoji: '🍔', cat: 'Burgers',  badge: 'popular' },
  { id: 5,  name: 'Crispy Chicken Burger',desc: 'Fried chicken fillet with coleslaw',     price: 1350, emoji: '🍔', cat: 'Burgers',  badge: null      },
  { id: 6,  name: 'Double Smash Burger',  desc: 'Two smashed patties, special sauce',     price: 1600, emoji: '🍔', cat: 'Burgers',  badge: 'new'     },
  { id: 7,  name: 'Salmon Nigiri',        desc: 'Fresh Atlantic salmon on sushi rice',    price: 2400, emoji: '🍣', cat: 'Sushi',    badge: null      },
  { id: 8,  name: 'California Roll',      desc: 'Crab, avocado & cucumber',               price: 1800, emoji: '🍱', cat: 'Sushi',    badge: 'popular' },
  { id: 9,  name: 'Spicy Tuna Roll',      desc: 'Fresh tuna with sriracha aioli',         price: 2100, emoji: '🍣', cat: 'Sushi',    badge: 'spicy'   },
  { id: 10, name: 'Chocolate Lava Cake',  desc: 'Warm cake with vanilla ice cream',       price: 950,  emoji: '🍰', cat: 'Desserts', badge: 'popular' },
  { id: 11, name: 'Mango Cheesecake',     desc: 'Creamy Sri Lankan mango topping',        price: 850,  emoji: '🍮', cat: 'Desserts', badge: 'new'     },
  { id: 12, name: 'Chicken Fried Rice',   desc: 'Wok-tossed with fresh vegetables',       price: 1100, emoji: '🍛', cat: 'Rice',     badge: 'popular' },
  { id: 13, name: 'Egg Fried Rice',       desc: 'Classic with fluffy scrambled egg',      price: 900,  emoji: '🍚', cat: 'Rice',     badge: null      },
  { id: 14, name: 'Grilled Chicken',      desc: 'Herb-marinated chicken breast',          price: 1500, emoji: '🍗', cat: 'Grill',    badge: 'popular' },
  { id: 15, name: 'Grilled Ribs',         desc: 'Slow-cooked smoky BBQ pork ribs',        price: 2800, emoji: '🥩', cat: 'Grill',    badge: 'new'     },
  { id: 16, name: 'Fresh Lime Juice',     desc: 'Sri Lankan style with rock salt',        price: 350,  emoji: '🥤', cat: 'Drinks',   badge: null      },
  { id: 17, name: 'Mango Lassi',          desc: 'Thick & creamy yogurt drink',            price: 450,  emoji: '🥭', cat: 'Drinks',   badge: 'new'     },
  { id: 18, name: 'Strawberry Smoothie',  desc: 'Fresh blended with honey',               price: 500,  emoji: '🍓', cat: 'Drinks',   badge: null      },
];
const orderHistory = [
  { id: '#FR-20240517-7721', items: 'Margherita Pizza + Coke', date: 'May 17, 2024', total: 2150 },
  { id: '#FR-20240515-6643', items: 'Chicken Burger + Fries',  date: 'May 15, 2024', total: 1680 },
  { id: '#FR-20240512-5512', items: 'Salmon Sushi Roll x2',    date: 'May 12, 2024', total: 3400 },
];
const DELIVERY_FEE = 200;

const CartContext = createContext(null);
const ToastContext = createContext(null);
const AuthContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: { ...state.items, [action.id]: (state.items[action.id] || 0) + 1 } };
    case 'REMOVE_ITEM': {
      const u = { ...state.items };
      delete u[action.id];
      return { ...state, items: u };
    }
    case 'SET_QTY': {
      if (action.qty <= 0) {
        const u = { ...state.items };
        delete u[action.id];
        return { ...state, items: u };
      }
      return { ...state, items: { ...state.items, [action.id]: action.qty } };
    }
    case 'APPLY_PROMO': return { ...state, promoApplied: true, discount: action.discount };
    case 'CLEAR_CART':  return { items: {}, promoApplied: false, discount: 0 };
    default: return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {}, promoApplied: false, discount: 0 });
  const addItem    = useCallback((id) => dispatch({ type: 'ADD_ITEM', id }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const setQty     = useCallback((id, qty) => dispatch({ type: 'SET_QTY', id, qty }), []);
  const applyPromo = useCallback((code) => {
    const valid = { FLAVOR10: 10, RUSH20: 20 };
    const pct = valid[code.toUpperCase()];
    if (pct) {
      dispatch({ type: 'APPLY_PROMO', discount: pct });
      return true;
    }
    return false;
  }, []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const totalItems = Object.values(state.items).reduce((a, b) => a + b, 0);
  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, setQty, applyPromo, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: '', show: false });
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        background: '#D82B2B', color: '#fff', padding: '12px 22px',
        borderRadius: 12, fontSize: '0.9rem', fontWeight: 500, zIndex: 9999,
        transform: toast.show ? 'translateY(0)' : 'translateY(120px)',
        opacity: toast.show ? 1 : 0, transition: 'all 0.3s ease',
        pointerEvents: 'none', boxShadow: '0 8px 24px rgba(216,43,43,0.35)',
        fontFamily: "'DM Sans', sans-serif",
      }}>{toast.msg}</div>
    </ToastContext.Provider>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const login  = (u) => { setUser(u); setShowLogin(false); };
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout, showLogin, setShowLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

const useCart   = () => useContext(CartContext);
const useToast  = () => useContext(ToastContext);
const useAuth   = () => useContext(AuthContext);

function LoginModal() {
  const { login, setShowLogin } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (tab === 'register' && !form.name.trim())       e.name = 'Name required';
    if (!form.email.includes('@'))                      e.email = 'Valid email required';
    if (form.password.length < 6)                      e.password = 'Min 6 characters';
    if (tab === 'register' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = tab === 'login' ? form.email.split('@')[0] : form.name;
      login({ name, email: form.email, initials: name.slice(0, 2).toUpperCase() });
      showToast(tab === 'login' ? `👋 Welcome back, ${name}!` : `🎉 Account created! Welcome, ${name}!`);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }} onClick={() => setShowLogin(false)}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '2rem',
        width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        fontFamily: "'DM Sans', sans-serif",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#1a1a1a' }}>
            Flavor<span style={{ color: '#D82B2B' }}>Rush</span>
          </div>
          <button onClick={() => setShowLogin(false)} style={{
            background: '#f7f4f2', border: 'none', width: 34, height: 34,
            borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#888',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
        <div style={{ display: 'flex', background: '#f7f4f2', borderRadius: 12, padding: 4, marginBottom: '1.5rem' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrors({}); }} style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.9rem',
              background: tab === t ? '#D82B2B' : 'transparent',
              color: tab === t ? '#fff' : '#888', transition: 'all 0.2s',
            }}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>
        {tab === 'register' && (
          <Field2 label="Full Name" placeholder="Kasun Perera" value={form.name}
            onChange={v => update('name', v)} error={errors.name} />
        )}
        <Field2 label="Email" placeholder="you@email.com" type="email" value={form.email}
          onChange={v => update('email', v)} error={errors.email} />
        {tab === 'register' && (
          <Field2 label="Phone (optional)" placeholder="+94 77 123 4567" value={form.phone}
            onChange={v => update('phone', v)} />
        )}
        <Field2 label="Password" placeholder="••••••••" type="password" value={form.password}
          onChange={v => update('password', v)} error={errors.password} />
        {tab === 'register' && (
          <Field2 label="Confirm Password" placeholder="••••••••" type="password" value={form.confirm}
            onChange={v => update('confirm', v)} error={errors.confirm} />
        )}
        {tab === 'login' && (
          <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            <button style={{ background: 'none', border: 'none', color: '#D82B2B', cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif" }}>
              Forgot password?
            </button>
          </div>
        )}
        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', background: loading ? '#e8e0e0' : '#D82B2B',
          color: '#fff', border: 'none', padding: '13px', borderRadius: 12,
          fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'default' : 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', marginTop: '0.5rem',
        }}>
          {loading ? '...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#aaa' }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrors({}); }}
            style={{ background: 'none', border: 'none', color: '#D82B2B', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem' }}>
            {tab === 'login' ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field2({ label, placeholder, value, onChange, type = 'text', error }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 5 }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 14px', border: `1.5px solid ${error ? '#D82B2B' : '#e8e0e0'}`,
          borderRadius: 10, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
          fontFamily: "'DM Sans', sans-serif", background: error ? '#FCEBEB' : '#fff',
          transition: 'border 0.2s',
        }}
      />
      {error && <div style={{ color: '#D82B2B', fontSize: '0.75rem', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function Navbar({ currentPage, navigate }) {
  const { totalItems } = useCart();
  const { user, logout, setShowLogin } = useAuth();
  const { showToast } = useToast();
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { key: 'home',     label: 'Home' },
    { key: 'menu',     label: 'Menu' },
    { key: 'tracking', label: 'Track Order' },
  ];

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    showToast('👋 Logged out successfully');
  };

  return (
    <nav style={{
      background: '#D82B2B', padding: '0 2rem', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', height: 64,
      position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div onClick={() => navigate('home')} style={{
        fontFamily: "'Playfair Display', serif", color: '#fff',
        fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none',
      }}>
        Flavor<span style={{ color: '#FFD700' }}>Rush</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {links.map(l => (
          <button key={l.key} onClick={() => navigate(l.key)} style={{
            color: currentPage === l.key ? '#fff' : 'rgba(255,255,255,0.85)',
            background: currentPage === l.key ? 'rgba(255,255,255,0.18)' : 'none',
            border: 'none', fontSize: '0.9rem', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 20, transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>
            {l.label}
          </button>
        ))}

        <button onClick={() => navigate('cart')} style={{
          background: '#fff', color: '#D82B2B', border: 'none',
          padding: '8px 18px', borderRadius: 20, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center',
          gap: 6, fontSize: '0.9rem', position: 'relative',
        }}>
          🛒 Cart
          {totalItems > 0 && (
            <span style={{
              background: '#D82B2B', color: '#fff', width: 20, height: 20,
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700,
            }}>{totalItems}</span>
          )}
        </button>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setDropOpen(!dropOpen)} style={{
              background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
              color: '#fff', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer',
              fontWeight: 700, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{user.initials}</button>
            {dropOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 48, background: '#fff',
                borderRadius: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                minWidth: 180, overflow: 'hidden', zIndex: 200,
                border: '1px solid #e8e0e0',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e0e0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>{user.email}</div>
                </div>
                {[
                  { label: '👤 Profile', action: () => { navigate('profile'); setDropOpen(false); } },
                  { label: '📦 My Orders', action: () => { navigate('profile'); setDropOpen(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 16px', border: 'none', background: 'none',
                    cursor: 'pointer', fontSize: '0.88rem', color: '#1a1a1a',
                    fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
                  }} onMouseEnter={e => e.target.style.background='#f7f4f2'}
                    onMouseLeave={e => e.target.style.background='none'}>
                    {item.label}
                  </button>
                ))}
                <button onClick={handleLogout} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', border: 'none', borderTop: '1px solid #e8e0e0',
                  background: 'none', cursor: 'pointer', fontSize: '0.88rem',
                  color: '#D82B2B', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                }}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            border: '1.5px solid rgba(255,255,255,0.5)', padding: '8px 18px',
            borderRadius: 20, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
          }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

function Footer({ navigate }) {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = () => {
    if (!email.includes('@')) { showToast('⚠️ Enter a valid email'); return; }
    showToast('🎉 Subscribed! Check your inbox for a 10% off coupon.');
    setEmail('');
  };

  const footerLinks = {
    'Quick Links': [
      { label: 'Home',       action: () => navigate('home')     },
      { label: 'Menu',       action: () => navigate('menu')     },
      { label: 'Track Order',action: () => navigate('tracking') },
      { label: 'My Cart',    action: () => navigate('cart')     },
    ],
    'Categories': [
      { label: '🍕 Pizza',    action: () => navigate('menu', 'Pizza')    },
      { label: '🍔 Burgers',  action: () => navigate('menu', 'Burgers')  },
      { label: '🍣 Sushi',    action: () => navigate('menu', 'Sushi')    },
      { label: '🍰 Desserts', action: () => navigate('menu', 'Desserts') },
      { label: '🥤 Drinks',   action: () => navigate('menu', 'Drinks')   },
    ],
    'Support': [
      { label: 'Help Center',    action: () => {} },
      { label: 'Delivery Info',  action: () => {} },
      { label: 'Refund Policy',  action: () => {} },
      { label: 'Privacy Policy', action: () => {} },
      { label: 'Terms of Use',   action: () => {} },
    ],
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0f0f 50%, #1a0a0a 100%)',
      color: '#fff', fontFamily: "'DM Sans', sans-serif", marginTop: 'auto',
    }}>
      <div style={{
        background: '#D82B2B', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
            Get 10% off your first order!
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: 3 }}>
            Subscribe for exclusive deals & new menu alerts
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
            style={{
              padding: '11px 18px', borderRadius: 30, border: 'none',
              fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
              outline: 'none', minWidth: 220, color: '#1a1a1a',
            }}
          />
          <button onClick={handleSubscribe} style={{
            background: '#fff', color: '#D82B2B', border: 'none',
            padding: '11px 22px', borderRadius: 30, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem', transition: 'all 0.2s',
          }}>Subscribe →</button>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem', marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: '1.8rem',
              marginBottom: '0.75rem',
            }}>
              Flavor<span style={{ color: '#FFD700' }}>Rush</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Sri Lanka's favourite food delivery app. Fresh, fast, and always delicious — delivered right to your door.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                <button key={i} style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.target.style.background = '#D82B2B'}
                  onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >{icon}</button>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div style={{
                fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem',
                textTransform: 'uppercase', fontSize: '0.78rem', color: '#FFD700',
              }}>{title}</div>
              {links.map(link => (
                <button key={link.label} onClick={link.action} style={{
                  display: 'block', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
                  fontSize: '0.88rem', padding: '4px 0',
                  fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = '#FFD700'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                >{link.label}</button>
              ))}
            </div>
          ))}
          <div>
            <div style={{
              fontWeight: 700, textTransform: 'uppercase', fontSize: '0.78rem',
              color: '#FFD700', letterSpacing: '0.05em', marginBottom: '1rem',
            }}>Contact Us</div>
            {[
              { icon: '📍', text: 'No. 25, Galle Road, Colombo 03' },
              { icon: '📞', text: '+94 11 234 5678' },
              { icon: '✉️', text: 'support@flavorrush.lk' },
              { icon: '⏰', text: 'Open daily: 8am – 11pm' },
            ].map(item => (
              <div key={item.icon} style={{
                display: 'flex', gap: '0.6rem', marginBottom: '0.7rem',
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)',
                alignItems: 'flex-start',
              }}>
                <span>{item.icon}</span>
                <span style={{ lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { icon: '🍎', store: 'App Store',   sub: 'Download on the' },
            { icon: '🤖', store: 'Google Play', sub: 'Get it on' },
          ].map(badge => (
            <button key={badge.store} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, padding: '10px 20px', cursor: 'pointer',
              color: '#fff', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <span style={{ fontSize: '1.6rem' }}>{badge.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{badge.sub}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{badge.store}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
            © 2024 FlavorRush. All rights reserved. Made with ❤️ in Sri Lanka.
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['🍕', '🍔', '🍣', '🍰', '🥤'].map((e, i) => (
              <span key={i} style={{ fontSize: '1.1rem' }}>{e}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <button key={t} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                transition: 'color 0.2s', padding: 0,
              }}
                onMouseEnter={e => e.target.style.color = '#FFD700'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const BADGE_MAP = {
  popular: { label: '🔥 Popular', bg: '#FFF3CD', color: '#856404' },
  new:     { label: '✨ New',     bg: '#d4edda', color: '#155724' },
  spicy:   { label: '🌶 Spicy',   bg: '#FCEBEB', color: '#D82B2B' },
};

function FoodCard({ item }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [hover, setHover] = useState(false);
  const badge = BADGE_MAP[item.badge];
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: '1px solid #e8e0e0', cursor: 'default',
        transform: hover ? 'translateY(-5px)' : 'none',
        boxShadow: hover ? '0 12px 30px rgba(216,43,43,0.13)' : 'none',
        transition: 'all 0.25s', fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', background: '#FCEBEB' }}>
        {item.emoji}
      </div>
      <div style={{ padding: '0.9rem' }}>
        {badge && <span style={{ display: 'inline-block', fontSize: '0.72rem', padding: '3px 9px', borderRadius: 10, marginBottom: 6, fontWeight: 700, background: badge.bg, color: badge.color }}>{badge.label}</span>}
        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, color: '#1a1a1a' }}>{item.name}</div>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', lineHeight: 1.4 }}>{item.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#D82B2B' }}>Rs. {item.price.toLocaleString()}</div>
          <button onClick={() => { addItem(item.id); showToast(`${item.emoji} ${item.name} added!`); }} style={{
            background: '#D82B2B', color: '#fff', border: 'none',
            width: 32, height: 32, borderRadius: '50%', fontSize: '1.3rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, transition: 'all 0.2s',
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ navigate }) {
  const { setShowLogin, user } = useAuth();
  const popular = menuItems.filter(i => i.badge === 'popular').slice(0, 4);
  const heroCategories = [
    { emoji: '🍕', label: 'Pizza',    cat: 'Pizza'    },
    { emoji: '🍔', label: 'Burgers',  cat: 'Burgers'  },
    { emoji: '🍣', label: 'Sushi',    cat: 'Sushi'    },
    { emoji: '🍰', label: 'Desserts', cat: 'Desserts' },
  ];
  const stats = [
    { num: '500+',   label: 'Menu Items'      },
    { num: '30 min', label: 'Avg Delivery'    },
    { num: '4.8 ⭐', label: 'Customer Rating' },
    { num: '50K+',   label: 'Happy Customers' },
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #A32020 0%, #D82B2B 55%, #E84040 100%)',
        color: '#fff', padding: '5rem 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 500 }}>
            🚀 Fast Delivery · Fresh Food
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
            Delicious Food,<br /><span style={{ color: '#FFD700' }}>Delivered Fast</span> 🍕
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
            Order from the best restaurants near you. Fresh, hot & on time — every time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('menu')} style={{ background: '#fff', color: '#D82B2B', border: 'none', padding: '14px 32px', borderRadius: 30, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Order Now →
            </button>
            {!user && (
              <button onClick={() => setShowLogin(true)} style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.7)', padding: '12px 28px', borderRadius: 30, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Sign Up Free
              </button>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', padding: '1.75rem 2rem', background: '#fff', borderBottom: '1px solid #e8e0e0', flexWrap: 'wrap', fontFamily: "'DM Sans', sans-serif" }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D82B2B' }}>{s.num}</div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '0.3rem' }}>Browse Categories</div>
        <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>What are you craving today?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {heroCategories.map(c => (
            <div key={c.cat} onClick={() => navigate('menu', c.cat)} style={{ background: '#fff', borderRadius: 16, padding: '2rem 1rem', textAlign: 'center', border: '1px solid #e8e0e0', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(216,43,43,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{c.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginTop: '2.5rem', marginBottom: '0.3rem' }}>Most Popular</div>
        <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Loved by thousands of customers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {popular.map(item => <FoodCard key={item.id} item={item} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('menu')} style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 30, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            View Full Menu →
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuPage({ initialCategory = 'All' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === 'All' || item.cat === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '0.3rem' }}>Our Menu</div>
      <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Fresh ingredients, bold flavours</div>
      <div style={{ position: 'relative', maxWidth: 420, marginBottom: '1.25rem' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        <input placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '11px 42px', border: '1.5px solid #e8e0e0', borderRadius: 30, fontSize: '0.9rem', outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>✕</button>}
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 18px', borderRadius: 20, border: '1.5px solid', borderColor: activeCategory === cat ? '#D82B2B' : '#e8e0e0', background: activeCategory === cat ? '#D82B2B' : '#fff', color: activeCategory === cat ? '#fff' : '#1a1a1a', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>{cat}</button>
        ))}
      </div>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.25rem' }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(item => <FoodCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <p style={{ color: '#888' }}>No items found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}

function CartPage({ navigate }) {
  const { items, setQty, removeItem, applyPromo, promoApplied, discount } = useCart();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const cartItems = Object.entries(items).filter(([, qty]) => qty > 0).map(([id, qty]) => ({ ...menuItems.find(i => i.id === Number(id)), qty }));
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = promoApplied ? Math.round(subtotal * discount / 100) : 0;
  const total = subtotal - discountAmt + DELIVERY_FEE;
  const handlePromo = () => {
    if (promoApplied) { showToast('Promo already applied!'); return; }
    const ok = applyPromo(promoCode);
    if (ok) showToast(`🎉 Promo applied! ${discount}% off`);
    else showToast('❌ Invalid code. Try FLAVOR10 or RUSH20');
  };
  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your cart is empty</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Add some delicious items to get started!</p>
      <button onClick={() => navigate('menu')} style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 30, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>Browse Menu →</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>🛒 Your Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', overflow: 'hidden' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #e8e0e0' }}>
              <div style={{ fontSize: '1.8rem', width: 48, height: 48, background: '#FCEBEB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#D82B2B' }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                <div style={{ fontSize: '0.78rem', color: '#aaa' }}>Rs. {item.price.toLocaleString()} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f7f4f2', borderRadius: 20, padding: '4px 8px' }}>
                <button onClick={() => setQty(item.id, item.qty - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#D82B2B', fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => setQty(item.id, item.qty + 1)} style={{ background: '#D82B2B', color: '#fff', border: 'none', cursor: 'pointer', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>+</button>
              </div>
              <button onClick={() => { removeItem(item.id); showToast('Item removed'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ccc', padding: 4 }}>🗑</button>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' }}>Order Summary</div>
          {cartItems.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.5rem', color: '#555' }}>
              <span>{i.name} ×{i.qty}</span><span>Rs. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.5rem', color: '#555' }}>
            <span>Delivery fee</span><span>Rs. {DELIVERY_FEE}</span>
          </div>
          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.5rem', color: '#155724' }}>
              <span>Promo ({discount}% off)</span><span>− Rs. {discountAmt.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <input placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e8e0e0', borderRadius: 10, fontSize: '0.85rem', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
            <button onClick={handlePromo} style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>Apply</button>
          </div>
          <div style={{ borderTop: '1px solid #e8e0e0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
            <span>Total</span><span style={{ color: '#D82B2B' }}>Rs. {total.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate('checkout')} style={{ width: '100%', background: '#D82B2B', color: '#fff', border: 'none', padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Proceed to Checkout →</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ navigate }) {
  const { items, discount, promoApplied, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, setShowLogin } = useAuth();
  const [payMethod, setPayMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', city: '', postal: '', cardNum: '', cvv: '', expiry: '' });
  const cartItems = Object.entries(items).filter(([, qty]) => qty > 0).map(([id, qty]) => ({ ...menuItems.find(i => i.id === Number(id)), qty }));
  const subtotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = promoApplied ? Math.round(subtotal * discount / 100) : 0;
  const total = subtotal - discountAmt + DELIVERY_FEE;
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleOrder = () => {
    if (!user) { setShowLogin(true); showToast('⚠️ Please sign in to place an order'); return; }
    const required = ['firstName', 'lastName', 'phone', 'address', 'city'];
    for (const k of required) { if (!form[k].trim()) { showToast('⚠️ Please fill all required fields'); return; } }
    setLoading(true);
    setTimeout(() => { clearCart(); setLoading(false); navigate('tracking'); showToast('🎉 Order placed successfully!'); }, 1500);
  };
  const Inp = ({ label, k, placeholder }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 5 }}>{label}</label>
      <input value={form[k]} onChange={e => update(k, e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8e0e0', borderRadius: 10, fontSize: '0.88rem', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
    </div>
  );
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {!user && (
            <div style={{ background: '#FFF3CD', border: '1px solid #ffc107', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#856404', fontSize: '0.9rem' }}>⚠️ Sign in to complete your order and track deliveries</span>
              <button onClick={() => setShowLogin(true)} style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', flexShrink: 0, marginLeft: '1rem' }}>Sign In</button>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📍 Delivery Details</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Inp label="First Name *" k="firstName" placeholder="Kasun" />
              <Inp label="Last Name *"  k="lastName"  placeholder="Perera" />
            </div>
            <div style={{ marginBottom: '0.75rem' }}><Inp label="Phone *" k="phone" placeholder="+94 77 123 4567" /></div>
            <div style={{ marginBottom: '0.75rem' }}><Inp label="Address *" k="address" placeholder="No. 25, Galle Road" /></div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Inp label="City *" k="city" placeholder="Colombo" />
              <Inp label="Postal Code" k="postal" placeholder="00300" />
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>💳 Payment</h3>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {[{ id: 'card', label: '💳 Card' }, { id: 'cash', label: '💵 Cash' }, { id: 'online', label: '📱 Online' }].map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)} style={{ flex: 1, padding: '10px 8px', border: '1.5px solid', borderColor: payMethod === m.id ? '#D82B2B' : '#e8e0e0', background: payMethod === m.id ? '#FCEBEB' : '#fff', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", color: payMethod === m.id ? '#D82B2B' : '#555', transition: 'all 0.2s' }}>{m.label}</button>
              ))}
            </div>
            {payMethod === 'card' && (
              <div>
                <div style={{ marginBottom: '0.75rem' }}><Inp label="Card Number" k="cardNum" placeholder="1234 5678 9012 3456" /></div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Inp label="Expiry" k="expiry" placeholder="MM/YY" />
                  <Inp label="CVV" k="cvv" placeholder="123" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' }}>Order Summary</div>
          {cartItems.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#555' }}>
              <span>{i.name} ×{i.qty}</span><span>Rs. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#555' }}>
            <span>Delivery</span><span>Rs. {DELIVERY_FEE}</span>
          </div>
          {promoApplied && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: '#155724' }}><span>Promo</span><span>−Rs. {discountAmt.toLocaleString()}</span></div>}
          <div style={{ borderTop: '1px solid #e8e0e0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
            <span>Total</span><span style={{ color: '#D82B2B' }}>Rs. {total.toLocaleString()}</span>
          </div>
          <button onClick={handleOrder} disabled={loading} style={{ width: '100%', background: loading ? '#ccc' : '#D82B2B', color: '#fff', border: 'none', padding: '13px', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? 'Placing Order...' : '🎉 Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackingPage() {
  const STEPS = [
    { icon: '✅', label: 'Order Confirmed',  desc: 'Your order has been received',    done: true,  current: false },
    { icon: '👨‍🍳', label: 'Preparing',        desc: 'Our chefs are cooking your meal', done: true,  current: false },
    { icon: '🚴', label: 'Out for Delivery', desc: 'Driver is heading your way',      done: false, current: true  },
    { icon: '🏠', label: 'Delivered',        desc: 'Enjoy your meal!',                done: false, current: false },
  ];
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Track Your Order</h1>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e0e0', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #A32020, #D82B2B)', color: '#fff', padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Order ID: #FR-20240518-8821</div>
          <div style={{ marginTop: 6, opacity: 0.9 }}>Your order is on the way! 🚴</div>
          <div style={{ marginTop: 4, fontSize: '0.85rem', opacity: 0.8 }}>⏱ Estimated delivery: 25 minutes</div>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ background: '#f7f4f2', borderRadius: 10, overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ width: '65%', height: 8, background: '#D82B2B', borderRadius: 10 }} />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem' }}>65% complete</p>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                  background: step.done ? '#FCEBEB' : step.current ? '#D82B2B' : '#f7f4f2',
                  border: step.current ? '2px solid #D82B2B' : '2px solid transparent',
                }}>{step.icon}</div>
                {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: step.done ? '#D82B2B' : '#e8e0e0', margin: '4px 0' }} />}
              </div>
              <div style={{ paddingTop: 10, paddingBottom: 16 }}>
                <div style={{ fontWeight: 600, color: step.done || step.current ? '#D82B2B' : '#888', fontSize: '0.95rem' }}>{step.label}</div>
                <div style={{ fontSize: '0.82rem', color: '#aaa', marginTop: 3 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ navigate }) {
  const { user, logout, setShowLogin } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Orders');
  if (!user) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '0.5rem' }}>Sign in to view your profile</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Access your orders, saved addresses, and more.</p>
      <button onClick={() => setShowLogin(true)} style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 30, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>Sign In / Register</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #A32020, #D82B2B)', borderRadius: 20, padding: '1.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem', flexShrink: 0, border: '3px solid rgba(255,255,255,0.4)' }}>{user.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>{user.name}</div>
          <div style={{ opacity: 0.85, fontSize: '0.88rem', marginTop: 3 }}>{user.email}</div>
          <div style={{ display: 'inline-block', background: 'rgba(255,215,0,0.25)', color: '#FFD700', fontSize: '0.78rem', padding: '3px 10px', borderRadius: 10, marginTop: 6, fontWeight: 600 }}>⭐ Gold Member</div>
        </div>
        <button onClick={() => { logout(); showToast('👋 Signed out'); }} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>Sign Out</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        {[{ num: '24', label: 'Orders' }, { num: 'Rs. 48,200', label: 'Total Spent' }, { num: '4.9 ⭐', label: 'Avg Rating' }].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1px solid #e8e0e0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#D82B2B' }}>{s.num}</div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['Orders', 'Profile', 'Addresses'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '9px 20px', border: '1.5px solid', borderColor: activeTab === t ? '#D82B2B' : '#e8e0e0', borderRadius: 20, background: activeTab === t ? '#D82B2B' : '#fff', color: activeTab === t ? '#fff' : '#555', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>{t}</button>
        ))}
      </div>
      {activeTab === 'Orders' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e0e0' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' }}>Order History</div>
          {orderHistory.map(order => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid #e8e0e0' }}>
              <div style={{ fontSize: '1.5rem', width: 44, height: 44, background: '#FCEBEB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🍽️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.items}</div>
                <div style={{ fontSize: '0.78rem', color: '#aaa', marginTop: 2 }}>{order.id} · {order.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#D82B2B', fontSize: '0.95rem' }}>Rs. {order.total.toLocaleString()}</div>
                <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 10, background: '#d4edda', color: '#155724', fontWeight: 600, display: 'inline-block', marginTop: 3 }}>✅ Delivered</span>
              </div>
            </div>
          ))}
          <button onClick={() => navigate('menu')} style={{ marginTop: '1rem', background: 'none', border: '1.5px solid #D82B2B', color: '#D82B2B', padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>+ Order Again</button>
        </div>
      )}
      {activeTab === 'Profile' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e0e0' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' }}>Personal Info</div>
          {[['Full Name', user.name], ['Email', user.email], ['Phone', '+94 77 123 4567'], ['Member Since', '2023']].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e8e0e0', fontSize: '0.9rem' }}>
              <span style={{ color: '#888' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'Addresses' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e0e0' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' }}>Saved Addresses</div>
          {[{ icon: '🏠', label: 'Home', addr: 'No. 25, Galle Road, Colombo 03' }, { icon: '🏢', label: 'Office', addr: 'Level 4, World Trade Center, Colombo 01' }].map(a => (
            <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid #e8e0e0' }}>
              <div style={{ width: 40, height: 40, background: '#FCEBEB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.82rem', color: '#888', marginTop: 2 }}>{a.addr}</div>
              </div>
              <button style={{ background: 'none', border: '1px solid #e8e0e0', color: '#888', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
            </div>
          ))}
          <button style={{ marginTop: '1rem', width: '100%', background: 'none', border: '1.5px dashed #e8e0e0', color: '#888', padding: '11px', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>+ Add New Address</button>
        </div>
      )}
    </div>
  );
}

function LoginModalWrapper() {
  const { showLogin } = useAuth();
  return showLogin ? <LoginModal /> : null;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [menuCategory, setMenuCategory] = useState('All');

  const navigate = (target, category = 'All') => {
    setPage(target);
    if (target === 'menu') setMenuCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':     return <HomePage     navigate={navigate} />;
      case 'menu':     return <MenuPage     initialCategory={menuCategory} />;
      case 'cart':     return <CartPage     navigate={navigate} />;
      case 'checkout': return <CheckoutPage navigate={navigate} />;
      case 'tracking': return <TrackingPage />;
      case 'profile':  return <ProfilePage  navigate={navigate} />;
      default:         return <HomePage     navigate={navigate} />;
    }
  };

      useEffect(() => {

        const getFoods = async () => {
          try {
            const res = await axios.get("http://localhost:5000/foods");

            console.log(res.data);
          } catch (err) {
            console.log(err);
          }
        };

        const addFood = async () => {
          try {
            const res = await axios.post("http://localhost:5000/foods", {
              name: "Fried Rice",
              price: 1800,
            });

            console.log(res.data);
          } catch (err) {
            console.log(err);
          }
        };

        getFoods();
        addFood();

      }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body, #root { min-height: 100%; }
            body { font-family: 'DM Sans', sans-serif; background: #f7f4f2; min-height: 100vh; }
            button, input { font-family: 'DM Sans', sans-serif; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: #f7f4f2; }
            ::-webkit-scrollbar-thumb { background: #e8e0e0; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #D82B2B; }
          `}</style>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar currentPage={page} navigate={navigate} />
            <main style={{ flex: 1 }}>{renderPage()}</main>
            <Footer navigate={navigate} />
          </div>
          <LoginModalWrapper />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}