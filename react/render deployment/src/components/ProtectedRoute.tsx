import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../api/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafcfb]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (user.role === 'RECEPTIONIST') return <Navigate to="/receptionist" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
