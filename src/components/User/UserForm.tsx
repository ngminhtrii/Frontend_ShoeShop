import React, { useState } from "react";

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "NguyenMinhTri",
    email: "ngminhtri2203@gmail.com",
    phone: "0816288946",
    dob: "2003-02-02",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold mb-3 text-gray-800">
        Thông tin tài khoản
      </h2>

      {/* Form */}
      <form className="flex flex-col gap-3">
        <div>
          <label className="block font-bold text-sm text-gray-700">
            Họ tên
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-bold text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-bold text-sm text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-bold text-sm text-gray-700">
            Ngày sinh
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              let value = input.value;
              let parts = value.split("-");
              if (parts[0] && parts[0].length > 4) {
                parts[0] = parts[0].slice(0, 4); // Giới hạn năm tối đa 4 chữ số
                input.value = parts.join("-");
              }
            }}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Nút Cập nhật */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md mt-2 hover:bg-green-700 transition"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UserForm;
