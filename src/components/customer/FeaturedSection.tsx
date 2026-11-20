/**
 * ==============================================================================
 * KASHISH MASALE - FeaturedSection Component
 * ==============================================================================
 * Home page par top-selling aur featured masalas ka royal showcase.
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { SpiceCard } from '../common/SpiceCard';

interface FeaturedSectionProps {
  onExploreFullClick: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onExploreFullClick }) => {
  const { products } = useProducts();

  // Featured masale filter karein (Jo 'featured === true' hain ya top sellers)
  const featuredList = products.filter((p) => p.featured || (p.badge && p.badge.toLowerCase().includes('top'))).slice(0, 8);

  return (
    <section className="section bg-cream">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">Our Specialties</span>
          <h2>Featured Masalas</h2>
          <div className="divider">
            <div className="divider-diamond"></div>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
            Discover our top-selling blends that have become the secret ingredient in thousands of kitchens across the country.
          </p>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {featuredList.map((product) => (
            <SpiceCard key={product.id} product={product} />
          ))}
        </div>

        {/* Explore Full Catalog Button */}
        <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
          <button
            className="btn btn-outline"
            onClick={onExploreFullClick}
            style={{ borderColor: 'var(--maroon)', color: 'var(--maroon)', padding: '12px 32px' }}
          >
            <span>Explore Full Catalog</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};
