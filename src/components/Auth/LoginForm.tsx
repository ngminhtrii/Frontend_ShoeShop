import { useNavigate } from "react-router-dom";
import { useState } from "react";
//import { toast } from "react-toastify";
// @ts-ignore
import "@fontsource/lobster";
import { authenticateApi } from "../../services/AuthenticationService";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await authenticateApi.login({
        email: loginEmail,
        password: loginPassword,
      });
      console.log("🎉 Đăng nhập thành công:", response);
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("🚨 Đăng nhập thất bại:", error);
      alert("Email hoặc mật khẩu không đúng!");
    }
  };

  const handleRegister = async () => {
    console.log("Hàm handleRegister được gọi");
    try {
      const response = await authenticateApi.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      console.log("Phản hồi từ API:", response);

      if (response.status === 201) {
        console.log(
          "🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
        );
        navigate("/otp-verification");
      }
    } catch (error: any) {
      console.error(
        "🚨 Đăng ký thất bại:",
        error.response?.data?.message || "Đăng ký thất bại!"
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Container chính */}
      <div className="flex items-center justify-between w-[1400px] mx-auto relative gap-x-56">
        {/* ĐĂNG NHẬP */}
        <div className="w-[40%] flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl mb-4 w-full text-center">ĐĂNG NHẬP</h2>

          {/* Email */}
          <div className="w-3/4 mb-4">
            <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
              Email
            </label>
            <input
              type="email"
              className="border border-black rounded-md p-2 w-full"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div className="w-3/4 mb-4">
            <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className="border border-black rounded-md p-2 w-full"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between w-3/4 mb-1">
            <button
              className="bg-black text-white px-4 py-2 rounded-md w-[40%]"
              onClick={handleLogin}
            >
              Đăng nhập
            </button>
            <button
              className="text-black text-base ml-2"
              onClick={() => navigate("/forgotpassword")}
            >
              Quên mật khẩu ?
            </button>
          </div>
        </div>

        {/* Đường thẳng và chữ "Or" */}
        <div className="relative flex items-center justify-center h-full">
          <div
            className="bg-black"
            style={{
              width: "2px",
              height: "75vh",
            }}
          ></div>
          <div
            className="absolute bg-white border border-black flex items-center justify-center"
            style={{
              width: "100px",
              height: "63px",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%",
            }}
          >
            <span
              className="text-black text-3xl"
              style={{
                fontFamily: "'Lobster', cursive",
              }}
            >
              Or
            </span>
          </div>
        </div>

        {/* ĐĂNG KÝ */}
        <div className="w-[40%] flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl mb-4 w-full text-center">ĐĂNG KÝ</h2>

          {/* Tên người dùng */}
          <div className="w-3/4 mb-4">
            <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
              Tên người dùng
            </label>
            <input
              type="text"
              className="border border-black rounded-md p-2 w-full"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="w-3/4 mb-4">
            <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
              Email
            </label>
            <input
              type="email"
              className="border border-black rounded-md p-2 w-full"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div className="w-3/4 mb-4">
            <label className="block text-left mb-1 text-base text-gray-500 font-light pl-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className="border border-black rounded-md p-2 w-full"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between w-3/4 mb-1">
            <button
              className="bg-black text-white px-4 py-2 rounded-md w-[40%]"
              onClick={handleRegister}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
