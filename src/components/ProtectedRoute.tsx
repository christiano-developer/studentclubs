'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRegistration?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireRegistration = false,
  requireAdmin = false,
  redirectTo = '/auth'
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
        return;
      }

      if (requireRegistration && user && !user.isRegistered) {
        router.push('/register');
        return;
      }

      if (requireAdmin && user && !user.isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, requireAuth, requireRegistration, requireAdmin, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireRegistration && user && !user.isRegistered) {
    return null;
  }

  if (requireAdmin && user && !user.isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;