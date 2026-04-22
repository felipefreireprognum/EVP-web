'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  isChecked: boolean;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY   = 'evp:auth';
const AUTH_USER  = 'evp:user';
const VALID_USER = 'supervisor';
const VALID_PASS = 'tempo';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY) === 'true';
    setIsAuthenticated(authed);
    setUsername(authed ? (localStorage.getItem(AUTH_USER) ?? '') : '');
    setIsChecked(true);
  }, []);

  function login(user: string, password: string): boolean {
    if (user.trim() === VALID_USER && password === VALID_PASS) {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_USER, user.trim());
      setIsAuthenticated(true);
      setUsername(user.trim());
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_USER);
    setIsAuthenticated(false);
    setUsername('');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isChecked, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
}
