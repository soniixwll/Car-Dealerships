import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw, X, Search, ChevronUp, ChevronDown, Check } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { useApp } from '../context/AppContext';
import { getCars, getBrands } from '../services/api';
import { useIsTablet } from '../hooks/useMediaQuery';
import CarCard from '../components/CarCard';

export default function Catalog() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const isTablet = useIsTablet();
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    selectedBrands: searchParams.get('brand') ? [searchParams.get('brand')] : [],
    price_min: '', price_max: searchParams.get('price_max') || '',
    year_min: '', year_max: '',
    mileage_max: '',
    ordering: 'price_uah',
  });
  const [draftPrice, setDraftPrice] = useState({ min: '', max: searchParams.get('price_max') || '' });

  const applyPrice = () => setFilters(p => ({ ...p, price_min: draftPrice.min, price_max: draftPrice.max }));
  const clearPrice = () => { setDraftPrice({ min: '', max: '' }); setFilters(p => ({ ...p, price_min: '', price_max: '' })); };
  const handlePriceKey = (e) => { if (e.key === 'Enter') applyPrice(); };

  useEffect(() => { getBrands().then(r => setBrands(r.data.results || r.data || [])).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ordering: filters.ordering };
    if (filters.selectedBrands.length === 1) params.brand = filters.selectedBrands[0];
    if (filters.price_min) params.price_min = filters.price_min;
    if (filters.price_max) params.price_max = filters.price_max;
    if (filters.year_min) params.year_min = filters.year_min;
    if (filters.year_max) params.year_max = filters.year_max;
    if (filters.mileage_max) params.mileage_max = filters.mileage_max;
    const sq = searchParams.get('search');
    if (sq) params.search = sq;
    getCars(params).then(r => { setCars(r.data.results || []); setTotal(r.data.count || 0); }).catch(() => {}).finally(() => setLoading(false));
  }, [filters, searchParams]);

  const toggleBrand = (name) => setFilters(p => ({ ...p, selectedBrands: p.selectedBrands.includes(name) ? p.selectedBrands.filter(b => b !== name) : [...p.selectedBrands, name] }));
  const resetFilters = () => { setFilters({ selectedBrands: [], price_min: '', price_max: '', year_min: '', year_max: '', mileage_max: '', ordering: 'price_uah' }); setDraftPrice({ min: '', max: '' }); };

  const sidebarFloating = isTablet;
  const showSidebar = !isTablet || filtersOpen;

  const sidebarOuter = sidebarFloating
    ? { position: 'fixed', top: 0, left: 0, width: 'min(320px, 85vw)', height: '100vh', zIndex: 200, background: 'var(--bg2)', overflowY: 'auto', padding: 20, transform: filtersOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .25s', boxShadow: filtersOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none' }
    : { width: 260, flexShrink: 0 };
  const sidebarInner = sidebarFloating
    ? { background: 'transparent', border: 'none', padding: 0 }
    : { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, position: 'sticky', top: 88 };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800 }}>{t.catalog.title}</h1>
          <div style={{ color: 'var(--text2)', marginTop: 4, fontSize: 14 }}>{total} {t.catalog.vehicles}</div>
        </div>
        {sidebarFloating && (
          <button onClick={() => setFiltersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
            <SlidersHorizontal size={15} color="#3b82f6" /> {t.catalog.filters}
          </button>
        )}
      </div>

      {sidebarFloating && filtersOpen && (
        <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 199 }} />
      )}

      <div style={{ display: 'flex', gap: 28 }}>
        {/* SIDEBAR */}
        <aside style={sidebarOuter} aria-hidden={sidebarFloating && !filtersOpen}>
          <div style={sidebarInner}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
                <SlidersHorizontal size={18} color="#3b82f6" /> {t.catalog.filters}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                  <RotateCcw size={12} /> {t.catalog.reset}
                </button>
                {sidebarFloating && (
                  <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: 4 }}>
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Brands */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.brand}</div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {brands.map(b => {
                  const checked = filters.selectedBrands.includes(b.name);
                  return (
                    <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 14, color: checked ? '#3b82f6' : 'var(--text)' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBrand(b.name)}
                        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: checked ? '#3b82f6' : 'var(--bg)',
                          border: `1px solid ${checked ? '#60a5fa' : 'rgba(148,163,184,0.45)'}`,
                          boxShadow: checked ? '0 0 0 3px rgba(59,130,246,0.18)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                          transition: 'background .15s, border-color .15s, box-shadow .15s',
                        }}
                      >
                        {checked && <Check size={13} strokeWidth={3} color="#fff" />}
                      </span>
                      <span>{b.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.price_range}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <PriceInput placeholder="Min" value={draftPrice.min} onChange={v => setDraftPrice(p => ({ ...p, min: v }))} onKeyDown={handlePriceKey} step={10000} />
                <PriceInput placeholder="Max" value={draftPrice.max} onChange={v => setDraftPrice(p => ({ ...p, max: v }))} onKeyDown={handlePriceKey} step={10000} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={applyPrice} style={{ flex: 1, padding: '8px 12px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t.catalog.apply || 'Застосувати'}
                </button>
                {(filters.price_min || filters.price_max) && (
                  <button onClick={clearPrice} aria-label="Clear price" style={{ padding: '8px 12px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>×</button>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Ціна в грн</div>
            </div>

            {/* Year */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.year}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Від" value={filters.year_min} onChange={e => setFilters(p => ({ ...p, year_min: e.target.value }))} style={inputS} />
                <input type="number" placeholder="До" value={filters.year_max} onChange={e => setFilters(p => ({ ...p, year_max: e.target.value }))} style={inputS} />
              </div>
            </div>

            {/* Mileage */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.mileage} (макс. км)</div>
              <input type="number" placeholder="Напр. 100000" value={filters.mileage_max} onChange={e => setFilters(p => ({ ...p, mileage_max: e.target.value }))} style={{ ...inputS, width: '100%' }} />
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: 'var(--text2)' }}>Знайдено: <strong style={{ color: 'var(--text)' }}>{total}</strong> авто</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>{t.catalog.sort}:</span>
              <CustomSelect
                pill
                value={filters.ordering}
                onChange={v => setFilters(p => ({ ...p, ordering: v }))}
                options={[
                  { value: 'price_uah', label: t.catalog.sort_price_asc },
                  { value: '-price_uah', label: t.catalog.sort_price_desc },
                  { value: '-year', label: t.catalog.sort_year },
                  { value: 'mileage_km', label: t.catalog.sort_mileage },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 360, background: 'var(--card)', borderRadius: 16, opacity: 0.5 }} />)}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text2)' }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Search size={36} color="var(--text3)" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Нічого не знайдено</div>
              <div>Спробуйте змінити фільтри</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {cars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const inputS = { flex: 1, padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%' };

function PriceInput({ placeholder, value, onChange, onKeyDown, step = 10000 }) {
  const num = parseInt(value) || 0;
  const increment = () => onChange(String(num + step));
  const decrement = () => onChange(String(Math.max(0, num - step)));
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', transition: 'border-color .2s' }}
      onFocusCapture={e => e.currentTarget.style.borderColor = '#3b82f6'}
      onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <input
        type="number"
        placeholder={placeholder}
        min={0}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ flex: 1, padding: '9px 8px 9px 12px', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%', MozAppearance: 'textfield' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)' }}>
        <button type="button" onClick={increment} tabIndex={-1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 18, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 0, borderBottom: '1px solid var(--border)' }}>
          <ChevronUp size={11} />
        </button>
        <button type="button" onClick={decrement} tabIndex={-1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 18, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 0 }}>
          <ChevronDown size={11} />
        </button>
      </div>
    </div>
  );
}
