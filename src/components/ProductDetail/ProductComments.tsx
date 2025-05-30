import React, { useEffect, useState } from "react";
import { reviewApi } from "../../services/ReviewService";

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await reviewApi.getReviewsByProduct(productId);
        // Sửa dòng này:
        setReviews(res.data.data || []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  return (
    <div>
      <h3 className="text-lg font-bold">Bình luận</h3>
      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">Hiện chưa có bình luận nào.</p>
      ) : (
        <ul className="space-y-4 mt-2">
          {reviews.map((review) => (
            <li key={review._id} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {review.user?.name || "Ẩn danh"}
                </span>
                <span className="text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => "★")}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => "☆")}
                </span>
              </div>
              <div className="text-gray-700">{review.content}</div>
              <div className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductComments;
