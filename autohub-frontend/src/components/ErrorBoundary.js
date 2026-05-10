import React from 'react';
import * as Sentry from '@sentry/react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught:', error, info);
    }
    Sentry.captureException(error, { extra: info });
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 650, marginBottom: 8 }}>Щось пішло не так</div>
            <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
              Сталася непередбачена помилка. Спробуйте перезавантажити сторінку.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={this.reset} style={{ padding: '10px 18px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Спробувати знову
              </button>
              <button onClick={() => window.location.assign('/')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg,var(--blue-hover),var(--blue))', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                На головну
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
