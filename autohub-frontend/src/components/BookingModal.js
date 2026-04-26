import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, CheckCircle2, LockKeyhole, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomSelect from './CustomSelect';
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
const PHONE_RE = /^\+380\d{9}$/;

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
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(79,134,217,0.1)', border: '1px solid rgba(79,134,217,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LockKeyhole size={36} color="var(--blue)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{t.booking.login_required}</div>
          <a href="/login" style={primaryBtn}>{t.auth.sign_in}</a>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      ...(form.date ? {} : { date: 'Оберіть дату' }),
      ...(form.time ? {} : { booking_datetime: 'Оберіть час' }),
      ...(PHONE_RE.test(form.phone.trim()) ? {} : { phone: 'Введіть номер у форматі +380XXXXXXXXX' }),
    };
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setLoading(true); setErrors({});
    try {
      const dt = `${form.date}T${form.time}:00`;
      await createBooking({
        car: car.id,
        dealership: form.salon,
        booking_datetime: dt,
        phone: form.phone.trim(),
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
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(79,134,217,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="var(--blue)" />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>{t.booking.title}</h2>
          </div>
          <button onClick={onClose} style={closeBtn}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--text2)' }}>
            <Car size={15} color="var(--text3)" style={{ marginRight: 6, verticalAlign: 'middle' }} />
            {car.brand_name} {car.model_name} {car.year}
          </div>

          {errors._general && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>
              {errors._general}
            </div>
          )}

          <div style={fieldStyle}>
            <label style={labelStyle}>{t.booking.salon}</label>
            <CustomSelect
              value={form.salon}
              onChange={v => setForm(p => ({ ...p, salon: v }))}
              options={dealerships.map(d => ({ value: d.id, label: d.name }))}
            />
            {fieldError('dealership')}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Дата</label>
              <DatePicker
                value={form.date}
                min={todayStr}
                onChange={date => setForm(p => ({ ...p, date, time: '' }))}
              />
              {fieldError('date')}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Час</label>
              <CustomSelect
                value={form.time}
                onChange={v => setForm(p => ({ ...p, time: v }))}
                disabled={!form.date}
                placeholder={form.date ? '— оберіть —' : 'Спочатку дата'}
                options={TIME_SLOTS.map(slot => ({ value: slot, label: slot, disabled: takenTimes.includes(slot) }))}
              />
              {fieldError('booking_datetime')}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>{t.profile?.phone || 'Телефон'}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+380670000000"
              required
              pattern="^\+380[0-9]{9}$"
              style={inputStyle}
            />
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
const primaryBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '12px 24px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' };

const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function formatDisplayDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const offset = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function DatePicker({ value, min, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [visibleMonth, setVisibleMonth] = useState(selectedDate || new Date());
  const minKey = min || toDateKey(new Date());
  const days = getCalendarDays(visibleMonth.getFullYear(), visibleMonth.getMonth());

  const shiftMonth = (delta) => {
    setVisibleMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const selectDate = (date) => {
    const key = toDateKey(date);
    if (key < minKey) return;
    onChange(key);
    setVisibleMonth(date);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: value ? 'var(--text)' : 'var(--text3)' }}>
          {value ? formatDisplayDate(value) : 'дд.мм.рррр'}
        </span>
        <Calendar size={16} color="var(--text3)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: 272,
          maxWidth: 'calc(100vw - 64px)',
          padding: 10,
          background: 'var(--bg2)',
          border: '1px solid rgba(79,134,217,0.28)',
          borderRadius: 12,
          boxShadow: '0 20px 48px rgba(0,0,0,0.45)',
          zIndex: 1200,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Попередній місяць" style={calendarNavBtn}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </div>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Наступний місяць" style={calendarNavBtn}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
            {weekDays.map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text3)', padding: '2px 0' }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {days.map(date => {
              const key = toDateKey(date);
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = key === value;
              const isToday = key === toDateKey(new Date());
              const isDisabled = key < minKey;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectDate(date)}
                  style={{
                    height: 28,
                    borderRadius: 7,
                    border: isSelected ? '1px solid var(--blue-light)' : isToday ? '1px solid rgba(79,134,217,0.55)' : '1px solid transparent',
                    background: isSelected ? 'var(--blue)' : isToday ? 'rgba(79,134,217,0.12)' : 'transparent',
                    color: isDisabled ? 'var(--text3)' : isSelected ? '#fff' : isCurrentMonth ? 'var(--text)' : 'rgba(148,163,184,0.55)',
                    fontSize: 12,
                    fontWeight: isSelected || isToday ? 700 : 500,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.45 : 1,
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const calendarNavBtn = { width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
