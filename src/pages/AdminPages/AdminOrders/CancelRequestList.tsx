import React, { useEffect, useState } from "react";
import { orderApi } from "../../../services/OrderService";

interface CancelRequest {
  _id: string;
  order: {
    _id: string;
    code: string;
    status: string;
    totalAfterDiscountAndShipping: number;
    user: { name: string; email: string };
    payment: { method: string; paymentStatus: string };
  };
  user: {
    name: string;
    email: string;
    phone: string;
    avatar?: { url: string };
  };
  reason: string;
  status: string;
  adminResponse: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

const CancelRequestList: React.FC = () => {
  const [requests, setRequests] = useState<CancelRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getCancelRequests();
      setRequests(res.data.cancelRequests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await orderApi.handleCancelRequest(id, {
      status: "approved",
      adminResponse: "Chấp nhận cho phép hủy đơn",
    });
    fetchRequests();
  };

  const handleReject = async (id: string) => {
    await orderApi.handleCancelRequest(id, {
      status: "rejected",
      adminResponse: "Từ chối yêu cầu hủy đơn",
    });
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách yêu cầu hủy đơn</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mã đơn
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Khách hàng
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Lý do hủy
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Trạng thái
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Phản hồi admin
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Đang tải...
              </td>
            </tr>
          ) : requests.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có yêu cầu
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm">{req.order.code}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {req.user.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {req.user.phone}
                  </span>
                </td>
                <td className="py-2 px-4 border-b text-sm">{req.reason}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {req.status === "pending"
                    ? "Chờ duyệt"
                    : req.status === "approved"
                    ? "Đã chấp nhận"
                    : req.status === "rejected"
                    ? "Đã từ chối"
                    : req.status}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {req.adminResponse}
                </td>
                <td className="py-2 px-4 border-b text-sm space-x-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => handleApprove(req._id)}
                      >
                        Duyệt
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleReject(req._id)}
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {req.status !== "pending" && <span>-</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CancelRequestList;
