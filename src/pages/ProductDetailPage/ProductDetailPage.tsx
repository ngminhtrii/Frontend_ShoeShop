import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ProductAttributes,
  ProductVariants,
  ProductImages,
} from "../../types/product";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import { Product, productPublicService } from "../../services/ProductServiceV2";

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

  // Component hiển thị sản phẩm liên quan
  const RelatedProducts = () => {
    if (loading || !similarProducts.length) return null;

    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Sản phẩm cùng loại
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {similarProducts.slice(0, 10).map((product) => (
              <div
                key={product._id}
                className="group cursor-pointer"
                onClick={() => {
                  const identifier = getProductIdentifier(product);
                  if (identifier) {
                    navigate(`/product/${identifier}`);
                  }
                }}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75 transition-opacity">
                  <img
                    src={
                      product.mainImage ||
                      product.images?.[0]?.url ||
                      "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-2">
                    {product.hasDiscount ? (
                      <>
                        <span className="text-sm font-semibold text-red-600">
                          {product.price?.toLocaleString()}đ
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {product.originalPrice?.toLocaleString()}đ
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {product.price?.toLocaleString() ||
                          product.variantSummary?.priceRange?.min?.toLocaleString() ||
                          "Liên hệ"}
                        đ
                      </span>
                    )}
                  </div>

                  {product.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.numReviews})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Render not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">Không tìm thấy sản phẩm</p>
          </div>
        </div>
      </div>
    );
  }

  // Main render - chỉ khi có product
  return (
    <div>
      <ProductDetail
        product={product}
        attributes={attributes || undefined}
        variants={variants || undefined}
        images={images || undefined}
        similarProducts={similarProducts}
      />
      <RelatedProducts />
    </div>
  );
};

export default ProductDetailPage;
