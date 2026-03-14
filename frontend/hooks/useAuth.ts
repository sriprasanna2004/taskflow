import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { getMe, login, logout, register } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    getMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const u = await login({ email, password });
      setUser(u);
      router.push('/dashboard');
    },
    [router]
  );

  const handleRegister = useCallback(
    async (name: string, email: string, password: string) => {
      const u = await register({ name, email, password });
      setUser(u);
      router.push('/dashboard');
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return { user, loading, handleLogin, handleRegister, handleLogout };
};
