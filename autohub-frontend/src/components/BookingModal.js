import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createBooking } from '../services/api';

export default function BookingModal({ car, dealerships, onClose }) {
  const { t, user } = useApp();
  const [form, setForm] = useState({ salon: car.dealership || '', date: '', time: '10:00', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{t.booking.login_required}</div>
          <a href="/login" style={primaryBtn}>{t.auth.sign_in}</a>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const dt = `${form.date}T${form.time}:00`;
      await createBooking({ car: car.id, dealership: form.salon, booking_datetime: dt, comment: form.comment });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#3b82f6" />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>{t.booking.title}</h2>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#22c55e' }}>{t.booking.success}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--text2)' }}>
              🚗 {car.brand_name} {car.model_name} {car.year}
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{error}</div>}
            <div style={fieldStyle}>
              <label style={labelStyle}>{t.booking.salon}</label>
              <select value={form.salon} onChange={e => setForm(p => ({ ...p, salon: e.target.value }))} required style={inputStyle}>
                {dealerships.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Дата</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required style={inputStyle} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Час</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required style={inputStyle} />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>{t.booking.comment}</label>
              <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} placeholder={t.booking.comment_placeholder} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" disabled={loading} style={{ ...primaryBtn, flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                {loading ? '...' : t.booking.submit}
              </button>
              <button type="button" onClick={onClose} style={{ padding: '12px 20px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 14, fontWeight: 500 }}>
                {t.booking.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
const modalStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, position: 'relative' };
const closeBtn = { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' };
const fieldStyle = { marginBottom: 14 };
const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 };
const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' };
const primaryBtn = { display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.3)', cursor: 'pointer' };
