// src/utils/axiosIntance.ts
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5005";

// Instance cho các request không cần authentication
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance cho các request cần authentication
export const axiosInstanceAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor cho axiosInstanceAuth - tự động thêm token
axiosInstanceAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request interceptor - Token found:", !!token);
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor cho axiosInstanceAuth - xử lý token hết hạn
axiosInstanceAuth.interceptors.response.use(
  (response) => {
    console.log("Response interceptor - Success:", response.status);
    return response;
  },
  async (error) => {
    console.error(
      "Response interceptor - Error:",
      error.response?.status,
      error.response?.data
    );

    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      console.log("Attempting to refresh token:", !!refreshToken);

      if (
        refreshToken &&
        refreshToken !== "null" &&
        refreshToken !== "undefined"
      ) {
        try {
          // Gọi API refresh token
          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh-token`,
            {
              refreshToken: refreshToken,
            }
          );

          if (response.data.success && response.data.token) {
            const newToken = response.data.token;
            localStorage.setItem("token", newToken);
            console.log("Token refreshed successfully");

            // Retry request gốc với token mới
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstanceAuth(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);

          // Xóa tất cả dữ liệu auth và redirect về login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("refreshToken");

          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");

          // Delay một chút để toast hiển thị trước khi redirect
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);

          return Promise.reject(refreshError);
        }
      } else {
        // Không có refresh token, redirect về login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");

        toast.error("Vui lòng đăng nhập để tiếp tục");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);

        return Promise.reject(error);
      }
    }

    // Nếu là lỗi 403 (forbidden)
    if (error.response?.status === 403) {
      toast.error("Bạn không có quyền thực hiện hành động này");
    }

    // Nếu là lỗi server
    if (error.response?.status >= 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }

    return Promise.reject(error);
  }
);

// Response interceptor cho axiosInstance (không cần auth)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "Public API error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 500) {
      toast.error("Lỗi server, vui lòng thử lại sau");
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceAuth;
