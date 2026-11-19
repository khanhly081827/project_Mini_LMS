import React, { createContext, useState, useEffect, useCallback } from 'react';
import authApi from '../features/auth/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mini_lms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mini_lms_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Xác thực lại phiên đăng nhập khi ứng dụng tải lại (F5)
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mini_lms_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('mini_lms_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[Auth] Không thể làm mới phiên đăng nhập:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('mini_lms_token', newToken);
      localStorage.setItem('mini_lms_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }
    throw new Error(res.message || 'Đăng nhập không thành công');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('mini_lms_token');
    localStorage.removeItem('mini_lms_user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isInstructor: user?.role === 'INSTRUCTOR',
    isStudent: user?.role === 'STUDENT',
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
