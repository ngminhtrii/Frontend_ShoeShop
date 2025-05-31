import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "../../services/CartServiceV2";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiLoader,
  FiShoppingCart,
  FiArrowLeft,
} from "react-icons/fi";

interface CartItem {
  _id: string;
  variant: {
    _id: string;
    color: {
      name: string;
      code: string;
    };
    price: number;
    priceFinal: number;
    percentDiscount?: number;
  };
  size: {
    _id: string;
    value: string | number;
  };
  quantity: number;
  price: number;
  productName: string;
  image: string;
  isSelected: boolean;
  isAvailable: boolean;
  unavailableReason?: string;
}

interface Cart {
  _id: string;
  user: string;
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log("🛒 Fetching cart data...");

      const response = await cartService.getCart();
      console.log("🛒 Cart response:", response);

      if (response.data.success) {
        // Backend trả về cart ở response.data.cart (không có nested data)
        const cartData = response.data.cart || null;
        console.log("🛒 Cart data extracted:", cartData);
        setCart(cartData);
      } else {
        console.error("🛒 Cart fetch failed:", response.data.message);
        toast.error(response.data.message || "Không thể tải giỏ hàng");
      }
    } catch (error: any) {
      console.error("🛒 Error fetching cart:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải giỏ hàng";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Preview order
  const previewOrder = async (couponCode?: string) => {
    try {
      console.log("🛒 Previewing order with coupon:", couponCode);

      const response = await cartService.previewBeforeOrder(
        couponCode ? { couponCode } : {}
      );

      console.log("🛒 Preview response:", response);

      if (response.data.success) {
        // Backend trả về preview ở response.data.preview
        setPreviewData(response.data.preview);
        if (couponCode && response.data.preview?.couponApplied) {
          setAppliedCoupon(response.data.preview.couponDetail);
        }
      }
    } catch (error: any) {
      console.error("🛒 Error previewing order:", error);
      if (couponCode) {
        toast.error(
          error.response?.data?.message || "Mã giảm giá không hợp lệ"
        );
        setAppliedCoupon(null);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchCart();
    previewOrder();
  }, [isAuthenticated, navigate]);

  // Update quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      console.log("🛒 Updating quantity:", itemId, newQuantity);

      const response = await cartService.updateCartItemQuantity(itemId, {
        quantity: newQuantity,
      });

      console.log("🛒 Update quantity response:", response);

      if (response.data.success) {
        // Backend trả về cart ở response.data.cart
        const updatedCart = response.data.cart;
        setCart(updatedCart);
        await previewOrder(appliedCoupon?.code);
        toast.success("Đã cập nhật số lượng");
      }
    } catch (error: any) {
      console.error("🛒 Error updating quantity:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        navigate("/login");
        return;
      }
      toast.error(
        error.response?.data?.message || "Không thể cập nhật số lượng"
      );
    } finally {
      setUpdating(null);
    }
  };

  // Toggle item selection
  const toggleItemSelection = async (itemId: string) => {
    try {
      console.log("🛒 Toggling item:", itemId);
      const response = await cartService.toggleCartItem(itemId);

      if (response.data.success) {
        // Backend trả về cart ở response.data.cart
        const updatedCart = response.data.cart;
        setCart(updatedCart);
        await previewOrder(appliedCoupon?.code);
      }
    } catch (error: any) {
      console.error("🛒 Error toggling item:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        navigate("/login");
        return;
      }
      toast.error("Không thể thay đổi trạng thái sản phẩm");
    }
  };

  // Remove selected items
  const removeSelectedItems = async () => {
    const selectedItems = cart?.cartItems?.filter(
      (item: CartItem) => item.isSelected && item.isAvailable
    );
    if (!selectedItems?.length) {
      toast.error("Vui lòng chọn sản phẩm để xóa");
      return;
    }

    try {
      console.log("🛒 Removing selected items");
      const response = await cartService.removeSelectedItems();

      if (response.data.success) {
        // Backend trả về cart ở response.data.cart
        const updatedCart = response.data.cart;
        setCart(updatedCart);
        await previewOrder(appliedCoupon?.code);
        toast.success(`Đã xóa ${selectedItems.length} sản phẩm`);
      }
    } catch (error: any) {
      console.error("🛒 Error removing items:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        navigate("/login");
        return;
      }
      toast.error("Không thể xóa sản phẩm");
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setCouponLoading(true);
    try {
      await previewOrder(couponCode);
      if (previewData?.couponApplied) {
        toast.success("Đã áp dụng mã giảm giá");
      } else {
        toast.error("Mã giảm giá không hợp lệ");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setAppliedCoupon(null);
      toast.error("Mã giảm giá không hợp lệ");
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    setCouponCode("");
    setAppliedCoupon(null);
    await previewOrder();
    toast.success("Đã hủy mã giảm giá");
  };

  // Select all items
  const selectAllItems = async () => {
    if (!cart?.cartItems?.length) return;

    const availableItems = cart.cartItems.filter(
      (item: CartItem) => item.isAvailable
    );

    if (!availableItems.length) return;

    const allSelected = availableItems.every(
      (item: CartItem) => item.isSelected
    );

    try {
      // Toggle từng item
      for (const item of availableItems) {
        if (item.isSelected === allSelected) {
          await cartService.toggleCartItem(item._id);
        }
      }
      await fetchCart();
      await previewOrder(appliedCoupon?.code);
    } catch (error) {
      console.error("🛒 Error selecting all items:", error);
      toast.error("Không thể thay đổi trạng thái sản phẩm");
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    const selectedItems = cart?.cartItems?.filter(
      (item: CartItem) => item.isSelected && item.isAvailable
    );
    if (!selectedItems?.length) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    navigate("/order-confirmation");
  };

  // Helper functions
  const selectedItems =
    cart?.cartItems?.filter(
      (item: CartItem) => item.isSelected && item.isAvailable
    ) || [];

  const availableItems =
    cart?.cartItems?.filter((item: CartItem) => item.isAvailable) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin text-2xl text-blue-600" />
          <span className="text-lg">Đang tải giỏ hàng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft />
              <span>Tiếp tục mua sắm</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <FiShoppingCart />
            <span>Giỏ hàng ({cart?.cartItems?.length || 0})</span>
          </h1>
        </div>

        {!cart?.cartItems?.length ? (
          // Empty cart
          <div className="text-center py-16">
            <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm một số sản phẩm vào giỏ hàng của bạn
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={
                          availableItems.length > 0 &&
                          availableItems.every(
                            (item: CartItem) => item.isSelected
                          )
                        }
                        onChange={selectAllItems}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900">
                        Chọn tất cả ({availableItems.length} sản phẩm)
                      </span>
                    </label>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={removeSelectedItems}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 />
                        <span>Xóa đã chọn</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cart.cartItems.map((item: CartItem) => (
                    <div key={item._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.isSelected || false}
                          onChange={() => toggleItemSelection(item._id)}
                          disabled={!item.isAvailable}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-2"
                        />

                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.productName || "Product"}
                            className="w-20 h-20 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {item.productName || "Tên sản phẩm"}
                              </h3>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                <span>
                                  Màu: {item.variant?.color?.name || "N/A"}
                                </span>
                                <span>Size: {item.size?.value || "N/A"}</span>
                              </div>
                              {!item.isAvailable && (
                                <p className="mt-1 text-sm text-red-600">
                                  {item.unavailableReason ||
                                    "Sản phẩm không có sẵn"}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-lg font-semibold text-gray-900">
                                {(item.price || 0).toLocaleString()}đ
                              </div>
                              {item.variant?.price !==
                                item.variant?.priceFinal && (
                                <div className="text-sm text-gray-500 line-through">
                                  {(item.variant?.price || 0).toLocaleString()}đ
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updating === item._id ||
                                  !item.isAvailable
                                }
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>

                              <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                                {updating === item._id ? (
                                  <FiLoader className="animate-spin mx-auto" />
                                ) : (
                                  item.quantity || 1
                                )}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item._id, item.quantity + 1)
                                }
                                disabled={
                                  updating === item._id || !item.isAvailable
                                }
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-lg font-semibold text-blue-600">
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toLocaleString()}
                              đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Tóm tắt đơn hàng
                  </h2>

                  {/* Coupon Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiTag className="text-green-600" />
                      <span className="font-medium text-gray-900">
                        Mã giảm giá
                      </span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <div className="font-medium text-green-800">
                            {appliedCoupon.code}
                          </div>
                          <div className="text-sm text-green-600">
                            Giảm{" "}
                            {appliedCoupon.type === "percentage"
                              ? `${appliedCoupon.value}%`
                              : `${appliedCoupon.value.toLocaleString()}đ`}
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Nhập mã giảm giá"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={couponLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {couponLoading ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            "Áp dụng"
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  {previewData && (
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>
                          Tạm tính ({previewData.totalQuantity || 0} sản phẩm)
                        </span>
                        <span>
                          {(previewData.subTotal || 0).toLocaleString()}đ
                        </span>
                      </div>

                      {(previewData.discount || 0) > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá</span>
                          <span>
                            -{(previewData.discount || 0).toLocaleString()}đ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center space-x-1">
                          <FiTruck />
                          <span>Phí vận chuyển</span>
                        </span>
                        <span>
                          {(previewData.shippingFee || 0).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {previewData && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">
                          {(previewData.totalPrice || 0).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={proceedToCheckout}
                    disabled={selectedItems.length === 0}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Thanh toán ({selectedItems.length} sản phẩm)
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-1">
                      <span>🛡️</span>
                      <span>Thanh toán an toàn và bảo mật</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
