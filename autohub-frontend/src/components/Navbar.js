import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User, GitCompare, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { t, lang, toggleLang, user, logout, favorites, compareList } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/catalog', label: t.nav.catalog },
    { path: '/salons', label: t.nav.salons },
    { path: '/compare', label: t.nav.compare },
  ];

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>AutoHub</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 15, fontWeight: 500, color: isActive(l.path) ? '#3b82f6' : 'var(--text2)', transition: '.15s', background: isActive(l.path) ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 340, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 100, padding: '0 16px', height: 40 }}>
          <Search size={15} color="var(--text3)" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} placeholder={t.nav.search} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }} />
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Lang toggle */}
          <button onClick={toggleLang} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', fontSize: 13, fontWeight: 600, transition: '.15s' }}>
            {lang === 'ua' ? 'EN' : 'UA'}
          </button>

          {/* Favorites */}
          <Link to="/profile" style={{ position: 'relative', width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.15s' }}>
            <Heart size={18} color={favorites.length > 0 ? '#ef4444' : 'var(--text2)'} fill={favorites.length > 0 ? '#ef4444' : 'none'} />
            {favorites.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favorites.length}</span>}
          </Link>

          {/* Compare */}
          <Link to="/compare" style={{ position: 'relative', width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitCompare size={18} color={compareList.length > 0 ? '#3b82f6' : 'var(--text2)'} />
            {compareList.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{compareList.length}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/profile" style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff' }}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={16} color="var(--text2)" />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ padding: '8px 20px', borderRadius: 100, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
