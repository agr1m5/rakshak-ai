/**
 * AuthContext — provides authentication state globally.
 *
 * Stores the JWT in memory (not localStorage) for security.
 * A single source of truth for: currentUser, token, loading state.
 *
 * We use an httpOnly-cookie-safe pattern here: the JWT is kept in
 * React state so it disappears on page refresh — Step 5 (Auth backend)
 * will pair this with a /auth/refresh endpoint backed by an httpOnly cookie.
 */
import { createContext, useContext, useState, useCallback } from 'react';
import api from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);   // { _id, email }
  const [token, setToken] = useState(null);   // raw JWT string (in-memory only)
  const [loading, setLoading] = useState(false);

  /**
   * login — calls POST /api/auth/login, stores returned JWT in memory,
   * wires Axios default header, returns the user object.
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      // Attach token to every subsequent Axios request
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * signup — calls POST /api/auth/signup then auto-logs in.
   */
  const signup = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', { email, password });
      return login(email, password);
    } finally {
      setLoading(false);
    }
  }, [login]);

  /**
   * logout — clears all in-memory auth state and Axios header.
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort — always clear locally
    } finally {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const value = { user, token, loading, login, signup, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — convenience hook for consuming AuthContext.
 * Throws if used outside of <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
