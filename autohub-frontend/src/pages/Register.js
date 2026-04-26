import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useApp } from '../context/AppContext';
import { register as registerApi, login as loginApi, googleLogin as googleLoginApi } from '../services/api';

export default function Register() {
  const { t, login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '', password2: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { setError('Паролі не співпадають'); return; }
    setLoading(true); setError('');
    try {
      await registerApi({ email: form.email, username: form.username, password: form.password, password2: form.password2, phone: form.phone });
      const r = await loginApi({ email: form.email, password: form.password });
      login({ email: r.data.email, username: r.data.username, role: r.data.role }, r.data.access);
      navigate('/');
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(' ') : 'Помилка реєстрації');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credResp) => {
    setError('');
    try {
      const r = await googleLoginApi(credResp.credential);
      login({ email: r.data.email, username: r.data.username, role: r.data.role }, r.data.access);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Не вдалось увійти через Google');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 40 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 650, fontSize: 24, marginBottom: 6 }}>{t.auth.register_title}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>{t.auth.register_sub}</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[['email', t.auth.email, 'email', 'your@email.com'], ['username', t.auth.username, 'text', 'username'], ['phone', t.auth.phone, 'tel', '+380 67 000 0000'], ['password', t.auth.password, 'password', '••••••••'], ['password2', t.auth.confirm_password, 'password', '••••••••']].map(([key, label, type, ph]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} required={key !== 'phone'} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: '100%', minHeight: 48, padding: '14px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, marginTop: 8, cursor: 'pointer', opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap' }}>
            {loading ? '...' : t.auth.create_account}
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
            onError={() => setError('Не вдалось увійти через Google')}
            theme="filled_blue"
            shape="pill"
            text="signup_with"
            width="360"
          />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 20 }}>
          {t.auth.have_account} <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>{t.auth.sign_in_link}</Link>
        </p>
      </div>
    </div>
  );
}
