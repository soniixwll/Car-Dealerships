import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDealerships } from '../services/api';

export default function Salons() {
  const { t } = useApp();
  const [salons, setSalons] = useState([]);

  useEffect(() => { getDealerships().then(r => setSalons(r.data.results || r.data || [])).catch(() => {}); }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>{t.salons.title}</h1>
        <p style={{ color: 'var(--text2)', fontSize: 16 }}>{t.salons.sub}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
        {salons.map(salon => (
          <div key={salon.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

            {/* Map placeholder */}
            <div style={{ height: 160, background: 'linear-gradient(135deg, #0f1f38, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', border: '2px solid rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={28} color="#3b82f6" fill="rgba(59,130,246,0.2)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#60a5fa' }}>{salon.district}</div>
            </div>

            <div style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>{salon.name}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[{ Icon: MapPin, text: `${salon.address}, ${salon.district}` }, { Icon: Phone, text: salon.phone }, { Icon: Mail, text: salon.email }, { Icon: Clock, text: salon.working_hours }].map(({ Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text2)' }}>
                    <Icon size={15} color="var(--text3)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Car size={16} color="#3b82f6" />
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{t.salons.available_cars}:</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{salon.cars_count} {t.salons.vehicles}</span>
              </div>

              <a href={`tel:${salon.phone}`} style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                {salon.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
