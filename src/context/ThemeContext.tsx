/**
 * ==============================================================================
 * KASHISH MASALE - Theme Context (Standard Royal Light Theme)
 * ==============================================================================
 * User ke request anusar dark mode ko puri tarah hata kar standard royal
 * ivory light theme par lock kiya gaya hai.
 * ==============================================================================
 */

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light';
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', isDark: false });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Remove dark theme attribute & clear saved dark theme
    if (typeof window !== 'undefined') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
