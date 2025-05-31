import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import cartService from "../../services/CartServiceV2";
import wishlistService from "../../services/WishlistService";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiMinus, FiPlus, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import ProductInfo from "./ProductInfo";
import ProductComments from "./ProductComments";
import toast from "react-hot-toast";

interface ProductDetailProps {
  product: any;
  attributes?: any;
  variants?: any;
  images?: any;
  similarProducts?: any[];
}

const NewProductDetail: React.FC<ProductDetailProps> = ({
  product,
  attributes,
  variants,
  images,
  similarProducts,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [displayedImages, setDisplayedImages] = useState<any[]>([]);

  // Wishlist state
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Stock information for selected variant and size
  const [availableStock, setAvailableStock] = useState(0);

  // Cập nhật hiển thị ảnh theo variant được chọn
  useEffect(() => {
    if (!images) {
      // Nếu không có thông tin images, sử dụng ảnh từ product
      if (product?.images?.length) {
        setDisplayedImages(product.images);
      }
      return;
    }

    if (selectedGender && selectedColorId) {
      // Tìm ảnh theo giới tính và màu sắc
      const key = `${selectedGender}-${selectedColorId}`;
      if (images[key] && images[key].length > 0) {
        setDisplayedImages(images[key]);
        setCurrentImageIndex(0); // Reset về ảnh đầu tiên khi thay đổi variant
        return;
      }
    }

    // Nếu không có ảnh cho variant cụ thể, kiểm tra xem có ảnh mặc định không
    if (images["default"] && images["default"].length > 0) {
      setDisplayedImages(images["default"]);
    } else if (product?.images?.length) {
      // Sử dụng ảnh từ product nếu không có ảnh variant
      setDisplayedImages(product.images);
    } else {
      // Không có ảnh nào
      setDisplayedImages([]);
    }
    setCurrentImageIndex(0);
  }, [selectedGender, selectedColorId, images, product]);

  // Fetch stock information when variant or size changes
  useEffect(() => {
    const fetchStockInfo = () => {
      if (!variants || !selectedGender || !selectedColorId) {
        setAvailableStock(0);
        return;
      }

      const variantKey = `${selectedGender}-${selectedColorId}`;
      const variant = variants[variantKey];

      if (variant && variant.sizes) {
        // Set available stock for selected size
        if (selectedSizeId) {
          const sizeInfo = variant.sizes.find(
            (size: any) => size.sizeId === selectedSizeId
          );
          setAvailableStock(sizeInfo?.quantity || 0);
        }
      }
    };

    fetchStockInfo();
  }, [variants, selectedGender, selectedColorId, selectedSizeId]);

  // Tự động chọn gender và color mặc định khi tải sản phẩm
  useEffect(() => {
    if (attributes?.genders?.length && !selectedGender) {
      setSelectedGender(attributes.genders[0].id);
    }

    if (attributes?.colors?.length && selectedGender && !selectedColorId) {
      // Tìm màu đầu tiên có variant hợp lệ cho gender đã chọn
      for (const color of attributes.colors) {
        const variantKey = `${selectedGender}-${color._id}`;
        if (variants && variants[variantKey]) {
          setSelectedColorId(color._id);
          break;
        }
      }
    }
  }, [attributes, variants, selectedGender]);

  // Reset quantity when size changes
  useEffect(() => {
    setSelectedQuantity(1);
  }, [selectedSizeId]);

  // Kiểm tra sản phẩm đã yêu thích chưa
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await wishlistService.getUserWishlist();
        const foundItem = res.data.data?.wishlist.find(
          (item: any) =>
            (item.product._id === (product._id || product.id) ||
              item.product.id === (product._id || product.id)) &&
            item.variant?._id === getVariantId()
        );
        setIsLiked(!!foundItem);
        setWishlistItemId(foundItem ? foundItem._id : null);
      } catch {
        setIsLiked(false);
        setWishlistItemId(null);
      }
    };
    if (product && getVariantId()) fetchWishlist();
  }, [product, selectedGender, selectedColorId, isAuthenticated]);

  if (!product)
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy sản phẩm.
      </div>
    );

  const currentImage = displayedImages[currentImageIndex];

  // Tìm variantId theo gender và color
  const getVariantId = () => {
    if (!variants || !selectedGender || !selectedColorId) return null;
    const variantKey = `${selectedGender}-${selectedColorId}`;
    return variants[variantKey]?.id || null;
  };

  // Tìm variant hiện tại
  const getCurrentVariant = () => {
    if (!variants || !selectedGender || !selectedColorId) return null;
    const variantKey = `${selectedGender}-${selectedColorId}`;
    return variants[variantKey] || null;
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (!selectedGender || !selectedColorId || !selectedSizeId) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    if (availableStock < selectedQuantity) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }

    const variantId = getVariantId();
    if (!variantId) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    setLoadingAdd(true);
    try {
      const response = await cartService.addToCart({
        variantId,
        sizeId: selectedSizeId,
        quantity: selectedQuantity,
      });

      if (response.data.success) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
        // Reset về giá trị mặc định sau khi thêm thành công
        setSelectedQuantity(1);
      } else {
        toast.error(
          response.data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
        );
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi thêm vào giỏ hàng";
      toast.error(errorMessage);
    } finally {
      setLoadingAdd(false);
    }
  };

  // Xử lý mua ngay
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    if (!selectedGender || !selectedColorId || !selectedSizeId) {
      toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
      return;
    }

    if (availableStock < selectedQuantity) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }

    setLoadingBuyNow(true);
    try {
      const variantId = getVariantId();
      if (!variantId) {
        toast.error("Không tìm thấy thông tin sản phẩm");
        return;
      }

      // Thêm sản phẩm vào giỏ hàng trước
      await cartService.addToCart({
        variantId,
        sizeId: selectedSizeId,
        quantity: selectedQuantity,
      });

      // Chuyển hướng đến trang giỏ hàng với query parameter để hiển thị checkout
      navigate("/cart?checkout=true");
      toast.success("Đã thêm sản phẩm vào giỏ hàng, chuyển đến thanh toán");
    } catch (error: any) {
      console.error("Buy now error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi mua ngay"
      );
    } finally {
      setLoadingBuyNow(false);
    }
  };

  // Xử lý yêu thích
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      navigate("/login");
      return;
    }

    const variantId = getVariantId();
    if (!variantId) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }

    setLikeLoading(true);
    try {
      if (isLiked && wishlistItemId) {
        await wishlistService.removeFromWishlist(wishlistItemId);
        setIsLiked(false);
        setWishlistItemId(null);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        const response = await wishlistService.addToWishlist({
          productId: product._id || product.id,
          variantId,
        } as any);
        setIsLiked(true);
        setWishlistItemId((response.data.data as any)?._id);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={currentImage?.url || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder.jpg";
              }}
            />
          </div>

          {/* Thumbnail images */}
          {displayedImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {displayedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    currentImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and price */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl font-bold text-gray-900">
                {getCurrentVariant()?.priceFinal?.toLocaleString() ||
                  getCurrentVariant()?.price?.toLocaleString() ||
                  "Liên hệ"}
                đ
              </p>

              {getCurrentVariant()?.percentDiscount > 0 && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg text-gray-500 line-through">
                    {getCurrentVariant()?.price?.toLocaleString()}đ
                  </span>
                  <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                    -{getCurrentVariant()?.percentDiscount}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rating and reviews */}
          {product.rating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.numReviews} đánh giá)
              </span>
            </div>
          )}

          {/* Gender selection */}
          {attributes?.genders && attributes.genders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Giới tính:</h3>
              <div className="flex gap-2">
                {attributes.genders.map((gender: any) => (
                  <button
                    key={gender.id}
                    onClick={() => {
                      setSelectedGender(gender.id);
                      setSelectedColorId(null);
                      setSelectedSizeId(null);
                    }}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedGender === gender.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {gender.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selection */}
          {selectedGender && attributes?.colors && (
            <div>
              <h3 className="text-lg font-medium mb-3">Màu sắc:</h3>
              <div className="flex flex-wrap gap-2">
                {attributes.colors
                  .filter((color: any) => {
                    const variantKey = `${selectedGender}-${color._id}`;
                    return variants[variantKey];
                  })
                  .map((color: any) => (
                    <button
                      key={color._id}
                      onClick={() => {
                        setSelectedColorId(color._id);
                        setSelectedSizeId(null);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                        selectedColorId === color._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color.type === "solid" ? (
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.code }}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full border relative overflow-hidden">
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
                      )}
                      <span>{color.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {selectedGender && selectedColorId && getCurrentVariant() && (
            <div>
              <h3 className="text-lg font-medium mb-3">Kích thước:</h3>
              <div className="flex flex-wrap gap-2">
                {getCurrentVariant().sizes?.map((sizeInfo: any) => (
                  <button
                    key={sizeInfo.sizeId}
                    onClick={() => setSelectedSizeId(sizeInfo.sizeId)}
                    disabled={sizeInfo.quantity === 0}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSizeId === sizeInfo.sizeId
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : sizeInfo.quantity === 0
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {sizeInfo.sizeValue}
                    {sizeInfo.quantity === 0 && (
                      <span className="block text-xs">Hết hàng</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selection */}
          {selectedSizeId && availableStock > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Số lượng:</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                  }
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg">
                  {selectedQuantity}
                </span>
                <button
                  onClick={() =>
                    setSelectedQuantity(
                      Math.min(availableStock, selectedQuantity + 1)
                    )
                  }
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiPlus />
                </button>
                <span className="text-sm text-gray-500">
                  Còn {availableStock} sản phẩm
                </span>
              </div>
            </div>
          )}

          {/* Add to cart & buy now buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={
                loadingAdd ||
                !selectedSizeId ||
                availableStock < selectedQuantity
              }
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg ${
                loadingAdd ||
                !selectedSizeId ||
                availableStock < selectedQuantity
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loadingAdd ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FiShoppingCart size={20} />
                  <span>Thêm vào giỏ hàng</span>
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={
                loadingBuyNow ||
                !selectedSizeId ||
                availableStock < selectedQuantity
              }
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg ${
                loadingBuyNow ||
                !selectedSizeId ||
                availableStock < selectedQuantity
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {loadingBuyNow ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FiShoppingBag size={20} />
                  <span>Mua ngay</span>
                </>
              )}
            </button>
            <button
              onClick={handleToggleWishlist}
              disabled={likeLoading || !selectedColorId}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
                likeLoading || !selectedColorId
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : isLiked
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {likeLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              ) : isLiked ? (
                <AiFillHeart size={20} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={20} />
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t pt-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Chi tiết sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đánh giá
              </button>
            </div>
            <div className="py-4">
              {activeTab === "details" && <ProductInfo product={product} />}
              {activeTab === "reviews" && (
                <ProductComments productId={product._id || product.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.slice(0, 4).map((similarProduct) => (
              <div
                key={similarProduct._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(
                    `/product/${similarProduct._id || similarProduct.slug}`
                  )
                }
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={
                      similarProduct.mainImage ||
                      (similarProduct.images && similarProduct.images.length > 0
                        ? similarProduct.images[0].url
                        : "/image/product.jpg")
                    }
                    alt={similarProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-2">
                    {similarProduct.name}
                  </h3>
                  <p className="text-red-600 font-bold">
                    {similarProduct.price?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductDetail;
