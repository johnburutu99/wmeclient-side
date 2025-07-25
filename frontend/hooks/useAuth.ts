import { useState } from 'react';
import { apiPost } from '../utils/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/auth/login', { email, password });
      if (res.access_token) {
        localStorage.setItem('token', res.access_token);
      }
      return res;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
  }

  return { login, logout, loading, error };
}
