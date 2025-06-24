import { Navigate } from 'react-router-dom';
import { useAuth } from '../Authcontext/AuthContext';
import type { ReactNode } from 'react';
import SwirlingEffectSpinner from '@/components/spinner-06';

interface MiddlewareProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: MiddlewareProps) => {
  const auth = useAuth();
  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) {
    return <SwirlingEffectSpinner />;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export const GuestOnly = ({ children }: MiddlewareProps) => {
  const auth = useAuth();
  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) {
    return <SwirlingEffectSpinner />;
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};
