import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { menuItems, DELIVERY_FEE } from '../data/menuData';

export default function CartPage({ navigate }) {
  const { items, setQty, removeItem, applyPromo, promoApplied, discount } = useCart();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState('');

  const cartItems = Object.entries(items)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...menuItems.find(i => i.id === Number(id)), qty }));

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = promoApplied ? Math.round(subtotal * discount / 100) : 0;
  const total = subtotal - discountAmt + DELIVERY_FEE;

  const handlePromo = () => {
    if (promoApplied) { showToast('Promo already applied!'); return; }
    const ok = applyPromo(promoCode);
    if (ok) showToast(`🎉 Promo applied! ${discount}% off`);
    else showToast('❌ Invalid promo code. Try FLAVOR10 or RUSH20');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          Your cart is empty
        </h2>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Add some delicious items to get started!</p>
        <button
          style={styles.browsBtn}
          onClick={() => navigate('menu')}
        >
          Browse Menu →
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 style={styles.title}>🛒 Your Cart</h1>
      <div style={styles.layout}>
        {/* Items */}
        <div style={styles.items}>
          {cartItems.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.ciEmoji}>{item.emoji}</div>
              <div style={styles.ciInfo}>
                <div style={styles.ciName}>{item.name}</div>
                <div style={styles.ciPrice}>Rs. {(item.price * item.qty).toLocaleString()}</div>
                <div style={styles.ciUnit}>Rs. {item.price.toLocaleString()} each</div>
              </div>
              <div style={styles.qtyCtrl}>
                <button style={styles.qtyBtn} onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                <span style={styles.qtyNum}>{item.qty}</span>
                <button style={styles.qtyBtn} onClick={() => setQty(item.id, item.qty + 1)}>+</button>
              </div>
              <button
                style={styles.rmBtn}
                onClick={() => { removeItem(item.id); showToast('Item removed'); }}
                aria-label="Remove item"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryTitle}>Order Summary</div>

          {cartItems.map(i => (
            <div key={i.id} style={styles.sumRow}>
              <span>{i.name} ×{i.qty}</span>
              <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}

          <div style={styles.sumRow}>
            <span>Delivery fee</span>
            <span>Rs. {DELIVERY_FEE}</span>
          </div>

          {promoApplied && (
            <div style={{ ...styles.sumRow, color: '#155724' }}>
              <span>Promo ({discount}% off)</span>
              <span>− Rs. {discountAmt.toLocaleString()}</span>
            </div>
          )}

          {/* Promo */}
          <div style={styles.promoRow}>
            <input
              style={styles.promoInput}
              placeholder="Promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePromo()}
            />
            <button style={styles.promoBtn} onClick={handlePromo}>Apply</button>
          </div>
          <p style={styles.promoHint}>Try: FLAVOR10 or RUSH20</p>

          <div style={styles.sumTotal}>
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <button style={styles.checkoutBtn} onClick={() => navigate('checkout')}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

const R = '#D82B2B';

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  cartItem: {
    background: '#fff', borderRadius: 14, padding: '1rem 1.25rem',
    border: '1px solid #e8e0e0', display: 'flex', alignItems: 'center', gap: '1rem',
  },
  ciEmoji: {
    fontSize: '2.2rem', width: 52, height: 52, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#FCEBEB', borderRadius: 10, flexShrink: 0,
  },
  ciInfo: { flex: 1 },
  ciName: { fontWeight: 600, fontSize: '0.95rem' },
  ciPrice: { color: R, fontWeight: 700, fontSize: '0.95rem', marginTop: 2 },
  ciUnit: { color: '#aaa', fontSize: '0.78rem', marginTop: 1 },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e8e0e0',
    background: '#fff', cursor: 'pointer', fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
  },
  qtyNum: { fontWeight: 700, minWidth: 22, textAlign: 'center' },
  rmBtn: {
    background: 'none', border: 'none', color: '#bbb', cursor: 'pointer',
    fontSize: '1.1rem', padding: 4, transition: 'color 0.2s',
  },
  summary: {
    background: '#fff', borderRadius: 16, padding: '1.5rem',
    border: '1px solid #e8e0e0', position: 'sticky', top: 80,
  },
  summaryTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.55rem', color: '#555' },
  promoRow: { display: 'flex', gap: 8, margin: '1rem 0 0.25rem' },
  promoInput: {
    flex: 1, padding: '9px 12px', border: '1.5px solid #e8e0e0', borderRadius: 8,
    fontSize: '0.85rem', outline: 'none', fontFamily: "'DM Sans', sans-serif",
  },
  promoBtn: {
    background: R, color: '#fff', border: 'none', padding: '9px 14px',
    borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  promoHint: { fontSize: '0.75rem', color: '#bbb', marginBottom: '0.75rem' },
  sumTotal: {
    display: 'flex', justifyContent: 'space-between', fontWeight: 700,
    fontSize: '1.05rem', paddingTop: '0.75rem', marginTop: '0.5rem',
    borderTop: `2px solid ${R}`, color: R,
  },
  checkoutBtn: {
    width: '100%', padding: 14, background: R, color: '#fff', border: 'none',
    borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", marginTop: '1rem', transition: 'all 0.2s',
  },
  browsBtn: {
    background: R, color: '#fff', border: 'none', padding: '13px 30px',
    borderRadius: 30, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
};
