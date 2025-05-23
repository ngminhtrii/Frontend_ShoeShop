import React, { useState, useEffect } from "react";
import { cartApi } from "../../services/CartService";
import { productLikeApi } from "../../services/ProductLikeService";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface ProductDetailProps {
  product: any;
  attributes?: any;
  variants?: any;
  similarProducts?: any[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  attributes,
  variants,
  similarProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Wishlist state
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!product?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.images]);

  // Kiểm tra sản phẩm đã yêu thích chưa
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await productLikeApi.getWishlist();
        const foundItem = res.data.wishlist.find(
          (item: any) =>
            (item.product._id === (product._id || product.id) ||
              item.product.id === (product._id || product.id)) &&
            item.variant._id === getVariantId()
        );
        setIsLiked(!!foundItem);
        setWishlistItemId(foundItem ? foundItem._id : null); // Lưu wishlistItemId
      } catch {
        setIsLiked(false);
        setWishlistItemId(null);
      }
    };
    if (product && getVariantId()) fetchWishlist();
    // eslint-disable-next-line
  }, [product, selectedGender, selectedColorId]);

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const currentImage = product.images?.[currentImageIndex];

  // Tìm variantId theo gender và color
  const getVariantId = () => {
    if (!variants || !selectedGender || !selectedColorId) return null;
    const variantKey = `${selectedGender}-${selectedColorId}`;
    return variants[variantKey]?.id || null;
  };

  const handleAddToCart = async () => {
    if (!selectedGender || !selectedColorId || !selectedSizeId) {
      alert("Vui lòng chọn giới tính, màu sắc và kích thước.");
      return;
    }

    const variantId = getVariantId();
    if (!variantId) {
      alert("Không tìm thấy phiên bản sản phẩm phù hợp!");
      return;
    }

    setLoadingAdd(true);
    try {
      await cartApi.addToCart({
        variantId,
        sizeId: selectedSizeId,
        quantity: 1,
      });
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch {
      alert("Thêm vào giỏ hàng thất bại!");
    } finally {
      setLoadingAdd(false);
    }
  };

  // Xử lý thêm/xóa yêu thích
  const handleToggleLike = async () => {
    if (!selectedGender || !selectedColorId) {
      alert("Vui lòng chọn giới tính và màu sắc trước khi yêu thích!");
      return;
    }
    const variantId = getVariantId();
    if (!variantId) {
      alert("Không tìm thấy phiên bản sản phẩm phù hợp!");
      return;
    }
    setLikeLoading(true);
    try {
      if (isLiked) {
        if (!wishlistItemId) {
          alert("Không tìm thấy wishlistItemId để xóa!");
          setLikeLoading(false);
          return;
        }
        await productLikeApi.removeFromWishlist(wishlistItemId);
        setIsLiked(false);
        setWishlistItemId(null);
      } else {
        const res = await productLikeApi.addToWishlist(product.id, variantId);
        setIsLiked(true);
        // Nếu backend trả về wishlistItemId mới, bạn có thể set lại ở đây
        // setWishlistItemId(res.data.wishlistItemId);
      }
    } catch {
      alert("Có lỗi khi thao tác với danh sách yêu thích!");
    } finally {
      setLikeLoading(false);
    }
  };
  const renderColors = (variantSummary?: { colors: any[] }) => {
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
                  backgroundColor: color.colors[0] || "#fff",
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
                  backgroundColor: color.colors[1] || "#fff",
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

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex items-start space-x-6">
        <div className="relative w-80 h-80">
          {currentImage && (
            <img
              key={currentImage._id || currentImage.public_id}
              src={currentImage.url}
              alt={product.name}
              className="w-80 h-80 object-cover rounded transition-all duration-500"
            />
          )}
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

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl text-black font-bold">{product.name}</h2>
            <button
              onClick={handleToggleLike}
              disabled={likeLoading}
              className="focus:outline-none"
              title={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-400 text-2xl" />
              )}
            </button>
          </div>
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
              <span className="line-through text-gray-500 text-lg">
                {product.originalPrice?.toLocaleString()}đ
              </span>
            )}
          </div>
          <span className="text-sm text-red-400 font-semibold">
            Giảm {product.discountPercent}%
          </span>

          {/* Thuộc tính: giới tính, màu sắc, kích thước */}
          {attributes && (
            <div className="mt-4">
              {/* Giới tính */}
              {attributes.genders && (
                <div className="mb-2">
                  <b>Giới tính:</b>{" "}
                  {attributes.genders.map((g: any) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      className={`inline-block mr-2 px-3 py-1 border rounded ${
                        selectedGender === g.id
                          ? "bg-green-600 text-white"
                          : "hover:border-gray-400"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Màu sắc */}
              <div className="mb-2">
                <b>Màu sắc:</b>{" "}
                {attributes.colors?.map((color: any) => {
                  const isSelected = selectedColorId === color._id;
                  return (
                    <button
                      key={color._id}
                      onClick={() => setSelectedColorId(color._id)}
                      className={`inline-flex items-center mr-2 px-2 py-1 border rounded ${
                        isSelected
                          ? "ring-2 ring-red-500"
                          : "hover:border-gray-400"
                      }`}
                    >
                      {color.type === "solid" ? (
                        <span
                          className="w-6 h-6 rounded-full border mr-1"
                          style={{ backgroundColor: color.code || "#fff" }}
                        />
                      ) : (
                        <span
                          className="w-6 h-6 rounded-full border mr-1 relative overflow-hidden"
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
                        </span>
                      )}
                      {color.name}
                    </button>
                  );
                })}
              </div>

              {/* Kích thước */}
              <div className="mb-2">
                <b>Kích thước:</b>{" "}
                {attributes.sizes?.map((size: any) => (
                  <button
                    key={size._id}
                    onClick={() => setSelectedSizeId(size._id)}
                    className={`inline-block mr-2 px-3 py-1 border rounded ${
                      selectedSizeId === size._id
                        ? "bg-blue-600 text-white"
                        : "hover:border-gray-400"
                    }`}
                  >
                    {size.value}
                  </button>
                ))}
              </div>

              {/* Hiển thị variantId, sizeId, quantity */}
              {selectedGender && selectedColorId && selectedSizeId && (
                <div className="mt-2 p-3 bg-gray-100 rounded shadow-inner text-sm">
                  <p>
                    <b>Variant ID:</b> {getVariantId() || "Không tìm thấy"}
                  </p>
                  <p>
                    <b>Size ID:</b> {selectedSizeId}
                  </p>
                  <p>
                    <b>Số lượng:</b> 1
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4 px-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          onClick={handleAddToCart}
          disabled={loadingAdd}
        >
          {loadingAdd ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </button>
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

        <div className="mt-4 p-4 rounded-lg shadow-lg">
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-bold">Chi tiết sản phẩm</h3>
              <p className="text-gray-600">{product.description}</p>

              {attributes && (
                <div className="mt-4">
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
                  <div className="mb-2">
                    <b>Danh mục:</b> {product.category?.name}
                  </div>
                  <div className="mb-2 flex items-center">
                    <b>Thương hiệu:</b>
                    {product.brand?.logo && (
                      <img
                        src={product.brand.logo}
                        className="h-8 w-16 object-contain mx-2 inline-block"
                      />
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

      <div className="text-left mt-6 px-6">
        <h3 className="text-lg text-center">SẢN PHẨM TƯƠNG TỰ</h3>
        {similarProducts && similarProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {similarProducts.map((sp) => (
              <div
                key={sp.id}
                className="border p-4 text-center rounded-lg cursor-pointer hover:shadow-lg transition"
                onClick={() =>
                  (window.location.href = `/product-detail/${sp.id}`)
                }
              >
                <img
                  src={sp.mainImage || sp.images?.[0]?.url}
                  alt={sp.name}
                  className="h-20 w-full object-contain rounded mx-auto"
                />
                <p className="text-gray-700 mt-2">{sp.name}</p>
                <p className="text-red-600 font-bold">
                  {sp.price?.toLocaleString()} đ
                </p>
                {renderColors(sp.variantSummary)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-2">
            Chưa có sản phẩm tương tự.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
