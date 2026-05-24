import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BADGE_MAP = {
  popular: { label: '🔥 Popular', bg: '#FFF3CD', color: '#856404' },
  new:     { label: '✨ New',     bg: '#d4edda', color: '#155724' },
  spicy:   { label: '🌶 Spicy',   bg: '#FCEBEB', color: '#D82B2B' },
};

export default function FoodCard({ item }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const badge = BADGE_MAP[item.badge];

  const handleAdd = () => {
    addItem(item.id);
    showToast(`${item.emoji} ${item.name} added to cart!`);
  };

  return (
    <div style={styles.card} className="food-card-hover">
      <div style={styles.imgBox}>{item.emoji}</div>
      <div style={styles.info}>
        {badge && (
          <span style={{ ...styles.badge, background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
        )}
        <div style={styles.name}>{item.name}</div>
        <div style={styles.desc}>{item.desc}</div>
        <div style={styles.footer}>
          <div style={styles.price}>Rs. {item.price.toLocaleString()}</div>
          <button style={styles.addBtn} onClick={handleAdd} aria-label={`Add ${item.name} to cart`}>
            +
          </button>
        </div>
      </div>

      <style>{`
        .food-card-hover { transition: transform 0.25s, box-shadow 0.25s; }
        .food-card-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(216,43,43,0.13); }
        .food-card-hover button:hover { background: #A32020 !important; transform: scale(1.1); }
      `}</style>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #e8e0e0',
    cursor: 'default',
  },
  imgBox: {
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    background: '#FCEBEB',
  },
  info: { padding: '1rem' },
  badge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    padding: '3px 9px',
    borderRadius: 10,
    marginBottom: 6,
    fontWeight: 700,
  },
  name: { fontWeight: 600, fontSize: '1rem', marginBottom: 4 },
  desc: { fontSize: '0.82rem', color: '#888', marginBottom: '0.75rem', lineHeight: 1.4 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: '1.1rem', fontWeight: 700, color: '#D82B2B' },
  addBtn: {
    background: '#D82B2B',
    color: '#fff',
    border: 'none',
    width: 34,
    height: 34,
    borderRadius: '50%',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
};
