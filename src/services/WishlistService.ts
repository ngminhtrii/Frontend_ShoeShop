import { axiosInstanceAuth } from "../utils/axiosIntance";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: Array<{
    url: string;
    public_id: string;
    isMain: boolean;
    displayOrder: number;
  }>;
  brand: {
    _id: string;
    name: string;
    logo?: {
      url: string;
      public_id: string;
    };
  };
  category: {
    _id: string;
    name: string;
  };
  rating: number;
  numReviews: number;
  totalQuantity: number;
  stockStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variantSummary?: {
    priceRange: {
      min: number;
      max: number;
      isSinglePrice: boolean;
    };
    discount: {
      hasDiscount: boolean;
      maxPercent: number;
    };
  };
}

export interface WishlistItem {
  _id: string;
  product: WishlistProduct;
  variant?: any;
  addedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface WishlistQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export const wishlistService = {
  // Lấy danh sách wishlist của user
  getUserWishlist: (
    params: WishlistQuery = {}
  ): Promise<{ data: ApiResponse<{ wishlist: WishlistItem[] }> }> =>
    axiosInstanceAuth.get("/api/v1/users/wishlist", { params }),

  // Thêm sản phẩm vào wishlist
  addToWishlist: (
    productId: string,
    variantId?: string
  ): Promise<{ data: ApiResponse }> => {
    const data = { productId };
    if (variantId) {
      Object.assign(data, { variantId });
    }
    return axiosInstanceAuth.post("/api/v1/users/wishlist", data);
  },

  // Xóa sản phẩm khỏi wishlist
  removeFromWishlist: (
    wishlistItemId: string
  ): Promise<{ data: ApiResponse }> =>
    axiosInstanceAuth.delete(`/api/v1/users/wishlist/${wishlistItemId}`),
  // Kiểm tra sản phẩm có trong wishlist hay không
  checkInWishlist: (
    productId: string
  ): Promise<{ data: ApiResponse<{ inWishlist: boolean }> }> =>
    axiosInstanceAuth.get(`/api/v1/users/wishlist/check/${productId}`),
};

export default wishlistService;
