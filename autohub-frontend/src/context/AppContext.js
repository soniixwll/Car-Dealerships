import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n';
import { getFavorites, addFavorite, removeFavorite } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ua');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => { try { return JSON.parse(localStorage.getItem('recentlyViewed')) || []; } catch { return []; } });
  const [compareList, setCompareList] = useState(() => { try { return JSON.parse(localStorage.getItem('compareList')) || []; } catch { return []; } });

  const t = translations[lang];
  const toggleLang = () => { const n = lang === 'ua' ? 'en' : 'ua'; setLang(n); localStorage.setItem('lang', n); };
  const login = (u, tk) => { setUser(u); setToken(tk); localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', tk); };
  const logout = () => { setUser(null); setToken(null); setFavorites([]); localStorage.removeItem('user'); localStorage.removeItem('token'); };

  useEffect(() => {
    if (!token) { setFavorites([]); return; }
    getFavorites().then(r => setFavorites(r.data || [])).catch(() => setFavorites([]));
  }, [token]);

  const toggleFavorite = async (car) => {
    if (!user) return false;
    const existing = favorites.find(f => f.car.id === car.id);
    if (existing) {
      await removeFavorite(existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
    } else {
      const r = await addFavorite(car.id);
      setFavorites(prev => [...prev, r.data]);
    }
    return true;
  };
  const isFavorite = (id) => favorites.some(f => f.car.id === id);

  const addRecentlyViewed = (car) => setRecentlyViewed(prev => { const n = [car, ...prev.filter(c => c.id !== car.id)].slice(0, 10); localStorage.setItem('recentlyViewed', JSON.stringify(n)); return n; });
  const toggleCompare = (car) => setCompareList(prev => { const e = prev.find(c => c.id === car.id); let n; if (e) n = prev.filter(c => c.id !== car.id); else n = prev.length >= 3 ? [...prev.slice(1), car] : [...prev, car]; localStorage.setItem('compareList', JSON.stringify(n)); return n; });
  const isInCompare = (id) => compareList.some(c => c.id === id);

  return (
    <AppContext.Provider value={{ lang, t, toggleLang, user, token, login, logout, favorites, toggleFavorite, isFavorite, recentlyViewed, addRecentlyViewed, compareList, toggleCompare, isInCompare }}>
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);
