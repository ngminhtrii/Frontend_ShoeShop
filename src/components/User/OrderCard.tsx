import React from "react";

interface OrderCardProps {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string | number;
  color?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  name,
  quantity,
  price,
  image,
  size,
  color,
}) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      {/* Ảnh sản phẩm */}
      <div className="w-14 h-14 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <p className="text-gray-800">
          {name} x {quantity}
        </p>
        {size && <p className="text-sm text-gray-500">Size: {size}</p>}
        {color && <p className="text-sm text-gray-500">Màu: {color}</p>}
        <p className="text-red-500 font-semibold">
          Giá tiền: {(price * quantity).toLocaleString()}đ
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
