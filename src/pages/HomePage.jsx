import FoodCard from '../components/FoodCard';
import { menuItems } from '../data/menuData';

const heroCategories = [
  { emoji: '🍕', label: 'Pizza',    cat: 'Pizza'    },
  { emoji: '🍔', label: 'Burgers',  cat: 'Burgers'  },
  { emoji: '🍣', label: 'Sushi',    cat: 'Sushi'    },
  { emoji: '🍰', label: 'Desserts', cat: 'Desserts' },
];

const stats = [
  { num: '500+',   label: 'Menu Items'       },
  { num: '30 min', label: 'Avg Delivery'     },
  { num: '4.8 ⭐', label: 'Customer Rating'  },
  { num: '50K+',   label: 'Happy Customers'  },
];

export default function HomePage({ navigate }) {
  const popular = menuItems.filter(i => i.badge === 'popular').slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🚀 Fast Delivery · Fresh Food</p>
          <h1 style={styles.heroTitle}>
            Delicious Food,<br />
            <span style={{ color: '#FFD700' }}>Delivered Fast</span> 🍕
          </h1>
          <p style={styles.heroSub}>
            Order from the best restaurants near you. Fresh, hot & on time — every time.
          </p>
          <div style={styles.heroBtns}>
            <button className="btn-primary" onClick={() => navigate('menu')} style={styles.heroPrimary}>
              Order Now →
            </button>
            <button className="btn-outline" onClick={() => navigate('tracking')} style={styles.heroOutline}>
              Track My Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        {stats.map(s => (
          <div key={s.label} style={styles.stat}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="page-wrapper">
        <div className="section-title">Browse Categories</div>
        <div className="section-sub">What are you craving today?</div>
        <div style={styles.catGrid}>
          {heroCategories.map(c => (
            <div key={c.cat} style={styles.catCard} onClick={() => navigate('menu', c.cat)}
              className="food-card-hover">
              <div style={styles.catEmoji}>{c.emoji}</div>
              <div style={styles.catLabel}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Popular Items */}
        <div className="section-title" style={{ marginTop: '2.5rem' }}>Most Popular</div>
        <div className="section-sub">Loved by thousands of customers</div>
        <div style={styles.foodGrid}>
          {popular.map(item => <FoodCard key={item.id} item={item} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-primary" onClick={() => navigate('menu')}
            style={{ background: '#D82B2B', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 30, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            View Full Menu →
          </button>
        </div>
      </div>

      <style>{`
        .food-card-hover { transition: transform 0.25s, box-shadow 0.25s; }
        .food-card-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(216,43,43,0.13); }
        .btn-primary { background: #D82B2B; color: #fff; border: none; padding: 13px 28px; border-radius: 30px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #A32020; transform: translateY(-2px); }
        .btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.7); padding: 11px 24px; border-radius: 30px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #A32020 0%, #D82B2B 55%, #E84040 100%)',
    color: '#fff',
    padding: '5rem 2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: { position: 'relative', maxWidth: 700, margin: '0 auto' },
  heroTag: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
    fontWeight: 500,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    lineHeight: 1.2,
    marginBottom: '1rem',
  },
  heroSub: { fontSize: '1.05rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 },
  heroBtns: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroPrimary: {
    background: '#fff', color: '#D82B2B', border: 'none', padding: '14px 32px',
    borderRadius: 30, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s',
  },
  heroOutline: {
    background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.7)',
    padding: '12px 28px', borderRadius: 30, fontWeight: 600, fontSize: '1rem',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  stats: {
    display: 'flex', justifyContent: 'center', gap: '3rem', padding: '1.75rem 2rem',
    background: '#fff', borderBottom: '1px solid #e8e0e0', flexWrap: 'wrap',
  },
  stat: { textAlign: 'center' },
  statNum: { fontSize: '1.6rem', fontWeight: 700, color: '#D82B2B' },
  statLabel: { fontSize: '0.8rem', color: '#888', marginTop: 2 },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  catCard: {
    background: '#fff', borderRadius: 16, padding: '2rem 1rem',
    textAlign: 'center', border: '1px solid #e8e0e0', cursor: 'pointer',
  },
  catEmoji: { fontSize: '3.5rem', marginBottom: '0.75rem' },
  catLabel: { fontWeight: 600, fontSize: '1rem' },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
};
