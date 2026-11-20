/**
 * ==============================================================================
 * KASHISH MASALE - AdminLogin Component
 * ==============================================================================
 * Admin Panel ka secure authentication gate:
 * - Confidential login: Username aur Password hidden rehte hain
 * - Custom brand logo support (agar upload hua ho toh logo dikhta hai)
 * - Glassmorphic royal Indian card with gold border accents
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';

interface AdminLoginProps {
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWebsite }) => {
  const { login } = useAuth();
  const { siteConfig } = useProducts();

  // Inputs are blank for security (no prefilled credentials)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Incorrect username or password');
      }
    } catch (err) {
      setErrorMessage('Incorrect username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 65% 50%, rgba(35, 12, 12, 0.85) 0%, rgba(18, 12, 10, 0.94) 60%, rgba(10, 5, 5, 0.98) 100%), url("/images/spice-dark-slate.jpg") center left / cover no-repeat fixed',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Decorative Gold Radial Shimmer */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 160, 23, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#1A0E0C',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23F5D76E\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\'/%3E%3Cpath d=\'M20 12 L22 18 L28 17 L24 21 L27 26 L21 24 L18 29 L17 23 L12 22 L17 19 Z\'/%3E%3Cellipse cx=\'60\' cy=\'20\' rx=\'4\' ry=\'8\' transform=\'rotate(25 60 20)\'/%3E%3Crect x=\'19\' y=\'58\' width=\'2\' height=\'10\' rx=\'1\'/%3E%3Ccircle cx=\'20\' cy=\'56\' r=\'3\'/%3E%3Cpath d=\'M52 56 Q60 54 68 56 L68 64 Q60 62 52 64 Z\'/%3E%3Ccircle cx=\'40\' cy=\'38\' r=\'1.5\'/%3E%3Ccircle cx=\'44\' cy=\'42\' r=\'1.2\'/%3E%3Ccircle cx=\'38\' cy=\'44\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
          borderRadius: '24px',
          border: '1.5px solid var(--gold)',
          padding: '40px 32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(212, 160, 23, 0.15)',
          position: 'relative',
          zIndex: 2,
          color: '#FFFFFF',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Back to Website Button */}
        <button
          onClick={onBackToWebsite}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'var(--gold-light)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Website</span>
        </button>

        {/* Brand Logo / Lock Emblem */}
        <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
          {siteConfig.logoUrl ? (
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                background: siteConfig.logoBgColor || '#FAF8ED',
                border: '2.5px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: 'var(--shadow-gold)',
                overflow: 'hidden',
                padding: '4px',
              }}
            >
              <img
                src={siteConfig.logoUrl}
                alt="Brand Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'scale(1.18)',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                color: '#1A1209',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '1.5rem',
                boxShadow: 'var(--shadow-gold)',
              }}
            >
              <i className="fa-solid fa-lock"></i>
            </div>
          )}

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              color: 'var(--gold)',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            Admin Portal
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {siteConfig.shortBrand} Management & Customizer
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(196, 30, 58, 0.2)',
              color: '#FFB3BA',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              border: '1px solid rgba(196, 30, 58, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fa-solid fa-circle-exclamation text-deep-red"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--gold-light)' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  borderColor: 'rgba(212, 160, 23, 0.4)',
                }}
              />
              <i
                className="fa-solid fa-user"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold)',
                }}
              ></i>
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ color: 'var(--gold-light)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  borderColor: 'rgba(212, 160, 23, 0.4)',
                }}
              />
              <i
                className="fa-solid fa-key"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold)',
                }}
              ></i>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gold-light)',
                }}
              >
                <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
