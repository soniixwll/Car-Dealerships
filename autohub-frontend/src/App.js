import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const Salons = lazy(() => import('./pages/Salons'));
const Compare = lazy(() => import('./pages/Compare'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageFallback() {
  return <div style={{ minHeight: '60vh' }} aria-busy="true" />;
}

export default function App() {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <BrowserRouter>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <a href="#main" className="skip-link">Перейти до основного вмісту</a>
                <Navbar />
                <main id="main" style={{ flex: 1 }}>
                  <ErrorBoundary>
                    <Suspense fallback={<PageFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/cars/:id" element={<CarDetail />} />
                        <Route path="/salons" element={<Salons />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 4000,
                    style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: 14 },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                  }}
                />
              </div>
            </BrowserRouter>
          </AppProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}
