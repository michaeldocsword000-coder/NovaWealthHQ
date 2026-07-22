'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { api } from './api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  balance: number;
  referralBonus: number;
  referralCode: string;
  role: 'USER' | 'ADMIN';
  status: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        return;
      }
      const res = await api.get<{ success: boolean; user: User }>('/auth/me');
      setUser(res.user);
    } catch {
      Cookies.remove('token');
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ success: boolean; user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    Cookies.set('token', res.token, { expires: 7 });
    setUser(res.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post<{ success: boolean; user: User; token: string }>(
      '/auth/register',
      data
    );
    Cookies.set('token', res.token, { expires: 7 });
    setUser(res.user);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
