/**
 * ==============================================================================
 * KASHISH MASALE - ProductModal Component (Quick View Popup)
 * ==============================================================================
 * Jab koi customer kisi bhi masala card par click karta hai, toh ye modal
 * screen par pop-up hota hai.
 * 
 * Ye kya-kya dikhata hai:
 * 1. Product Image / High-Res Pouch
 * 2. Masala Title, Hindi Title aur Category
 * 3. Veg / Non-Veg / Both Badge
 * 4. Full Detailed Description
 * 5. Har ek pack weight aur uska MRP / Price Table
 * 6. Direct WhatsApp Bulk Order / Inquiry Button (Ek click me WhatsApp chat khulti hai)
 * 7. Call Distributor Button
 * ==============================================================================
 */

import React, { useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { VegBadge } from './VegBadge';
import { PackagePlaceholder } from './PackagePlaceholder';

export const ProductModal: React.FC = () => {
  const { selectedProduct, isModalOpen, closeProductModal, siteConfig } = useProducts();

  // Escape key dabane par modal band karein
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeProductModal]);

  if (!isModalOpen || !selectedProduct) return null;

  // WhatsApp Inquiry URL generate karein
  const whatsappMsg = encodeURIComponent(
    `Hello ${siteConfig.companyName}, I would like to inquire about "${selectedProduct.title}". Please share wholesale/retail details.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMsg}`;

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
          {/* Left Column: Image / Pouch */}
          <div
            className="modal-image-col"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 250, 242, 0.95) 0%, rgba(245, 238, 224, 0.85) 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              minHeight: '280px',
              border: '1.5px solid rgba(212, 160, 23, 0.3)',
            }}
          >
            {selectedProduct.imageUrl ? (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                style={{
                  maxHeight: '340px',
                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
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
