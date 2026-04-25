import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createBooking, getProfile, getAvailability } from '../services/api';

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 9; h < 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 18 || true) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots.filter(t => t <= '18:30');
})();

export default function BookingModal({ car, dealerships, onClose }) {
  const { t, user } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    salon: car.dealership || (dealerships[0] && dealerships[0].id) || '',
    date: '',
    time: '',
    phone: user?.phone || '',
    comment: '',
  });
  const [takenTimes, setTakenTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill phone from user profile if not present in user object
  useEffect(() => {
    if (user && !form.phone) {
      getProfile().then(r => {
        if (r.data.phone) setForm(p => ({ ...p, phone: r.data.phone }));
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch taken time slots whenever date changes
  useEffect(() => {
    if (!form.date) { setTakenTimes([]); return; }
    getAvailability(car.id, form.date)
      .then(r => setTakenTimes(r.data.taken_times || []))
      .catch(() => setTakenTimes([]));
  }, [form.date, car.id]);

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
    setLoading(true); setErrors({});
    try {
      const dt = `${form.date}T${form.time}:00`;
      await createBooking({
        car: car.id,
        dealership: form.salon,
        booking_datetime: dt,
        phone: form.phone,
        comment: form.comment,
      });
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // unique_together error comes as non_field_errors
        const nonField = data.non_field_errors;
        if (Array.isArray(nonField) && nonField.some(m => /unique|already/i.test(m))) {
          setErrors({ _general: 'Цей час щойно забронював інший користувач. Оберіть інший слот.' });
          getAvailability(car.id, form.date).then(r => setTakenTimes(r.data.taken_times || [])).catch(() => {});
        } else {
          setErrors(data);
        }
      } else {
        setErrors({ _general: 'Помилка бронювання. Спробуйте ще раз.' });
      }
    } finally { setLoading(false); }
  };

  const fieldError = (key) => {
    const v = errors[key];
    if (!v) return null;
    return <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{Array.isArray(v) ? v.join(' ') : String(v)}</div>;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (success) return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        <div style={{ textAlign: 'center', padding: '32px 8px' }}>
          <CheckCircle2 size={56} color="#22c55e" style={{ marginBottom: 16 }} />
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{t.booking.success}</div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>
            {car.brand_name} {car.model_name} · {form.date} о {form.time}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => { onClose(); navigate('/profile'); }} style={{ ...primaryBtn, justifyContent: 'center' }}>
              До моїх записів
            </button>
            <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              {t.booking.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--text2)' }}>
            🚗 {car.brand_name} {car.model_name} {car.year}
          </div>

          {errors._general && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>
              {errors._general}
            </div>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>{t.booking.salon}</label>
            <select value={form.salon} onChange={e => setForm(p => ({ ...p, salon: e.target.value }))} required style={inputStyle}>
              {dealerships.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {fieldError('dealership')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Дата</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value, time: '' }))} required style={inputStyle} min={todayStr} />
              {fieldError('date')}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Час</label>
              <select value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required disabled={!form.date} style={{ ...inputStyle, opacity: form.date ? 1 : 0.6 }}>
                <option value="">{form.date ? '— оберіть —' : 'Спочатку дата'}</option>
                {TIME_SLOTS.map(slot => {
                  const taken = takenTimes.includes(slot);
                  return (
                    <option key={slot} value={slot} disabled={taken}>
                      {slot}{taken ? ' — зайнято' : ''}
                    </option>
                  );
                })}
              </select>
              {fieldError('booking_datetime')}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>{t.profile?.phone || 'Телефон'}</label>
            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+380 67 000 0000" style={inputStyle} />
            {fieldError('phone')}
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
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
const modalStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' };
const closeBtn = { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' };
const fieldStyle = { marginBottom: 14 };
const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 };
const inputStyle = { width: '100%', padding: '11px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' };
const primaryBtn = { display: 'inline-flex', alignItems: 'center', padding: '12px 24px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.3)', cursor: 'pointer' };
