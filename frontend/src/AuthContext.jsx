// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BACKEND_URL = 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load token và user từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          // Verify token với backend
          const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (response.data.success) {
            setUser(response.data.user);
            setToken(savedToken);
          } else {
            // Token không hợp lệ, xóa đi
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Lưu vào state
        setUser(user);
        setToken(token);

        // Lưu token vào localStorage
        localStorage.setItem('token', token);

        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Đăng nhập thất bại';
      return { success: false, error: errorMessage };
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Refresh user data from backend (useful after profile/address updates)
  const refreshUser = async () => {
    const savedToken = localStorage.getItem('token') || token;
    if (!savedToken) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  // Hàm đăng ký
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Lưu vào state
        setUser(user);
        setToken(token);

        // Lưu token vào localStorage
        localStorage.setItem('token', token);

        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Đăng ký thất bại';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
