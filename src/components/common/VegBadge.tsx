/**
 * ==============================================================================
 * KASHISH MASALE - VegBadge Component
 * ==============================================================================
 * Ye component masala package par FSSAI ke niyam anusar Veg/Non-Veg/Both ka
 * standard symbol aur badge dikhata hai.
 * 
 * Prakaar:
 * 1. 'veg': Green Square ke andar Green Circle (Pure Vegetarian)
 * 2. 'non-veg': Red Square ke andar Red Triangle (Non-Vegetarian)
 * 3. 'both': Gold Badge jo darshata hai ki ye masala Veg aur Non-Veg dono
 *             dish me use ho sakta hai (e.g. Garam Masala, Biryani Masala)
 * ==============================================================================
 */

import React from 'react';
import { DietaryType } from '../../types';

interface VegBadgeProps {
  type: DietaryType;
  showText?: boolean; // Kya 'Veg' / 'Non-Veg' / 'Both' text bhi likhna hai?
  className?: string;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ type, showText = true, className = '' }) => {
  if (type === 'veg') {
    return (
      <span className={`dietary-badge veg ${className}`} title="100% Pure Vegetarian Blend">
        <span className="diet-symbol-veg"></span>
        {showText && <span>Pure Veg</span>}
      </span>
    );
  }

  if (type === 'non-veg') {
    return (
      <span className={`dietary-badge non-veg ${className}`} title="Non-Vegetarian Spice Blend">
        <span className="diet-symbol-non-veg"></span>
        {showText && <span>Non-Veg</span>}
      </span>
    );
  }

  // Dietary Type: 'both' (Veg aur Non-Veg dono ke liye)
  return (
    <span className={`dietary-badge both ${className}`} title="Suitable for both Veg & Non-Veg Delicacies">
      <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
        <span className="diet-symbol-veg" style={{ width: '10px', height: '10px' }}></span>
        <span className="diet-symbol-non-veg" style={{ width: '10px', height: '10px' }}></span>
      </span>
      {showText && <span>Veg & Non-Veg</span>}
    </span>
  );
};
