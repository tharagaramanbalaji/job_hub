import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jobhub_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persistAuth = (token, userData) => {
    localStorage.setItem('jobhub_token', token);
    localStorage.setItem('jobhub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (username, password, userType) => {
    const { data } = await api.post('/auth/register', { username, password, userType });
    persistAuth(data.token, data.user);
    toast.success(`Welcome, ${data.user.username}! 🎉`);
    return data.user;
  }, []);

  const login = useCallback(async (username, password, userType) => {
    const { data } = await api.post('/auth/login', { username, password, userType });
    persistAuth(data.token, data.user);
    toast.success(`Welcome back, ${data.user.username}!`);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jobhub_token');
    localStorage.removeItem('jobhub_user');
    setUser(null);
    toast('Logged out. See you soon!', { icon: '👋' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
