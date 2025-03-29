import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const OrderSummary: React.FC = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const products: Product[] = [
    { id: 1, name: "Sản phẩm A", price: 1000000, quantity: 1, image: "/sp.png" },
    { id: 2, name: "Sản phẩm B", price: 1000000, quantity: 1, image: "/sp.png" },
  ];

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const discount = 1000000;
  const finalAmount = totalAmount - discount;

  return (
    <div className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-3xl font-bold text-center text-red-600 uppercase mb-6">
        Xác nhận đơn hàng
      </h2>

      <h3 className="text-lg font-bold mb-2 text-red-600">Sản phẩm:</h3>
      <div className="space-y-4 mb-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between border p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">Đơn giá: {product.price.toLocaleString()}đ</p>
                <p className="text-gray-600">Số lượng: {product.quantity}</p>
              </div>
            </div>
            <p className="font-bold text-red-500">{(product.price * product.quantity).toLocaleString()}đ</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        placeholder="Mã giảm giá"
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <div className="border-t pt-4">
        <p className="flex justify-between text-lg">
          <span>Thành tiền:</span>
          <span>{totalAmount.toLocaleString()}đ</span>
        </p>
        <p className="flex justify-between text-lg text-red-500">
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString()}đ</span>
        </p>
        <p className="flex justify-between text-lg font-bold text-blue-600">
          <span>Tổng cộng:</span>
          <span>{finalAmount.toLocaleString()}đ</span>
        </p>
      </div>

      <h3 className="text-lg font-bold mt-6 mb-2 text-red-600">Thông tin nhận hàng:</h3>
      <input
        type="text"
        placeholder="Họ và tên"
        value={customerInfo.name}
        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <input
        type="text"
        placeholder="Địa chỉ nhận hàng"
        value={customerInfo.address}
        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        value={customerInfo.phone}
        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-6"
      />

      <h3 className="text-lg font-bold mb-2 text-red-600">Phương thức thanh toán:</h3>
      <div className="flex space-x-4 items-center">
        <input type="radio" name="payment" className="w-5 h-5" />
        <span className="text-lg">Thanh toán khi nhận hàng</span>
        <img src="image/vnpay.jpg" alt="VNPAY" className="h-11" />
        <img src="image/mastercard.png" alt="MasterCard" className="h-11" />
        <img src="image/momo.jpg" alt="MoMo" className="h-11" />
      </div>

      <button className="w-full bg-green-500 text-white font-bold py-3 mt-6 text-lg rounded">
        XÁC NHẬN
      </button>
    </div>
  );
};

export default OrderSummary;
