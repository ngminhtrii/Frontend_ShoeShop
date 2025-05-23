import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainNavbar from "../../components/Navbar/MainNavbar";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import { productApi } from "../../services/ProductService";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>(null);
  const [variants, setVariants] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await productApi.getProductById(id);
          setProduct(res.data.product);
          setAttributes(res.data.attributes);
          setVariants(res.data.variants); // LẤY variants từ API
        }
      } catch {
        setProduct(null);
        setAttributes(null);
        setVariants(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;
  const similarProducts = [
    { id: 1, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 2, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 3, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
    { id: 4, name: "Tên sản phẩm", price: "Giá sản phẩm", image: "/sp.png" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />
      <ProductDetail
        product={product}
        attributes={attributes}
        variants={variants} // TRUYỀN variants vào
        similarProducts={similarProducts}
      />
    </div>
  );
};

export default ProductDetailPage;
