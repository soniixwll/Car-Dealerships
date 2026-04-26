import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, GitCompare, Calendar, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCar, calculateCost, getDealerships } from '../services/api';
import BookingModal from '../components/BookingModal';

export default function CarDetail() {
  const { id } = useParams();
  const { t, toggleFavorite, isFavorite, toggleCompare, isInCompare, addRecentlyViewed } = useApp();
  const [car, setCar] = useState(null);
  const [dealerships, setDealerships] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [calc, setCalc] = useState({ monthly_km: 1500, result: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCar(id).then(r => { setCar(r.data); addRecentlyViewed(r.data); }).catch(() => {}).finally(() => setLoading(false));
    getDealerships().then(r => setDealerships(r.data.results || r.data || [])).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!car) return;
    const t = setTimeout(() => {
      calculateCost(car.id, { monthly_km: calc.monthly_km, fuel_price: 55 })
        .then(r => setCalc(p => ({ ...p, result: r.data }))).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [car, calc.monthly_km]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text2)' }}>Завантаження...</div>;
  if (!car) return <div style={{ textAlign: 'center', padding: '100px 24px' }}>Авто не знайдено</div>;

  const priceUSD = Math.round(parseFloat(car.price_uah) / 41);
  const images = car.images || [];

  const fav = isFavorite(car.id);
  const inComp = isInCompare(car.id);

  const specs = [
    [t.car.engine, car.engine_volume ? `${car.engine_volume}L` : '—', t.car.fuel_type, car.fuel_type_display || '—'],
    [t.car.power, car.power_hp ? `${car.power_hp} hp` : '—', t.car.transmission, car.transmission_display || '—'],
    [t.car.acceleration, car.acceleration || '—', t.car.drive_type, car.drive_type_display || '—'],
    [t.car.top_speed, car.top_speed ? `${car.top_speed} km/h` : '—', t.car.body_type, car.body_type_display || '—'],
    [t.car.year, car.year || '—', t.car.mileage, `${(car.mileage_km || 0).toLocaleString()} km`],
    [t.car.seats, car.seats || '5', t.car.color, car.color || '—'],
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--text3)' }}>Головна</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: 'var(--text3)' }}>Каталог</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text)' }}>{car.brand_name} {car.model_name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32 }}>
        {/* LEFT */}
        <div>
          {/* Gallery */}
          <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg3)', aspectRatio: '16/9', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 0 ? (
              <img src={images[activeImg]?.image} alt={car.brand_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10 }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 56, borderRadius: 8, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--blue)' : 'transparent'}`, cursor: 'pointer', flexShrink: 0 }}>
                  <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Specs */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginTop: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.car.specifications}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {specs.map(([l1, v1, l2, v2], i) => (
                <React.Fragment key={i}>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>{l1}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{v1}</div>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 2 }}>{l2}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{v2}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginTop: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.car.calculator}</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{t.car.monthly_km}</label>
              <input type="number" value={calc.monthly_km} onChange={e => setCalc(p => ({ ...p, monthly_km: +e.target.value }))} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
            </div>
            {calc.result && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  [t.car.fuel_cost, `$${Math.round(calc.result.breakdown.fuel_monthly / 41)}/міс`],
                  [t.car.maintenance, `$${Math.round(calc.result.breakdown.maintenance_monthly / 41)}/міс`],
                  [t.car.taxes, `$${Math.round(calc.result.breakdown.tax_monthly / 41)}/міс`],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
                    <div style={{ fontWeight: 650, fontSize: 16, color: 'var(--blue)' }}>{val}</div>
                  </div>
                ))}
                <div style={{ background: 'rgba(79,134,217,0.1)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(79,134,217,0.2)', gridColumn: '1/-1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase' }}>{t.car.total_monthly}</div>
                    <div style={{ fontWeight: 650, fontSize: 20, color: 'var(--blue)' }}>${Math.round(calc.result.total_monthly / 41)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase' }}>{t.car.total_yearly}</div>
                    <div style={{ fontWeight: 650, fontSize: 20, color: 'var(--blue)' }}>${Math.round(calc.result.total_annual / 41)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ position: 'sticky', top: 88, height: 'fit-content' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: car.condition === 'new' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(234,179,8,0.2)', color: car.condition === 'new' ? '#fff' : '#eab308' }}>
                {car.condition === 'new' ? t.catalog.new : t.catalog.used}
              </span>
              <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: 'rgba(79,134,217,0.1)', color: 'var(--blue)', border: '1px solid rgba(79,134,217,0.2)' }}>{car.generation_name}</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 650, marginBottom: 4 }}>{car.brand_name} {car.model_name}</h1>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>{car.year} · {car.brand_name}</div>

            {car.description && <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>{car.description}</p>}

            <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>{t.car.price}</div>
              <div style={{ fontSize: 30, fontWeight: 650, color: 'var(--blue)', letterSpacing: 0 }}>${priceUSD.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{Math.round(car.price_uah).toLocaleString()} грн</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setShowBooking(true)} style={{ width: '100%', minHeight: 48, padding: '14px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Calendar size={18} /> {t.car.book_test_drive}
              </button>
              <button onClick={() => toggleFavorite(car)} style={{ width: '100%', padding: '12px', background: 'var(--bg3)', color: fav ? '#ef4444' : 'var(--text)', border: `1px solid ${fav ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: 10, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <Heart size={16} fill={fav ? '#ef4444' : 'none'} /> {fav ? t.car.remove_favorites : t.car.add_favorites}
              </button>
              <button onClick={() => toggleCompare(car)} style={{ width: '100%', padding: '12px', background: 'var(--bg3)', color: inComp ? 'var(--blue)' : 'var(--text)', border: `1px solid ${inComp ? 'rgba(79,134,217,0.4)' : 'var(--border)'}`, borderRadius: 10, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <GitCompare size={16} /> {t.car.add_compare}
              </button>
            </div>

            {/* Salon info */}
            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>{t.car.available_at}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{car.dealership_name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {car.dealership_address && <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text2)' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: 1 }} color="var(--text3)" />{car.dealership_address}</div>}
                {car.dealership_phone && <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text2)' }}><Phone size={14} style={{ flexShrink: 0, marginTop: 1 }} color="var(--text3)" />{car.dealership_phone}</div>}
              </div>
              <Link to="/salons" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{t.car.view_salon} →</Link>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal car={car} dealerships={dealerships} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
