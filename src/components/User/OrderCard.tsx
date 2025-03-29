import React from "react";

interface OrderCardProps {
  name: string;
  quantity: number;
  price: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ name, quantity, price }) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      {/* Ảnh sản phẩm */}
      <div className="w-14 h-14 bg-gray-700 text-white flex items-center justify-center rounded-lg">
        SP
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <p className="text-gray-800">
          {name} x {quantity}
        </p>
        <p className="text-red-500 font-semibold">
          Giá tiền: {(price * quantity).toLocaleString()}đ
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
