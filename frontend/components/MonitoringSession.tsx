'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { useAuth } from '@/lib/AuthContext';

export function MonitoringSession() {
  const { user } = useAuth();
  const pathname = usePathname();
  useEffect(() => { Sentry.setUser(user ? { id: user.id } : null); Sentry.setTag('role', user?.role || 'anonymous'); }, [user?.id, user?.role]);
  useEffect(() => { Sentry.addBreadcrumb({ category: 'navigation', message: pathname, level: 'info' }); }, [pathname]);
  return null;
}
