import React from "react";
import MainNavbar from "../../components/Navbar/MainNavbar";
import ProductDetail from "../../components/ProductDetail/ProductDetail";

const ProductDetailPage: React.FC = () => {
  const product = {
    name: "Màn hình LG 24MR400-B",
    price: 2250000,
    image: "/image/product.jpg",
    description:
      "Màn hình LG được biết đến với khả năng hiển thị vượt trội so với những sản phẩm trong cùng phân khúc và nhu cầu sử dụng như làm việc, học tập...",
  };

  const similarProducts = [
    { id: 1, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 2, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 3, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 4, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />
      <ProductDetail product={product} similarProducts={similarProducts} />
    </div>
  );
};

export default ProductDetailPage;
