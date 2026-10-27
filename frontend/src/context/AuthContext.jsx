import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('imovies_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify and fetch latest user info on app start
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('imovies_token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('imovies_user', JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    const handleAuthEvent = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('authChange', handleAuthEvent);
    return () => window.removeEventListener('authChange', handleAuthEvent);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('imovies_token', receivedToken);
        localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem('imovies_token', receivedToken);
        localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

