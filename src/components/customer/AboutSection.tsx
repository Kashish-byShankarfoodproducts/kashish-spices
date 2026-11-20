/**
 * ==============================================================================
 * KASHISH MASALE - AboutSection Component
 * ==============================================================================
 * "Our Story" section: Shankar Food Products ki heritage, pure ingredients sourcing
 * aur traditional recipes ki information.
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';

interface AboutSectionProps {
  onViewBlendsClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onViewBlendsClick }) => {
  const { siteConfig } = useProducts();

  return (
    <section className="section bg-white">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 800 ? '1fr' : '1fr 1.2fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left: Royal Heritage Visual Emblem with Spice Flatlay Blend */}
          <div
            style={{
              position: 'relative',
              background:
                'linear-gradient(135deg, rgba(140, 20, 20, 0.92) 0%, rgba(74, 14, 14, 0.95) 100%), url("/images/spice-bg.jpg") center / cover no-repeat',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              border: '2px solid var(--gold)',
              boxShadow: 'var(--shadow-md)',
              color: 'white',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                border: '3px solid var(--gold)',
                background: siteConfig.logoUrl ? (siteConfig.logoBgColor || '#FAF8ED') : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '3rem',
                color: 'var(--gold)',
                padding: siteConfig.logoUrl ? '8px' : '0',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-gold)',
              }}
            >
              {siteConfig.logoUrl ? (
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.shortBrand}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.18)' }}
                />
              ) : (
                <i className="fa-solid fa-mortar-pestle"></i>
              )}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                color: 'var(--gold-light)',
                marginBottom: '8px',
              }}
            >
              {siteConfig.shortBrand}
            </h3>
            <p style={{ color: 'var(--cream)', fontSize: '0.92rem', marginBottom: '16px' }}>
              Pure & Authentic Indian Spices
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 18px',
                background: 'var(--gold)',
                color: '#1A1209',
                fontWeight: 700,
                borderRadius: '20px',
                fontSize: '0.85rem',
                letterSpacing: '1px',
              }}
            >
              SINCE {siteConfig.sinceYear}
            </div>
          </div>

          {/* Right: Story Text */}
          <div>
            <div className="ornament">
              <i className="fa-solid fa-star ornament-icon"></i>
              <span style={{ color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
                Our Story
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.1rem',
                color: 'var(--maroon)',
                lineHeight: 1.3,
                marginBottom: '16px',
              }}
            >
              {siteConfig.aboutHeading}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '14px' }}>
              {siteConfig.aboutParagraph1}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '24px' }}>
              {siteConfig.aboutParagraph2}
            </p>

            {/* Features Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: 'rgba(212, 160, 23, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-award"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '4px' }}>
                    Premium Quality
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    Sourced from the finest farms.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: 'rgba(212, 160, 23, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-heart-circle-check"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '4px' }}>
                    FSSAI Certified
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    100% pure and safe for family.
                  </p>
                </div>
              </div>
            </div>

            <button className="btn btn-maroon" onClick={onViewBlendsClick}>
              <span>View All Blends</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
