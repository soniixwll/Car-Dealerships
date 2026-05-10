import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User, GitCompare, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function Navbar() {
  const { t, lang, toggleLang, user, logout, favorites, compareList } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 480px)');

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/catalog', label: t.nav.catalog },
    { path: '/salons', label: t.nav.salons },
    { path: '/compare', label: t.nav.compare },
  ];

  const searchInput = (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 100, padding: '0 16px', height: 40 }}>
      <Search size={15} color="var(--text3)" />
      <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} placeholder={t.nav.search} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, minWidth: 0 }} />
    </div>
  );

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(248,251,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', gap: isCompact ? 12 : 28 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--blue-hover), var(--blue))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
          </div>
          {!isMobile && <span style={{ fontWeight: 650, fontSize: 19, color: 'var(--text)' }}>AutoHub</span>}
        </Link>

        {/* Desktop nav links */}
        {!isCompact && (
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 15, fontWeight: 500, color: isActive(l.path) ? 'var(--blue)' : 'var(--text2)', transition: '.15s', background: isActive(l.path) ? 'rgba(53,104,179,0.12)' : 'transparent' }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Search (desktop and tablet, not pure mobile) */}
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: 340 }}>
            {searchInput}
          </div>
        )}

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {!isMobile && (
            <button onClick={toggleLang} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', fontSize: 13, fontWeight: 600, transition: '.15s' }}>
              {lang === 'ua' ? 'EN' : 'UA'}
            </button>
          )}

          {!isMobile && (
            <Link to="/profile" style={{ position: 'relative', width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.15s' }}>
              <Heart size={18} color={favorites.length > 0 ? '#ef4444' : 'var(--text2)'} fill={favorites.length > 0 ? '#ef4444' : 'none'} />
              {favorites.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favorites.length}</span>}
            </Link>
          )}

          {!isMobile && (
            <Link to="/compare" style={{ position: 'relative', width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitCompare size={18} color={compareList.length > 0 ? 'var(--blue)' : 'var(--text2)'} />
              {compareList.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--blue)', color: '#fff', fontSize: 10, fontWeight: 650, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{compareList.length}</span>}
            </Link>
          )}

          {/* User (desktop) */}
          {!isCompact && (user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/profile" style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 650, fontSize: 15, color: '#fff' }}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </Link>
              <button aria-label={t.nav.logout} onClick={() => { logout(); navigate('/'); }} style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogOut size={16} color="var(--text2)" />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 38, padding: '8px 20px', borderRadius: 100, background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {t.nav.login}
            </Link>
          ))}

          {/* Hamburger (compact) */}
          {isCompact && (
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {menuOpen ? <X size={18} color="var(--text)" /> : <Menu size={18} color="var(--text)" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isCompact && menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '16px 16px 20px' }}>
          {isMobile && <div style={{ marginBottom: 12 }}>{searchInput}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)} style={{ padding: '12px 14px', borderRadius: 8, fontSize: 16, fontWeight: 500, color: isActive(l.path) ? 'var(--blue)' : 'var(--text)', background: isActive(l.path) ? 'rgba(53,104,179,0.12)' : 'transparent' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text)', fontSize: 14 }}>
              <Heart size={16} color={favorites.length > 0 ? '#ef4444' : 'var(--text2)'} fill={favorites.length > 0 ? '#ef4444' : 'none'} />
              {favorites.length}
            </Link>
            <Link to="/compare" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text)', fontSize: 14 }}>
              <GitCompare size={16} color={compareList.length > 0 ? 'var(--blue)' : 'var(--text2)'} />
              {compareList.length}
            </Link>
            <button onClick={toggleLang} style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 13, fontWeight: 600 }}>
              {lang === 'ua' ? 'EN' : 'UA'}
            </button>
          </div>
          {user ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '12px', textAlign: 'center', borderRadius: 8, background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                <User size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{user.username || user.email}
              </Link>
              <button aria-label={t.nav.logout} onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14, fontWeight: 500 }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px', textAlign: 'center', borderRadius: 8, background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', fontSize: 14, fontWeight: 600 }}>
              {t.nav.login}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
