import { axiosInstanceAuth } from "../utils/axiosIntance";

export const orderApi = {
  createOrder: (data: {
    addressId: string;
    paymentMethod: string;
    note?: string;
    couponCode?: string;
  }) => axiosInstanceAuth.post("http://localhost:5005/api/v1/orders", data),

  getOrders: (params: { page?: number; limit?: number; status?: string }) =>
    axiosInstanceAuth.get("http://localhost:5005/api/v1/orders", { params }),
};
