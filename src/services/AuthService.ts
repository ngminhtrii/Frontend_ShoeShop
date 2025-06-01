import { axiosInstance, axiosInstanceAuth } from "../utils/axiosIntance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  phone?: string;
  isAdmin: boolean;
}

export const authApi = {
  // Đăng nhập
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  // Đăng ký
  register: async (data: RegisterRequest) => {
    return axiosInstance.post("/api/v1/auth/register", data);
  },

  // Đăng xuất
  logout: async () => {
    return axiosInstanceAuth.delete("/api/v1/auth/logout");
  },

  // Xác thực OTP
  verifyOtp: async (data: OtpVerificationRequest) => {
    return axiosInstance.post("/api/v1/auth/verify-otp", data);
  },

  // Quên mật khẩu
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return axiosInstance.post("/api/v1/auth/forgot-password", data);
  },

  // Reset mật khẩu
  resetPassword: async (data: ResetPasswordRequest) => {
    return axiosInstance.post("/api/v1/auth/reset-password", data);
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return axiosInstance.post("/api/v1/auth/refresh-token", { refreshToken });
  },

  // Lấy thông tin user hiện tại
  getMe: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token");
    }

    // Verify token bằng cách gọi API protected
    await axiosInstanceAuth.get("/api/v1/auth/sessions");

    // Decode token để lấy thông tin user cơ bản
    // Trong thực tế, backend nên có endpoint /me riêng
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]));

      // Tạo user object cơ bản từ token
      // Lưu ý: Đây chỉ là giải pháp tạm thời, nên có endpoint /me ở backend
      const user = {
        success: true,
        user: {
          _id: payload.id || "temp",
          name: "User", // Sẽ được cập nhật khi có endpoint /me
          email: "user@example.com", // Sẽ được cập nhật khi có endpoint /me
          role: "user",
          isVerified: true,
          isAdmin: false,
        },
      };

      return { data: user };
    } catch (error) {
      console.error("Token decoding error:", error);
      throw new Error("Failed to decode token");
    }
  },

  // Lấy danh sách session
  getSessions: async () => {
    return axiosInstanceAuth.get("/api/v1/auth/sessions");
  },

  // Đăng xuất session cụ thể
  logoutSession: async (sessionId: string) => {
    return axiosInstanceAuth.delete(`/api/v1/auth/sessions/${sessionId}`);
  },

  // Đăng xuất tất cả session khác
  logoutAllOtherSessions: async () => {
    return axiosInstanceAuth.delete("/api/v1/auth/sessions");
  },

  // Đăng xuất tất cả session
  logoutAll: async () => {
    return axiosInstanceAuth.delete("/api/v1/auth/logout-all");
  },
};
