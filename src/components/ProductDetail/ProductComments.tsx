import React, { useEffect, useState } from "react";
import { reviewApi, Review } from "../../services/ReviewServiceV2";
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaUser } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
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
        stars.push(<FaStar key={i} className="text-yellow-400 w-5 h-5" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 w-5 h-5" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center mt-3 text-gray-500 font-medium">
          Đang tải đánh giá...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Đánh giá sản phẩm
          </h3>
          <p className="text-gray-500 mt-1 font-medium">
            {reviews.length} đánh giá từ khách hàng
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-bold text-yellow-500">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </span>
          <div className="flex justify-end mt-2 space-x-1">
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

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="py-16 px-8 text-center bg-gray-50">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-5 shadow-sm">
            <FaRegStar className="w-10 h-10 text-gray-300" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            Chưa có đánh giá nào
          </h4>
          <p className="text-gray-500 max-w-md mx-auto">
            Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!
          </p>
        </div>
      ) : (
        /* Reviews List */
        <div className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-8 hover:bg-gray-50 transition-colors"
            >
              {/* User Info and Rating */}
              <div className="flex justify-between mb-5">
                <div className="flex items-start gap-4">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar.url}
                      alt={review.user.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                      <FaUser className="text-white text-xl" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-800 text-lg">
                      {review.user?.name || "Khách hàng ẩn danh"}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full font-medium">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Review Content */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.content}
                </p>
              </div>

              {/* Like Button */}
              <div className="flex justify-end">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    likedReviews[review._id]
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                  <span className="font-medium mr-1">
                    {review.numberOfLikes || 0}
                  </span>
                  <span className="text-sm">Hữu ích</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductComments;
