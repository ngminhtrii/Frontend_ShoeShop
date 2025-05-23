import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { productLikeApi } from "../../services/ProductLikeService";

// Định nghĩa kiểu dữ liệu cho sản phẩm yêu thích
interface WishlistItem {
  _id: string; // wishlistItemId
  product: {
    id?: string;
    _id?: string;
    name: string;
    images: { url: string }[];
    price?: number | string;
  };
  variant: {
    price: number;
    priceFinal: number;
    percentDiscount: number;
    _id: string;
  };
}

const LikeProduct = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách sản phẩm yêu thích từ API
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await productLikeApi.getWishlist();
        setWishlist(res.data.wishlist);
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Hàm xóa sản phẩm khỏi wishlist
  const removeProduct = async (wishlistItemId: string) => {
    try {
      await productLikeApi.removeFromWishlist(wishlistItemId);
      setWishlist((prev) => prev.filter((item) => item._id !== wishlistItemId));
    } catch {
      alert("Xóa sản phẩm yêu thích thất bại!");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {loading ? (
        <div>Đang tải danh sách yêu thích...</div>
      ) : wishlist.length === 0 ? (
        <div>Bạn chưa có sản phẩm yêu thích nào.</div>
      ) : (
        wishlist.map((item) => (
          <div
            key={item._id}
            className="flex items-center bg-white shadow-md rounded-lg p-4 w-[400px]"
          >
            {/* Ảnh sản phẩm */}
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md font-bold text-lg overflow-hidden">
              {item.product.images && item.product.images[0]?.url ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 ml-4">
              <p className="text-lg font-medium">{item.product.name}</p>
              <p className="text-red-500 font-semibold">
                {item.variant.priceFinal?.toLocaleString()}đ
              </p>
              {item.variant.percentDiscount > 0 && (
                <span className="text-xs text-gray-500 line-through">
                  {item.variant.price?.toLocaleString()}đ
                </span>
              )}
            </div>

            {/* Icon thùng rác */}
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-500 hover:text-red-700"
              title="Xóa khỏi yêu thích"
            >
              <FaTrash size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default LikeProduct;
