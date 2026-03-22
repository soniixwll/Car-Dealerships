import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Compare() {
  const { t, compareList, toggleCompare } = useApp();

  const fields = [
    ['price', t.compare.price, c => `$${Math.round(parseFloat(c.price_uah) / 41).toLocaleString()}`],
    ['year', t.compare.year, c => c.year],
    ['condition', t.compare.condition, c => c.condition === 'new' ? t.catalog?.new || 'New' : t.catalog?.used || 'Used'],
    ['fuel_type', t.compare.fuel_type, c => c.fuel_type_display],
    ['transmission', t.compare.transmission, c => c.transmission_display || '—'],
    ['drive_type', t.compare.drive_type, c => c.drive_type_display || '—'],
    ['body_type', t.compare.body_type, c => c.body_type_display],
    ['mileage_km', t.compare.mileage, c => `${(c.mileage_km || 0).toLocaleString()} km`],
  ];

  if (compareList.length === 0) return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>⚖️</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>{t.compare.empty}</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>{t.compare.empty_sub}</p>
      <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 100, fontSize: 15, fontWeight: 600 }}>
        {t.compare.go_catalog} <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>{t.compare.title}</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>{t.compare.sub}</p>
        </div>
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 14, fontWeight: 500, color: 'var(--text2)' }}>
          + {t.compare.add_car}
        </Link>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {/* Car headers */}
        <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`, borderBottom: '1px solid var(--border)' }}>
          <div style={{ padding: 20, background: 'var(--bg3)' }} />
          {compareList.map(car => {
            const img = car.images?.[0];
            return (
              <div key={car.id} style={{ padding: 20, position: 'relative', borderLeft: '1px solid var(--border)' }}>
                <button onClick={() => toggleCompare(car)} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                  <X size={14} />
                </button>
                <div style={{ height: 120, borderRadius: 10, overflow: 'hidden', background: 'var(--bg3)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {img ? <img src={`http://127.0.0.1:8000${img.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>🚗</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{car.brand_name} {car.model_name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6', marginBottom: 8 }}>${Math.round(parseFloat(car.price_uah) / 41).toLocaleString()}</div>
                <Link to={`/cars/${car.id}`} style={{ display: 'block', textAlign: 'center', padding: '8px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  {t.compare.view_details}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {fields.map(([key, label, getValue]) => {
          const values = compareList.map(c => getValue(c));
          const allSame = values.every(v => v === values[0]);
          return (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`, borderBottom: '1px solid var(--border)' }}>
              <div style={{ padding: '14px 20px', background: 'var(--bg3)', fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center' }}>
                {label}
                {!allSame && <span style={{ marginLeft: 8, fontSize: 11, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: 4 }}>{t.compare.different}</span>}
              </div>
              {compareList.map((car, i) => (
                <div key={car.id} style={{ padding: '14px 20px', borderLeft: '1px solid var(--border)', fontSize: 14, fontWeight: 500, background: !allSame ? 'rgba(59,130,246,0.03)' : 'transparent', display: 'flex', alignItems: 'center' }}>
                  {values[i]}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
