import React from "react";
import OrderSummary from "../../components/OrderSummary/OrderSummary";

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <header className="absolute top-4 left-6 flex items-center">
        <img className="w-14 h-14" src="/image/logo.png" alt="logo" />
        <h1 className="text-2xl font-bold text-blue-600 ml-2"></h1>
      </header>

      <div className="mt-20">
        <OrderSummary />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
