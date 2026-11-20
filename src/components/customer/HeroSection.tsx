/**
 * ==============================================================================
 * KASHISH MASALE - HeroSection Component
 * ==============================================================================
 * Homepage ka main grand hero banner: Royal Indian red gradient, gold badges,
 * Hindi tagline aur Call-to-action buttons.
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';

interface HeroSectionProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onContactClick }) => {
  const { siteConfig } = useProducts();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2 className="hero-subtitle">{siteConfig.heroSubtitle}</h2>
          <h1 className="hero-brand">{siteConfig.heroBrand}</h1>
          <p className="hero-tagline">{siteConfig.tagline}</p>
          <p className="hero-tagline-hindi">"{siteConfig.taglineHindi}"</p>

          {/* Key Badges */}
          <div className="hero-badges">
            <div className="hero-badge">
              <i className="fa-solid fa-leaf text-gold"></i>
              <span>Zero Preservatives</span>
            </div>
            <div className="hero-badge">
              <i className="fa-solid fa-droplet-slash text-gold"></i>
              <span>Zero Colouring Agents</span>
            </div>
            <div className="hero-badge">
              <i className="fa-solid fa-seedling text-gold"></i>
              <span>Fresh Ingredients</span>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={onExploreClick}>
              <span>Explore Products</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button className="btn btn-outline" onClick={onContactClick}>
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
