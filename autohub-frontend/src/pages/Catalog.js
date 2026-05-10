import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { SlidersHorizontal, RotateCcw, X, Search, ChevronUp, ChevronDown, Check } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { useApp } from '../context/AppContext';
import { getCars, getBrands } from '../services/api';
import { useIsTablet } from '../hooks/useMediaQuery';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/Skeleton';
import Seo from '../components/Seo';

function paramsToFilters(searchParams) {
  return {
    selectedBrands: searchParams.get('brand') ? searchParams.get('brand').split(',').filter(Boolean) : [],
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
    year_min: searchParams.get('year_min') || '',
    year_max: searchParams.get('year_max') || '',
    mileage_max: searchParams.get('mileage_max') || '',
    ordering: searchParams.get('ordering') || 'price_uah',
  };
}

export default function Catalog() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const isTablet = useIsTablet();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = paramsToFilters(searchParams);
  const [draftPrice, setDraftPrice] = useState({ min: filters.price_min, max: filters.price_max });

  const updateFilter = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v == null || (Array.isArray(v) && v.length === 0)) next.delete(k);
      else next.set(k, Array.isArray(v) ? v.join(',') : v);
    });
    setSearchParams(next, { replace: true });
  };

  const setFilters = (updater) => {
    const current = filters;
    const next = typeof updater === 'function' ? updater(current) : updater;
    updateFilter({
      brand: next.selectedBrands,
      price_min: next.price_min,
      price_max: next.price_max,
      year_min: next.year_min,
      year_max: next.year_max,
      mileage_max: next.mileage_max,
      ordering: next.ordering === 'price_uah' ? '' : next.ordering,
    });
  };

  const applyPrice = () => updateFilter({ price_min: draftPrice.min, price_max: draftPrice.max });
  const clearPrice = () => { setDraftPrice({ min: '', max: '' }); updateFilter({ price_min: '', price_max: '' }); };
  const handlePriceKey = (e) => { if (e.key === 'Enter') applyPrice(); };

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands().then(r => r.data.results || r.data || []),
    staleTime: 5 * 60_000,
  });
  const brands = brandsData || [];

  const searchQ = searchParams.get('search') || '';
  const carsParams = (() => {
    const params = { ordering: filters.ordering };
    if (filters.selectedBrands.length) params.brand = filters.selectedBrands.join(',');
    if (filters.price_min) params.price_min = filters.price_min;
    if (filters.price_max) params.price_max = filters.price_max;
    if (filters.year_min) params.year_min = filters.year_min;
    if (filters.year_max) params.year_max = filters.year_max;
    if (filters.mileage_max) params.mileage_max = filters.mileage_max;
    if (searchQ) params.search = searchQ;
    return params;
  })();

  const {
    data: carsData,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cars', 'infinite', carsParams],
    queryFn: ({ pageParam = 1 }) => getCars({ ...carsParams, page: pageParam }).then(r => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage?.next ? allPages.length + 1 : undefined),
  });
  const cars = carsData?.pages.flatMap(p => p.results || []) || [];
  const total = carsData?.pages[0]?.count || 0;

  const toggleBrand = (name) => {
    const current = filters.selectedBrands;
    const next = current.includes(name) ? current.filter(b => b !== name) : [...current, name];
    updateFilter({ brand: next });
  };
  const resetFilters = () => {
    const next = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) next.set('search', search);
    setSearchParams(next, { replace: true });
    setDraftPrice({ min: '', max: '' });
  };

  const sidebarFloating = isTablet;

  const sidebarOuter = sidebarFloating
    ? { position: 'fixed', top: 0, left: 0, width: 'min(320px, 85vw)', height: '100vh', zIndex: 200, background: 'var(--bg2)', overflowY: 'auto', padding: 20, transform: filtersOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .25s', boxShadow: filtersOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none' }
    : { width: 260, flexShrink: 0 };
  const sidebarInner = sidebarFloating
    ? { background: 'transparent', border: 'none', padding: 0 }
    : { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, position: 'sticky', top: 88 };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
      <Seo
        title={t.catalog.title}
        description={`${total ? `${total} ` : ''}${t.catalog.vehicles}. ${t.catalog.title}.`}
      />
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(21px, 3vw, 26px)', fontWeight: 600, lineHeight: 1.15 }}>{t.catalog.title}</h1>
          <div style={{ color: 'var(--text2)', marginTop: 4, fontSize: 14 }}>{total} {t.catalog.vehicles}</div>
        </div>
        {sidebarFloating && (
          <button onClick={() => setFiltersOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
            <SlidersHorizontal size={15} color="var(--blue)" /> {t.catalog.filters}
          </button>
        )}
      </div>

      {sidebarFloating && filtersOpen && (
        <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 199 }} />
      )}

      <div style={{ display: 'flex', gap: 28 }}>
        <aside style={sidebarOuter} aria-hidden={sidebarFloating && !filtersOpen}>
          <div style={sidebarInner}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
                <SlidersHorizontal size={18} color="var(--blue)" /> {t.catalog.filters}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                  <RotateCcw size={12} /> {t.catalog.reset}
                </button>
                {sidebarFloating && (
                  <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: 4 }}>
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.brand}</div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {brands.map(b => {
                  const checked = filters.selectedBrands.includes(b.name);
                  return (
                    <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 14, color: checked ? 'var(--blue)' : 'var(--text)' }}>
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
                          background: checked ? 'var(--blue)' : 'var(--bg)',
                          border: `1px solid ${checked ? 'var(--blue-light)' : 'rgba(148,163,184,0.45)'}`,
                          transition: 'background .15s, border-color .15s',
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

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.price_range}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <PriceInput placeholder="Min" value={draftPrice.min} onChange={v => setDraftPrice(p => ({ ...p, min: v }))} onKeyDown={handlePriceKey} step={10000} />
                <PriceInput placeholder="Max" value={draftPrice.max} onChange={v => setDraftPrice(p => ({ ...p, max: v }))} onKeyDown={handlePriceKey} step={10000} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={applyPrice} style={{ flex: 1, padding: '8px 12px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t.catalog.apply}
                </button>
                {(filters.price_min || filters.price_max) && (
                  <button onClick={clearPrice} aria-label="Clear price" style={{ padding: '8px 12px', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>×</button>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>{t.catalog.price_hint}</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.year}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder={t.catalog.from} value={filters.year_min} onChange={e => setFilters(p => ({ ...p, year_min: e.target.value }))} style={inputS} />
                <input type="number" placeholder={t.catalog.to} value={filters.year_max} onChange={e => setFilters(p => ({ ...p, year_max: e.target.value }))} style={inputS} />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.mileage}</div>
              <input type="number" placeholder={t.catalog.mileage_placeholder} value={filters.mileage_max} onChange={e => setFilters(p => ({ ...p, mileage_max: e.target.value }))} style={{ ...inputS, width: '100%' }} />
            </div>
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: 'var(--text2)' }}>{t.catalog.found}: <strong style={{ color: 'var(--text)' }}>{total}</strong> {t.catalog.cars_label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>{t.catalog.sort}:</span>
              <CustomSelect
                pill
                style={{ width: 280, maxWidth: '100%' }}
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
              {Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text2)' }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Search size={36} color="var(--text3)" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{t.catalog.nothing_found}</div>
              <div>{t.catalog.try_change}</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
                {cars.map(car => <CarCard key={car.id} car={car} />)}
                {isFetchingNextPage && Array(3).fill(0).map((_, i) => <CarCardSkeleton key={`s-${i}`} />)}
              </div>
              {hasNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    style={{ padding: '12px 32px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: isFetchingNextPage ? 'wait' : 'pointer', opacity: isFetchingNextPage ? 0.6 : 1 }}
                  >
                    {isFetchingNextPage ? '…' : (t.catalog.load_more || 'Завантажити ще')}
                  </button>
                </div>
              )}
              {!hasNextPage && cars.length >= 12 && (
                <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--text3)', fontSize: 13 }}>
                  {t.catalog.all_loaded || `Показано всі ${total}`}
                </div>
              )}
            </>
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
      onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--blue)'}
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
