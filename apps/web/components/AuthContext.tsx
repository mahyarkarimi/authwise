import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/lib/axios';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/auth/profile');
      setUser(data.data);
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = () => {
    fetchUser();
  };

  useEffect(() => {
    if (loading) return;
    if (['/auth/login', '/auth/register'].includes(pathname)) {
      if (loggedIn) {
        router.push('/dashboard');
      }
    } else if (!loggedIn) {
      
      router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loggedIn, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, error, refetch, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};