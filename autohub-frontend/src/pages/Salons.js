import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Clock, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDealerships } from '../services/api';
import { SalonCardSkeleton } from '../components/Skeleton';
import Seo from '../components/Seo';
import { localizeSalonName, localizeDistrict, localizeAddress, localizeHours, localizeCity } from '../i18n';

export default function Salons() {
  const { t, lang } = useApp();
  const { data: salons = [], isLoading } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => getDealerships().then(r => r.data.results || r.data || []),
    staleTime: 5 * 60_000,
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px' }}>
      <Seo title={t.salons.title} description={t.salons.sub} />
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>{t.salons.title}</h1>
        <p style={{ color: 'var(--text2)', fontSize: 16 }}>{t.salons.sub}</p>
      </div>

      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
          {Array(6).fill(0).map((_, i) => <SalonCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && (() => {
        const cityOrder = ['Київ', 'Львів', 'Одеса', 'Харків'];
        const groups = salons.reduce((acc, s) => {
          const city = (s.name.split(' ')[1]) || 'Інше';
          (acc[city] = acc[city] || []).push(s);
          return acc;
        }, {});
        const cities = [...cityOrder.filter(c => groups[c]), ...Object.keys(groups).filter(c => !cityOrder.includes(c))];
        return cities.map(city => (
          <section key={city} style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 24, letterSpacing: '-0.5px' }}>{localizeCity(city, lang)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
              {groups[city].map(salon => (
          <div key={salon.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>

            <div style={{ height: 160, background: 'linear-gradient(135deg, #e5f0fb, #cfe2f7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(53,104,179,0.18)', border: '2px solid rgba(53,104,179,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={28} color="var(--blue)" fill="rgba(53,104,179,0.18)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--blue)' }}>{localizeDistrict(salon.district, lang)}</div>
            </div>

            <div style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 650, fontSize: 18, marginBottom: 16 }}>{localizeSalonName(salon.name, lang)}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[{ Icon: MapPin, text: `${localizeAddress(salon.address, lang)}, ${localizeDistrict(salon.district, lang)}` }, { Icon: Phone, text: salon.phone }, { Icon: Mail, text: salon.email }, { Icon: Clock, text: localizeHours(salon.working_hours, lang) }].map(({ Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text2)' }}>
                    <Icon size={15} color="var(--text3)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Car size={16} color="var(--blue)" />
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{t.salons.available_cars}:</span>
                <span style={{ fontWeight: 650, color: 'var(--blue)' }}>{salon.cars_count} {t.salons.vehicles}</span>
              </div>

              <a href={`tel:${salon.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {salon.phone}
              </a>
            </div>
          </div>
              ))}
            </div>
          </section>
        ));
      })()}
    </div>
  );
}
