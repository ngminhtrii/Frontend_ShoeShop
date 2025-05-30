import React, { useState, useEffect } from "react";
import { LuScanEye } from "react-icons/lu";
import { orderApi } from "../../../services/OrderService";
import CancelRequestList from "./CancelRequestList";

interface Order {
  _id: string;
  orderCode: string;
  customerName: string;
  address: string;
  phone: string;
  price: string;
  paymentStatus: string;
  paymentMethod?: string;
  orderStatus: string;
  orderStatusRaw?: string;
}

const ListOrderPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCancelRequests, setShowCancelRequests] = useState(false);

  // Lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllAdminOrders();
      setOrders(
        (res.data.orders || []).map((o: any) => ({
          _id: o._id,
          orderCode: o.code || o.orderCode || o._id,
          customerName: o.user?.name || o.shippingAddress?.name || "",
          address: [
            o.shippingAddress?.detail,
            o.shippingAddress?.ward,
            o.shippingAddress?.district,
            o.shippingAddress?.province,
          ]
            .filter(Boolean)
            .join(", "),
          phone: o.shippingAddress?.phone || o.user?.phone || "",
          price: o.totalAfterDiscountAndShipping
            ? o.totalAfterDiscountAndShipping.toLocaleString("vi-VN") + " (VND)"
            : "",
          paymentStatus:
            o.payment?.paymentStatus === "paid"
              ? "Đã thanh toán"
              : "Chưa thanh toán",
          paymentMethod:
            o.payment?.method === "VNPAY"
              ? "VNPAY"
              : o.payment?.method === "COD"
              ? "Thanh toán khi nhận hàng"
              : o.payment?.method || "",
          orderStatus:
            o.status === "pending"
              ? "Chờ xác nhận"
              : o.status === "confirmed"
              ? "Đã xác nhận"
              : o.status === "shipping"
              ? "Đang giao hàng"
              : o.status === "delivered"
              ? "Giao hàng thành công"
              : o.status === "cancelled"
              ? "Đã hủy"
              : o.status || "",
          orderStatusRaw: o.status,
        }))
      );
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = async (order: Order) => {
    try {
      const res = await orderApi.getAdminOrderById(order._id);
      const o = res.data.data || res.data.order;
      setSelectedOrder({
        _id: o._id,
        orderCode: o.code || o.orderCode || o._id,
        customerName: o.user?.name || o.shippingAddress?.name || "",
        address: [
          o.shippingAddress?.detail,
          o.shippingAddress?.ward,
          o.shippingAddress?.district,
          o.shippingAddress?.province,
        ]
          .filter(Boolean)
          .join(", "),
        phone: o.shippingAddress?.phone || o.user?.phone || "",
        price: o.totalAfterDiscountAndShipping
          ? o.totalAfterDiscountAndShipping.toLocaleString("vi-VN") + " (VND)"
          : "",
        paymentStatus:
          o.payment?.paymentStatus === "paid"
            ? "Đã thanh toán"
            : "Chưa thanh toán",
        paymentMethod:
          o.payment?.method === "VNPAY"
            ? "VNPAY"
            : o.payment?.method === "COD"
            ? "Thanh toán khi nhận hàng"
            : o.payment?.method || "",
        orderStatus:
          o.status === "pending"
            ? "Chờ xác nhận"
            : o.status === "confirmed"
            ? "Đã xác nhận"
            : o.status === "shipping"
            ? "Đang giao hàng"
            : o.status === "delivered"
            ? "Giao hàng thành công"
            : o.status === "cancelled"
            ? "Đã hủy"
            : o.status || "",
        orderStatusRaw: o.status,
      });
    } catch {
      setSelectedOrder(order);
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handlePaymentFilter = (status: string) => {
    setPaymentFilter(status);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (paymentFilter ? order.paymentStatus === paymentFilter : true) &&
      (statusFilter ? order.orderStatus === statusFilter : true)
    );
  });

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await orderApi.updateOrderStatus(orderId, { status });
    fetchOrders();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm mã đơn hàng hoặc tên khách hàng"
          className="px-4 py-2 w-1/3 border rounded-md"
        />
        <button
          className="ml-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          onClick={() => setShowCancelRequests((v) => !v)}
        >
          {showCancelRequests ? "Ẩn yêu cầu hủy đơn" : "Xem yêu cầu hủy đơn"}
        </button>
      </div>

      {showCancelRequests && (
        <div className="mb-8">
          <CancelRequestList />
        </div>
      )}

      {/* Orders Table */}
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mã đơn hàng
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Khách hàng
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Địa chỉ
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Số điện thoại
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Giá
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Thanh toán
              <select
                className="ml-2 py-1 px-2 border rounded-md"
                onChange={(e) => handlePaymentFilter(e.target.value)}
                value={paymentFilter}
              >
                <option value="">Tất cả</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Chưa thanh toán">Chưa thanh toán</option>
              </select>
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Phương thức thanh toán
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Trạng thái
              <select
                className="ml-2 py-1 px-2 border rounded-md"
                onChange={(e) => handleStatusFilter(e.target.value)}
                value={statusFilter}
              >
                <option value="">Tất cả</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Giao hàng thành công">
                  Giao hàng thành công
                </option>
                <option value="Đã hủy">Đã hủy</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
              </select>
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                Đang tải...
              </td>
            </tr>
          ) : filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                Không có đơn hàng
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm">
                  {order.orderCode}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.customerName}
                </td>
                <td className="py-2 px-4 border-b text-sm">{order.address}</td>
                <td className="py-2 px-4 border-b text-sm">{order.phone}</td>
                <td className="py-2 px-4 border-b text-sm">{order.price}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.paymentStatus}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.paymentMethod}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.orderStatus}
                </td>
                <td className="py-2 px-4 border-b text-sm space-x-2">
                  <LuScanEye
                    className="inline-block mr-2 text-2xl hover:text-green-600 cursor-pointer transition duration-300 ease-in-out"
                    onClick={() => handleViewDetails(order)}
                  />
                  {/* Nút cập nhật trạng thái đơn hàng */}
                  <select
                    className="py-1 px-2 border rounded-md"
                    value=""
                    onChange={(e) => {
                      let statusRaw = e.target.value;
                      if (statusRaw)
                        handleUpdateOrderStatus(order._id, statusRaw);
                    }}
                  >
                    <option value="">Chọn trạng thái</option>
                    {order.orderStatusRaw === "pending" && (
                      <option value="confirmed">Đã xác nhận</option>
                    )}
                    {order.orderStatusRaw === "confirmed" && (
                      <option value="shipping">Đang giao hàng</option>
                    )}
                    {order.orderStatusRaw === "shipping" && (
                      <option value="delivered">Giao hàng thành công</option>
                    )}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h3>
            <p>
              <strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}
            </p>
            <p>
              <strong>Khách hàng:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Giá:</strong> {selectedOrder.price}
            </p>
            <p>
              <strong>Thanh toán:</strong> {selectedOrder.paymentStatus}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedOrder.orderStatus}
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrderPage;
