import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SOCIAL_LINKS = [
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: Youtube, label: 'YouTube', href: '#' },
];

export default function Footer() {
  const { t } = useApp();
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '60px 24px 32px', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>AutoHub</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 280 }}>{t.footer.about_text}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', transition: '.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{t.footer.quick_links}</h5>
            {[{ to: '/catalog', label: t.footer.browse }, { to: '/salons', label: t.footer.showrooms }, { to: '/compare', label: t.footer.compare }, { to: '/profile', label: t.footer.account }].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 14, color: 'var(--text2)', marginBottom: 10, transition: '.15s' }}
                onMouseEnter={e => e.target.style.color = '#3b82f6'}
                onMouseLeave={e => e.target.style.color = 'var(--text2)'}>{l.label}</Link>
            ))}
          </div>
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{t.footer.contact}</h5>
            {['info@autohub.com', '+380 44 123 4567', 'Available 7 days a week', '9:00 AM - 9:00 PM'].map(s => (
              <div key={s} style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 10 }}>{s}</div>
            ))}
          </div>
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{t.footer.follow}</h5>
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text2)', marginBottom: 10, transition: '.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
                <Icon size={16} /> {label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--text3)' }}>
          <div>© 2024 AutoHub. {t.footer.rights}</div>
        </div>
      </div>
    </footer>
  );
}
