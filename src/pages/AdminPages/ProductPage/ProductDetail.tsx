import { Product } from "../../../model/Product";

interface ProductDetailProps {
  product: Product;
  handleClose: () => void;
}

const ProductDetail = ({ product, handleClose }: ProductDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>ID:</strong> {product._id}
          </div>
          <div>
            <strong>Slug:</strong> {product.slug}
          </div>
          <div>
            <strong>Mô tả:</strong> {product.description}
          </div>
          <div>
            <strong>Danh mục:</strong> {product.category?.name}
          </div>
          <div>
            <strong>Thương hiệu:</strong> {product.brand?.name}
          </div>
          {product.brand?.logo?.url && (
            <div>
              <strong>Logo thương hiệu:</strong>
              <img
                src={product.brand.logo.url}
                alt="logo"
                className="inline h-8 ml-2"
              />
            </div>
          )}
          <div>
            <strong>Hình ảnh:</strong>
            <div className="flex gap-2 mt-1">
              {product.images.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt={product.name}
                  className="w-16 h-16 object-cover border"
                />
              ))}
            </div>
          </div>
          <div>
            <strong>Tổng số lượng:</strong> {product.totalQuantity}
          </div>
          <div>
            <strong>Trạng thái kho:</strong> {product.stockStatus}
          </div>
          <div>
            <strong>Đánh giá:</strong> {product.rating}
          </div>
          <div>
            <strong>Số lượt đánh giá:</strong> {product.numReviews}
          </div>
          <div>
            <strong>Ngày tạo:</strong> {product.createdAt}
          </div>
          <div>
            <strong>Ngày cập nhật:</strong> {product.updatedAt}
          </div>
          <div>
            <strong>Biến thể:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(product.variants, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Thông tin khác:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(
                {
                  deletedAt: product.deletedAt,
                  deletedBy: product.deletedBy,
                  isActive: product.isActive,
                  variantSummary: (product as any).variantSummary,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
