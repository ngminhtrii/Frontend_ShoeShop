// src/pages/PaymentStatus.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaList,
} from "react-icons/fa";

interface PaymentStatus {
  status: "loading" | "success" | "failed";
  orderId?: string;
  message?: string;
  transactionId?: string;
  amount?: string;
}

const PaymentStatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "loading",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");
    const transactionStatus = queryParams.get("vnp_TransactionStatus");
    const orderId = queryParams.get("orderId");
    const message = queryParams.get("message");
    const transactionId = queryParams.get("vnp_TransactionNo");
    const amount = queryParams.get("vnp_Amount");

    // Xử lý kết quả từ VNPAY callback
    if (responseCode === "00" && transactionStatus === "00") {
      setPaymentStatus({
        status: "success",
        orderId: orderId || undefined,
        message: message || "Thanh toán thành công",
        transactionId: transactionId || undefined,
        amount: amount ? (parseInt(amount) / 100).toLocaleString() : undefined,
      });
    } else {
      setPaymentStatus({
        status: "failed",
        orderId: orderId || undefined,
        message: message || "Thanh toán thất bại",
        transactionId: transactionId || undefined,
      });
    }
  }, [location.search]);

  const renderContent = () => {
    switch (paymentStatus.status) {
      case "loading":
        return (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-6xl text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-12">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Thanh toán thành công!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <p className="text-green-700 mb-2">
                <strong>Thông báo:</strong> {paymentStatus.message}
              </p>
              {paymentStatus.transactionId && (
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Mã giao dịch:</strong> {paymentStatus.transactionId}
                </p>
              )}
              {paymentStatus.amount && (
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Số tiền:</strong> {paymentStatus.amount} VNĐ
                </p>
              )}
              {paymentStatus.orderId && (
                <p className="text-gray-600 text-sm">
                  <strong>Mã đơn hàng:</strong> {paymentStatus.orderId}
                </p>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang
              được xử lý.
            </p>
          </div>
        );

      case "failed":
        return (
          <div className="text-center py-12">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Thanh toán thất bại!
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <p className="text-red-700 mb-2">
                <strong>Lý do:</strong> {paymentStatus.message}
              </p>
              {paymentStatus.transactionId && (
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Mã giao dịch:</strong> {paymentStatus.transactionId}
                </p>
              )}
              {paymentStatus.orderId && (
                <p className="text-gray-600 text-sm">
                  <strong>Mã đơn hàng:</strong> {paymentStatus.orderId}
                </p>
              )}
            </div>
            <p className="text-gray-600 mb-6">
              Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc
              liên hệ hỗ trợ.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg">
        <div className="p-8">
          {renderContent()}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Về trang chủ
            </Link>

            <Link
              to="/user-manage-order"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaList className="mr-2" />
              Xem đơn hàng
            </Link>

            {paymentStatus.status === "failed" && (
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Quay lại giỏ hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
