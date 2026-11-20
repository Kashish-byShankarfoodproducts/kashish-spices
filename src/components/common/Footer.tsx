/**
 * ==============================================================================
 * KASHISH MASALE - Footer Component
 * ==============================================================================
 * Website ka footer section: Brand information, FSSAI verification, quick links,
 * categories navigation, and packed/marketed by contact information.
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';

interface FooterProps {
  onNavigate: (view: 'home' | 'catalog' | 'contact' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteConfig, setActiveCategory } = useProducts();

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    onNavigate('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* 1. Brand Column */}
          <div>
            {siteConfig.logoUrl ? (
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: siteConfig.logoBgColor || '#FAF8ED',
                  border: '2px solid var(--gold)',
                  padding: '4px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-gold)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.shortBrand}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.18)' }}
                />
              </div>
            ) : null}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--gold)',
                fontSize: '1.6rem',
                marginBottom: '12px',
              }}
            >
              {siteConfig.shortBrand}
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {siteConfig.taglineHindi}. Bringing authentic Indian flavors to your kitchen since{' '}
              {siteConfig.sinceYear}. Handpicked, pure, and aromatic spices for your culinary journey.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(212, 160, 23, 0.15)',
                border: '1px solid var(--gold)',
                borderRadius: '6px',
                color: 'var(--gold-light)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>FSSAI: {siteConfig.fssaiNumber}</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Our Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ color: 'var(--gold-light)', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Categories Navigation */}
          <div>
            <h4>Categories</h4>
            <ul className="footer-links">
              <li>
                <button
                  onClick={() => handleCategoryClick('masala-blends')}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Masala Blends
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('pure-spices')}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Pure Spices
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('premium')}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Premium Blends
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('dry-ingredients')}
                  style={{ color: 'inherit', textAlign: 'left', fontSize: '0.92rem' }}
                >
                  <i className="fa-solid fa-angle-right" style={{ marginRight: '6px', color: 'var(--gold)' }}></i>
                  Dry Ingredients
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Contact Details */}
          <div>
            <h4>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--gold)', marginTop: '4px' }}></i>
                <div>
                  <strong>Packed & Marketed by:</strong>
                  <p style={{ marginTop: '2px' }}>{siteConfig.address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <i className="fa-solid fa-envelope" style={{ color: 'var(--gold)', marginTop: '4px' }}></i>
                <a href={`mailto:${siteConfig.email}`} style={{ wordBreak: 'break-all' }}>
                  {siteConfig.email}
                </a>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <i className="fa-solid fa-phone" style={{ color: 'var(--gold)', marginTop: '4px' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <a href={`tel:${siteConfig.primaryPhone}`}>{siteConfig.primaryPhone}</a>
                  <a href={`tel:${siteConfig.secondaryPhone}`}>{siteConfig.secondaryPhone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {siteConfig.sinceYear} {siteConfig.companyName}. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '1.2rem', color: 'var(--gold)' }}>
            <a href={siteConfig.facebookUrl || '#'} target="_blank" rel="noreferrer" title="Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href={siteConfig.instagramUrl || '#'} target="_blank" rel="noreferrer" title="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
