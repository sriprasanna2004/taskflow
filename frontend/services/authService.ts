import api from './api';
import { User } from '@/types';

export const register = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post('/api/auth/register', data);
  return res.data.data.user as User;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post('/api/auth/login', data);
  return res.data.data.user as User;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
};

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await api.get('/api/auth/me');
    return res.data.data.user as User;
  } catch {
    return null;
  }
};
