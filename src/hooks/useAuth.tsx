import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/AuthService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string; // Thêm role property
  isAdmin: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean; // Thêm loading state
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (
    resetToken: string,
    password: string,
    confirmPassword: string
  ) => Promise<any>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm loading state

  // Kiểm tra trạng thái đăng nhập khi khởi động
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          const { data } = await authApi.getMe();
          if (data.success) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ, xóa khỏi localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm tiện ích xử lý lỗi từ API
  const handleApiError = (error: any): string => {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      return error.response.data.errors[0].msg;
    } else if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.message) {
      return error.message;
    }
    return "Có lỗi xảy ra";
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const {
        _id,
        name,
        email: userEmail,
        role,
        avatar,
        token,
        refreshToken,
      } = response;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      const userData = {
        _id,
        name,
        email: userEmail,
        role,
        isAdmin: role === "admin",
        avatar,
      };

      setUser(userData);
      setIsAuthenticated(true);

      return { user: userData };
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register({ name, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP function
  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await authApi.verifyOtp({ email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      const response = await authApi.forgotPassword({ email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (
    resetToken: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const response = await authApi.resetPassword(
        resetToken,
        password,
        confirmPassword
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Refresh user function
  const refreshUser = async () => {
    try {
      const { data } = await authApi.getMe();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
    loading,
    login,
    logout,
    register,
    verifyOTP,
    forgotPassword,
    resetPassword,
    refreshUser,
    handleApiError, // Thêm hàm xử lý lỗi cho components khác sử dụng
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
