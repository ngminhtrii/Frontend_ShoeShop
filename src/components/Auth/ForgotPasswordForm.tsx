import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isHuman, setIsHuman] = useState(false);

  const handleForgotPassword = async () => {
    if (!email || !isHuman) return;

    try {
      const response = await axios.post(
        "http://localhost:5005/api/v1/auth/forgot-password",
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("OTP đã được gửi đến email của bạn!");
        navigate("/otp-verification", { state: { email } });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể gửi OTP!");
    }
  };

  return (
    <div className="w-[100%] flex items-center justify-center h-screen bg-white">
      <div className="w-[35%] p-8 bg-white rounded-lg flex flex-col items-center justify-center h-auto">
        <h2 className="text-2xl mb-6 text-center">LẤY LẠI MẬT KHẨU</h2>

        {/* Email */}
        <div className="w-full mb-8">
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

        {/* Tôi không phải là người máy */}
        <div className="w-[40%] mb-4 flex items-center border border-black rounded-md p-2 bg-gray-100 justify-start self-start">
          <input
            type="checkbox"
            id="notRobot"
            className="mr-2"
            checked={isHuman}
            onChange={(e) => setIsHuman(e.target.checked)}
          />
          <label
            htmlFor="notRobot"
            className="text-base text-gray-500 font-light"
          >
            Tôi không phải là người máy
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-start w-full mt-6">
          <button
            className="bg-black text-white px-4 py-2 rounded-md w-[48%] transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg"
            onClick={handleForgotPassword}
          >
            Lấy lại mật khẩu
          </button>
          <button
            className="text-black text-base ml-[5cm] transition-all duration-300 hover:text-gray-600 hover:scale-105"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
