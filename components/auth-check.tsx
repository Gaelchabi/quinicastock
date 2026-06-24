'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/app-context';

export function AuthCheck() {
  const router = useRouter();
  const { setUser, setStore, setIsOnboarded, user } = useApp();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tenantId = localStorage.getItem('tenantId');
    const role = localStorage.getItem('role');

    if (token && userId) {
      setUser({
        id: userId,
        email: '',
        name: '',
        storeId: tenantId || undefined,
      });
      setIsOnboarded(!!tenantId);

      if (tenantId) {
        setStore({
          id: tenantId,
          name: '',
          owner: '',
          phone: '',
          country: '',
          city: '',
          currency: 'XOF',
          lowStockThreshold: 10,
          notificationsEnabled: true,
          createdAt: new Date(),
        });
      }
    }
  }, []);

  return null;
}
