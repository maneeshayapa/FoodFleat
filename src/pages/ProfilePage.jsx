import { useState } from 'react';
import { orderHistory } from '../data/menuData';

const TABS = ['Orders', 'Profile', 'Addresses'];

export default function ProfilePage({ navigate }) {
  const [activeTab, setActiveTab] = useState('Orders');

  return (
    <div className="page-wrapper" style={{ maxWidth: 720 }}>
      {/* Profile Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>KP</div>
        <div>
          <div style={styles.name}>Kasun Perera</div>
          <div style={styles.email}>kasun.perera@email.com</div>
          <div style={styles.memberBadge}>⭐ Gold Member since 2023</div>
        </div>
        <button style={styles.editBtn}>✏️ Edit</button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { num: '24',        label: 'Orders' },
          { num: 'Rs. 48,200', label: 'Total Spent' },
          { num: '4.9 ⭐',    label: 'Avg Rating Given' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Orders' && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>Order History</div>
          {orderHistory.map(order => (
            <div key={order.id} style={styles.orderItem}>
              <div style={styles.orderEmoji}>🍽️</div>
              <div style={styles.orderInfo}>
                <div style={styles.orderItems}>{order.items}</div>
                <div style={styles.orderId}>{order.id} &bull; {order.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.orderPrice}>Rs. {order.total.toLocaleString()}</div>
                <span style={styles.statusPill}>✅ Delivered</span>
              </div>
            </div>
          ))}
          <button style={styles.reorderBtn} onClick={() => navigate('menu')}>
            + Order Again
          </button>
        </div>
      )}

      {activeTab === 'Profile' && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>Personal Info</div>
          {[
            ['Full Name',     'Kasun Perera'],
            ['Phone',         '+94 77 123 4567'],
            ['Email',         'kasun.perera@email.com'],
            ['Date of Birth', '15 March 1995'],
          ].map(([label, value]) => (
            <div key={label} style={styles.infoRow}>
              <span style={styles.infoLabel}>{label}</span>
              <span style={styles.infoValue}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Addresses' && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>Saved Addresses</div>
          {[
            { icon: '🏠', label: 'Home',   addr: 'No. 25, Galle Road, Colombo 03' },
            { icon: '🏢', label: 'Office', addr: 'Level 4, World Trade Center, Colombo 01' },
          ].map(a => (
            <div key={a.label} style={styles.addrItem}>
              <div style={styles.addrIcon}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.82rem', color: '#888', marginTop: 2 }}>{a.addr}</div>
              </div>
              <button style={styles.addrEdit}>Edit</button>
            </div>
          ))}
          <button style={styles.addAddrBtn}>+ Add New Address</button>
        </div>
      )}
    </div>
  );
}

const R = '#D82B2B';
const styles = {
  header: {
    background: `linear-gradient(135deg, #A32020, ${R})`,
    borderRadius: 20, padding: '1.75rem', color: '#fff',
    display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem',
  },
  avatar: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '1.5rem', flexShrink: 0,
    border: '3px solid rgba(255,255,255,0.4)',
  },
  name: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' },
  email: { opacity: 0.85, fontSize: '0.88rem', marginTop: 3 },
  memberBadge: {
    display: 'inline-block', background: 'rgba(255,215,0,0.25)',
    color: '#FFD700', fontSize: '0.78rem', padding: '3px 10px',
    borderRadius: 10, marginTop: 6, fontWeight: 600,
  },
  editBtn: {
    marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.4)', padding: '8px 16px',
    borderRadius: 10, cursor: 'pointer', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', flexShrink: 0,
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem',
  },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '1.25rem',
    border: '1px solid #e8e0e0', textAlign: 'center',
  },
  statNum: { fontSize: '1.3rem', fontWeight: 700, color: R },
  statLabel: { fontSize: '0.8rem', color: '#888', marginTop: 3 },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' },
  tab: {
    padding: '9px 20px', border: '1.5px solid #e8e0e0', borderRadius: 20,
    background: '#fff', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
  },
  tabActive: { background: R, color: '#fff', borderColor: R },
  card: { background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e0e0' },
  cardTitle: { fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e0e0' },
  orderItem: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.9rem 0', borderBottom: '1px solid #e8e0e0',
  },
  orderEmoji: {
    fontSize: '1.5rem', width: 44, height: 44, background: '#FCEBEB',
    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  orderInfo: { flex: 1 },
  orderItems: { fontWeight: 600, fontSize: '0.9rem' },
  orderId: { fontSize: '0.78rem', color: '#aaa', marginTop: 2 },
  orderPrice: { fontWeight: 700, color: R, fontSize: '0.95rem' },
  statusPill: {
    fontSize: '0.72rem', padding: '3px 8px', borderRadius: 10,
    background: '#d4edda', color: '#155724', fontWeight: 600, display: 'inline-block', marginTop: 3,
  },
  reorderBtn: {
    marginTop: '1rem', background: 'none', border: `1.5px solid ${R}`, color: R,
    padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0',
    borderBottom: '1px solid #e8e0e0', fontSize: '0.9rem',
  },
  infoLabel: { color: '#888' },
  infoValue: { fontWeight: 500 },
  addrItem: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.9rem 0', borderBottom: '1px solid #e8e0e0',
  },
  addrIcon: {
    width: 40, height: 40, background: '#FCEBEB', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
  },
  addrEdit: {
    marginLeft: 'auto', background: 'none', border: `1px solid #e8e0e0`, color: '#888',
    padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  addAddrBtn: {
    marginTop: '1rem', width: '100%', background: 'none', border: `1.5px dashed #e8e0e0`,
    color: '#888', padding: '11px', borderRadius: 10, cursor: 'pointer', fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
  },
};
