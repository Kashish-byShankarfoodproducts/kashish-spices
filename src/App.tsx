/**
 * ==============================================================================
 * KASHISH MASALE - Main App Component
 * ==============================================================================
 * Ye React application ka main root component hai jo customer views
 * (Home, Catalog, Contact) aur Admin Panel ke beech seamless navigation karta hai.
 * 
 * Layout & Polish:
 * - Purani website ka layout 100% barkarar rakha gaya hai
 * - Premium gold accents, glassmorphic cards aur smooth Indian spice styling
 * - Auth-based Admin Panel
 * - WhatsApp direct inquiry support
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProductModal } from './components/common/ProductModal';
import { HeroSection } from './components/customer/HeroSection';
import { AboutSection } from './components/customer/AboutSection';
import { FeaturedSection } from './components/customer/FeaturedSection';
import { WhyChooseUs } from './components/customer/WhyChooseUs';
import { StatsSection } from './components/customer/StatsSection';
import { CatalogPage } from './components/customer/CatalogPage';
import { ContactPage } from './components/customer/ContactPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { useProducts } from './context/ProductContext';

export const App: React.FC = () => {
  // Navigation View State: 'home' | 'catalog' | 'contact' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'contact' | 'admin'>('home');
  const { isAuthenticated } = useAuth();
  const { siteConfig } = useProducts();

  // Scroll to top helper
  const navigateTo = (view: 'home' | 'catalog' | 'contact' | 'admin') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Agar user ne 'admin' chuna hai
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin onBackToWebsite={() => navigateTo('home')} />;
    }
    return <AdminDashboard onBackToWebsite={() => navigateTo('home')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Global Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* 2. Main Page Views */}
      <main style={{ flexGrow: 1 }}>
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreClick={() => navigateTo('catalog')}
              onContactClick={() => navigateTo('contact')}
            />
            <AboutSection onViewBlendsClick={() => navigateTo('catalog')} />
            <FeaturedSection onExploreFullClick={() => navigateTo('catalog')} />
            <WhyChooseUs />
            <StatsSection />
          </>
        )}

        {/* VIEW 2: PRODUCTS CATALOG PAGE */}
        {currentView === 'catalog' && (
          <CatalogPage onHomeClick={() => navigateTo('home')} />
        )}

        {/* VIEW 3: CONTACT US PAGE */}
        {currentView === 'contact' && (
          <ContactPage onHomeClick={() => navigateTo('home')} />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* 4. Quick View Product Modal */}
      <ProductModal />

      {/* 5. Floating WhatsApp Button for Direct Orders */}
      <a
        href={`https://wa.me/${siteConfig.whatsappNumber}?text=Hello%20Shankar%20Food%20Products%2C%20I%20want%20to%20know%20more%20about%20Kashish%20Masale`}
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#25D366',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 900,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="Chat on WhatsApp"
        aria-label="Order or Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default App;
