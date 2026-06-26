import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { AuthUser, PatientRegisterPayload, UserRole } from '../api/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  register: (payload: PatientRegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'clinic_auth';

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const persist = (auth: AuthUser, token: string) => {
    localStorage.setItem('clinic_token', token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setUser(auth);
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    const authUser: AuthUser = {
      userId: res.userId,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
      profileId: res.profileId,
      patientCode: res.patientCode,
    };
    persist(authUser, res.token);
    return res.role;
  };

  const register = async (payload: PatientRegisterPayload) => {
    const res = await api.register(payload);
    const authUser: AuthUser = {
      userId: res.userId,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
      profileId: res.profileId,
      patientCode: res.patientCode,
    };
    persist(authUser, res.token);
  };

  const logout = () => {
    localStorage.removeItem('clinic_token');
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
