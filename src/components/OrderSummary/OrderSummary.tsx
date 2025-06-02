import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userOrderService } from "../../services/OrderServiceV2";
import { inforApi } from "../../services/InforService";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}

const OrderSummary: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");
  const [note, setNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách địa chỉ từ API user
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await inforApi.getProfile();
        const userAddresses = res.data.user.addresses || [];
        setAddresses(userAddresses);
        // Chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
        const defaultAddr = userAddresses.find((a: Address) => a.isDefault);
        setAddressId(defaultAddr?._id || userAddresses[0]?._id || "");
      } catch {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, []);

  const handleOrder = async () => {
    setLoading(true);
    try {
      const res = await userOrderService.createOrder({
        addressId,
        paymentMethod,
        note,
        couponCode: discountCode || undefined,
      });

      // Nếu chọn VNPAY và có paymentUrl thì chuyển hướng
      if (paymentMethod === "VNPAY" && res.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl;
        return;
      }

      toast.success("Đặt hàng thành công!");
      navigate("/order-success"); // Chuyển hướng đến trang thành công
    } catch (error) {
      toast.error("Đặt hàng thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-lg border mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Xác nhận đơn hàng</h2>
      {/* Chọn địa chỉ giao hàng */}
      <div className="mb-4">
        <label className="font-semibold">Địa chỉ giao hàng:</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
        >
          {addresses.map((addr) => (
            <option key={addr._id} value={addr._id}>
              {addr.fullName} - {addr.phone} | {addr.addressDetail}, {addr.ward}
              , {addr.district}, {addr.province}
              {addr.isDefault ? " [Mặc định]" : ""}
            </option>
          ))}
        </select>
      </div>
      {/* Chọn phương thức thanh toán */}
      <div className="mb-4">
        <label className="font-semibold">Phương thức thanh toán:</label>
        <div className="flex space-x-4 mt-1">
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />{" "}
            Thanh toán khi nhận hàng (COD)
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="VNPAY"
              checked={paymentMethod === "VNPAY"}
              onChange={() => setPaymentMethod("VNPAY")}
            />{" "}
            VNPAY
          </label>
        </div>
      </div>
      {/* Ghi chú */}
      <div className="mb-4">
        <label className="font-semibold">Ghi chú:</label>
        <textarea
          className="w-full border rounded px-3 py-2 mt-1"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú cho đơn hàng..."
        />
      </div>
      {/* Mã giảm giá */}
      <div className="mb-4">
        <label className="font-semibold">Mã giảm giá:</label>
        <input
          className="w-full border rounded px-3 py-2 mt-1"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Nhập mã giảm giá (nếu có)"
        />
      </div>
      <button
        className="w-full bg-green-500 text-white font-bold py-3 mt-6 text-lg rounded"
        onClick={handleOrder}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "XÁC NHẬN"}
      </button>
    </div>
  );
};

export default OrderSummary;
