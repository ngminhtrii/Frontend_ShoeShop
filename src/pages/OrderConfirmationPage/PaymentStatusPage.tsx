// src/pages/PaymentStatus.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function PaymentStatusPage() {
  const location = useLocation();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");
    const transactionStatus = queryParams.get("vnp_TransactionStatus");

    // VNPay Response Code: "00" là thành công
    if (responseCode === "00" && transactionStatus === "00") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [location.search]);

  return (
    <div className="p-4 text-center">
      {status === "loading" && <p>Đang kiểm tra trạng thái thanh toán...</p>}
      {status === "success" && (
        <h2 className="text-green-600 text-xl font-bold">
          Thanh toán thành công!
        </h2>
      )}
      {status === "failed" && (
        <h2 className="text-red-600 text-xl font-bold">Thanh toán thất bại!</h2>
      )}
    </div>
  );
}

export default PaymentStatusPage;
