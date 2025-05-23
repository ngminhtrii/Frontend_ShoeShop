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
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await productApi.getProductById(id);
          setProduct(res.data.product);
          setAttributes(res.data.attributes);
          setVariants(res.data.variants);

          // Lấy sản phẩm liên quan
          const relatedRes = await productApi.getRelatedProducts(id);
          setSimilarProducts(relatedRes.data.products || []);
        }
      } catch {
        setProduct(null);
        setAttributes(null);
        setVariants(null);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />
      <ProductDetail
        product={product}
        attributes={attributes}
        variants={variants}
        similarProducts={similarProducts}
      />
    </div>
  );
};

export default ProductDetailPage;
