/**
 * ==============================================================================
 * KASHISH MASALE - CatalogPage Component (Royal Indian Spice Showcase)
 * ==============================================================================
 * Customer-facing website ka main products page:
 * - Royal banner with gold mandala & diamond motifs
 * - Category filter pills with gold sheen
 * - Dietary selector (Pure Veg, Non-Veg, Both) with vibrant gem colors
 * - Fast live search bar
 * - Responsive 3D SpiceCard grid
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { SpiceCard } from '../common/SpiceCard';
import { DietaryType } from '../../types';

interface CatalogPageProps {
  onHomeClick: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onHomeClick }) => {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    activeDietary,
    setActiveDietary,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    siteConfig,
  } = useProducts();

  return (
    <div>
      {/* 1. Grand Royal Page Hero Banner with Spice Flatlay Blend */}
      <section
        style={{
          position: 'relative',
          background:
            'linear-gradient(90deg, rgba(45, 6, 6, 0.93) 0%, rgba(85, 12, 14, 0.84) 45%, rgba(40, 5, 5, 0.88) 100%), url("/images/spice-bg.jpg") right center / cover no-repeat',
          color: 'white',
          padding: '65px 20px 50px 20px',
          textAlign: 'center',
          borderBottom: '3px solid var(--gold)',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Subtle Ambient Gold Halo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(212, 160, 23, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Royal Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 16px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(212, 160, 23, 0.5)',
              borderRadius: '20px',
              color: 'var(--gold-light)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            <span>✦</span>
            <span>SHANKAR FOOD PRODUCTS PRESENTS</span>
            <span>✦</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#FFFFFF',
              letterSpacing: '1px',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)',
              marginBottom: '8px',
            }}
          >
            Our Premium Products
          </h1>

          {/* Ornamental Divider */}
          <div className="divider" style={{ margin: '10px auto 14px auto' }}>
            <div className="divider-diamond"></div>
          </div>

          <p
            style={{
              color: 'var(--cream)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto 18px auto',
              lineHeight: 1.6,
            }}
          >
            "{siteConfig.taglineHindi}" — Explore our pure, authentic range of Indian masalas and whole spices.
            Zero artificial preservatives, 100% natural aromatics.
          </p>

          {/* Breadcrumbs */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              padding: '4px 14px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span
              onClick={onHomeClick}
              style={{ color: 'var(--gold-light)', cursor: 'pointer', fontWeight: 600 }}
            >
              <i className="fa-solid fa-house" style={{ marginRight: '6px' }}></i>
              Home
            </span>
            <i className="fa-solid fa-angle-right" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}></i>
            <span style={{ color: 'white', fontWeight: 600 }}>Products Catalog</span>
          </div>
        </div>
      </section>

      {/* 2. Main Catalog Section with Filters */}
      <section className="section bg-cream">
        <div className="container">
          <div className="filters-bar">
            {/* Category Tabs */}
            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon && <i className={`fa-solid ${cat.icon}`}></i>}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Dietary Preference Filter (Veg / Non-Veg / Both) */}
            <div className="dietary-filter-group">
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--gray-700)',
                  marginRight: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-filter text-gold"></i>
                <span>Dietary Preference:</span>
              </span>

              <button
                className={`diet-pill-btn ${activeDietary === 'all' ? 'active-all' : ''}`}
                onClick={() => setActiveDietary('all')}
              >
                <span>All Diets</span>
              </button>

              <button
                className={`diet-pill-btn ${activeDietary === 'veg' ? 'active-veg' : ''}`}
                onClick={() => setActiveDietary('veg')}
              >
                <span className="diet-symbol-veg"></span>
                <span>🌱 Pure Veg</span>
              </button>

              <button
                className={`diet-pill-btn ${activeDietary === 'non-veg' ? 'active-non-veg' : ''}`}
                onClick={() => setActiveDietary('non-veg')}
              >
                <span className="diet-symbol-non-veg"></span>
                <span>🍗 Non-Veg</span>
              </button>

              <button
                className={`diet-pill-btn ${activeDietary === 'both' ? 'active-both' : ''}`}
                onClick={() => setActiveDietary('both')}
              >
                <i className="fa-solid fa-star text-gold" style={{ fontSize: '0.78rem' }}></i>
                <span>✨ Both (Veg & Non-Veg)</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="search-wrapper">
              <i className="fa-solid fa-search search-icon-left text-gold"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search spices by title, ingredients, or Hindi name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Product Count Indicator */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--gray-500)',
              marginBottom: '32px',
            }}
          >
            Showing{' '}
            <span
              style={{
                color: 'var(--maroon)',
                fontWeight: 800,
                fontSize: '1.1rem',
                padding: '2px 8px',
                background: 'rgba(212, 160, 23, 0.15)',
                borderRadius: '6px',
                border: '1px solid rgba(212, 160, 23, 0.4)',
              }}
            >
              {filteredProducts.length}
            </span>{' '}
            Products
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <SpiceCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--cream-card)',
                borderRadius: '16px',
                border: '1px dashed var(--gold)',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <i
                className="fa-solid fa-mortar-pestle text-gold"
                style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}
              ></i>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--gray-700)',
                  marginBottom: '8px',
                  fontSize: '1.4rem',
                }}
              >
                No Matching Spices Found
              </h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem', marginBottom: '20px' }}>
                Aapke chune hue filter ya search ke hisaab se koi masala nahi mila.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveDietary('all');
                  setSearchQuery('');
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
