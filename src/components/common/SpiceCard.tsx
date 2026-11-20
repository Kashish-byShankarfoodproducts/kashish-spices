/**
 * ==============================================================================
 * KASHISH MASALE - SpiceCard Component
 * ==============================================================================
 * Ye customer-facing website par har ek masala ka card render karta hai.
 * 
 * Features:
 * 1. 3D Tilt Effect: Mouse move karne par subtle royal 3D rotation hota hai.
 * 2. Veg / Non-Veg / Both Badge: Top right corner me indicator.
 * 3. Image Upload Support: Agar admin ne photo upload ki hai toh real photo,
 *    warna royal pouch illustration render hoti hai.
 * 4. Weight Chips: Pack sizes (12g, 25g, 50g, 100g).
 * 5. OnClick: Card par click karne par detailed Quick View Modal khulta hai.
 * ==============================================================================
 */

import React, { useRef } from 'react';
import { MasalaProduct } from '../../types';
import { VegBadge } from './VegBadge';
import { PackagePlaceholder } from './PackagePlaceholder';
import { useProducts } from '../../context/ProductContext';

interface SpiceCardProps {
  product: MasalaProduct;
}

export const SpiceCard: React.FC<SpiceCardProps> = ({ product }) => {
  const { openProductModal } = useProducts();
  const cardRef = useRef<HTMLDivElement>(null);

  // Lowest price calculate karein
  const lowestPrice = product.weights && product.weights.length > 0
    ? Math.min(...product.weights.map((w) => w.price))
    : null;

  // 3D Tilt mouse effect (Momentum Tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <div
      ref={cardRef}
      className="product-card"
      onClick={() => openProductModal(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.25s ease' }}
    >
      {/* 1. Top Badges Overlay */}
      {product.badge && (
        <div className={`product-badge-overlay ${product.badge.toLowerCase().includes('top') ? 'gold' : ''}`}>
          {product.badge}
        </div>
      )}

      {/* 2. Dietary Badge (Veg / Non-Veg / Both) */}
      <div className="product-diet-overlay">
        <VegBadge type={product.dietaryType} showText={false} />
      </div>

      {/* 3. Image Box (Uploaded Image ya Fallback Pouch Illustration) */}
      <div className="product-card-top">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <PackagePlaceholder
            title={product.title}
            categoryName={product.category.replace('-', ' ')}
            dietaryType={product.dietaryType}
          />
        )}
      </div>

      {/* 4. Card Content Body */}
      <div className="product-card-body">
        <span className="product-category-text">
          {product.category.replace('-', ' ')}
        </span>

        <h3>{product.title}</h3>

        {product.hindiTitle && (
          <div className="product-hindi-name">{product.hindiTitle}</div>
        )}

        <p className="product-description-snippet">{product.description}</p>

        {/* 5. Pack Sizes & Pricing */}
        <div className="product-weights-chips">
          {product.weights.map((w, idx) => (
            <span key={idx} className="weight-chip">
              {w.weight}
            </span>
          ))}

          {lowestPrice !== null && (
            <span className="price-indicator">
              From ₹{lowestPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
