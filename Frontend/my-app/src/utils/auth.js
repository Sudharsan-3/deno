import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useRequireAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(authData);
        if (!parsed?.data?.token) router.push('/login');
      } catch {
        router.push('/login');
      }
    }
  }, [router]);
};