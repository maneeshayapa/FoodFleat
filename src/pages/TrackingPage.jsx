const STEPS = [
  { icon: '✅', label: 'Order Confirmed',  desc: 'Your order has been received',      done: true,  current: false },
  { icon: '👨‍🍳', label: 'Preparing',        desc: 'Our chefs are cooking your meal',   done: true,  current: false },
  { icon: '🚴', label: 'Out for Delivery', desc: 'Driver is heading your way',        done: false, current: true  },
  { icon: '🏠', label: 'Delivered',        desc: 'Enjoy your meal!',                  done: false, current: false },
];

export default function TrackingPage() {
  return (
    <div className="page-wrapper" style={{ maxWidth: 700 }}>
      <h1 style={styles.title}>Track Your Order</h1>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.orderId}>Order ID: #FR-20240518-8821</div>
          <div style={styles.status}>Your order is on the way! 🚴</div>
          <div style={styles.eta}>⏱ Estimated delivery: 25 minutes</div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressWrap}>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: '65%' }} />
          </div>
          <p style={styles.progressLabel}>65% complete</p>
        </div>

        {/* Steps */}
        <div style={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={{ ...styles.stepIconWrap, position: 'relative' }}>
                <div style={{
                  ...styles.stepIcon,
                  ...(step.done ? styles.stepDone : {}),
                  ...(step.current ? styles.stepCurrent : {}),
                }}>
                  {step.done ? '✅' : step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    ...styles.connector,
                    background: step.done ? '#D82B2B' : '#e8e0e0',
                  }} />
                )}
              </div>
              <div style={styles.stepInfo}>
                <div style={{
                  ...styles.stepLabel,
                  color: step.done || step.current ? '#D82B2B' : '#888',
                }}>
                  {step.label}
                </div>
                <div style={styles.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Driver Card */}
        <div style={styles.driverCard}>
          <div style={styles.driverAvatar}>🚴</div>
          <div style={styles.driverInfo}>
            <div style={styles.driverName}>Nuwan Jayasinghe</div>
            <div style={styles.driverSub}>Your delivery partner &bull; ⭐ 4.9 rating</div>
          </div>
          <div style={styles.driverActions}>
            <button style={styles.callBtn}>📞 Call</button>
            <button style={styles.chatBtn}>💬 Chat</button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div style={styles.mapPlaceholder}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🗺️</div>
          <div style={{ fontWeight: 600, color: '#D82B2B' }}>Live Map Tracking</div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>
            Integrate Google Maps API here
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(216,43,43,0.35); }
          50%       { box-shadow: 0 0 0 9px rgba(216,43,43,0); }
        }
        .step-current { animation: pulse 1.6s infinite; }
      `}</style>
    </div>
  );
}

const R = '#D82B2B';
const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1.5rem' },
  card: { background: '#fff', borderRadius: 20, padding: '2rem', border: '1px solid #e8e0e0' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  orderId: { fontSize: '0.85rem', color: '#888', marginBottom: 6 },
  status: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: R },
  eta: {
    display: 'inline-block', background: '#FCEBEB', color: R,
    padding: '7px 20px', borderRadius: 20, fontSize: '0.88rem',
    fontWeight: 600, marginTop: 10,
  },
  progressWrap: { marginBottom: '2rem' },
  progressBg: { background: '#f0e8e8', borderRadius: 10, height: 10, overflow: 'hidden' },
  progressFill: { background: R, height: '100%', borderRadius: 10, transition: 'width 1s ease' },
  progressLabel: { fontSize: '0.78rem', color: '#888', marginTop: 6, textAlign: 'right' },
  steps: { marginBottom: '1.5rem' },
  step: { display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' },
  stepIconWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  stepIcon: {
    width: 40, height: 40, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
    border: '2px solid #e8e0e0', background: '#fff', zIndex: 1, flexShrink: 0,
  },
  stepDone: { background: '#FCEBEB', borderColor: R },
  stepCurrent: { borderColor: R, borderWidth: 2.5 },
  connector: {
    width: 2, flex: 1, minHeight: 24, margin: '4px 0',
  },
  stepInfo: { paddingTop: 8 },
  stepLabel: { fontWeight: 600, fontSize: '0.95rem' },
  stepDesc: { fontSize: '0.82rem', color: '#888', marginTop: 2 },
  driverCard: {
    background: '#FCEBEB', borderRadius: 14, padding: '1rem 1.25rem',
    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem',
  },
  driverAvatar: {
    fontSize: '2rem', width: 52, height: 52, background: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  driverInfo: { flex: 1 },
  driverName: { fontWeight: 700, fontSize: '0.95rem' },
  driverSub: { fontSize: '0.8rem', color: '#888', marginTop: 2 },
  driverActions: { display: 'flex', gap: 8 },
  callBtn: {
    background: R, color: '#fff', border: 'none', padding: '8px 14px',
    borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
  },
  chatBtn: {
    background: '#fff', color: R, border: `1.5px solid ${R}`, padding: '8px 14px',
    borderRadius: 8, cursor: 'pointer', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
  },
  mapPlaceholder: {
    background: '#f7f4f2', borderRadius: 12, padding: '2rem',
    textAlign: 'center', border: '2px dashed #e8e0e0',
  },
};
