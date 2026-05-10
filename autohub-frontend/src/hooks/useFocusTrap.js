import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function useFocusTrap(active, onEscape) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const previouslyFocused = document.activeElement;

    const focusables = () => Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter(el => !el.hasAttribute('aria-hidden'));

    const first = focusables()[0];
    if (first) first.focus();
    else { node.setAttribute('tabindex', '-1'); node.focus(); }

    const handleKey = (e) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) { e.preventDefault(); return; }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    node.addEventListener('keydown', handleKey);
    return () => {
      node.removeEventListener('keydown', handleKey);
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [active, onEscape]);

  return ref;
}
