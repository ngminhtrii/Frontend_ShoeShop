import { useState } from "react";
import { FaTrash } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const LikeProduct = () => {
  // Danh sách sản phẩm yêu thích
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Tên sản phẩm", price: "Giá tiền", image: "/image/sp.jpg" },
    { id: 2, name: "Tên sản phẩm", price: "Giá tiền", image: "/image/sp.jpg" },
    { id: 3, name: "Tên sản phẩm", price: "Giá tiền", image: "/image/sp.jpg" },
    { id: 4, name: "Tên sản phẩm", price: "Giá tiền", image: "/image/sp.jpg" },
    { id: 5, name: "Tên sản phẩm", price: "Giá tiền", image: "/image/sp.jpg" },
  ]);

  // Hàm xóa sản phẩm khi click vào icon thùng rác
  const removeProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {products.map(product => (
        <div key={product.id} className="flex items-center bg-white shadow-md rounded-lg p-4 w-[400px]">
          {/* Ảnh sản phẩm */}
          <div className="w-16 h-16 bg-gray-800 text-white flex items-center justify-center rounded-md font-bold text-lg">
            SP
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-1 ml-4">
            <p className="text-lg font-medium">{product.name}</p>
            <p className="text-red-500 font-semibold">{product.price}</p>
          </div>

          {/* Icon thùng rác */}
          <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700">
            <FaTrash size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LikeProduct;
