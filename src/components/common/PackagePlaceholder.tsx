/**
 * ==============================================================================
 * KASHISH MASALE - PackagePlaceholder Component
 * ==============================================================================
 * Jab tak admin specific masala package ki image upload nahi karta,
 * tab ye authentic default spice photograph (/images/spice-default-placeholder.jpg)
 * ke sath clean & royal style me ONLY masala ka title display karta hai.
 * ==============================================================================
 */

import React from 'react';
import { DietaryType } from '../../types';

interface PackagePlaceholderProps {
  title: string;
  categoryName?: string;
  dietaryType?: DietaryType;
}

export const PackagePlaceholder: React.FC<PackagePlaceholderProps> = ({ title }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '220px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: '#1A0E08',
      }}
    >
      {/* Real Spice Default Photo */}
      <img
        src="/images/spice-default-placeholder.jpg"
        alt={title}
        loading="lazy"
        className="placeholder-spice-img"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Clean, Simple Scrim + Only Masala Name */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          padding: '24px 14px 12px 14px',
          background:
            'linear-gradient(to top, rgba(16, 7, 3, 0.94) 0%, rgba(16, 7, 3, 0.6) 65%, transparent 100%)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#FFF0B3',
            fontSize: '1.02rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textShadow: '0 2px 6px rgba(0,0,0,0.95)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.25,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};
