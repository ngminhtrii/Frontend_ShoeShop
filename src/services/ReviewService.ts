import { axiosInstanceAuth } from "../utils/axiosIntance";

export const reviewApi = {
  // Lấy danh sách đánh giá của người dùng
  getMyReviews: () =>
    axiosInstanceAuth.get(
      "http://localhost:5005/api/v1/users/reviews/my-reviews"
    ),

  // Lấy đánh giá theo productId
  getReviewsByProduct: (productId: string) =>
    axiosInstanceAuth.get(
      `http://localhost:5005/api/v1/products/${productId}/reviews`
    ),

  // Tạo mới đánh giá
  createReview: (data: {
    orderId: string;
    orderItemId: string;
    rating: number;
    content: string;
  }) =>
    axiosInstanceAuth.post("http://localhost:5005/api/v1/users/reviews", data),

  // Cập nhật đánh giá theo reviewId
  updateReview: (reviewId: string, data: { rating: number; content: string }) =>
    axiosInstanceAuth.put(
      `http://localhost:5005/api/v1/users/reviews/${reviewId}`,
      data
    ),

  // Xóa đánh giá
  deleteReview: (reviewId: string) =>
    axiosInstanceAuth.delete(
      `http://localhost:5005/api/v1/users/reviews/${reviewId}`
    ),

  // Thích đánh giá
  likeReview: (reviewId: string) =>
    axiosInstanceAuth.post(
      `http://localhost:5005/api/v1/users/reviews/${reviewId}/like`
    ),
};
