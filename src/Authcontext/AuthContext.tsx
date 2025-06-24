import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import axiosInstance, { setOnUnauthorizedCallback } from '../Api/axiosInstance';
import SwirlingEffectSpinner from '@/components/spinner-06';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

function clearTokenCookie() {
  document.cookie = 'jwt_token=; Max-Age=0; path=/; SameSite=Lax';
}

function getTokenCookie(): string | null {
  const name = 'jwt_token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    const trimmed = c.trim();
    if (trimmed.startsWith(name)) {
      return trimmed.substring(name.length);
    }
  }
  return null;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchUserCalledRef = useRef(false);

const logout = useCallback(async () => {
  try {
    await axiosInstance.post('/logout');
    console.log('Logged out on backend');
  } catch (error) {
    console.warn('Logout error (probably already expired):', error);
  } finally {
    setIsAuthenticated(false);
    setUser(null);
    clearTokenCookie();
  }
}, []);


  const fetchUser = useCallback(async (): Promise<boolean> => {
    const token = getTokenCookie();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      const response = await axiosInstance.get('/user');
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      clearTokenCookie();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: any): Promise<boolean> => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/login', credentials);
        const token = response.data?.access_token;
        if (!token) throw new Error('No token returned from login');
        return await fetchUser();
      } catch (error) {
        const axiosError = error as any;
        console.warn('Login failed:', axiosError.response?.data?.message || error);
        setUser(null);
        setIsAuthenticated(false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUser]
  );

  useEffect(() => {
    setOnUnauthorizedCallback(logout);
    if (!fetchUserCalledRef.current) {
      fetchUserCalledRef.current = true;
      fetchUser();
    }
    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, [logout, fetchUser]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    fetchUser,
  };

  if (loading) {
    return <SwirlingEffectSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
