import React, { useState } from "react";
import Modal from "react-modal";
import { FaStar, FaRegStar, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { reviewApi } from "../../services/ReviewService"; // Sử dụng ReviewService thay vì ReviewServiceV2

// Đảm bảo modal có thể truy cập được cho screen readers
Modal.setAppElement("#root");

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: string;
  orderItemId: string;
  productName: string;
  productImage: string;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  orderItemId,
  productName,
  productImage,
}) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (content.trim().length < 2) {
      toast.error("Nội dung đánh giá phải có ít nhất 2 ký tự");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        orderId,
        orderItemId,
        rating,
        content: content.trim(),
      };

      console.log("Đang gửi đánh giá với dữ liệu:", reviewData);

      const response = await reviewApi.createReview(reviewData);

      console.log("Response từ API:", response);

      // Kiểm tra response structure linh hoạt hơn
      const responseData = response.data || response;
      const isSuccess =
        responseData.success === true ||
        response.status === 200 ||
        response.status === 201;

      if (isSuccess) {
        toast.success(responseData.message || "Đánh giá sản phẩm thành công");
        setRating(5);
        setContent("");
        onSuccess();
        onClose();
      } else {
        // Nếu không success nhưng có message
        const errorMessage = responseData.message || "Không thể tạo đánh giá";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi đánh giá:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Không thể tạo đánh giá";

      if (error.response) {
        // Lỗi từ server (4xx, 5xx)
        const errorData = error.response.data;
        errorMessage =
          errorData?.message ||
          errorData?.error ||
          `Lỗi server: ${error.response.status}`;
      } else if (error.request) {
        // Lỗi network
        errorMessage = "Lỗi kết nối mạng. Vui lòng thử lại.";
      } else {
        // Lỗi khác
        errorMessage = error.message || "Đã xảy ra lỗi không xác định";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const ratingText = [
    "",
    "Rất không hài lòng",
    "Không hài lòng",
    "Bình thường",
    "Hài lòng",
    "Rất hài lòng",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Đánh giá sản phẩm"
      className="max-w-md mx-auto mt-20 bg-white p-5 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center"
    >
      <h2 className="text-lg font-bold mb-3">Đánh giá sản phẩm</h2>

      <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <FaImage className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-medium text-sm truncate">{productName}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="flex space-x-2 justify-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none transition-transform hover:scale-110"
              >
                {(hoverRating ? star <= hoverRating : star <= rating) ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-yellow-400" />
                )}
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">
            {ratingText[hoverRating || rating]}
          </div>
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            rows={3}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            required
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[100px]"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateReviewModal;
