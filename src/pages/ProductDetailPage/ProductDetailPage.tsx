import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import NewProductDetail from "../../components/ProductDetail/ProductDetail";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Product, productPublicService } from "../../services/ProductServiceV2";

interface ProductAttributes {
  genders?: Array<{ id: string; name: string }>;
  colors?: Array<{
    _id: string;
    name: string;
    code: string;
    type: string;
    colors?: string[];
  }>;
  sizes?: Array<{ _id: string; value: string; description?: string }>;
}

interface ProductVariants {
  [key: string]: {
    id: string;
    price: number;
    priceFinal: number;
    percentDiscount: number;
    sizes: Array<{
      sizeId: string;
      quantity: number;
      isSizeAvailable: boolean;
    }>;
  };
}

interface ProductImages {
  [key: string]: Array<{
    url: string;
    isMain: boolean;
    alt?: string;
  }>;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [attributes, setAttributes] = useState<ProductAttributes | null>(null);
  const [variants, setVariants] = useState<ProductVariants | null>(null);
  const [images, setImages] = useState<ProductImages | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError("Không tìm thấy ID sản phẩm");
          return;
        }

        let response;

        // Kiểm tra nếu id là slug hoặc là ID MongoDB
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isMongoId) {
          response = await productPublicService.getProductById(id);
        } else {
          response = await productPublicService.getProductBySlug(id);
        }

        if (response.data.success) {
          setProduct(response.data.product || response.data.data);

          // Lấy thông tin về thuộc tính và biến thể
          if (response.data.attributes) {
            setAttributes(response.data.attributes);
          }

          if (response.data.variants) {
            setVariants(response.data.variants);
          }

          if (response.data.images) {
            setImages(response.data.images);
          }

          // Lấy sản phẩm liên quan nếu có product ID
          const productData = response.data.product || response.data.data;
          if (productData?._id) {
            try {
              const relatedRes = await productPublicService.getRelatedProducts(
                productData._id,
                { limit: 8 }
              );
              if (relatedRes.data.success) {
                setSimilarProducts(
                  relatedRes.data.products || relatedRes.data.data || []
                );
              }
            } catch (relatedError) {
              console.error("Error fetching related products:", relatedError);
              // Không set error cho related products vì đây không phải lỗi chính
            }
          }
        } else {
          setError("Không thể tải sản phẩm");
          toast.error("Không thể tải sản phẩm");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Đã xảy ra lỗi khi tải sản phẩm");
        toast.error("Không thể tải sản phẩm");
        setProduct(null);
        setAttributes(null);
        setVariants(null);
        setImages(null);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Gọi lại API khi id thay đổi
    fetchProduct();
  }, [id, location.pathname]);

  // Helper function để lấy ID hoặc slug sản phẩm
  const getProductIdentifier = (product: Product): string => {
    return product.slug || product._id || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-800">
              Không tìm thấy sản phẩm
            </p>
            <p className="text-gray-600 mt-2">
              {error || "Sản phẩm không tồn tại hoặc đã bị xóa."}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem sản phẩm khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <NewProductDetail
          product={product}
          attributes={attributes}
          variants={variants}
          images={images}
          similarProducts={similarProducts}
        />

        {/* Sản phẩm liên quan */}
        {similarProducts && similarProducts.length > 0 && (
          <section className="py-12 mb-8">
            <h2 className="text-2xl font-bold mb-6 px-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={getProductIdentifier(product)}
                  product={product}
                  onClick={() =>
                    navigate(`/product/${getProductIdentifier(product)}`)
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
