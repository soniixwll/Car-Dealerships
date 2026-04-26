import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Eye, Settings, Car, MapPin, Check, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBookings, deleteBooking, getProfile, updateProfile } from '../services/api';
import CarCard from '../components/CarCard';

export default function Profile() {
  const { t, user, favorites, recentlyViewed, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('favorites');
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({ username: '', phone: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getProfile().then(r => setProfile({ username: r.data.username || '', phone: r.data.phone || '' })).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user || tab !== 'test_drives') return;
    getBookings().then(r => setBookings(r.data.results || r.data || [])).catch(() => {});
  }, [user, tab]);

  const handleCancelBooking = async (id) => {
    await deleteBooking(id).catch(() => {});
    setBookings(p => p.filter(b => b.id !== id));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(profile).catch(() => {});
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'favorites', label: t.profile.favorites, Icon: Heart },
    { key: 'test_drives', label: t.profile.test_drives, Icon: Calendar },
    { key: 'recently_viewed', label: t.profile.recently_viewed, Icon: Eye },
    { key: 'settings', label: t.profile.settings, Icon: Settings },
  ];

  const statusColor = { confirmed: '#22c55e', pending: '#eab308', cancelled: '#ef4444' };
  const statusLabel = { confirmed: t.profile.confirmed, pending: t.profile.pending, cancelled: t.profile.cancelled };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 30, fontWeight: 650 }}>{t.profile.title}</h1>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>{t.profile.sub}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, width: 'fit-content', maxWidth: '100%', overflowX: 'auto', marginBottom: 32 }}>
        {tabs.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: '.15s', background: tab === key ? 'linear-gradient(135deg,var(--blue-hover),var(--blue))' : 'transparent', color: tab === key ? '#fff' : 'var(--text2)' }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* FAVORITES */}
      {tab === 'favorites' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.profile.favorite_cars}</h3>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
              <Heart size={48} color="var(--text3)" style={{ marginBottom: 16 }} />
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{t.profile.no_favorites}</div>
              <div style={{ marginBottom: 20 }}>{t.profile.no_favorites_sub}</div>
              <Link to="/catalog" style={{ padding: '12px 24px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>
                {t.home?.view_all || 'Browse Catalog'}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {favorites.map(f => <CarCard key={f.id} car={f.car} />)}
            </div>
          )}
        </div>
      )}

      {/* TEST DRIVES */}
      {tab === 'test_drives' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.profile.test_drive_requests}</h3>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
              <Calendar size={48} color="var(--text3)" style={{ marginBottom: 16 }} />
              <div style={{ fontWeight: 600, marginBottom: 20 }}>{t.profile.no_requests}</div>
              <Link to="/catalog" style={{ padding: '12px 24px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', borderRadius: 100, fontSize: 14, fontWeight: 600 }}>
                {t.home?.view_all || 'Browse'}
              </Link>
            </div>
          ) : bookings.map(b => (
            <div key={b.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 90, height: 60, borderRadius: 8, background: 'var(--bg3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={24} color="var(--text3)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{b.car_display}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
                  <Calendar size={13} /> {new Date(b.booking_datetime).toLocaleString('uk-UA')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>
                  <MapPin size={13} /> {b.dealership_name}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: `${statusColor[b.status]}20`, color: statusColor[b.status] }}>
                  {statusLabel[b.status]}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/cars/${b.car}`} style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{t.profile.view_car}</Link>
                {b.status === 'pending' && (
                  <button onClick={() => handleCancelBooking(b.id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#ef4444', cursor: 'pointer' }}>
                    {t.profile.cancel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECENTLY VIEWED */}
      {tab === 'recently_viewed' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.profile.recently_viewed_cars}</h3>
          {recentlyViewed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
              <Eye size={48} color="var(--text3)" style={{ marginBottom: 16 }} />
              <div>{t.profile.no_viewed}</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {recentlyViewed.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {tab === 'settings' && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t.profile.profile_settings}</h3>
            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{t.profile.email}</label>
                <input value={user?.email || ''} disabled style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text3)', fontSize: 15, opacity: 0.6 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{t.auth.username}</label>
                <input value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{t.profile.phone}</label>
                <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 15, outline: 'none' }} />
              </div>
              <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: saved ? '#22c55e' : 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {saved && <Check size={16} />}
                {saved ? 'Збережено!' : t.profile.save}
              </button>
            </form>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            <LogOut size={16} /> {t.nav.logout}
          </button>
        </div>
      )}
    </div>
  );
}
