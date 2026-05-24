export default function Footer({ navigate }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Logo & About */}
        <div style={styles.col}>
          <div style={styles.logo}>
            Flavor<span style={{ color: '#FFD700' }}>Rush</span>
          </div>
          <p style={styles.about}>
            Fresh food delivered fast. Order from the best restaurants near you.
          </p>
          <div style={styles.socials}>
            {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
              <button key={i} style={styles.socialBtn}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.col}>
          <div style={styles.colTitle}>Quick Links</div>
          {[
            { label: 'Home',        page: 'home'     },
            { label: 'Menu',        page: 'menu'     },
            { label: 'Track Order', page: 'tracking' },
            { label: 'Profile',     page: 'profile'  },
          ].map(link => (
            <button key={link.page} style={styles.link} onClick={() => navigate(link.page)}>
              {link.label}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div style={styles.col}>
          <div style={styles.colTitle}>Contact Us</div>
          <div style={styles.contactItem}>📍 Colombo 03, Sri Lanka</div>
          <div style={styles.contactItem}>📞 +94 11 234 5678</div>
          <div style={styles.contactItem}>✉️ hello@flavorrush.lk</div>
          <div style={styles.contactItem}>🕐 Open: 8AM – 11PM</div>
        </div>

        {/* App Download */}
        <div style={styles.col}>
          <div style={styles.colTitle}>Download App</div>
          <button style={styles.appBtn}>🍎 App Store</button>
          <button style={styles.appBtn}>🤖 Google Play</button>
          <div style={styles.colTitle2}>We Accept</div>
          <div style={styles.payments}>
            {['💳', '📱', '💵'].map((p, i) => (
              <span key={i} style={styles.payIcon}>{p}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <span>© 2026 FlavorRush. All rights reserved.</span>
        <div style={styles.bottomLinks}>
          <button style={styles.bottomLink}>Privacy Policy</button>
          <button style={styles.bottomLink}>Terms of Service</button>
          <button style={styles.bottomLink}>Refund Policy</button>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1a1a',
    color: '#ccc',
    marginTop: '3rem',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '3rem 1.5rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    color: '#fff',
    marginBottom: '0.5rem',
  },
  about: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: '#aaa',
    marginBottom: '0.5rem',
  },
  socials: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid #444',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  colTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: '0.25rem',
    marginTop: '0.25rem',
  },
  colTitle2: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginTop: '1rem',
    marginBottom: '0.25rem',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '0.88rem',
    textAlign: 'left',
    padding: '2px 0',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.2s',
  },
  contactItem: {
    fontSize: '0.85rem',
    color: '#aaa',
    padding: '2px 0',
  },
  appBtn: {
    background: '#2a2a2a',
    border: '1px solid #444',
    color: '#fff',
    padding: '9px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textAlign: 'left',
  },
  payments: {
    display: 'flex',
    gap: '0.5rem',
  },
  payIcon: {
    fontSize: '1.5rem',
    background: '#2a2a2a',
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #444',
  },
  bottomBar: {
    borderTop: '1px solid #333',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem',
    fontSize: '0.82rem',
    color: '#666',
    maxWidth: 1100,
    margin: '0 auto',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.25rem',
  },
  bottomLink: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: "'DM Sans', sans-serif",
  },
};