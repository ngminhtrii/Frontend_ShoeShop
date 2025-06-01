// src/utils/axiosIntance.ts
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5005";

// Axios instance cho các request không cần authentication
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance cho các request cần authentication
export const axiosInstanceAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor cho axiosInstanceAuth - thêm token vào header
axiosInstanceAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor cho axiosInstanceAuth - xử lý lỗi 401
axiosInstanceAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axiosInstance.post(
            "/api/v1/auth/refresh-token",
            {
              refreshToken,
            }
          );

          if (response.data.success && response.data.token) {
            localStorage.setItem("accessToken", response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return axiosInstanceAuth(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }

      // Nếu refresh thất bại, xóa token và chuyển về login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Chỉ hiển thị toast một lần cho lỗi 401
      if (!originalRequest._toastShown) {
        originalRequest._toastShown = true;
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");

        // Delay nhỏ để tránh race condition
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor cho axiosInstance - xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      toast.error("Lỗi máy chủ, vui lòng thử lại sau");
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceAuth;
