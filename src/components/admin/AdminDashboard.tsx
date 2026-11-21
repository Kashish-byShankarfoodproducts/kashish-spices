/**
 * ==============================================================================
 * KASHISH MASALE - AdminDashboard Component
 * ==============================================================================
 * Admin Panel ka main layout aur metrics hub:
 * 
 * Features:
 * 1. KPI Metrics Banner: Total masalas, Veg count, Non-Veg count, Both count.
 * 2. Tab Navigation:
 *    - Masala Packages Management
 *    - Live Website Customizer
 *    - Data Backup & Security
 * 3. Logout & Back to Website controls.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { supabaseService } from '../../services/supabaseService';
import { MasalaManager } from './MasalaManager';
import { SiteCustomizer } from './SiteCustomizer';
import { CloudSync } from './CloudSync';
import { DataBackup } from './DataBackup';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

type AdminTab = 'masalas' | 'customizer' | 'cloud' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const { username, logout } = useAuth();
  const { products, siteConfig } = useProducts();
  const [activeTab, setActiveTab] = useState<AdminTab>('masalas');

  // Metrics computation
  const totalCount = products.length;
  const vegCount = products.filter((p) => p.dietaryType === 'veg').length;
  const nonVegCount = products.filter((p) => p.dietaryType === 'non-veg').length;
  const bothCount = products.filter((p) => p.dietaryType === 'both').length;
  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="admin-layout">
      {/* 1. Admin Top Navbar */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: siteConfig.logoUrl ? (siteConfig.logoBgColor || '#FAF8ED') : 'var(--gold)',
              color: '#1A1209',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              overflow: 'hidden',
              padding: siteConfig.logoUrl ? '3px' : '0',
              border: '2px solid var(--gold)',
              boxShadow: 'var(--shadow-gold)',
              flexShrink: 0,
            }}
          >
            {siteConfig.logoUrl ? (
              <img
                src={siteConfig.logoUrl}
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.18)' }}
              />
            ) : (
              <span>K</span>
            )}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'white' }}>
              {siteConfig.shortBrand} Admin Panel
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>
              Logged in as: <strong>{username}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Cloud Database Sync Status Pill */}
          <button
            onClick={() => setActiveTab('cloud')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: supabaseService.getConfig().isConfigured ? 'rgba(40, 167, 69, 0.25)' : 'rgba(255, 152, 0, 0.25)',
              border: `1px solid ${supabaseService.getConfig().isConfigured ? '#4cd964' : '#ffb74d'}`,
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Click to manage live database sync"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: supabaseService.getConfig().isConfigured ? '#4cd964' : '#ffb74d',
                boxShadow: supabaseService.getConfig().isConfigured ? '0 0 8px #4cd964' : '0 0 8px #ffb74d',
              }}
            ></span>
            <span>{supabaseService.getConfig().isConfigured ? 'Cloud Synced' : 'Local Mode'}</span>
          </button>

          <button
            onClick={onBackToWebsite}
            className="btn btn-outline"
            style={{ padding: '8px 18px', fontSize: '0.85rem', borderColor: 'var(--gold)', color: 'white' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>View Website</span>
          </button>

          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Admin Content Body */}
      <main className="admin-body">
        {/* KPI Metrics Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* Card 1: Total Spices */}
          <div
            style={{
              background: 'var(--cream-card)',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Masalas
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--maroon)', marginTop: '4px' }}>
              {totalCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
              {inStockCount} currently in stock
            </span>
          </div>

          {/* Card 2: Pure Veg */}
          <div
            style={{
              background: 'var(--cream-card)',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
              🌱 Pure Veg
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e7e34', marginTop: '4px' }}>
              {vegCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
              100% vegetarian blends
            </span>
          </div>

          {/* Card 3: Non-Veg */}
          <div
            style={{
              background: 'var(--cream-card)',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
              🍗 Non-Veg
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c41e3a', marginTop: '4px' }}>
              {nonVegCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
              Meat & Chicken masalas
            </span>
          </div>

          {/* Card 4: Both */}
          <div
            style={{
              background: 'var(--cream-card)',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
              ✨ Both (Veg & Non-Veg)
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-dark)', marginTop: '4px' }}>
              {bothCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
              Multi-purpose all-rounders
            </span>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-nav-btn ${activeTab === 'masalas' ? 'active' : ''}`}
            onClick={() => setActiveTab('masalas')}
          >
            <i className="fa-solid fa-mortar-pestle"></i>
            <span>Masala Packages & Uploads</span>
          </button>

          <button
            className={`admin-nav-btn ${activeTab === 'customizer' ? 'active' : ''}`}
            onClick={() => setActiveTab('customizer')}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Live Website Customizer</span>
          </button>

          <button
            className={`admin-nav-btn ${activeTab === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('cloud')}
          >
            <i className="fa-solid fa-cloud"></i>
            <span>Live Cloud Sync</span>
          </button>

          <button
            className={`admin-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span>Backup & Security</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'masalas' && <MasalaManager />}
        {activeTab === 'customizer' && <SiteCustomizer />}
        {activeTab === 'cloud' && <CloudSync />}
        {activeTab === 'backup' && <DataBackup />}
      </main>
    </div>
  );
};
