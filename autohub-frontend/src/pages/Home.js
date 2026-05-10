import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { useApp } from '../context/AppContext';
import { getCars, getDealerships, getBrands } from '../services/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/Skeleton';
import Seo from '../components/Seo';
import { localizeSalonName, localizeDistrict, localizeAddress, localizeHours } from '../i18n';

export default function Home() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ brand: '', price_max: '' });

  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ['cars', { ordering: '-created_at', page_size: 6 }],
    queryFn: () => getCars({ ordering: '-created_at', page_size: 6 }).then(r => r.data),
  });
  const cars = carsData?.results || [];
  const totalCars = carsData?.count || 0;

  const { data: salons = [] } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => getDealerships().then(r => r.data.results || r.data || []),
    staleTime: 5 * 60_000,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands().then(r => r.data.results || r.data || []),
    staleTime: 5 * 60_000,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.brand) params.set('brand', search.brand);
    if (search.price_max) params.set('price_max', search.price_max);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div>
      <Seo
        title={t.home.seo_title || 'Каталог авто та автосалонів'}
        description={t.home.seo_description || 'Купуйте нові та вживані автомобілі від перевірених салонів. Тест-драйв, порівняння і калькулятор вартості володіння.'}
      />
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 52%, #dcecff 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(53,104,179,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(119,168,232,0.1) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(53,104,179,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(53,104,179,0.035) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(53,104,179,0.1)', border: '1px solid rgba(53,104,179,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 13, fontWeight: 500, color: 'var(--blue)', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              {t.home.hero_badge}
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 700, lineHeight: 1.08, marginBottom: 20 }}>
              {t.home.hero_title}<br />
              <span style={{ color: 'var(--blue)' }}>{t.home.hero_title2}</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
              {t.home.hero_sub}
            </p>

            <form onSubmit={handleSearch} style={{ background: 'rgba(248,251,255,0.82)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', marginBottom: 40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{t.home.brand}</label>
                  <CustomSelect
                    value={search.brand}
                    onChange={v => setSearch(p => ({ ...p, brand: v }))}
                    placeholder={t.home.any}
                    options={[{ value: '', label: t.home.any }, ...brands.map(b => ({ value: b.name, label: b.name }))]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{t.home.max_price}</label>
                  <CustomSelect
                    value={search.price_max}
                    onChange={v => setSearch(p => ({ ...p, price_max: v }))}
                    placeholder={t.home.any}
                    options={[
                      { value: '', label: t.home.any },
                      { value: '615000', label: `${t.home.up_to} $15,000` },
                      { value: '1230000', label: `${t.home.up_to} $30,000` },
                      { value: '2050000', label: `${t.home.up_to} $50,000` },
                      { value: '4100000', label: `${t.home.up_to} $100,000` },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{t.home.condition}</label>
                  <CustomSelect
                    value=""
                    onChange={() => {}}
                    placeholder={t.home.any_m}
                    options={[
                      { value: '', label: t.home.any_m },
                      { value: 'new', label: t.catalog.new },
                      { value: 'used', label: t.catalog.used },
                    ]}
                  />
                </div>
                <button type="submit" style={{ minHeight: 44, padding: '11px 24px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                  {t.home.search_btn} <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', gap: 40 }}>
              {[[`${totalCars}+`, t.home.stats_cars], [`${salons.length}`, t.home.stats_salons], [`${brands.length}+`, t.home.stats_brands]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 26, fontWeight: 650, color: 'var(--text)' }}>{num}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.home.catalog_eyebrow}</div>
            <h2 style={{ fontSize: 32, fontWeight: 650 }}>{t.home.featured}</h2>
            <p style={{ color: 'var(--text2)', marginTop: 8 }}>{t.home.featured_sub}</p>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontWeight: 600, fontSize: 15 }}>
            {t.home.view_all} <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
          {carsLoading
            ? Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
            : cars.slice(0, 6).map(car => <CarCard key={car.id} car={car} />)}
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 650, marginBottom: 12 }}>{t.home.our_salons}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>{t.home.salons_sub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
            {salons.map(salon => (
              <div key={salon.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: 140, background: 'linear-gradient(135deg, #e5f0fb, #cfe2f7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(53,104,179,0.15)', border: '1px solid rgba(53,104,179,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={24} color="var(--blue)" />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)' }}>{localizeDistrict(salon.district, lang)}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{localizeSalonName(salon.name, lang)}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {[{ Icon: MapPin, text: localizeAddress(salon.address, lang) }, { Icon: Phone, text: salon.phone }, { Icon: Mail, text: salon.email }, { Icon: Clock, text: localizeHours(salon.working_hours, lang) }].map(({ Icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text2)' }}>
                        <Icon size={14} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>
                    {t.salons.available_cars}: <span style={{ color: 'var(--blue)', fontWeight: 650 }}>{salon.cars_count} {t.salons.vehicles}</span>
                  </div>
                  <Link to="/catalog" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
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
