import React from "react";
import { FaUser, FaClipboardList, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authenticateApi } from "../../services/AuthenticationService";
import Cookie from "js-cookie";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authenticateApi.logout();
      localStorage.removeItem("accessToken");
      Cookie.remove("token");
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  return (
    <div className="w-60 bg-white p-6 shadow-md">
      <nav>
        <ul className="space-y-4">
          {/* Mục Thông tin tài khoản */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/user-information")}
          >
            <FaUser />
            <span>Thông tin tài khoản</span>
          </li>

          {/* Mục Quản lý đơn hàng */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/user-manage-order")}
          >
            <FaClipboardList />
            <span>Quản lý đơn hàng</span>
          </li>

          {/* Mục Sản phẩm yêu thích */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/like-page")}
          >
            <FaHeart />
            <span>Sản phẩm yêu thích</span>
          </li>

          {/* Mục Đăng xuất */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
