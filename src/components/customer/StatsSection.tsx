/**
 * ==============================================================================
 * KASHISH MASALE - StatsSection Component
 * ==============================================================================
 * Animated stats counter numbers (Unique Blends, Natural Ingredients,
 * Distributors, Pure Promise). Ye numbers Admin Panel se live customize
 * ho sakte hain.
 * ==============================================================================
 */

import React from 'react';
import { useProducts } from '../../context/ProductContext';

export const StatsSection: React.FC = () => {
  const { siteConfig, products } = useProducts();

  // Dynamic blend count: ya toh database me available products ki count ya siteConfig
  const totalBlends = products.length > 0 ? products.length : siteConfig.statBlendsCount;

  return (
    <section className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          {/* Stat 1 */}
          <div>
            <div className="stat-number">{totalBlends}+</div>
            <div className="stat-label">Unique Blends</div>
          </div>

          {/* Stat 2 */}
          <div>
            <div className="stat-number">{siteConfig.statNaturalPercent}%</div>
            <div className="stat-label">Natural Ingredients</div>
          </div>

          {/* Stat 3 */}
          <div>
            <div className="stat-number">{siteConfig.statDistributors}+</div>
            <div className="stat-label">City Distributors</div>
          </div>

          {/* Stat 4 */}
          <div>
            <div className="stat-number">{siteConfig.statPurePromise}%</div>
            <div className="stat-label">Pure Promise</div>
          </div>
        </div>
      </div>
    </section>
  );
};
