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
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || Cookie.get("token");
    if (!token || token === "null" || token === "undefined") {
      navigate("/login");
      return;
    }

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      await inforApi.updateAvatar(formData);
      const res = await inforApi.getProfile();
      setUser(res.data.user);
    }
  };

  const handleUpdateAddress = async (addr: Address) => {
    await inforApi.updateAddress(addr._id, {
      fullName: addr.fullName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      addressDetail: addr.addressDetail,
      isDefault: addr.isDefault,
    });
    const res = await inforApi.getProfile();
    setUser(res.data.user);
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-gray-800">
        Thông tin tài khoản
      </h2>

      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2 group">
          <img
            src={
              user.avatar?.url ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.name)
            }
            alt="avatar"
            className="w-24 h-24 rounded-full border object-cover cursor-pointer group-hover:opacity-80 transition"
            onClick={() => document.getElementById("avatarInput")?.click()}
            title="Nhấn để đổi ảnh đại diện"
          />
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
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
                <button
                  className="ml-2 text-blue-500 text-xs"
                  onClick={() => {
                    setEditingAddress(addr);
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">Chưa có địa chỉ nào.</div>
        )}
      </div>

      {/* Modal chỉnh sửa địa chỉ */}
      {isModalOpen && editingAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa địa chỉ</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (editingAddress) {
                  await handleUpdateAddress(editingAddress);
                  setIsModalOpen(false);
                }
              }}
              className="space-y-2"
            >
              {[
                "fullName",
                "phone",
                "province",
                "district",
                "ward",
                "addressDetail",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={(editingAddress as any)[field]}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress!,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              ))}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingAddress.isDefault}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress,
                      isDefault: e.target.checked,
                    })
                  }
                />
                <span>Đặt làm mặc định</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;
