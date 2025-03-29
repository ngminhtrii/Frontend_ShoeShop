import React, { useState } from "react";
import HinhQuangCao from "../../assets/HinhQuangCaoDoc.jpg";
import { useNavigate } from "react-router-dom";


interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Sản phẩm A", price: 1000000, quantity: 1, image: "sp-a.jpg" },
    { id: 2, name: "Sản phẩm B", price: 2000000, quantity: 1, image: "sp-b.jpg" },
    { id: 3, name: "Sản phẩm C", price: 3000000, quantity: 1, image: "sp-c.jpg" },
    { id: 4, name: "Sản phẩm D", price: 4000000, quantity: 1, image: "sp-d.jpg" },
  ]);

  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (products.length === 0) return; // Không làm gì nếu giỏ hàng rỗng
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map((p) => p.id)
    );
  };
  

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id]
    );
  };

  const handleClearCart = () => {
    setSelectedProducts([]); // Reset danh sách sản phẩm đã chọn trước
    setProducts([]); // Xóa toàn bộ sản phẩm
    };

  const handleQuantityChange = (id: number, delta: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    setSelectedProducts((prevSelected) => prevSelected.filter((pid) => pid !== id));
  };  

  const totalAmount = products
    .filter((p) => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-3 gap-6">
  {/* Bên trái: Giỏ hàng */}
  <div className="col-span-2">
    {/* Header giỏ hàng */}
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold">Giỏ hàng</h2>
    </div>
    <div className="flex justify-between mb-2">
      <button
        onClick={handleSelectAll}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {products.length === 0 || selectedProducts.length === 0
          ? "Chọn tất cả"
          : "Bỏ chọn tất cả"}
      </button>

      <button
        onClick={handleClearCart}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Xóa tất cả
      </button>
    </div>

    {/* Tiêu đề cột */}
    <div className="grid grid-cols-5 gap-4 font-bold bg-gray-200 p-3 rounded-lg">
      <div className="flex flex-col col-span-2 items-center">
        <span>Sản phẩm</span>
      </div>
      <span className="text-center">Đơn giá</span>
      <span className="text-center">Số lượng</span>
      <span className="text-center">Thành tiền</span>
    </div>

    {/* Danh sách sản phẩm */}
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-5 gap-4 items-center border p-4 rounded-lg shadow"
        >
          {/* Ảnh + tên sản phẩm */}
          <div className="flex items-center col-span-2">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={() => handleSelectProduct(product.id)}
              className="w-5 h-5 rounded-full accent-blue-500 mr-4"
            />
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </div>

          {/* Đơn giá */}
          <p className="text-center">{product.price.toLocaleString()}đ</p>

          {/* Số lượng có nút tăng giảm */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(product.id, -1)}
                className="bg-gray-300 text-black px-2 py-1 rounded"
              >
                -
              </button>
              <span className="text-center">{product.quantity}</span>
              <button
                onClick={() => handleQuantityChange(product.id, 1)}
                className="bg-gray-300 text-black px-2 py-1 rounded"
              >
                +
              </button>
            </div>
            {/* Nút Xóa - nhỏ hơn */}
            <button
              onClick={() => handleRemoveProduct(product.id)}
              className="text-blue-400 text-sm hover:text-blue-600"
            >
              Xóa
            </button>
          </div>

          {/* Thành tiền */}
          <p className="text-center font-bold text-red-500">
            {(product.price * product.quantity).toLocaleString()}đ
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Bên phải: Thanh toán + Hình quảng cáo */}
  <div className="flex flex-col space-y-4">
    {/* Thanh toán */}
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-bold">Thanh toán</h3>
      <p className="text-xl font-bold text-red-500">
        Tổng cộng: {totalAmount.toLocaleString()}đ
      </p>
      <button
        disabled={selectedProducts.length === 0}
        onClick={() => navigate("/order-confirmation")}
        className="bg-green-500 text-white font-bold px-4 py-2 rounded w-full mt-2"
      >
        Đặt hàng
      </button>
    </div>

    {/* Hình quảng cáo */}
    <img
      src={HinhQuangCao}
      alt="Quảng cáo"
      style={{ width: "100%", height: "475px", objectFit: "cover" }}
      className="rounded-lg shadow-lg"
    />
  </div>
</div>

  );
};

export default Cart;
