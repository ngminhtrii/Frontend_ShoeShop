import { axiosInstance, axiosInstanceAuth } from "../utils/axiosIntance";

export const authenticateApi = {
  login: async (data: { email: string; password: string }) => {
    return axiosInstance.post(`http://localhost:5005/api/v1/auth/login`, data);
  },

  register: async (data: { name: string; email: string; password: string }) => {
    return axiosInstance.post(
      `http://localhost:5005/api/v1/auth/register`,
      data
    );
  },

  logout: async (data?: { refreshToken?: string }) => {
    return axiosInstanceAuth.delete(
      `http://localhost:5005/api/v1/auth/logout`,
      {
        data,
      }
    );
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    return axiosInstance.post(
      `http://localhost:5005/api/v1/auth/verify-otp`,
      data
    );
  },
};
