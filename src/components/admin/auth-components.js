import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { initializeAdmin } from './adminSetup';

// Create Auth Context
const AuthContext = createContext(null);

// JWT Token Manager
const TokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  refreshAccessToken: async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { accessToken, newRefreshToken } = await response.json();
      TokenManager.setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      TokenManager.clearTokens();
      throw error;
    }
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize admin and check auth on mount
  useEffect(() => {
    initializeAdmin();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = TokenManager.getAccessToken();
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Get admin credentials from localStorage
      const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials'));
      if (adminCredentials) {
        setUser({ email: adminCredentials.email, role: 'admin' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      TokenManager.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials'));
      
      if (email === adminCredentials.email && password === adminCredentials.password) {
        const accessToken = 'temp_access_token_' + Date.now();
        const refreshToken = 'temp_refresh_token_' + Date.now();
        
        TokenManager.setTokens(accessToken, refreshToken);
        setUser({ email: adminCredentials.email, role: 'admin' });
        router.push('/admin');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    TokenManager.clearTokens();
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Export all auth related utilities
export { TokenManager };
export { LoginForm } from './auth-components-login';
export { ProtectedRoute } from './auth-components-protected';

// Request Interceptor for adding auth headers
export const apiClient = {
  fetch: async (url, options = {}) => {
    let accessToken = TokenManager.getAccessToken();

    // Add auth header if token exists
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }

    try {
      const response = await fetch(url, options);

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        try {
          accessToken = await TokenManager.refreshAccessToken();
          options.headers['Authorization'] = `Bearer ${accessToken}`;
          return fetch(url, options);
        } catch (error) {
          TokenManager.clearTokens();
          window.location.href = '/admin/login';
          throw error;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default { AuthProvider, useAuth, apiClient };