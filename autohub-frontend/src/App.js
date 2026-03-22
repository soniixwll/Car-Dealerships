import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';
import Salons from './pages/Salons';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
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
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
