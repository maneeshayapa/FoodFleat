import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ navigate, onLogin }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      showToast('⚠️ Email සහ Password දෙකම enter කරන්න'); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Kasun Perera', email: loginForm.email });
      showToast('👋 Welcome back!');
      navigate('home');
    }, 1200);
  };

  const handleRegister = () => {
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password) {
      showToast('⚠️ සියලු fields fill කරන්න'); return;
    }
    if (regForm.password !== regForm.confirm) {
      showToast('❌ Passwords match වෙන්නෑ'); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: regForm.name, email: regForm.email });
      showToast('🎉 Account created successfully!');
      navigate('home');
    }, 1200);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logo}>Flavor<span style={{ color: '#FFD700' }}>Rush</span></div>
          <p style={styles.logoSub}>
            {tab === 'login' ? 'Welcome back! 👋' : 'Create your account 🍕'}
          </p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'register' ? styles.tabActive : {}) }}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <div>
            <Field label="Email Address" type="email" placeholder="kasun@email.com"
              value={loginForm.email} onChange={v => setLoginForm(f => ({ ...f, email: v }))} />
            <Field label="Password" type="password" placeholder="••••••••"
              value={loginForm.password} onChange={v => setLoginForm(f => ({ ...f, password: v }))} />

            <div style={styles.forgotWrap}>
              <button style={styles.forgotBtn}>Forgot password?</button>
            </div>

            <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>

            {/* Demo hint */}
            <div style={styles.demoHint}>
              💡 Demo: ඕනෑම email/password දාන්න
            </div>
          </div>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <div>
            <Field label="Full Name *"       type="text"     placeholder="Kasun Perera"
              value={regForm.name}     onChange={v => setRegForm(f => ({ ...f, name: v }))} />
            <Field label="Email Address *"   type="email"    placeholder="kasun@email.com"
              value={regForm.email}    onChange={v => setRegForm(f => ({ ...f, email: v }))} />
            <Field label="Phone Number *"    type="tel"      placeholder="+94 77 123 4567"
              value={regForm.phone}    onChange={v => setRegForm(f => ({ ...f, phone: v }))} />
            <Field label="Password *"        type="password" placeholder="••••••••"
              value={regForm.password} onChange={v => setRegForm(f => ({ ...f, password: v }))} />
            <Field label="Confirm Password *" type="password" placeholder="••••••••"
              value={regForm.confirm}  onChange={v => setRegForm(f => ({ ...f, confirm: v }))} />

            <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account 🎉'}
            </button>
          </div>
        )}

        <p style={styles.switchText}>
          {tab === 'login' ? "Account නෑද? " : "Already have an account? "}
          <button style={styles.switchBtn} onClick={() => setTab(tab === 'login' ? 'register' : 'login')}>
            {tab === 'login' ? 'Register කරන්න' : 'Login කරන්න'}
          </button>
        </p>

      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => (e.target.style.borderColor = '#D82B2B')}
        onBlur={e => (e.target.style.borderColor = '#e8e0e0')}
      />
    </div>
  );
}

const R = '#D82B2B';
const styles = {
  wrapper: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: '#f7f4f2',
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '2.5rem',
    width: '100%',
    maxWidth: 420,
    border: '1px solid #e8e0e0',
    boxShadow: '0 8px 32px rgba(216,43,43,0.08)',
  },
  logoWrap: { textAlign: 'center', marginBottom: '1.5rem' },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    color: '#1a1a1a',
  },
  logoSub: { color: '#888', fontSize: '0.95rem', marginTop: 6 },
  tabs: {
    display: 'flex',
    background: '#f7f4f2',
    borderRadius: 10,
    padding: 4,
    marginBottom: '1.5rem',
  },
  tab: {
    flex: 1,
    padding: '9px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    background: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    color: '#888',
  },
  tabActive: {
    background: '#fff',
    color: R,
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%',
    padding: '11px 13px',
    border: '1.5px solid #e8e0e0',
    borderRadius: 9,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  forgotWrap: { textAlign: 'right', marginTop: -6, marginBottom: '1rem' },
  forgotBtn: {
    background: 'none', border: 'none', color: R,
    fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    width: '100%',
    padding: 13,
    background: R,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: '0.25rem',
    transition: 'all 0.2s',
  },
  demoHint: {
    textAlign: 'center',
    fontSize: '0.78rem',
    color: '#aaa',
    marginTop: '0.75rem',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '1.25rem',
  },
  switchBtn: {
    background: 'none', border: 'none', color: R,
    fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
    fontFamily: "'DM Sans', sans-serif",
  },
};