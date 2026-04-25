import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder, disabled, style, pill }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const borderRadius = pill ? 100 : 8;

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: pill ? '8px 14px' : '10px 14px',
          background: 'var(--card)',
          border: `1px solid ${open ? '#3b82f6' : 'var(--border)'}`,
          borderRadius,
          color: selected ? 'var(--text)' : 'var(--text3)',
          fontSize: pill ? 13 : 14,
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          outline: 'none',
          transition: 'border-color .15s',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selected ? selected.label : (placeholder || '— оберіть —')}
        </span>
        <ChevronDown
          size={14}
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s', color: 'var(--text3)' }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 500,
          overflow: 'hidden',
          minWidth: 180,
        }}>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {options.map(opt => {
              const isSelected = String(opt.value) === String(value);
              const isDisabled = opt.disabled;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => { if (!isDisabled) { onChange(opt.value); setOpen(false); } }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: isSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                    border: 'none',
                    color: isDisabled ? 'var(--text3)' : isSelected ? '#3b82f6' : 'var(--text)',
                    fontSize: 14,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background .1s',
                  }}
                  onMouseEnter={e => { if (!isDisabled && !isSelected) e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{opt.label}{isDisabled ? ' — зайнято' : ''}</span>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
