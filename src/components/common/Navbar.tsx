/**
 * ==============================================================================
 * KASHISH MASALE - Navbar Component
 * ==============================================================================
 * Website ka main top navigation header.
 * 
 * Features:
 * 1. Brand Logo: Kashish by Shankar Food Products
 * 2. Navigation Tabs: Home, Our Products, Contact Us
 * 3. FSSAI Certification Tag: Live government food license number display
 * 4. Theme Toggle: Sun / Moon icon (Dark / Light mode)
 * 5. Admin Panel Button: Sidha auth-based admin panel me jane ke liye
 * 6. Responsive Mobile Drawer: Chhote screens par smooth hamburger menu
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'catalog' | 'contact' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { siteConfig } = useProducts();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection for sticky compact header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'catalog' | 'contact' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* 1. Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => handleNavClick('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <div
            className="brand-emblem"
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: siteConfig.logoBgColor || '#FAF8ED',
              border: '2.5px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-gold)',
              overflow: 'hidden',
              padding: '2px',
              flexShrink: 0,
            }}
          >
            {siteConfig.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt={siteConfig.shortBrand}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  display: 'block',
                  transform: 'scale(1.15)',
                }}
              />
            ) : (
              <span>K</span>
            )}
          </div>
          <div className="brand-title">
            <span className="brand-name" style={{ fontSize: '1.12rem' }}>{siteConfig.shortBrand || 'Kashish Masale'}</span>
            <span className="brand-sub" style={{ fontSize: '0.74rem' }}>BY {siteConfig.companyName}</span>
          </div>
        </div>

        {/* 2. Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ul className="nav-links" style={{ display: window.innerWidth < 840 ? 'none' : 'flex' }}>
            <li>
              <button
                className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentView === 'catalog' ? 'active' : ''}`}
                onClick={() => handleNavClick('catalog')}
              >
                Our Products
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentView === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                Contact Us
              </button>
            </li>
          </ul>

          {/* FSSAI Badge */}
          <div
            style={{
              display: window.innerWidth < 1000 ? 'none' : 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--gold-light)',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 10px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '20px',
              border: '1px solid rgba(212, 160, 23, 0.3)',
            }}
          >
            <i className="fa-solid fa-shield-halved text-gold"></i>
            <span>FSSAI: {siteConfig.fssaiNumber}</span>
          </div>

          {/* Right Action Icons (Admin Panel) */}
          <div className="nav-actions">
            {/* Admin Panel Button */}
            <button
              className="admin-pill-btn"
              onClick={() => handleNavClick('admin')}
              title="Manage spices, prices, images and website settings"
            >
              <i className="fa-solid fa-lock"></i>
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="icon-btn"
              style={{ display: window.innerWidth < 840 ? 'flex' : 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu with Spice Blend */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background:
              'linear-gradient(90deg, rgba(62, 8, 8, 0.97) 0%, rgba(95, 12, 14, 0.94) 70%, rgba(55, 7, 7, 0.97) 100%), url("/images/spice-bg.jpg") right center / cover no-repeat',
            borderBottom: '2px solid var(--gold)',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 999,
          }}
        >
          <button
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: currentView === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => handleNavClick('home')}
          >
            <i className="fa-solid fa-house" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
            Home
          </button>
          <button
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: currentView === 'catalog' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => handleNavClick('catalog')}
          >
            <i className="fa-solid fa-mortar-pestle" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
            Our Products
          </button>
          <button
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              background: currentView === 'contact' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => handleNavClick('contact')}
          >
            <i className="fa-solid fa-envelope" style={{ marginRight: '10px', color: 'var(--gold)' }}></i>
            Contact Us
          </button>
          <button
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              color: 'var(--gold-light)',
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => handleNavClick('admin')}
          >
            <i className="fa-solid fa-shield-halved" style={{ marginRight: '10px' }}></i>
            {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
          </button>
        </div>
      )}
    </header>
  );
};
