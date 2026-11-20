/**
 * ==============================================================================
 * KASHISH MASALE - ProductModal Component (Quick View Popup with Image Slider)
 * ==============================================================================
 * Jab koi customer kisi bhi masala card par click karta hai, toh ye modal
 * screen par pop-up hota hai.
 * 
 * Ye kya-kya dikhata hai:
 * 1. Multi-Image Slider / Carousel: Multiple package photos slide karne ki suvidha,
 *    thumbnails strip aur Next/Prev buttons ke sath.
 * 2. Masala Title, Hindi Title aur Category
 * 3. Veg / Non-Veg / Both Badge
 * 4. Full Detailed Description
 * 5. Har ek pack weight aur uska MRP / Price Table
 * 6. Direct WhatsApp Bulk Order / Inquiry Button
 * 7. Call Distributor Button
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { VegBadge } from './VegBadge';
import { PackagePlaceholder } from './PackagePlaceholder';

export const ProductModal: React.FC = () => {
  const { selectedProduct, isModalOpen, closeProductModal, siteConfig } = useProducts();

  // Normalize images array
  const images: string[] =
    selectedProduct?.images && Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
      ? selectedProduct.images
      : selectedProduct?.imageUrl
      ? [selectedProduct.imageUrl]
      : [];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Reset active image index whenever selected product changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [selectedProduct?.id]);

  // Keyboard navigation: Escape to close, Left/Right arrows to slide images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductModal();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveImgIndex((prev) => (prev + 1) % images.length);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeProductModal, images.length]);

  if (!isModalOpen || !selectedProduct) return null;

  // WhatsApp Inquiry URL generate karein
  const whatsappMsg = encodeURIComponent(
    `Hello ${siteConfig.companyName}, I would like to inquire about "${selectedProduct.title}". Please share wholesale/retail details.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMsg}`;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        // Overlay background par click karne par band karein
        if (e.target === e.currentTarget) closeProductModal();
      }}
    >
      <div className="modal-card">
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={closeProductModal}
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-grid">
          {/* Left Column: Image Slider / Thumbnails / Pouch */}
          <div
            className="modal-image-col"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 250, 242, 0.95) 0%, rgba(245, 238, 224, 0.85) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              minHeight: '280px',
              border: '1.5px solid rgba(212, 160, 23, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {images.length > 0 ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Main Large Image Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '310px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(212, 160, 23, 0.25)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    key={activeImgIndex}
                    src={images[activeImgIndex]}
                    alt={`${selectedProduct.title} - Photo ${activeImgIndex + 1}`}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'opacity 0.2s ease',
                      padding: '8px',
                    }}
                  />

                  {/* Multiple Photos Badge */}
                  {images.length > 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(30, 20, 10, 0.75)',
                        color: '#FFFFFF',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(212, 160, 23, 0.4)',
                        zIndex: 2,
                      }}
                    >
                      <i className="fa-regular fa-images" style={{ color: 'var(--gold)' }}></i>
                      <span>
                        {activeImgIndex + 1} / {images.length}
                      </span>
                    </div>
                  )}

                  {/* Previous Button */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous photo"
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--maroon)',
                        border: '1.5px solid var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.15s, background 0.15s',
                        zIndex: 3,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  )}

                  {/* Next Button */}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next photo"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--maroon)',
                        border: '1.5px solid var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.15s, background 0.15s',
                        zIndex: 3,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(-50%) scale(1)')}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  )}
                </div>

                {/* Thumbnails Strip (when more than 1 image) */}
                {images.length > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px',
                      overflowX: 'auto',
                      maxWidth: '100%',
                      padding: '4px 2px',
                    }}
                  >
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: idx === activeImgIndex ? '2px solid var(--maroon)' : '1.5px solid rgba(212, 160, 23, 0.4)',
                          boxShadow: idx === activeImgIndex ? '0 0 0 2px var(--gold)' : 'none',
                          cursor: 'pointer',
                          background: '#FFFFFF',
                          padding: '2px',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          opacity: idx === activeImgIndex ? 1 : 0.65,
                        }}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '260px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid var(--gold)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <PackagePlaceholder
                  title={selectedProduct.title}
                  categoryName={selectedProduct.category.replace('-', ' ')}
                  dietaryType={selectedProduct.dietaryType}
                />
              </div>
            )}
          </div>

          {/* Right Column: Information & Prices */}
          <div className="modal-info-col">
            {/* Category & Veg Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="product-category-text" style={{ fontSize: '0.82rem' }}>
                {selectedProduct.category.replace('-', ' ')}
              </span>
              <VegBadge type={selectedProduct.dietaryType} showText={true} />
            </div>

            {/* Title & Hindi Title */}
            <h2>{selectedProduct.title}</h2>
            {selectedProduct.hindiTitle && (
              <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '12px' }}>
                "{selectedProduct.hindiTitle}"
              </p>
            )}

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '18px' }}>
              {selectedProduct.description}
            </p>

            {/* Pack Sizes & MRP Pricing Table */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '8px' }}>
                Available Pack Sizes & MRP
              </h4>
              <table className="prices-table">
                <thead>
                  <tr>
                    <th>Pack Size</th>
                    <th style={{ textAlign: 'right' }}>Price (MRP)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.weights && selectedProduct.weights.length > 0 ? (
                    selectedProduct.weights.map((w, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{w.weight} Pack</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--maroon)' }}>
                          ₹{w.price}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
                        Standard Pack Available on Request
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Action Buttons: WhatsApp & Call */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ flex: 1, minWidth: '180px' }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${siteConfig.primaryPhone}`}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '140px' }}
              >
                <i className="fa-solid fa-phone"></i>
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
