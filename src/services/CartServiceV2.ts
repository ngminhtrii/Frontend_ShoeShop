import { axiosInstanceAuth } from "../utils/axiosIntance";

export interface CartItem {
  _id: string;
  variant: {
    _id: string;
    color: {
      _id: string;
      name: string;
      code: string;
      type?: string;
      colors?: string[];
    };
    product: {
      _id: string;
      name: string;
      slug: string;
      images: Array<{
        url: string;
        public_id: string;
        isMain: boolean;
        displayOrder: number;
      }>;
    };
    price: number;
    priceFinal: number;
    percentDiscount?: number;
    isActive: boolean;
    imagesvariant?: Array<{
      url: string;
      public_id: string;
      isMain: boolean;
      displayOrder: number;
    }>;
  };
  size: {
    _id: string;
    value: number;
    description?: string;
  };
  quantity: number;
  price: number;
  productName: string;
  image: string;
  isAvailable: boolean;
  isSelected: boolean;
  unavailableReason: string;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  cartItems: CartItem[];
  totalItems: number;
  subTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    cart: Cart;
  };
}

export interface AddToCartData {
  variantId: string;
  sizeId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface PreviewOrderData {
  couponCode?: string;
}

export interface PreviewOrderResponse {
  success: boolean;
  message: string;
  preview: {
    items: number;
    itemsDetail: Array<{
      productId: string;
      productName: string;
      variantId: string;
      color: {
        name: string;
        type: string;
        code: string;
      };
      sizeId: string;
      sizeValue: number;
      sizeDescription?: string;
      price: number;
      quantity: number;
      image: string;
      totalPrice: number;
    }>;
    totalQuantity: number;
    subTotal: number;
    discount: number;
    shippingFee: number;
    totalPrice: number;
    couponApplied: boolean;
    couponDetail?: {
      code: string;
      type: string;
      value: number;
      maxDiscount?: number;
    };
  };
}

export const cartService = {
  // Lấy giỏ hàng hiện tại
  getCart: (): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.get("/api/v1/cart"),

  // Thêm sản phẩm vào giỏ hàng
  addToCart: (data: AddToCartData): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.post("/api/v1/cart/items", data),

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItemQuantity: (
    itemId: string,
    data: UpdateCartItemData
  ): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.put(`/api/v1/cart/items/${itemId}`, data),

  // Toggle chọn sản phẩm trong giỏ hàng
  toggleCartItem: (itemId: string): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.patch(`/api/v1/cart/items/${itemId}/toggle`),

  // Xóa sản phẩm đã chọn khỏi giỏ hàng
  removeSelectedItems: (): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.delete("/api/v1/cart/items"),

  // Xóa toàn bộ giỏ hàng
  clearCart: (): Promise<{ data: CartResponse }> =>
    axiosInstanceAuth.delete("/api/v1/cart"),

  // Xem trước đơn hàng trước khi tạo
  previewBeforeOrder: (
    data: PreviewOrderData
  ): Promise<{ data: PreviewOrderResponse }> =>
    axiosInstanceAuth.post("/api/v1/cart/preview-before-order", data),
};

export default cartService;
