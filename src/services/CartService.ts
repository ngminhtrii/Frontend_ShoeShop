import { axiosInstanceAuth } from "../utils/axiosIntance";

export const cartApi = {
  addToCart: (data: { variantId: string; sizeId: string; quantity: number }) =>
    axiosInstanceAuth.post("http://localhost:5005/api/v1/cart/items", data),
  // Toggle chọn sản phẩm trong giỏ hàng
  toggleCartItem: (cartItemId: string) =>
    axiosInstanceAuth.patch(
      `http://localhost:5005/api/v1/cart/items/${cartItemId}/toggle`
    ),
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = () =>
  axiosInstanceAuth.get("http://localhost:5005/api/v1/cart");
