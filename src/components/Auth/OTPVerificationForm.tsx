import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const OTPVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // Email người dùng
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5005/api/v1/auth/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      if (response.data.success) {
        toast.success("Xác thực thành công!");
        // Điều hướng đến trang tiếp theo (ví dụ: trang đăng nhập)
        window.location.href = "/login";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xác thực thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] flex items-center justify-center h-screen bg-white">
      <div className="w-[35%] p-8 bg-white rounded-lg flex flex-col items-center justify-center h-auto">
        <h2 className="text-2xl mb-6 text-center">XÁC NHẬN ĐĂNG KÝ</h2>

        {/* Email */}
        <div className="w-full mb-4">
          <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
            Email
          </label>
          <input
            type="email"
            className="border border-black rounded-md p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mã xác nhận */}
        <div className="w-full mb-8">
          <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
            Mã xác nhận
          </label>
          <input
            type="text"
            className="border border-black rounded-md p-2 w-full"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between w-full mt-6">
          <button
            className="bg-black text-white px-4 py-2 rounded-md w-[48%] transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Xác nhận"}
          </button>
          <button
            className="text-black text-base transition-all duration-300 hover:text-gray-600 hover:scale-105"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OTPVerificationForm;
