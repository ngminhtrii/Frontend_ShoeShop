import React, { useEffect, useState } from "react";
import { reviewApi, Review } from "../../services/ReviewServiceV2";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
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

    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    try {
      const response = await reviewApi.likeReview(reviewId);
      if (response.data.success) {
        // Cập nhật trạng thái like
        setLikedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
        
        // Cập nhật số lượng like trong reviews
        setReviews(prev => 
          prev.map(review => 
            review._id === reviewId 
              ? { 
                  ...review, 
                  numberOfLikes: response.data.data?.numberOfLikes || review.numberOfLikes 
                } 
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error liking review:", error);
      toast.error("Không thể thích đánh giá này");
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
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
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">Đánh giá sản phẩm</h3>
        <span className="text-sm text-gray-500">{reviews.length} đánh giá</span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Chưa có đánh giá nào cho sản phẩm này.</p>
          <p className="text-gray-500 mt-2">Hãy là người đầu tiên mua sản phẩm và đánh giá!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {review.user?.avatar ? (
                    <img 
                      src={review.user.avatar.url} 
                      alt={review.user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {review.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{review.user?.name || "Ẩn danh"}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-gray-500 ml-1">({review.rating}/5)</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{review.content}</p>
              
              <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-200">
                <button 
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
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
                  <span>{review.numberOfLikes || 0}</span>
                </button>
                
                {isAuthenticated && review.user?._id === (review.user?._id || '') && (
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Chỉnh sửa
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-800">
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
