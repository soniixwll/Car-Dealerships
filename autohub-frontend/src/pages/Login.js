import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';
import { login as loginApi, googleLogin as googleLoginApi } from '../services/api';


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
      setError(err.response?.data?.detail || t.auth.invalid_creds);
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credResp) => {
    setError('');
    try {
      const r = await googleLoginApi(credResp.credential);
      login({ email: r.data.email, username: r.data.username, role: r.data.role }, r.data.access);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || t.auth.google_failed);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(79,134,217,0.15)', border: '1px solid rgba(79,134,217,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 650, fontSize: 24, marginBottom: 6 }}>{t.auth.login_title}</h2>
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
              <a href="#" style={{ fontSize: 13, color: 'var(--blue)' }}>{t.auth.forgot_password}</a>
            </div>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="••••••••" style={inputS} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', minHeight: 48, padding: '14px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, marginTop: 8, cursor: 'pointer', opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {loading ? '...' : t.auth.sign_in}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>{t.auth.or_continue}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError(t.auth.google_failed)}
            theme="filled_blue"
            shape="pill"
            text="signin_with"
            width="360"
          />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 20 }}>
          {t.auth.no_account} <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600 }}>{t.auth.sign_up}</Link>
        </p>
      </div>
    </div>
  );
}
const fieldS = { marginBottom: 16 };
const labelS = { display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 };
const inputS = { width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' };
