import { useEffect, useState } from "react";
import { productApi } from "../../../services/ProductService";
import { Product } from "../../../model/Product";
import ProductImagesManager from "./ProductImagesManager";

interface ProductDetailProps {
  product: Product;
  handleClose: () => void;
}

const ProductDetail = ({ product, handleClose }: ProductDetailProps) => {
  const [detail, setDetail] = useState<any>(product);
  const [loading, setLoading] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getDetailById(product._id)
      .then((res) => setDetail(res.data.product))
      .finally(() => setLoading(false));
  }, [product._id]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-xl font-bold"
          >
            ×
          </button>
          <div>Đang tải chi tiết sản phẩm...</div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2">{detail.name}</h2>
        <div className="mb-2 text-gray-700">{detail.description}</div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <span className="font-semibold">Danh mục:</span>{" "}
            {detail.category?.name}
          </div>
          <div>
            <strong>Slug:</strong> {product.slug}
          </div>
          <div>
            <strong>Mô tả:</strong> {product.description}
          </div>{" "}
          <div>
            <strong>Danh mục:</strong>{" "}
            {typeof product.category === "object"
              ? product.category?.name
              : product.category}
          </div>
          <div>
            <strong>Thương hiệu:</strong>{" "}
            {typeof product.brand === "object"
              ? product.brand?.name
              : product.brand}
          </div>
          {typeof product.brand === "object" && product.brand?.logo?.url && (
            <div>
              <strong>Logo thương hiệu:</strong>
              <img
                src={detail.brand.logo.url}
                alt={detail.brand.name}
                className="inline-block h-6 ml-2"
              />
            </div>
          )}{" "}
          <div>
            <strong>Hình ảnh:</strong>
            <div className="flex gap-2 mt-1">
              {product.images?.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt={product.name}
                  className="w-16 h-16 object-cover border"
                />
              )) || <span>Không có hình ảnh</span>}
            </div>
          </div>
          <div>
            <span className="font-semibold">Trạng thái:</span>{" "}
            {detail.isActive ? (
              <span className="text-green-600">Đang bán</span>
            ) : (
              <span className="text-gray-500">Ẩn</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Tồn kho:</span>{" "}
            {
              {
                in_stock: "Còn hàng",
                low_stock: "Sắp hết hàng",
                out_of_stock: "Hết hàng",
              }[
                (detail.stockStatus as
                  | "in_stock"
                  | "low_stock"
                  | "out_of_stock") || "out_of_stock"
              ]
            }
          </div>
          <div>
            <span className="font-semibold">Số lượng:</span>{" "}
            {detail.totalQuantity}
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
          </div>{" "}
          <div>
            <strong>Thông tin khác:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(
                {
                  deletedAt: product.deletedAt,
                  deletedBy: product.deletedBy,
                  isActive: product.isActive,
                  variantSummary: product.variantSummary,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Ảnh sản phẩm:</span>
          <div className="flex gap-2 mt-1 flex-wrap">
            {detail.images?.map((img: any) => (
              <img
                key={img._id}
                src={img.url}
                alt="product"
                className="h-20 rounded border"
              />
            ))}
          </div>
          <button
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setShowImageManager(true)}
          >
            Quản lý ảnh
          </button>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Biến thể:</span>
          {detail.variants?.length === 0 && <div>Không có biến thể</div>}
          {detail.variants?.map((variant: any) => (
            <div key={variant._id} className="border rounded p-2 mb-2">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <span className="font-semibold">Màu:</span>{" "}
                  {variant.color?.name}
                  {variant.color?.colors?.length > 0 && (
                    <span className="ml-2">
                      {variant.color.colors.map((c: string, i: number) => (
                        <span
                          key={i}
                          className="inline-block w-4 h-4 rounded-full border ml-1"
                          style={{ background: c }}
                        ></span>
                      ))}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Giới tính:</span>{" "}
                  {variant.gender}
                </div>
                <div>
                  <span className="font-semibold">Giá:</span>{" "}
                  {variant.price?.toLocaleString()} VND
                </div>
                <div>
                  <span className="font-semibold">Giá bán:</span>{" "}
                  {variant.priceFinal?.toLocaleString()} VND
                </div>
                <div>
                  <span className="font-semibold">Giảm giá:</span>{" "}
                  {variant.percentDiscount}%
                </div>
                <div>
                  <span className="font-semibold">Lợi nhuận:</span>{" "}
                  {variant.profit?.toLocaleString()} VND
                </div>
                <div>
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  {variant.isActive ? (
                    <span className="text-green-600">Đang bán</span>
                  ) : (
                    <span className="text-gray-500">Ẩn</span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Ảnh biến thể:</span>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {variant.imagesvariant?.map((img: any) => (
                    <img
                      key={img._id}
                      src={img.url}
                      alt="variant"
                      className="h-14 rounded border"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Size & số lượng:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {variant.sizes?.map((sz: any) => (
                    <span
                      key={sz._id}
                      className="inline-block bg-gray-100 px-2 py-1 rounded text-xs border"
                    >
                      {sz.size?.description || sz.size?.value}: {sz.quantity}{" "}
                      đôi
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          <div>ID: {detail._id}</div>
          <div>Slug: {detail.slug}</div>
          <div>Ngày tạo: {new Date(detail.createdAt).toLocaleString()}</div>
          <div>Cập nhật: {new Date(detail.updatedAt).toLocaleString()}</div>
        </div>
      </div>
      {/* Modal quản lý ảnh sản phẩm */}
      {showImageManager && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowImageManager(false)}
            >
              ×
            </button>
            <ProductImagesManager
              productId={detail._id}
              images={detail.images}
              reloadImages={async () => {
                const res = await productApi.getDetailById(detail._id);
                setDetail(res.data.product);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
