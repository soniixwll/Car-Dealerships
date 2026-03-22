import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, GitCompare, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CarCard({ car }) {
  const { t, toggleFavorite, isFavorite, toggleCompare, isInCompare } = useApp();
  const fav = isFavorite(car.id);
  const inComp = isInCompare(car.id);

  const priceUAH = parseFloat(car.price_uah);
  const priceUSD = Math.round(priceUAH / 41);
  const priceDisplay = `$${priceUSD.toLocaleString()}`;

  const mainImage = car.images && car.images.length > 0
    ? `http://127.0.0.1:8000${car.images[0].image}`
    : null;

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--bg3)' }}>
        {mainImage ? (
          <img src={mainImage} alt={`${car.brand_name} ${car.model_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
        )}
        {/* Badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: car.condition === 'new' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(234,179,8,0.2)', color: car.condition === 'new' ? '#fff' : '#eab308', border: car.condition === 'new' ? 'none' : '1px solid rgba(234,179,8,0.4)' }}>
          {car.condition === 'new' ? t.catalog.new : t.catalog.used}
        </div>
        {/* Fav button */}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(car); }}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 8, background: 'rgba(0,0,0,0.5)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <Heart size={16} color={fav ? '#ef4444' : '#fff'} fill={fav ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{car.brand_name} {car.model_name}</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>{car.dealership_name} · {car.year}</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {[car.fuel_type_display, car.body_type_display, car.mileage_km > 0 ? `${car.mileage_km.toLocaleString()} km` : '0 km'].map(s => (
            <span key={s} style={{ fontSize: 12, color: 'var(--text2)', background: 'var(--bg3)', padding: '3px 10px', borderRadius: 100 }}>{s}</span>
          ))}
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6', marginBottom: 14 }}>{priceDisplay}</div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/cars/${car.id}`} style={{ flex: 1, padding: '10px 0', textAlign: 'center', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
            {t.catalog.view}
          </Link>
          <button onClick={() => toggleCompare(car)} style={{ width: 40, height: 40, borderRadius: 8, background: inComp ? 'rgba(59,130,246,0.15)' : 'var(--bg3)', border: `1px solid ${inComp ? '#3b82f6' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitCompare size={16} color={inComp ? '#3b82f6' : 'var(--text2)'} />
          </button>
        </div>
      </div>
    </div>
  );
}
