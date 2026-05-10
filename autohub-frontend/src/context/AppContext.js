import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { translations } from '../i18n';
import { getFavorites, addFavorite, removeFavorite, logoutApi } from '../services/api';

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
  const login = (u, tk, refresh) => {
    setUser(u); setToken(tk);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('token', tk);
    if (refresh) localStorage.setItem('refresh', refresh);
  };
  const logout = async () => {
    const refresh = localStorage.getItem('refresh');
    setUser(null); setToken(null); setFavorites([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    if (refresh) {
      try { await logoutApi(refresh); } catch { /* token already invalid */ }
    }
  };

  useEffect(() => {
    if (!token) { setFavorites([]); return; }
    getFavorites().then(r => setFavorites(r.data || [])).catch(() => setFavorites([]));
  }, [token]);

  const toggleFavorite = async (car) => {
    if (!user) {
      toast.error(t.toast?.login_required || 'Увійдіть, щоб додати в улюблене');
      return false;
    }
    const existing = favorites.find(f => f.car.id === car.id);
    try {
      if (existing) {
        await removeFavorite(existing.id);
        setFavorites(prev => prev.filter(f => f.id !== existing.id));
        toast.success(t.toast?.removed_favorite || 'Видалено з улюблених');
      } else {
        const r = await addFavorite(car.id);
        setFavorites(prev => [...prev, r.data]);
        toast.success(t.toast?.added_favorite || 'Додано в улюблене');
      }
    } catch {
      toast.error(t.toast?.generic_error || 'Не вдалося. Спробуйте ще раз.');
    }
    return true;
  };
  const isFavorite = (id) => favorites.some(f => f.car.id === id);

  const addRecentlyViewed = (car) => setRecentlyViewed(prev => { const n = [car, ...prev.filter(c => c.id !== car.id)].slice(0, 10); localStorage.setItem('recentlyViewed', JSON.stringify(n)); return n; });
  const toggleCompare = (car) => setCompareList(prev => {
    const e = prev.find(c => c.id === car.id);
    let n;
    if (e) {
      n = prev.filter(c => c.id !== car.id);
      toast.success(t.toast?.removed_compare || 'Видалено з порівняння');
    } else {
      n = prev.length >= 3 ? [...prev.slice(1), car] : [...prev, car];
      toast.success(t.toast?.added_compare || 'Додано до порівняння');
    }
    localStorage.setItem('compareList', JSON.stringify(n));
    return n;
  });
  const isInCompare = (id) => compareList.some(c => c.id === id);

  return (
    <AppContext.Provider value={{ lang, t, toggleLang, user, token, login, logout, favorites, toggleFavorite, isFavorite, recentlyViewed, addRecentlyViewed, compareList, toggleCompare, isInCompare }}>
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);
