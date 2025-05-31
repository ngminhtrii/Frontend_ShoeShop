import React, { useEffect, useState } from "react";
import { reviewApi, Review } from "../../services/ReviewServiceV2";
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaUser } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await reviewApi.getReviewsByProduct(productId);
        setReviews(res.data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleLikeReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thích đánh giá");
      navigate("/login");
      return;
    }

    setLikeLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await reviewApi.likeReview(reviewId);
      if (response.data.success) {
        // Cập nhật trạng thái like
        setLikedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));

        // Cập nhật số lượng like trong reviews
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  numberOfLikes:
                    response.data.data?.numberOfLikes || review.numberOfLikes,
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Không thể thích đánh giá này");
    } finally {
      setLikeLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center mt-2 text-gray-500">Đang tải đánh giá...</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-8 flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Đánh giá sản phẩm
          </h3>
          <p className="text-gray-600 mt-1">
            {reviews.length} đánh giá từ khách hàng
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-yellow-500">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </span>
          <div className="flex justify-end mt-1">
            {renderStars(
              reviews.length > 0
                ? Math.round(
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                  )
                : 0
            )}
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FaRegStar className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có đánh giá nào
          </h4>
          <p className="text-gray-600 mb-4">
            Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Viết đánh giá đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar.url}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <FaUser className="text-white text-lg" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {review.user?.name || "Khách hàng ẩn danh"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500 font-medium">
                        {review.rating}/5 sao
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">
                  {review.content}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    likedReviews[review._id]
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleLikeReview(review._id)}
                  disabled={likeLoading[review._id]}
                >
                  {likeLoading[review._id] ? (
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : likedReviews[review._id] ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span className="font-medium">
                    {review.numberOfLikes || 0}
                  </span>
                  <span className="text-sm">Hữu ích</span>
                </button>

                {isAuthenticated &&
                  review.user?._id === (review.user?._id || "") && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                        Chỉnh sửa
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors">
                        Xóa
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductComments;
