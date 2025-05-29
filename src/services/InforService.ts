import { axiosInstanceAuth } from "../utils/axiosIntance";

export const inforApi = {
  getProfile: () =>
    axiosInstanceAuth.get("http://localhost:5005/api/v1/users/Profile"),

  // Cập nhật avatar (form-data)
  updateAvatar: (formData: FormData) =>
    axiosInstanceAuth.post(
      "http://localhost:5005/api/v1/images/avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    ),

  // Cập nhật địa chỉ
  updateAddress: (addressId: string, data: any) =>
    axiosInstanceAuth.put(
      `http://localhost:5005/api/v1/users/addresses/${addressId}`,
      data
    ),
};
