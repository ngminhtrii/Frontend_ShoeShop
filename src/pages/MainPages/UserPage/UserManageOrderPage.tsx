import React from "react";
import Sidebar from "../../../components/User/Sidebar";
import OrderCard from "../../../components/User/OrderCard"; // Component hiển thị đơn hàng

// Dữ liệu mẫu của đơn hàng
const orderProducts = [
  { name: "Sản phẩm A", quantity: 2, price: 50000 },
  { name: "Sản phẩm B", quantity: 1, price: 75000 },
];

const UserManageOrder: React.FC = () => {
  // Tính tổng tiền của đơn hàng
  const totalPrice = orderProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header 
      <MainNavbar />*/}

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

          {/* Danh sách đơn hàng */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">ID Đơn hàng: #1</h2>
            <p className="text-gray-700">Người đặt hàng: Trần Khải Hoàn</p>
            <p className="text-gray-700">Trạng thái: Đang chuẩn bị</p>
            <p className="text-gray-700">Địa chỉ giao hàng: Việt Nam</p>
            <p className="text-gray-700">Phương thức giao hàng: Shipper giao</p>
            <p className="text-gray-700">Phí giao hàng: 10000đ</p>
            <p className="text-gray-700">Hình thức thanh toán: VNPAY</p>
            <p className="text-gray-700">Khuyến mãi: Không</p>
            <p className="text-gray-700">Thời gian: 25/02/2025</p>

            {/* Danh sách sản phẩm */}
            {orderProducts.map((product, index) => (
              <div key={index}>
                <OrderCard {...product} />
                {index < orderProducts.length - 1 && (
                  <hr className="my-4 border-gray-300" />
                )}
              </div>
            ))}

            {/* Tổng cộng */}
            <p className="text-gray-700 font-bold mt-4">
              Tổng cộng: {totalPrice.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManageOrder;
