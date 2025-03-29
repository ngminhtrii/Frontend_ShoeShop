import { useNavigate } from "react-router-dom";
// @ts-ignore
import "@fontsource/lobster";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

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
            />
          </div>

          <div className="flex items-center justify-between w-3/4 mb-1">
            <button className="bg-black text-white px-4 py-2 rounded-md w-[40%]">
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
            />
          </div>

          <div className="flex items-center justify-between w-3/4 mb-1">
            <button className="bg-black text-white px-4 py-2 rounded-md w-[40%]">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
