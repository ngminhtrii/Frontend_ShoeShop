import React, { useEffect, useState } from "react";
import { variantApi } from "../../../services/VariantService";
import VariantForm from "./VariantForm";
import VariantImagesManager from "./VariantImagesManager";

const VariantPage: React.FC = () => {
  const [variants, setVariants] = useState<any[]>([]);
  const [deletedVariants, setDeletedVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVariant, setEditingVariant] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  // State cho quản lý ảnh
  const [showImageManager, setShowImageManager] = useState<string | null>(null);
  const [variantImages, setVariantImages] = useState<any[]>([]);

  // Lấy danh sách biến thể
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await variantApi.getAllVariants();
      setVariants(res.data.variants || res.data.data || []);
    } catch {
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách biến thể đã xóa
  const fetchDeletedVariants = async () => {
    setLoading(true);
    try {
      const res = await variantApi.getDeletedVariants();
      setDeletedVariants(res.data.variants || res.data.data || []);
    } catch {
      setDeletedVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedVariants();
    } else {
      fetchVariants();
    }
  }, [showDeleted]);

  // Xóa mềm
  const handleDelete = async (id: string) => {
    await variantApi.deleteVariant(id);
    fetchVariants();
  };

  // Khôi phục
  const handleRestore = async (id: string) => {
    await variantApi.restoreVariant(id);
    if (showDeleted) {
      fetchDeletedVariants();
    }
    fetchVariants();
  };

  // Bắt đầu cập nhật
  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    setIsFormOpen(true);
  };

  // Mở form thêm mới
  const handleAddNew = () => {
    setEditingVariant(null);
    setIsFormOpen(true);
  };

  // Sau khi thêm/cập nhật thành công
  const handleSuccess = () => {
    setEditingVariant(null);
    setIsFormOpen(false);
    fetchVariants();
  };

  // Đóng form
  const handleCloseForm = () => {
    setEditingVariant(null);
    setIsFormOpen(false);
  };

  // Mở modal quản lý ảnh
  const handleOpenImageManager = async (variant: any) => {
    setShowImageManager(variant._id);
    // Lấy lại ảnh biến thể từ API (nếu cần)
    if (variant.imagesvariant) {
      setVariantImages(variant.imagesvariant);
    } else {
      const res = await variantApi.getAllVariants();
      setVariantImages(res.data.variant.imagesvariant || []);
    }
  };

  return (
    <div className="p-6 w-full font-sans">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tight leading-snug mb-6">
        Danh Sách Biến Thể Sản Phẩm
      </h2>
      {/* Tab chuyển đổi */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setShowDeleted(false)}
          className={`px-4 py-2 font-medium transition border-b-2 -mb-px ${
            !showDeleted
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
        >
          Biến thể đang hoạt động
        </button>
        <button
          onClick={() => setShowDeleted(true)}
          className={`px-4 py-2 font-medium transition border-b-2 -mb-px ${
            showDeleted
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
        >
          Biến thể đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-slate-500 text-white rounded-3xl font-medium"
            onClick={handleAddNew}
          >
            Thêm Biến Thể
          </button>
        )}
      </div>
      {/* Modal hiển thị form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={handleCloseForm}
              title="Đóng"
            >
              ×
            </button>
            <VariantForm
              onSuccess={handleSuccess}
              editingVariant={editingVariant}
            />
          </div>
        </div>
      )}
      <hr className="my-4" />
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full w-full bg-white rounded-md overflow-hidden border font-sans">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 text-left border-b">ID</th>
                <th className="py-3 px-4 text-left border-b">Sản phẩm</th>
                <th className="py-3 px-4 text-left border-b">Màu</th>
                <th className="py-3 px-4 text-left border-b">Giá</th>
                <th className="py-3 px-4 text-left border-b">Giới tính</th>
                <th className="py-3 px-4 text-left border-b">Size: Số lượng</th>
                <th className="py-3 px-4 text-center border-b">Trạng thái</th>
                <th className="py-3 px-4 text-center border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(showDeleted ? deletedVariants : variants).map((v) => (
                <tr key={v._id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-3 text-sm">{v._id}</td>
                  <td className="px-4 py-3 text-sm">
                    {v.product?.name || v.product}
                  </td>
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    {v.color?.name || v.color}
                    {v.color?.colors?.length > 0 && (
                      <span className="flex gap-1">
                        {v.color.colors.length === 1 ? (
                          <span
                            className="inline-block w-6 h-6 rounded-full border"
                            style={{
                              background:
                                v.color.colors[0] ||
                                "#e5e7eb" /* fallback gray-200 */,
                            }}
                            title={v.color.colors[0]}
                          ></span>
                        ) : v.color.colors.length === 2 ? (
                          <span
                            className="inline-block w-6 h-6 rounded-full border"
                            style={{
                              background: `linear-gradient(90deg, ${v.color.colors[0]} 50%, ${v.color.colors[1]} 50%)`,
                            }}
                            title={v.color.colors.join(" / ")}
                          ></span>
                        ) : (
                          <span
                            className="inline-block w-6 h-6 rounded-full border"
                            style={{
                              background: `linear-gradient(90deg, ${v.color.colors
                                .map((c: string, i: number, arr: string[]) => {
                                  const percent = Math.round(
                                    (100 / arr.length) * (i + 1)
                                  );
                                  return `${c} ${percent}%`;
                                })
                                .join(", ")})`,
                            }}
                            title={v.color.colors.join(" / ")}
                          ></span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {v.price?.toLocaleString()}đ
                  </td>
                  <td className="px-4 py-3 text-sm">{v.gender}</td>
                  <td className="px-4 py-3 text-sm">
                    {v.sizes?.map((s: any) => (
                      <span
                        key={s.size?._id || s.size}
                        className="inline-block mr-2"
                      >
                        {s.size?.value || s.size}: {s.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {v.deletedAt ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Đã xóa
                      </span>
                    ) : v.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Ngừng hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    {!showDeleted ? (
                      <>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleEdit(v)}
                        >
                          Sửa
                        </button>
                        <button
                          className={`px-2 py-1 rounded text-xs ${
                            v.isActive
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                          onClick={async () => {
                            await variantApi.updateStatus(v._id, !v.isActive);
                            fetchVariants();
                          }}
                        >
                          {v.isActive ? "Tắt hoạt động" : "Kích hoạt"}
                        </button>
                        {!v.deletedAt ? (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleDelete(v._id)}
                          >
                            Xóa
                          </button>
                        ) : null}
                        <button
                          className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleOpenImageManager(v)}
                        >
                          Ảnh
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleRestore(v._id)}
                      >
                        Khôi phục
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal quản lý ảnh variant */}
      {showImageManager && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowImageManager(null)}
            >
              ×
            </button>
            <VariantImagesManager
              variantId={showImageManager}
              images={variantImages}
              reloadImages={async () => {
                // Gọi lại API lấy variant theo id
                const res = await variantApi.getVariantById(showImageManager);
                setVariantImages(res.data.variant.imagesvariant || []);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantPage;
