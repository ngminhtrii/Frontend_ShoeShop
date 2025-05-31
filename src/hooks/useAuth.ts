import { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  role: "user" | "admin";
  avatar?: {
    url: string;
    public_id: string;
  };
  isVerified: boolean;
  isActive?: boolean;
}

interface LoginData {
  token?: string;
  refreshToken?: string;
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  role?: "user" | "admin";
  avatar?: {
    url: string;
    public_id: string;
  };
  isVerified?: boolean;
  isActive?: boolean;
}

interface AuthData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (userData: LoginData) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => boolean;
}

interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

const useAuth = (): AuthData => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // Kiểm tra token có hợp lệ không
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }, []);
  // Kiểm tra authentication
  const checkAuth = useCallback((): boolean => {
    const tokenFromCookie = Cookie.get("token");
    const tokenFromStorage = localStorage.getItem("accessToken");
    const currentToken = tokenFromCookie || tokenFromStorage;

    if (
      !currentToken ||
      currentToken === "null" ||
      currentToken === "undefined"
    ) {
      return false;
    }

    if (!isTokenValid(currentToken)) {
      // Token hết hạn, xóa token
      Cookie.remove("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  }, [isTokenValid]);
  // Hàm đăng nhập
  const login = (userData: LoginData) => {
    try {
      const { token: authToken, refreshToken, ...userInfo } = userData;

      // Lưu token
      if (authToken) {
        Cookie.set("token", authToken, { expires: 7 });
        localStorage.setItem("accessToken", authToken);
        setToken(authToken);
      }

      // Lưu refresh token nếu có
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } // Lưu thông tin user
      const userId = userInfo._id || userInfo.id;
      if (!userId) {
        throw new Error("User ID is required");
      }

      const userToStore: User = {
        _id: userId,
        id: userId,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        gender: userInfo.gender,
        dateOfBirth: userInfo.dateOfBirth,
        role: userInfo.role || "user",
        avatar: userInfo.avatar,
        isVerified:
          userInfo.isVerified !== undefined ? userInfo.isVerified : true,
        isActive: userInfo.isActive !== undefined ? userInfo.isActive : true,
      };

      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
    }
  };
  // Hàm đăng xuất
  const logout = useCallback(() => {
    // Xóa tất cả dữ liệu authentication
    Cookie.remove("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Reset state
    setUser(null);
    setToken(null);
  }, []);

  // Hàm cập nhật thông tin user
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };
  // Effect để kiểm tra authentication khi component mount
  useEffect(() => {
    const initAuth = () => {
      setIsLoading(true);

      try {
        if (checkAuth()) {
          // Lấy token
          const tokenFromCookie = Cookie.get("token");
          const tokenFromStorage = localStorage.getItem("accessToken");
          const currentToken = tokenFromCookie || tokenFromStorage;

          if (currentToken) {
            setToken(currentToken);
          }

          // Lấy thông tin user từ localStorage
          const savedUser = localStorage.getItem("user");
          if (savedUser && savedUser !== "null" && savedUser !== "undefined") {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch (error) {
              console.error("Lỗi khi parse user data:", error);
              logout();
            }
          }
        } else {
          // Authentication không hợp lệ, logout
          logout();
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo authentication:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth, logout]);

  // Kiểm tra định kỳ token có còn hợp lệ không
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && !isTokenValid(token)) {
        console.log("Token đã hết hạn, đăng xuất...");
        logout();
      }
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(interval);
  }, [token]);

  return {
    user,
    isAuthenticated: !!user && !!token && checkAuth(),
    isLoading,
    token,
    login,
    logout,
    updateUser,
    checkAuth,
  };
};

export default useAuth;
