import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inforApi } from "../../services/InforService";
import Cookie from "js-cookie";

interface Address {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
  _id: string;
}

interface User {
  avatar?: { url: string };
  name: string;
  email: string;
  addresses: Address[];
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("accessToken") || Cookie.get("token");
    if (!token || token === "null" || token === "undefined") {
      navigate("/login");
      return;
    }
    // Lấy thông tin user
    const fetchProfile = async () => {
      try {
        const res = await inforApi.getProfile();
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-gray-800">
        Thông tin tài khoản
      </h2>
      <div className="flex flex-col items-center mb-4">
        <img
          src={
            user.avatar?.url ||
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
          }
          alt="avatar"
          className="w-24 h-24 rounded-full border mb-2 object-cover"
        />
        <div className="font-semibold text-lg">{user.name}</div>
        <div className="text-gray-500">{user.email}</div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Địa chỉ:</h3>
        {user.addresses && user.addresses.length > 0 ? (
          <ul className="space-y-2">
            {user.addresses.map((addr) => (
              <li
                key={addr._id}
                className={`border rounded p-2 ${
                  addr.isDefault ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div>
                  <span className="font-semibold">{addr.fullName}</span> -{" "}
                  {addr.phone}
                </div>
                <div>
                  {addr.addressDetail}, {addr.ward}, {addr.district},{" "}
                  {addr.province}
                </div>
                {addr.isDefault && (
                  <span className="text-green-600 text-xs font-semibold">
                    [Mặc định]
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">Chưa có địa chỉ nào.</div>
        )}
      </div>
    </div>
  );
};

export default UserForm;
