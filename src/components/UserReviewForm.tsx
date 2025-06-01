import React, { useState } from "react";
import { toast } from "react-toastify";
import { reviewApi, CreateReviewData } from "../services/ReviewServiceV2";
import { getErrorMessage, logError } from "../utils/errorHandler";

interface UserReviewFormProps {
  orderId: string;
  orderItemId: string;
  productName: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const UserReviewForm: React.FC<UserReviewFormProps> = ({
  orderId,
  orderItemId,
  productName,
  onSubmitSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const validateForm = (): boolean => {
    // Reset previous error
    setValidationError("");

    // Validate rating
    if (rating === 0) {
      setValidationError("Vui lòng chọn số sao đánh giá");
      return false;
    }

    // Validate content
    if (!content.trim()) {
      setValidationError("Vui lòng nhập nội dung đánh giá");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: CreateReviewData = {
        orderId,
        orderItemId,
        rating,
        content: content.trim(),
      };

      console.log("Submitting review data:", reviewData);

      const response = await reviewApi.createReview(reviewData);

      toast.success("Đánh giá sản phẩm thành công!");
      setRating(0);
      setContent("");

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      logError(error, "UserReviewForm submission");
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Đánh giá sản phẩm: {productName}</h3>

      <div className="rating-container">
        <p>Mức độ hài lòng của bạn:</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="content-container">
        <label htmlFor="review-content">Nội dung đánh giá:</label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          rows={4}
        />
      </div>

      {validationError && (
        <div className="error-message">{validationError}</div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </button>
        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </form>
  );
};

export default UserReviewForm;
