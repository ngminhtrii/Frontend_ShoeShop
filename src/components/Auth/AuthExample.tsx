import React from "react";
import useAuth from "../../hooks/useAuth";
import { authenticateApi } from "../../services/AuthenticationService";
import { toast } from "react-hot-toast";

const AuthExample: React.FC = () => {
  const { user, isAuthenticated, isLoading, token, login, logout, updateUser } =
    useAuth();

  // Xử lý đăng nhập
  const handleLogin = async () => {
    try {
      const response = await authenticateApi.login({
        email: "test@example.com",
        password: "password123",
      });

      if (response.data.success) {
        login(response.data.data);
        toast.success("Đăng nhập thành công!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await authenticateApi.logout();
      logout();
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      // Vẫn logout dù API lỗi
      logout();
      toast.success("Đăng xuất thành công!");
    }
  };

  // Xử lý cập nhật profile
  const handleUpdateProfile = () => {
    updateUser({
      name: "Tên mới",
      phone: "0123456789",
    });
    toast.success("Cập nhật thông tin thành công!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">useAuth Hook Demo</h1>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <p className="text-gray-600">Bạn chưa đăng nhập</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Đăng nhập Demo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Đăng nhập thành công!
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {user?._id}
              </p>
              <p>
                <strong>Tên:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
              <p>
                <strong>Verified:</strong> {user?.isVerified ? "Có" : "Không"}
              </p>
              {user?.phone && (
                <p>
                  <strong>SĐT:</strong> {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Token Info</h3>
            <p className="text-xs text-blue-600 break-all">
              {token ? `${token.substring(0, 50)}...` : "Không có token"}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpdateProfile}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Cập nhật Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Hook State:</h3>
        <pre className="text-xs text-gray-600">
          {JSON.stringify(
            {
              isAuthenticated,
              isLoading,
              hasUser: !!user,
              hasToken: !!token,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default AuthExample;
