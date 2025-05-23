import { axiosInstanceAuth } from "../utils/axiosIntance";

export const productLikeApi = {
  // Lấy danh sách sản phẩm yêu thích
  getWishlist: () =>
    axiosInstanceAuth.get("http://localhost:5005/api/v1/users/wishlist"),

  // Thêm sản phẩm vào wishlist
  addToWishlist: (productId: string, variantId: string) =>
    axiosInstanceAuth.post("http://localhost:5005/api/v1/users/wishlist", {
      productId,
      variantId,
    }),

  // Xóa sản phẩm khỏi wishlist (xóa theo productId)
  removeFromWishlist: (wishlistItemId: string) =>
    axiosInstanceAuth.delete(
      `http://localhost:5005/api/v1/users/wishlist/${wishlistItemId}`
    ),
};
