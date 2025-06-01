// src/components/Auth/AuthGuard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Đang load thông tin xác thực
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Yêu cầu quyền admin nhưng user không phải admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
