import { axiosInstance } from "../utils/axiosIntance";

export const authenticateApi = {
  login: async (data: { email: string; password: string }) => {
    return axiosInstance.post(`/api/v1/auth/login`, data);
  },

  register: async (data: { name: string; email: string; password: string }) => {
    return axiosInstance.post(`/api/v1/auth/register`, data);
  },

  logout: async () => {
    return axiosInstance.get(`/api/v1/auth/logout`);
  },
  verifyOtp: async (data: { email: string; otp: string }) => {
    return axiosInstance.post(`/api/v1/auth/verify-otp`, data);
  },
};
