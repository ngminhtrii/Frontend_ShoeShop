import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { sessionUserApi } from "../../../services/SessionUserService";

// Định nghĩa kiểu dữ liệu user từ API
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: { url?: string };
  role: string;
  isActive: boolean;
  isVerified: boolean;
  blockedAt?: string | null;
}

interface Session {
  _id: string;
  user: string | { _id: string; name: string; email: string; role: string };
  userAgent: string;
  ip: string;
  createdAt: string;
  device?: {
    browser?: {
      name?: string;
    };
  };
}

const ListCustomerPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchCustomers(), fetchSessions()]);
  };

  const fetchCustomers = async () => {
    try {
      const res = await sessionUserApi.getAllUsers();
      setCustomers(res.data.users || res.data.data || []);
    } catch {
      setCustomers([]);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await sessionUserApi.getAllSessions();
      setSessions(res.data.sessions || res.data.data || []);
    } catch {
      setSessions([]);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const getSessionUserId = (user: any) =>
    typeof user === "object" && user !== null ? user._id : user;

  const getStatus = (customer: Customer) => {
    if (customer.blockedAt)
      return <span className="text-red-500">Đã khóa</span>;
    if (!customer.isActive)
      return <span className="text-gray-500">Ngừng hoạt động</span>;
    if (!customer.isVerified)
      return <span className="text-yellow-600">Chưa xác thực</span>;
    return <span className="text-green-600">Đang hoạt động</span>;
  };

  // Đăng xuất tất cả session của user
  const handleLogoutUser = async (userId: string) => {
    if (
      !window.confirm(
        "Bạn chắc chắn muốn đăng xuất tất cả session của người dùng này?"
      )
    )
      return;
    setLoadingUserId(userId);
    try {
      await sessionUserApi.logoutUser(userId);
      await fetchSessions();
    } finally {
      setLoadingUserId(null);
    }
  };

  // Khóa hoặc mở khóa tài khoản
  const handleBlockUser = async (customer: Customer) => {
    const isBlocked = !!customer.blockedAt;
    let reason = "";
    if (!isBlocked) {
      reason =
        window.prompt("Nhập lý do khóa tài khoản:", "Vi phạm chính sách") ||
        "Vi phạm chính sách";
    }
    setLoadingUserId(customer._id);
    try {
      await sessionUserApi.blockUser(customer._id, !isBlocked, reason);
      await fetchCustomers();
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách khách hàng</h2>

      {!isSearchVisible && (
        <button
          onClick={toggleSearchVisibility}
          className="bg-sky-600/60 text-white px-3 py-2 rounded-md mb-4 hover:bg-sky-600"
        >
          <IoIosSearch className="inline-block mr-2" />
          Tìm kiếm
        </button>
      )}

      {isSearchVisible && (
        <div className="mb-4 flex items-center rounded-md">
          <IoIosSearch
            onClick={handleBack}
            className="text-gray-400 cursor-pointer mr-2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên hoặc email"
            className="px-4 py-2 w-1/3 "
          />
        </div>
      )}

      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Avatar
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Tên Khách Hàng
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Email
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Số Điện Thoại
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Trạng thái
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Vai trò
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Session
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-bold">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{customer._id}</td>
              <td className="py-2 px-4 border-b text-sm">
                {customer.avatar?.url ? (
                  <img
                    src={customer.avatar.url}
                    alt={customer.name}
                    className="h-10 w-10 object-cover rounded-full border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-lg">?</span>
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">{customer.name}</td>
              <td className="py-2 px-4 border-b text-sm">{customer.email}</td>
              <td className="py-2 px-4 border-b text-sm">
                {customer.phone || "-"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {getStatus(customer)}
              </td>
              <td className="py-2 px-4 border-b text-sm capitalize">
                {customer.role}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {sessions
                  .filter((s) => getSessionUserId(s.user) === customer._id)
                  .map((s) => (
                    <div key={s._id} className="mb-1">
                      <span className="text-xs text-green-700">
                        {s.device?.browser?.name || "Unknown"} - {s.ip} -{" "}
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                {sessions.filter(
                  (s) => getSessionUserId(s.user) === customer._id
                ).length === 0 && (
                  <span className="text-xs text-gray-400">
                    Không có session
                  </span>
                )}
                {/* Nút đăng xuất tất cả session */}
                {sessions.some(
                  (s) => getSessionUserId(s.user) === customer._id
                ) && (
                  <button
                    className="mt-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                    disabled={loadingUserId === customer._id}
                    onClick={() => handleLogoutUser(customer._id)}
                  >
                    {loadingUserId === customer._id
                      ? "Đang đăng xuất..."
                      : "Đăng xuất"}
                  </button>
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {/* Nút khóa/mở khóa */}
                <button
                  className={`${
                    customer.blockedAt
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-700 hover:bg-gray-900"
                  } text-white px-4 py-1 rounded-md`}
                  disabled={loadingUserId === customer._id}
                  onClick={() => handleBlockUser(customer)}
                >
                  {loadingUserId === customer._id
                    ? "Đang xử lý..."
                    : customer.blockedAt
                    ? "Mở khóa"
                    : "Khóa"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCustomerPage;
