import React, { useState } from "react";

interface ProductDetailProps {
  product: {
    name: string;
    price: number;
    image: string;
    description: string;
  };
  similarProducts: { id: number; name: string; price: string; image: string }[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  similarProducts,
}) => {
  // Thông tin sản phẩm 1 từ LandingPage
  const productData = {
    name: "Giày Sandal Nam 7081 - Sandal Nam Quai Ngang Chéo Phối Lót Dán Thời Trang, Sandal Nam Công Sở Năng Động, Trẻ Trung.",
    price: 1000000,
    image:
      "https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(2).jpg?alt=media&token=79e7a687-b564-45c2-830e-58a4255de418",
    description:
      "Giày Sandal Nam 7081 được thiết kế với quai ngang chéo phối lót dán, mang lại sự thoải mái và thời trang. Phù hợp cho công sở và các hoạt động năng động, trẻ trung.",
  };

  const [activeTab, setActiveTab] = useState("details");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {/* Phần thông tin sản phẩm */}
      <div className="flex items-start space-x-6">
        {/* Ảnh sản phẩm */}
        <img
          src={productData.image}
          alt={productData.name}
          className="w-1/2 max-w-sm h-auto object-contain rounded-lg"
        />
        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <h2 className="text-2xl text-black">{productData.name}</h2>
          <div className="flex items-center mt-4 space-x-4">
            <span className="text-xl">⭐️⭐️⭐️⭐️⭐️</span>
            <span className="text-gray-600">4.8/5 (120 đánh giá)</span>
            <span className="text-gray-600">❤️ 250 lượt thích</span>
          </div>
          <p className="text-3xl text-red-500 mt-2">
            {productData.price.toLocaleString()}đ
          </p>
          <div className="flex items-center mt-4">
            <span className="text-gray-600 font-bold mr-4">Màu sắc:</span>
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: "black" }}
            ></div>
            <div
              className="w-6 h-6 rounded-full ml-2"
              style={{
                background: "linear-gradient(to right, #000 50%, #D9D9D9 50%)",
              }}
            ></div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-gray-600 font-bold mr-4">Kích thước:</span>
            <div className="flex space-x-2">
              {["39", "40", "41", "42"].map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 border rounded-lg cursor-pointer"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button className="bg-red-500 text-white px-6 py-2 font-bold rounded-lg">
              Yêu thích
            </button>
            <button className="bg-yellow-500 text-white px-6 py-2 font-bold rounded-lg">
              Giỏ hàng
            </button>
            <button className="bg-green-500 text-white px-6 py-2 font-bold rounded-lg">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 px-6">
        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "details"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("details")}
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "comments"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => handleTabClick("comments")}
          >
            Bình luận
          </button>
        </div>

        {/* Nội dung tab */}
        <div className="mt-4 p-4 rounded-lg shadow-lg">
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-bold">Chi tiết sản phẩm</h3>
              <p className="text-gray-600">{productData.description}</p>
            </div>
          )}
          {activeTab === "comments" && (
            <div>
              <h3 className="text-lg font-bold">Bình luận</h3>
              <p className="text-gray-600">Hiện chưa có bình luận nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className="text-left mt-6 px-6">
        <h3 className="text-lg text-center">SẢN PHẨM TƯƠNG TỰ</h3>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {similarProducts.map((sp) => (
            <div key={sp.id} className="border p-4 text-center rounded-lg">
              <img
                src={sp.image}
                alt={sp.name}
                className="w-full h-24 object-cover rounded"
              />
              <p className="text-gray-700 mt-2">{sp.name}</p>
              <p className="text-red-600 font-bold">{sp.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
