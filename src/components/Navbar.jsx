import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ currentPage, navigate, user, onSignOut }) {
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { key: 'home',     label: t('home', 'Home') },
    { key: 'menu',     label: t('menu', 'Menu') },
    { key: 'tracking', label: t('trackOrder', 'Track Order') },
    { key: 'profile',  label: t('profile', 'Profile') },
  ];

  const initials = user
    ? user.initials || user.name?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('home')}>
        Flavor<span style={styles.logoSpan}>Rush</span>
      </div>

      <div style={styles.links}>
        {links.map(l => (
          <button
            key={l.key}
            style={{ ...styles.navLink, ...(currentPage === l.key ? styles.navLinkActive : {}) }}
            onClick={() => navigate(l.key)}
          >
            {l.label}
          </button>
        ))}

        <button style={styles.cartBtn} onClick={() => navigate('cart')}>
          🛒 Cart
          {totalItems > 0 && (
            <span style={styles.cartBadge}>{totalItems}</span>
          )}
        </button>

        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          style={styles.langSelect}
        >
          <option value="en">EN</option>
          <option value="si">සිං</option>
        </select>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button style={styles.userBtn} onClick={() => setDropOpen(open => !open)}>
              {initials}
            </button>
            {dropOpen && (
              <div style={styles.userMenu}>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                </div>
                <button style={styles.userMenuBtn} onClick={() => { navigate('profile'); setDropOpen(false); }}>
                  👤 {t('profile', 'Profile')}
                </button>
                <button style={{ ...styles.userMenuBtn, color: '#D82B2B' }} onClick={() => { onSignOut(); setDropOpen(false); }}>
                  🚪 {t('signIn', 'Sign In')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button style={styles.signInBtn} onClick={() => navigate('login')}>
            {t('signIn', 'Sign In')}
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#D82B2B',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoSpan: { color: '#FFD700' },
  links: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '7px 14px',
    borderRadius: 20,
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },
  navLinkActive: {
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
  },
  cartBtn: {
    background: '#fff',
    color: '#D82B2B',
    border: 'none',
    padding: '8px 18px',
    borderRadius: 20,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.9rem',
    position: 'relative',
    transition: 'all 0.2s',
  },
  cartBadge: {
    background: '#D82B2B',
    color: '#fff',
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  userBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.4)',
    color: '#fff',
    borderRadius: '50%',
    width: 38,
    height: 38,
    cursor: 'pointer',
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenu: {
    position: 'absolute',
    right: 0,
    top: 48,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    minWidth: 180,
    overflow: 'hidden',
    zIndex: 200,
    border: '1px solid #e8e0e0',
  },
  userInfo: {
    padding: '12px 16px',
    borderBottom: '1px solid #e8e0e0',
  },
  userName: {
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: '0.78rem',
    color: '#888',
    marginTop: 2,
  },
  userMenuBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.88rem',
    color: '#1a1a1a',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
  },
  signInBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.5)',
    padding: '8px 18px',
    borderRadius: 20,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
  },
  langSelect: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 9999,
    padding: '8px 12px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
    appearance: 'none',
  },
};
