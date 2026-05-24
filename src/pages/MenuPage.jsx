import { useState } from 'react';
import FoodCard from '../components/FoodCard';
import { menuItems, categories } from '../data/menuData';

export default function MenuPage({ initialCategory = 'All' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const filtered = menuItems.filter(item => {
    const matchCat = activeCategory === 'All' || item.cat === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="section-title">Our Menu</div>
      <div className="section-sub">Fresh ingredients, bold flavours — made just for you</div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.searchInput}
          placeholder="Search dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Category Tabs */}
      <div style={styles.cats}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.catBtn,
              ...(activeCategory === cat ? styles.catBtnActive : {}),
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={styles.countText}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div style={styles.foodGrid}>
          {filtered.map(item => <FoodCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <p style={{ color: '#888' }}>No items found. Try a different search or category.</p>
        </div>
      )}

      <style>{`
        .food-card-hover { transition: transform 0.25s, box-shadow 0.25s; }
        .food-card-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(216,43,43,0.13); }
      `}</style>
    </div>
  );
}

const styles = {
  searchWrap: {
    position: 'relative',
    maxWidth: 420,
    marginBottom: '1.25rem',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '11px 42px',
    border: '1.5px solid #e8e0e0',
    borderRadius: 30,
    fontSize: '0.9rem',
    outline: 'none',
    background: '#fff',
    transition: 'border 0.2s',
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: 4,
  },
  cats: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  catBtn: {
    padding: '8px 18px',
    borderRadius: 20,
    border: '1.5px solid #e8e0e0',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    color: '#1a1a1a',
    fontFamily: "'DM Sans', sans-serif",
  },
  catBtnActive: {
    background: '#D82B2B',
    color: '#fff',
    borderColor: '#D82B2B',
  },
  countText: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '1.25rem',
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
};
