import React, { useState, useEffect } from "react";

interface ProductDetailProps {
  product: any;
  attributes?: any;
  similarProducts?: any[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  attributes,
  similarProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!product?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000); // đổi ảnh mỗi 3 giây
    return () => clearInterval(interval);
  }, [product.images]);

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const currentImage = product.images?.[currentImageIndex];

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {/* Thông tin sản phẩm */}
      <div className="flex items-start space-x-6">
        {/* Ảnh sản phẩm với slideshow */}
        <div className="relative w-80 h-80">
          {currentImage && (
            <img
              key={currentImage._id || currentImage.public_id}
              src={currentImage.url}
              alt={product.name}
              className="w-80 h-80 object-cover rounded transition-all duration-500"
            />
          )}
          {/* Chấm tròn chuyển ảnh */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images?.map((_: any, idx: number) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentImageIndex ? "bg-red-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <h2 className="text-2xl text-black font-bold">{product.name}</h2>
          <div className="flex items-center mt-4 space-x-4">
            <span className="text-xl">⭐️ {product.rating || 0}</span>
            <span className="text-gray-600">{product.numReviews} đánh giá</span>
            <span className="text-gray-600">
              {product.totalQuantity} lượt mua
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-3xl text-red-500 font-bold">
              {product.price?.toLocaleString()}đ
            </span>
            {product.hasDiscount && (
              <>
                <span className="line-through text-gray-500 text-lg">
                  {product.originalPrice?.toLocaleString()}đ
                </span>
              </>
            )}
          </div>
          <span className="text-sm text-red-400 font-semibold">
            Giảm {product.discountPercent}%
          </span>
          <div className="mt-2">
            <b>Danh mục:</b> {product.category?.name}
          </div>
          <div className="mt-2 flex items-center">
            <b>Thương hiệu:</b>
            {product.brand?.logo && (
              <img
                src={product.brand.logo}
                //alt={product.brand.name}
                className="h-8 w-16 object-contain mx-2 inline-block"
              />
            )}
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
            onClick={() => setActiveTab("details")}
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "comments"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Bình luận
          </button>
        </div>

        {/* Nội dung tab */}
        <div className="mt-4 p-4 rounded-lg shadow-lg">
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-bold">Chi tiết sản phẩm</h3>
              <p className="text-gray-600">{product.description}</p>
              {attributes && (
                <div className="mt-4">
                  <div className="mb-2">
                    <b>Màu sắc:</b>{" "}
                    {attributes.colors?.map((color: any) =>
                      color.type === "solid" ? (
                        <span key={color._id} className="inline-block mr-2">
                          <span
                            className="inline-block w-6 h-6 rounded-full border align-middle"
                            style={{ backgroundColor: color.code || "#fff" }}
                          ></span>{" "}
                          {color.name}
                        </span>
                      ) : (
                        <span key={color._id} className="inline-block mr-2">
                          <span
                            className="inline-block w-6 h-6 rounded-full border align-middle relative overflow-hidden"
                            style={{ minWidth: 24, minHeight: 24 }}
                          >
                            <span
                              style={{
                                backgroundColor: color.colors[0] || "#fff",
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                clipPath: "inset(0 50% 0 0)",
                              }}
                            />
                            <span
                              style={{
                                backgroundColor: color.colors[1] || "#fff",
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                right: 0,
                                top: 0,
                                clipPath: "inset(0 0 0 50%)",
                              }}
                            />
                          </span>{" "}
                          {color.name}
                        </span>
                      )
                    )}
                  </div>
                  <div className="mb-2">
                    <b>Kích thước:</b>{" "}
                    {attributes.sizes?.map((size: any) => (
                      <span key={size._id} className="inline-block mr-2">
                        {size.value} ({size.description})
                      </span>
                    ))}
                  </div>
                  <div className="mb-2">
                    <b>Giới tính:</b>{" "}
                    {attributes.genders?.map((g: any) => (
                      <span key={g.id} className="inline-block mr-2">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <div className="mb-2">
                    <b>Khoảng giá:</b>{" "}
                    {attributes.priceRange && (
                      <span>
                        {attributes.priceRange.min?.toLocaleString()} đ -{" "}
                        {attributes.priceRange.max?.toLocaleString()} đ
                      </span>
                    )}
                  </div>
                </div>
              )}
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
      {similarProducts && similarProducts.length > 0 && (
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
      )}
    </div>
  );
};

export default ProductDetail;
