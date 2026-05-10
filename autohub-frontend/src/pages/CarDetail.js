import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, GitCompare, Calendar, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCar, calculateCost, getDealerships } from '../services/api';
import BookingModal from '../components/BookingModal';
import { Skeleton } from '../components/Skeleton';
import CarCard from '../components/CarCard';
import Seo from '../components/Seo';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { localizeSalonName, localizeAddress } from '../i18n';

export default function CarDetail() {
  const { id } = useParams();
  const { t, lang, toggleFavorite, isFavorite, toggleCompare, isInCompare, addRecentlyViewed, recentlyViewed } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showBooking, setShowBooking] = useState(false);
  const [calc, setCalc] = useState({ monthly_km: 1500, result: null });

  const { data: car, isLoading: loading, isError } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCar(id).then(r => r.data),
    enabled: !!id,
  });

  useEffect(() => { if (car) addRecentlyViewed(car); }, [car?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: dealerships = [] } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => getDealerships().then(r => r.data.results || r.data || []),
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!car) return;
    const tm = setTimeout(() => {
      calculateCost(car.id, { monthly_km: calc.monthly_km, fuel_price: 55 })
        .then(r => setCalc(p => ({ ...p, result: r.data }))).catch(() => {});
    }, 500);
    return () => clearTimeout(tm);
  }, [car, calc.monthly_km]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32 }}>
          <div>
            <Skeleton height={400} radius={16} />
            <div style={{ marginTop: 24, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton height={20} width="40%" />
              <Skeleton height={14} />
              <Skeleton height={14} width="80%" />
              <Skeleton height={14} width="70%" />
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, height: 'fit-content' }}>
            <Skeleton height={28} width="60%" />
            <Skeleton height={16} width="40%" />
            <Skeleton height={48} width="50%" style={{ marginTop: 16 }} />
            <Skeleton height={48} radius={10} style={{ marginTop: 16 }} />
            <Skeleton height={44} radius={10} />
          </div>
        </div>
      </div>
    );
  }
  if (isError || !car) return <div style={{ textAlign: 'center', padding: '100px 24px' }}>{t.car.not_found}</div>;

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

  const seoTitle = `${car.brand_name} ${car.model_name} ${car.year}`;
  const seoDescription = `${car.brand_name} ${car.model_name} ${car.year} — ${car.condition === 'new' ? t.catalog.new : t.catalog.used}, ${(car.mileage_km || 0).toLocaleString()} км. ${t.car.price}: $${priceUSD.toLocaleString()}.`;
  const seoImage = images[0]?.image;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${car.brand_name} ${car.model_name}`,
    brand: { '@type': 'Brand', name: car.brand_name },
    model: car.model_name,
    vehicleModelDate: car.year,
    mileageFromOdometer: car.mileage_km ? { '@type': 'QuantitativeValue', value: car.mileage_km, unitCode: 'KMT' } : undefined,
    fuelType: car.fuel_type_display,
    vehicleTransmission: car.transmission_display,
    color: car.color,
    image: seoImage,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UAH',
      price: car.price_uah,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'AutoDealer', name: car.dealership_name },
    },
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <Seo title={seoTitle} description={seoDescription} image={seoImage} type="product" jsonLd={jsonLd} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--text3)' }}>{t.nav.home}</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: 'var(--text3)' }}>{t.nav.catalog}</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text)' }}>{car.brand_name} {car.model_name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32 }}>
        <div>
          <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg3)', aspectRatio: '16/9', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 0 ? (
              <button
                type="button"
                onClick={() => setLightboxIndex(activeImg)}
                aria-label="Open photo"
                style={{ width: '100%', height: '100%', padding: 0, border: 'none', background: 'none', cursor: 'zoom-in' }}
              >
                <img src={images[activeImg]?.image} alt={car.brand_name} fetchpriority="high" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ) : (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <button key={i} type="button" onClick={() => setActiveImg(i)} aria-label={`View photo ${i + 1}`} style={{ width: 80, height: 56, padding: 0, borderRadius: 8, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--blue)' : 'transparent'}`, cursor: 'pointer', flexShrink: 0, background: 'none' }}>
                  <img src={img.image} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
          <Lightbox
            open={lightboxIndex >= 0}
            close={() => setLightboxIndex(-1)}
            index={lightboxIndex < 0 ? 0 : lightboxIndex}
            slides={images.map(img => ({ src: img.image, alt: `${car.brand_name} ${car.model_name}` }))}
          />

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

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginTop: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.car.calculator}</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{t.car.monthly_km}</label>
              <input type="number" value={calc.monthly_km} onChange={e => setCalc(p => ({ ...p, monthly_km: +e.target.value }))} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
            </div>
            {calc.result && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  [t.car.fuel_cost, `$${Math.round(calc.result.breakdown.fuel_monthly / 41)}${t.car.per_month}`],
                  [t.car.maintenance, `$${Math.round(calc.result.breakdown.maintenance_monthly / 41)}${t.car.per_month}`],
                  [t.car.taxes, `$${Math.round(calc.result.breakdown.tax_monthly / 41)}${t.car.per_month}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
                    <div style={{ fontWeight: 650, fontSize: 16, color: 'var(--blue)' }}>{val}</div>
                  </div>
                ))}
                <div style={{ background: 'rgba(53,104,179,0.1)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(53,104,179,0.2)', gridColumn: '1/-1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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

        <div style={{ position: 'sticky', top: 88, height: 'fit-content' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: car.condition === 'new' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(234,179,8,0.2)', color: car.condition === 'new' ? '#fff' : '#eab308' }}>
                {car.condition === 'new' ? t.catalog.new : t.catalog.used}
              </span>
              <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: 'rgba(53,104,179,0.1)', color: 'var(--blue)', border: '1px solid rgba(53,104,179,0.2)' }}>{car.generation_name}</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 650, marginBottom: 4 }}>{car.brand_name} {car.model_name}</h1>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>{car.year} · {car.brand_name}</div>

            {car.description && <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>{car.description}</p>}

            <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 4 }}>{t.car.price}</div>
              <div style={{ fontSize: 30, fontWeight: 650, color: 'var(--blue)', letterSpacing: 0 }}>${priceUSD.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{Math.round(car.price_uah).toLocaleString()} {t.car.uah_suffix}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setShowBooking(true)} style={{ width: '100%', minHeight: 48, padding: '14px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Calendar size={18} /> {t.car.book_test_drive}
              </button>
              <button onClick={() => toggleFavorite(car)} style={{ width: '100%', padding: '12px', background: 'var(--bg3)', color: fav ? '#ef4444' : 'var(--text)', border: `1px solid ${fav ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: 10, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <Heart size={16} fill={fav ? '#ef4444' : 'none'} /> {fav ? t.car.remove_favorites : t.car.add_favorites}
              </button>
              <button onClick={() => toggleCompare(car)} style={{ width: '100%', padding: '12px', background: 'var(--bg3)', color: inComp ? 'var(--blue)' : 'var(--text)', border: `1px solid ${inComp ? 'rgba(53,104,179,0.4)' : 'var(--border)'}`, borderRadius: 10, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <GitCompare size={16} /> {t.car.add_compare}
              </button>
            </div>

            <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>{t.car.available_at}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{localizeSalonName(car.dealership_name, lang)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {car.dealership_address && <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text2)' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: 1 }} color="var(--text3)" />{localizeAddress(car.dealership_address, lang)}</div>}
                {car.dealership_phone && <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text2)' }}><Phone size={14} style={{ flexShrink: 0, marginTop: 1 }} color="var(--text3)" />{car.dealership_phone}</div>}
              </div>
              <Link to="/salons" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{t.car.view_salon} →</Link>
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const others = (recentlyViewed || []).filter(c => c.id !== car.id).slice(0, 6);
        if (others.length === 0) return null;
        return (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: 22, fontWeight: 650, marginBottom: 20 }}>{t.car.recently_viewed || 'Нещодавно переглянуті'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
              {others.map(c => <CarCard key={c.id} car={c} />)}
            </div>
          </section>
        );
      })()}

      {showBooking && <BookingModal car={car} dealerships={dealerships} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
