/**
 * ==============================================================================
 * KASHISH MASALE - Application Entry Point (main.tsx)
 * ==============================================================================
 * Ye file React 19 application ko initialize aur DOM me render karti hai.
 * 
 * Architecture Hierarchy:
 * <React.StrictMode>
 *   <ThemeProvider>       --> Manages Dark/Light mode theme
 *     <AuthProvider>      --> Manages Admin login/logout security
 *       <ProductProvider> --> Manages Masala Catalog, filters, and site customizer
 *         <App />         --> Main application layout and routing
 *       </ProductProvider>
 *     </AuthProvider>
 *   </ThemeProvider>
 * </React.StrictMode>
 * ==============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element '#root' nahi mila. Kripya index.html check karein.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
