import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCars, getDealerships, getBrands } from '../services/api';
import CarCard from '../components/CarCard';

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [salons, setSalons] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState({ brand: '', price_max: '' });

  useEffect(() => {
    getCars({ ordering: '-created_at', page_size: 6 }).then(r => setCars(r.data.results || [])).catch(() => {});
    getDealerships().then(r => setSalons(r.data.results || r.data || [])).catch(() => {});
    getBrands().then(r => setBrands(r.data.results || r.data || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.brand) params.set('brand', search.brand);
    if (search.price_max) params.set('price_max', search.price_max);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #060e1e 0%, #0a1628 50%, #0f1f38 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(29,78,216,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 500, color: '#60a5fa', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Мережа автосалонів AutoHub
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}>
              {t.home.hero_title}<br />
              <span style={{ color: '#3b82f6' }}>{t.home.hero_title2}</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
              {t.home.hero_sub}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ background: 'rgba(15,31,56,0.8)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', marginBottom: 40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{t.home.brand}</label>
                  <select value={search.brand} onChange={e => setSearch(p => ({ ...p, brand: e.target.value }))} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' }}>
                    <option value="">Будь-яка</option>
                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{t.home.max_price}</label>
                  <select value={search.price_max} onChange={e => setSearch(p => ({ ...p, price_max: e.target.value }))} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' }}>
                    <option value="">Будь-яка</option>
                    <option value="615000">До $15,000</option>
                    <option value="1230000">До $30,000</option>
                    <option value="2050000">До $50,000</option>
                    <option value="4100000">До $100,000</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>Стан</label>
                  <select style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none' }}>
                    <option value="">Будь-який</option>
                    <option value="new">Новий</option>
                    <option value="used">Вживаний</option>
                  </select>
                </div>
                <button type="submit" style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(59,130,246,0.3)', whiteSpace: 'nowrap' }}>
                  {t.home.search_btn} <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40 }}>
              {[['17+', 'Автомобілів'], ['3', 'Салони'], ['10+', 'Брендів']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{num}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Каталог</div>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>{t.home.featured}</h2>
            <p style={{ color: 'var(--text2)', marginTop: 8 }}>{t.home.featured_sub}</p>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6', fontWeight: 600, fontSize: 15 }}>
            {t.home.view_all} <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
          {cars.length > 0 ? cars.slice(0, 6).map(car => <CarCard key={car.id} car={car} />) : (
            Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 360, background: 'var(--card)', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />)
          )}
        </div>
      </section>

      {/* SALONS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>{t.home.our_salons}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>{t.home.salons_sub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
            {salons.map(salon => (
              <div key={salon.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: 140, background: 'linear-gradient(135deg, #0f1f38, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={24} color="#3b82f6" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa' }}>{salon.district}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{salon.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {[{ Icon: MapPin, text: salon.address }, { Icon: Phone, text: salon.phone }, { Icon: Mail, text: salon.email }, { Icon: Clock, text: salon.working_hours }].map(({ Icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text2)' }}>
                        <Icon size={14} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>
                    {t.salons.available_cars}: <span style={{ color: '#3b82f6', fontWeight: 700 }}>{salon.cars_count} {t.salons.vehicles}</span>
                  </div>
                  <Link to="/catalog" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                    {t.home.view_details}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`}</style>
    </div>
  );
}
