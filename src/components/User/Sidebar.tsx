import React from "react";
import { FaUser, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  return (
    <div className="w-60 bg-white p-6 shadow-md">
      <nav>
        <ul className="space-y-4">
          {/* Mục Thông tin tài khoản */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/user-information")} // Điều hướng đến trang User Information
          >
            <FaUser />
            <span>Thông tin tài khoản</span>
          </li>

          {/* Mục Quản lý đơn hàng */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/user-manage-order")} // Điều hướng đến trang Quản lý đơn hàng
          >
            <FaClipboardList />
            <span>Quản lý đơn hàng</span>
          </li>

          {/* Mục Sản phẩm yêu thích */}
          <li
            className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer hover:text-blue-500"
            onClick={() => navigate("/like-page")} // Điều hướng đến trang Quản lý đơn hàng
          >
            <FaClipboardList />
            <span>Sản phẩm yêu thích</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
