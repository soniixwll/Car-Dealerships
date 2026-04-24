import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCars, getBrands } from '../services/api';
import CarCard from '../components/CarCard';

export default function Catalog() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>{t.catalog.title}</h1>
        <div style={{ color: 'var(--text2)', marginTop: 4 }}>{total} {t.catalog.vehicles}</div>
      </div>

      <div style={{ display: 'flex', gap: 28 }}>
        {/* SIDEBAR */}
        <aside style={{ width: 260, flexShrink: 0 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, position: 'sticky', top: 88 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
                <SlidersHorizontal size={18} color="#3b82f6" /> {t.catalog.filters}
              </div>
              <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                <RotateCcw size={12} /> {t.catalog.reset}
              </button>
            </div>

            {/* Brands */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.brand}</div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {brands.map(b => (
                  <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 14, color: filters.selectedBrands.includes(b.name) ? '#3b82f6' : 'var(--text)' }}>
                    <input type="checkbox" checked={filters.selectedBrands.includes(b.name)} onChange={() => toggleBrand(b.name)} style={{ accentColor: '#3b82f6', width: 16, height: 16 }} />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>{t.catalog.price_range}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Min" min={0} step={10000} value={draftPrice.min} onChange={e => setDraftPrice(p => ({ ...p, min: e.target.value }))} onKeyDown={handlePriceKey} style={inputS} />
                <input type="number" placeholder="Max" min={0} step={10000} value={draftPrice.max} onChange={e => setDraftPrice(p => ({ ...p, max: e.target.value }))} onKeyDown={handlePriceKey} style={inputS} />
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
              <select value={filters.ordering} onChange={e => setFilters(p => ({ ...p, ordering: e.target.value }))} style={{ padding: '8px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text)', fontSize: 13, outline: 'none' }}>
                <option value="price_uah">{t.catalog.sort_price_asc}</option>
                <option value="-price_uah">{t.catalog.sort_price_desc}</option>
                <option value="-year">{t.catalog.sort_year}</option>
                <option value="mileage_km">{t.catalog.sort_mileage}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 360, background: 'var(--card)', borderRadius: 16, opacity: 0.5 }} />)}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Нічого не знайдено</div>
              <div>Спробуйте змінити фільтри</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {cars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const inputS = { flex: 1, padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%' };
