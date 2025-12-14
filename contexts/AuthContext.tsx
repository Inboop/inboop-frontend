'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.inboop.com';
const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://inboop.com';

const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for tokens in URL (from cross-subdomain redirect)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      const refreshFromUrl = urlParams.get('refresh');

      if (tokenFromUrl && refreshFromUrl) {
        localStorage.setItem('accessToken', tokenFromUrl);
        localStorage.setItem('refreshToken', refreshFromUrl);
        // Clean up URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const userData = result.data || result;
        setUser(userData);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // Try to refresh the token
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearAuth();
        }
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) return false;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch {
      // Refresh failed
    }
    return false;
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const redirectToApp = (accessToken: string, refreshToken: string) => {
    if (isProduction) {
      // Cross-subdomain redirect with tokens
      const url = new URL('/inbox', APP_URL);
      url.searchParams.set('token', accessToken);
      url.searchParams.set('refresh', refreshToken);
      window.location.href = url.toString();
    } else {
      router.push('/inbox');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Invalid credentials');
    }

    const result = await response.json();
    const data = result.data || result;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    setIsAuthenticated(true);
    redirectToApp(data.accessToken, data.refreshToken);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    const data = result.data || result;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    setIsAuthenticated(true);
    redirectToApp(data.accessToken, data.refreshToken);
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Google sign-in failed');
    }

    const result = await response.json();
    const data = result.data || result;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    setIsAuthenticated(true);
    redirectToApp(data.accessToken, data.refreshToken);
  };

  const logout = () => {
    clearAuth();
    if (isProduction) {
      window.location.href = `${MARKETING_URL}/login`;
    } else {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
