import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { menuItems, DELIVERY_FEE } from '../data/menuData';

const PAY_METHODS = [
  { id: 'card',   label: '💳 Card'             },
  { id: 'cash',   label: '💵 Cash on Delivery'  },
  { id: 'online', label: '📱 Online Pay'         },
];

export default function CheckoutPage({ navigate }) {
  const { items, discount, promoApplied, clearCart } = useCart();
  const { showToast } = useToast();
  const [payMethod, setPayMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', postal: '',
    cardNum: '', cvv: '', expiry: '',
  });

  const cartItems = Object.entries(items)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...menuItems.find(i => i.id === Number(id)), qty }));

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = promoApplied ? Math.round(subtotal * discount / 100) : 0;
  const total = subtotal - discountAmt + DELIVERY_FEE;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOrder = () => {
    const required = ['firstName', 'lastName', 'phone', 'address', 'city'];
    for (const k of required) {
      if (!form[k].trim()) { showToast('⚠️ Please fill all required fields'); return; }
    }
    setLoading(true);
    setTimeout(() => {
      clearCart();
      setLoading(false);
      navigate('tracking');
      showToast('🎉 Order placed successfully!');
    }, 1500);
  };

  return (
    <div className="page-wrapper">
      <h1 style={styles.title}>Checkout</h1>
      <div style={styles.layout}>
        {/* Left: Form */}
        <div>
          {/* Delivery */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📍 Delivery Details</h3>
            <div style={styles.row}>
              <Field label="First Name *" value={form.firstName} onChange={v => update('firstName', v)} placeholder="Kasun" />
              <Field label="Last Name *"  value={form.lastName}  onChange={v => update('lastName', v)}  placeholder="Perera" />
            </div>
            <Field label="Phone Number *" value={form.phone} onChange={v => update('phone', v)} placeholder="+94 77 123 4567" />
            <Field label="Delivery Address *" value={form.address} onChange={v => update('address', v)} placeholder="No. 25, Galle Road, Colombo 03" />
            <div style={styles.row}>
              <Field label="City *"        value={form.city}   onChange={v => update('city', v)}   placeholder="Colombo" />
              <Field label="Postal Code"   value={form.postal} onChange={v => update('postal', v)} placeholder="00300" />
            </div>
          </div>

          {/* Payment */}
          <div style={{ ...styles.card, marginTop: '1rem' }}>
            <h3 style={styles.cardTitle}>💳 Payment Method</h3>
            <div style={styles.payMethods}>
              {PAY_METHODS.map(m => (
                <button
                  key={m.id}
                  style={{ ...styles.payBtn, ...(payMethod === m.id ? styles.payBtnActive : {}) }}
                  onClick={() => setPayMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div style={{ marginTop: '1rem' }}>
                <Field label="Card Number" value={form.cardNum} onChange={v => update('cardNum', v)} placeholder="4242 4242 4242 4242" />
                <div style={styles.row}>
                  <Field label="Expiry Date" value={form.expiry} onChange={v => update('expiry', v)} placeholder="MM / YY" />
                  <Field label="CVV"         value={form.cvv}    onChange={v => update('cvv', v)}    placeholder="123" />
                </div>
              </div>
            )}

            {payMethod === 'cash' && (
              <div style={styles.infoBanner}>
                💵 Pay with cash when your order arrives. Have exact change ready!
              </div>
            )}

            {payMethod === 'online' && (
              <div style={styles.infoBanner}>
                📱 You'll receive a payment link via SMS after placing the order.
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryTitle}>Order Summary</div>
          {cartItems.map(i => (
            <div key={i.id} style={styles.sumRow}>
              <span>{i.emoji} {i.name} ×{i.qty}</span>
              <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={styles.sumRow}><span>Delivery</span><span>Rs. {DELIVERY_FEE}</span></div>
          {promoApplied && (
            <div style={{ ...styles.sumRow, color: '#155724' }}>
              <span>Discount ({discount}%)</span>
              <span>− Rs. {discountAmt.toLocaleString()}</span>
            </div>
          )}
          <div style={styles.sumTotal}>
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <button style={{ ...styles.placeBtn, opacity: loading ? 0.7 : 1 }} onClick={handleOrder} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order 🎉'}
          </button>

          <p style={styles.secureNote}>🔒 100% Secure & Encrypted Payment</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={e => (e.target.style.borderColor = '#D82B2B')}
        onBlur={e => (e.target.style.borderColor = '#e8e0e0')}
      />
    </div>
  );
}

const R = '#D82B2B';

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' },
  card: { background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e0e0' },
  cardTitle: { fontWeight: 700, fontSize: '1rem', marginBottom: '1.1rem', color: R },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 13px', border: '1.5px solid #e8e0e0',
    borderRadius: 8, fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s',
    fontFamily: "'DM Sans', sans-serif", background: '#fff',
  },
  payMethods: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  payBtn: {
    padding: '10px 16px', border: '1.5px solid #e8e0e0', borderRadius: 10,
    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
    background: '#fff', fontFamily: "'DM Sans', sans-serif",
  },
  payBtnActive: { borderColor: R, background: '#FCEBEB', color: R },
  infoBanner: {
    background: '#FCEBEB', color: R, padding: '12px 14px', borderRadius: 10,
    fontSize: '0.88rem', marginTop: '1rem', lineHeight: 1.5,
  },
  summary: {
    background: '#fff', borderRadius: 16, padding: '1.5rem',
    border: '1px solid #e8e0e0', position: 'sticky', top: 80,
  },
  summaryTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', marginBottom: '0.55rem', color: '#555' },
  sumTotal: {
    display: 'flex', justifyContent: 'space-between', fontWeight: 700,
    fontSize: '1.05rem', paddingTop: '0.75rem', marginTop: '0.5rem',
    borderTop: `2px solid ${R}`, color: R, marginBottom: '0.25rem',
  },
  placeBtn: {
    width: '100%', padding: 14, background: R, color: '#fff', border: 'none',
    borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", marginTop: '1rem', transition: 'all 0.2s',
  },
  secureNote: { textAlign: 'center', fontSize: '0.78rem', color: '#aaa', marginTop: '0.75rem' },
};
