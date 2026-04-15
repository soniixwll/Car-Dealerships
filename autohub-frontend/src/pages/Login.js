import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { login as loginApi } from '../services/api';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const r = await loginApi({ email: form.email, password: form.password });
      localStorage.setItem('token', r.data.access)
      login({ email: r.data.email, username: r.data.username, role: r.data.role }, r.data.access);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Невірний email або пароль');
    } finally { setLoading(false); }
  };

//   const handleLogin = async () => {
//   const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   })

//   const data = await res.json()

//   localStorage.setItem('token', data.access)
// }

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 40 }}>
        {/* Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 6 }}>{t.auth.login_title}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>{t.auth.login_sub}</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={fieldS}>
            <label style={labelS}>{t.auth.email}</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="your@email.com" style={inputS} />
          </div>
          <div style={fieldS}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={labelS}>{t.auth.password}</label>
              <a href="#" style={{ fontSize: 13, color: '#3b82f6' }}>{t.auth.forgot_password}</a>
            </div>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="••••••••" style={inputS} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, marginTop: 8, cursor: 'pointer', boxShadow: '0 4px 15px rgba(59,130,246,0.3)', opacity: loading ? 0.7 : 1 }}>
            {loading ? '...' : t.auth.sign_in}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>{t.auth.or_continue}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button disabled style={{ width: '100%', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text3)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'not-allowed', opacity: 0.6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {t.auth.google} (незабаром)
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 20 }}>
          {t.auth.no_account} <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>{t.auth.sign_up}</Link>
        </p>
      </div>
    </div>
  );
}
const fieldS = { marginBottom: 16 };
const labelS = { display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 };
const inputS = { width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' };
