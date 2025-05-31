import React, { useState, useEffect } from "react";
import { Product } from "../../services/ProductServiceV2";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Set up image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      if (product.images && product.images.length > 1) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [product.images]);

  // Get product images array
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            url: "/image/product.jpg",
            public_id: "default",
            isMain: true,
            displayOrder: 0,
          },
        ];

  // Get current image URL
  const currentImage =
    productImages[currentImageIndex]?.url || "/image/product.jpg";

  // Format price range or single price
  const formatPrice = () => {
    if (product.variantSummary?.priceRange) {
      const { min, max, isSinglePrice } = product.variantSummary.priceRange;

      if (isSinglePrice || (min === max && min !== null)) {
        return `${(min || 0).toLocaleString("vi-VN")}đ`;
      } else if (min !== null && max !== null) {
        return `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString(
          "vi-VN"
        )}đ`;
      }
    }

    return `${(product.price || 0).toLocaleString("vi-VN")}đ`;
  };

  // Hàm render màu sắc
  const renderColors = (variantSummary?: Product["variantSummary"]) => {
    if (!variantSummary || !variantSummary.colors) return null;
    return (
      <div className="flex justify-center items-center mt-2 gap-2">
        {variantSummary.colors.map((color, idx) =>
          color.type === "solid" ? (
            <div
              key={idx}
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: color.code || "#fff" }}
            ></div>
          ) : (
            <div
              key={idx}
              className="w-6 h-6 rounded-full border relative overflow-hidden flex-shrink-0"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              <div
                style={{
                  backgroundColor: color.colors?.[0] || "#fff",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  clipPath: "inset(0 50% 0 0)",
                }}
              />
              <div
                style={{
                  backgroundColor: color.colors?.[1] || "#fff",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  clipPath: "inset(0 0 0 50%)",
                }}
              />
            </div>
          )
        )}
      </div>
    );
  };

  // Hàm render đánh giá sao
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    // Render half star if needed
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/image/product.jpg";
          }}
        />
        {productImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {productImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentImageIndex ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Đánh giá */}
        <div className="flex items-center mb-2">
          <div className="flex mr-1">{renderStars(product.rating || 0)}</div>
          <span className="text-gray-500 text-sm">
            ({product.numReviews || 0})
          </span>
        </div>

        <p className="text-2xl font-bold text-red-600 mb-2">{formatPrice()}</p>
        {product.originalPrice &&
          product.originalPrice > (product.price || 0) && (
            <p className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
        {renderColors(product.variantSummary)}
      </div>
    </div>
  );
};

export default ProductCard;
