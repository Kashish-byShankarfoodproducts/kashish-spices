/**
 * ==============================================================================
 * KASHISH MASALE - WhyChooseUs Component
 * ==============================================================================
 * "The Kashish Promise" section: Pure spice benefits (Zero Preservatives,
 * No Artificial Colors, Farm Fresh Ingredients).
 * ==============================================================================
 */

import React from 'react';

export const WhyChooseUs: React.FC = () => {
  const promises = [
    {
      icon: 'fa-ban',
      title: 'Zero Preservatives',
      desc: 'We preserve the natural goodness of spices without adding any harmful chemical preservatives.',
    },
    {
      icon: 'fa-palette',
      title: 'No Artificial Colors',
      desc: 'The vibrant colors of our spices come entirely from nature—what you see is pure authenticity.',
    },
    {
      icon: 'fa-seedling',
      title: 'Farm Fresh Ingredients',
      desc: 'Sourced directly from trusted traditional farms to ensure maximum aroma and flavor.',
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">Why Kashish?</span>
          <h2>The Kashish Promise</h2>
          <div className="divider">
            <div className="divider-diamond"></div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {promises.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 24px',
                textAlign: 'center',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--gray-200)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(139, 26, 26, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  fontSize: '1.6rem',
                  color: 'var(--maroon)',
                  border: '1px solid rgba(212, 160, 23, 0.4)',
                }}
              >
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--gray-700)',
                  marginBottom: '10px',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
