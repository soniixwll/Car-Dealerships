import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { register as registerApi, login as loginApi } from '../services/api';

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

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 40 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 6 }}>{t.auth.register_title}</h2>
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>{t.auth.register_sub}</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[['email', t.auth.email, 'email', 'your@email.com'], ['username', t.auth.username, 'text', 'username'], ['phone', t.auth.phone, 'tel', '+380 67 000 0000'], ['password', t.auth.password, 'password', '••••••••'], ['password2', t.auth.confirm_password, 'password', '••••••••']].map(([key, label, type, ph]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} required={key !== 'phone'} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, marginTop: 8, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '...' : t.auth.create_account}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>{t.auth.or_continue}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button type="button" onClick={() => alert(t.auth.google_soon || 'Реєстрація через Google скоро з\'явиться')}
          style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 10, color: '#1f1f1f', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: '.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.borderColor = '#3b82f6'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {t.auth.google}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)', marginTop: 20 }}>
          {t.auth.have_account} <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>{t.auth.sign_in_link}</Link>
        </p>
      </div>
    </div>
  );
}
