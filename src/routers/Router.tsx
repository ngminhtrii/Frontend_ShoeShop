
import OrderConfirmationPage from '../pages/OrderConfirmationPage/OrderConfirmationPage'
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage'
import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
import OTPVerificationPage from "../pages/AuthPages/OTPVerificationPage";
import ForgotPasswordPage from "../pages/AuthPages/ForgotPasswordPage";
import AdminLayout from "./layout/AdminLayout";
import LandingPage from "../pages/MainPages/LandingPage/LandingPage";
import MainLayout from "./layout/MainLayout";
import Dashboard from "../pages/AdminPages/DashboardPage/Dashboard";

import ListCustomerPage from "../pages/AdminPages/AdminUser/CustomerPage";
import EditCustomerPage from "../pages/AdminPages/AdminUser/EditUser";
import ListCategoriesPage from "../pages/AdminPages/AdminCategories/CategoriesPage";
import AddCategoryPage from "../pages/AdminPages/AdminCategories/AddCategories";
import EditCategoryPage from "../pages/AdminPages/AdminCategories/EditCategories";
import ListOrderPage from "../pages/AdminPages/AdminOrders/OrderPage";
import CartPage from "../pages/MainPages/CartPage/CartPage";
import UserInformationPage from "../pages/MainPages/UserPage/UserInformationPage";
import UserManageOrderPage from "../pages/MainPages/UserPage/UserManageOrderPage";
import LikePage from "../pages/MainPages/LikePage/LikePage";
import ProductPage from "../pages/AdminPages/ProductPage/ProductPage";
import DiscountPage from "../pages/AdminPages/DiscountPage/DiscountPage";

const Router = () => {
  return (
    <Routes>
        {/* Các path không cần chỉnh layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/user-information" element={<UserInformationPage/>} />
        <Route path="/user-manage-order" element={<UserManageOrderPage/>} />
        <Route path="/like-page" element={<LikePage/>} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        {/* Các path cần chỉnh layout */}
        {/* Admin */}
        <Route path="/admin/*" element={<AdminLayout />} >
            <Route path="" element={<Dashboard/>} />
            <Route path="user" element={<div>Admin User</div>} />
        </Route>
        {/* User */}
        <Route path="*" element={<MainLayout />} >
            <Route path="" element={<LandingPage/>} />
        </Route>
      {/* Các path không cần chỉnh layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp-verification" element={<OTPVerificationPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/user-information" element={<UserInformationPage />} />
      <Route path="/user-manage-order" element={<UserManageOrderPage />} />
      <Route path="/like-page" element={<LikePage />} />
      {/* Các path cần chỉnh layout */}
      {/* Admin */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="products" element={<ProductPage />} />
        <Route path="products/discount" element={<DiscountPage />} />
        <Route path="" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ListCustomerPage />} />
        <Route path="edit-user" element={<EditCustomerPage />} />
        <Route path="categories" element={<ListCategoriesPage />} />
        <Route path="add-categories" element={<AddCategoryPage />} />
        <Route path="edit-categories" element={<EditCategoryPage />} />
        <Route path="orders" element={<ListOrderPage />} />
      </Route>
      {/* User */}
      <Route path="*" element={<MainLayout />}>
        <Route path="" element={<LandingPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
