import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import RecommendPage from './pages/RecommendPage';
import DiseasePage from './pages/DiseasePage';
import ProfitPage from './pages/ProfitPage';
import './App.css';

function Navbar() {
  const navItems = [
    { to: '/recommend', icon: '🌾', label: 'Crop Advisor' },
    { to: '/disease',   icon: '🔬', label: 'Disease Detect' },
    { to: '/profit',    icon: '📊', label: 'Profit Calc' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🌿</span>
        <div>
          <span className="brand-name">Agri Chanakya</span>
          <span className="brand-tagline">Smart Farm Advisory</span>
        </div>
      </div>
      <nav className="navbar-links">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/recommend" replace />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/disease"   element={<DiseasePage />} />
          <Route path="/profit"    element={<ProfitPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
