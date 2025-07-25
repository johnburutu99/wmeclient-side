import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    // TODO: Fetch user profile from backend using token
    setUser({ email: 'demo@wme.com', name: 'Demo User' }); // Dummy data
    setLoading(false);
  }, []);

  return { user, loading };
}
