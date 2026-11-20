/**
 * ==============================================================================
 * KASHISH MASALE - Admin Authentication Context
 * ==============================================================================
 * Is file ka kaam Admin Panel ko password-protected banana hai.
 * 
 * Features:
 * 1. Default Login:
 *    - Username: admin
 *    - Password: kashish@123
 * 2. Password Change Support:
 *    - Admin apna password settings se kabhi bhi badal sakta hai.
 * 3. Session Persistence:
 *    - Login hone ke baad session tab close hone tak active rehta hai.
 * 4. Full Security & Hindi Comments:
 *    - Har function ka step-by-step documentation.
 * ==============================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import { storageService } from '../services/storageService';

const ADMIN_CREDS_KEY = 'kashish_admin_credentials';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (user: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session storage se login state check karein
  const [authState, setAuthState] = useState<{ isAuthenticated: boolean; username: string }>(() => {
    return storageService.getStoredAuth();
  });

  // Current admin credentials dhoondhein (Custom ya Default)
  const getAdminCredentials = () => {
    try {
      const stored = localStorage.getItem(ADMIN_CREDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* ignore */
    }
    // Default credentials
    return {
      username: 'admin',
      password: 'kashish@123',
    };
  };

  /**
   * LOGIN FUNCTION:
   * Username aur Password match karta hai.
   */
  const login = async (user: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const creds = getAdminCredentials();
    const cleanUser = user.trim().toLowerCase();
    const cleanExpectedUser = creds.username.trim().toLowerCase();

    if (cleanUser === cleanExpectedUser && pass === creds.password) {
      const newAuth = { isAuthenticated: true, username: creds.username };
      setAuthState(newAuth);
      storageService.setStoredAuth(newAuth);
      return { success: true };
    }

    return {
      success: false,
      message: 'Incorrect username or password',
    };
  };

  /**
   * LOGOUT FUNCTION:
   * Session ko khatam karta hai aur user ko logout kar deta hai.
   */
  const logout = () => {
    const cleared = { isAuthenticated: false, username: '' };
    setAuthState(cleared);
    storageService.setStoredAuth(cleared);
  };

  /**
   * CHANGE PASSWORD FUNCTION:
   * Admin ko apna password change karne ki suvidha deta hai.
   */
  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    const creds = getAdminCredentials();
    if (oldPass !== creds.password) {
      return { success: false, message: 'Purana password galat hai!' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'Naya password kam se kam 6 aksharo ka hona chahiye!' };
    }

    const updatedCreds = {
      username: creds.username,
      password: newPass.trim(),
    };

    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updatedCreds));
    return { success: true, message: 'Password safalta-purvak badal diya gaya!' };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        username: authState.username,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook: components me `useAuth()` call karke login state mil jayegi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
