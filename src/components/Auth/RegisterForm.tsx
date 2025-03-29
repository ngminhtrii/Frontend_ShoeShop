import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập tên người dùng"
          className="w-full border border-gray-300 p-3 text-lg rounded outline-none"
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Nhập email"
          className="w-full border border-gray-300 p-3 text-lg rounded outline-none"
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full border border-gray-300 p-3 text-lg rounded outline-none"
        />
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="w-full border border-gray-300 p-3 text-lg rounded outline-none"
        />
      </div>

      <button 
        className="w-full bg-green-500 text-white py-3 text-xl font-bold rounded"
        onClick={() => navigate("/otp-verification")}
      >
        Đăng ký
      </button>
    </div>
  );
};

export default RegisterForm;
