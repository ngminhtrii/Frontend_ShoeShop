import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/User/Sidebar";
import OrderCard from "../../../components/User/OrderCard";
import { orderApi } from "../../../services/OrderService";

const UserManageOrder: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getOrders({
          page: 1,
          limit: 15,
        });
        setOrders(res.data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>
          {loading ? (
            <div>Đang tải...</div>
          ) : orders.length === 0 ? (
            <div>Không có đơn hàng nào.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md p-6 rounded-lg mb-8"
              >
                <h2 className="text-lg font-semibold mb-4">
                  Mã đơn hàng: {order.code || order._id}
                </h2>
                <p className="text-gray-700">
                  Người đặt hàng: {order.shippingAddress?.name}
                </p>
                <p className="text-gray-700">
                  SĐT: {order.shippingAddress?.phone}
                </p>
                <p className="text-gray-700">
                  Địa chỉ giao hàng: {order.shippingAddress?.detail},{" "}
                  {order.shippingAddress?.ward},{" "}
                  {order.shippingAddress?.district},{" "}
                  {order.shippingAddress?.province}
                </p>
                <p className="text-gray-700">Trạng thái: {order.status}</p>
                <p className="text-gray-700">
                  Hình thức thanh toán: {order.payment?.method}
                </p>
                <p className="text-gray-700">
                  Khuyến mãi:{" "}
                  {order.couponDetail?.code
                    ? `${
                        order.couponDetail.code
                      } (-${order.discount?.toLocaleString()}đ)`
                    : "Không"}
                </p>
                <p className="text-gray-700">
                  Thời gian: {new Date(order.createdAt).toLocaleString()}
                </p>
                {/* Danh sách sản phẩm */}
                <div className="mt-4">
                  {order.orderItems.map((item: any, idx: number) => (
                    <div key={item._id || idx}>
                      <OrderCard
                        name={item.productName}
                        quantity={item.quantity}
                        price={item.price}
                        image={item.image}
                        size={item.size?.value}
                        color={item.variant?.color?.name}
                      />
                      {idx < order.orderItems.length - 1 && (
                        <hr className="my-4 border-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
                {/* Tổng cộng */}
                <p className="text-gray-700 font-bold mt-4">
                  Tổng cộng:{" "}
                  {order.totalAfterDiscountAndShipping?.toLocaleString() ||
                    order.subTotal?.toLocaleString()}
                  đ
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManageOrder;
