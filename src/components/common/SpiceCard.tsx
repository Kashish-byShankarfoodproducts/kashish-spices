/**
 * ==============================================================================
 * KASHISH MASALE - SpiceCard Component
 * ==============================================================================
 * Ye customer-facing website par har ek masala ka card render karta hai.
 * 
 * Features:
 * 1. 3D Tilt Effect: Mouse move karne par subtle royal 3D rotation hota hai.
 * 2. Multi-Image Auto-Slide on Hover: Agar product me multiple photos hain,
 *    toh card par hover karte hi photos apne aap loop me bari-bari slide hoti hain!
 * 3. Veg / Non-Veg / Both Badge: Top right corner me indicator.
 * 4. Image Upload Support: Real package photos ya royal pouch illustration.
 * 5. Weight Chips: Pack sizes (12g, 25g, 50g, 100g).
 * 6. OnClick: Card par click karne par detailed Quick View Modal khulta hai.
 * ==============================================================================
 */

import React, { useRef, useState, useEffect } from 'react';
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

  // Normalize images array (multiple images support)
  const images: string[] =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

  // Lowest price calculate karein
  const lowestPrice =
    product.weights && product.weights.length > 0
      ? Math.min(...product.weights.map((w) => w.price))
      : null;

  // Cleanup auto-slide timer on unmount
  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, []);

  // Hover start: Auto-slide images in a loop every 1.5 seconds
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      slideTimerRef.current = window.setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    }
  };

  // Hover end: Stop slide timer and reset to cover image
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = null;
    }
    setCurrentImgIndex(0);
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

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

  // Manual prev/next navigation within card without opening modal
  const handleManualPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleManualNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      ref={cardRef}
      className="product-card"
      onClick={() => openProductModal(product)}
      onMouseEnter={handleMouseEnter}
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

      {/* 3. Image Box (Uploaded Images Carousel ya Fallback Pouch Illustration) */}
      <div className="product-card-top" style={{ position: 'relative', overflow: 'hidden' }}>
        {images.length > 0 ? (
          <>
            <img
              key={currentImgIndex}
              src={images[currentImgIndex]}
              alt={`${product.title} - Photo ${currentImgIndex + 1}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'opacity 0.25s ease-in-out',
              }}
            />

            {/* Multiple Photos Count Indicator */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(30, 20, 10, 0.75)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(212, 160, 23, 0.4)',
                  zIndex: 2,
                }}
              >
                <i className="fa-regular fa-images" style={{ color: 'var(--gold)' }}></i>
                <span>{images.length}</span>
              </div>
            )}

            {/* Hover Manual Arrows (only if multiple images) */}
            {images.length > 1 && isHovered && (
              <>
                <button
                  type="button"
                  onClick={handleManualPrev}
                  aria-label="Previous Photo"
                  style={{
                    position: 'absolute',
                    left: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: 'var(--maroon)',
                    border: '1px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 3,
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  onClick={handleManualNext}
                  aria-label="Next Photo"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: 'var(--maroon)',
                    border: '1px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 3,
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Pagination Dots at Bottom of Image */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 2,
                }}
              >
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImgIndex(idx);
                    }}
                    style={{
                      width: idx === currentImgIndex ? '14px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: idx === currentImgIndex ? 'var(--gold)' : 'rgba(255, 255, 255, 0.55)',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </>
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
