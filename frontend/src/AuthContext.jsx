// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BACKEND_URL = 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [favorites, setFavorites] = useState([]);

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
            // Load favorites after user is authenticated
            await loadFavorites(savedToken);
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

  // Load favorites từ backend
  const loadFavorites = async (authToken) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${authToken || token}`,
        },
      });
      if (response.data.success) {
        setFavorites(response.data.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Toggle favorite (thêm/xóa sản phẩm khỏi danh sách yêu thích)
  const toggleFavorite = async (productId) => {
    if (!token) return { success: false, error: 'Vui lòng đăng nhập' };

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/favorites/${productId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setFavorites(response.data.data);
        return {
          success: true,
          isFavorited: response.data.isFavorited,
          message: response.data.message,
        };
      }
      return { success: false, error: 'Không thể cập nhật yêu thích' };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Lỗi khi cập nhật yêu thích',
      };
    }
  };

  // Kiểm tra sản phẩm có trong favorites không
  const isFavorited = (productId) => {
    return favorites.some(
      (fav) => fav.productId?.toString() === productId?.toString(),
    );
  };

  // Hàm đăng nhập (email hoặc username)
  const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        emailOrUsername,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Lưu vào state
        setUser(user);
        setToken(token);

        // Lưu token vào localStorage
        localStorage.setItem('token', token);

        // Load favorites after login
        await loadFavorites(token);

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
    setFavorites([]);
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
  const register = async (name, email, username, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name,
        email,
        username,
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
    favorites,
    login,
    logout,
    register,
    refreshUser,
    toggleFavorite,
    isFavorited,
    loadFavorites,
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
