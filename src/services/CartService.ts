import { axiosInstanceAuth } from "../utils/axiosIntance";

export const cartApi = {
  addToCart: (data: { variantId: string; sizeId: string; quantity: number }) =>
    axiosInstanceAuth.post("http://localhost:5005/api/v1/cart/items", data),

  // Toggle chọn sản phẩm trong giỏ hàng
  toggleCartItem: (cartItemId: string) =>
    axiosInstanceAuth.patch(
      `http://localhost:5005/api/v1/cart/items/${cartItemId}/toggle`
    ),

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItemQuantity: (cartItemId: string, quantity: number) =>
    axiosInstanceAuth.put(
      `http://localhost:5005/api/v1/cart/items/${cartItemId}`,
      { quantity }
    ),

  // Xóa sản phẩm khỏi giỏ hàng
  removeCartItem: () =>
    axiosInstanceAuth.delete(`http://localhost:5005/api/v1/cart/items`),
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = () =>
  axiosInstanceAuth.get("http://localhost:5005/api/v1/cart");
