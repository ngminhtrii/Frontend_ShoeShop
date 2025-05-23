import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, cartApi } from "../../services/CartService";
import MainNavbar from "../Navbar/MainNavbar";

interface CartItem {
  _id: string;
  variant: {
    _id: string;
    product: {
      _id: string;
      name: string;
      isActive: boolean;
      slug: string;
    };
    price: number;
    color: {
      _id: string;
      name: string;
      code: string | null;
    };
    isActive: boolean;
    priceFinal: number;
  };
  size: {
    _id: string;
    value: number;
    description: string;
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

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data.cart.cartItems || []);
        setSubTotal(res.data.cart.subTotal || 0);
        setSelectedItems(
          (res.data.cart.cartItems || [])
            .filter((item: any) => item.isSelected)
            .map((item: any) => item._id)
        );
      } catch {
        setCartItems([]);
        setSubTotal(0);
        setSelectedItems([]);
      }
    };
    fetchCart();
  }, []);

  const handleSelectAll = () => {
    if (cartItems.length === 0) return;
    setSelectedItems(
      selectedItems.length === cartItems.length
        ? []
        : cartItems.map((item) => item._id)
    );
  };

  const handleSelectItem = async (id: string) => {
    try {
      await cartApi.toggleCartItem(id);
      // Lấy lại giỏ hàng mới từ server để cập nhật trạng thái isSelected
      const res = await getCartItems();
      setCartItems(res.data.cart.cartItems || []);
      setSubTotal(res.data.cart.subTotal || 0);
      // Cập nhật selectedItems dựa trên isSelected mới nhất
      setSelectedItems(
        (res.data.cart.cartItems || [])
          .filter((item: any) => item.isSelected)
          .map((item: any) => item._id)
      );
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    setSelectedItems((prev) => prev.filter((pid) => pid !== id));
  };

  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <MainNavbar />
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-3 gap-6">
        {/* Bên trái: Giỏ hàng */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Giỏ hàng</h2>
          </div>
          <div className="flex justify-between mb-2">
            <button
              onClick={handleSelectAll}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {cartItems.length === 0 || selectedItems.length === 0
                ? "Chọn tất cả"
                : "Bỏ chọn tất cả"}
            </button>
          </div>
          <div className="grid grid-cols-6 gap-4 font-bold bg-gray-200 p-3 rounded-lg">
            <div className="flex flex-col col-span-2 items-center">
              <span>Sản phẩm</span>
            </div>
            <span className="text-center">Màu</span>
            <span className="text-center">Kích thước</span>
            <span className="text-center">Đơn giá</span>
            <span className="text-center">Số lượng</span>
            <span className="text-center">Thành tiền</span>
          </div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-6 gap-4 items-center border p-4 rounded-lg shadow"
              >
                {/* Ảnh + tên sản phẩm */}
                <div className="flex items-center col-span-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                    className="w-5 h-5 rounded-full accent-blue-500 mr-4"
                  />
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.productName}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {item.variant.product.slug}
                    </div>
                  </div>
                </div>
                {/* Màu */}
                <span className="text-center">{item.variant.color.name}</span>
                {/* Kích thước */}
                <span className="text-center">{item.size.value}</span>
                {/* Đơn giá */}
                <p className="text-center">{item.price.toLocaleString()}đ</p>
                {/* Số lượng có nút tăng giảm */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-blue-400 text-sm hover:text-blue-600"
                  >
                    Xóa
                  </button>
                </div>
                {/* Thành tiền */}
                <p className="text-center font-bold text-red-500">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Thanh toán */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 border rounded-lg shadow">
            <h3 className="text-lg font-bold">Thanh toán</h3>
            <p className="text-xl font-bold text-red-500">
              Tổng cộng: {totalAmount.toLocaleString()}đ
            </p>
            <button
              disabled={selectedItems.length === 0}
              onClick={() => navigate("/order-confirmation")}
              className="bg-green-500 text-white font-bold px-4 py-2 rounded w-full mt-2"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
