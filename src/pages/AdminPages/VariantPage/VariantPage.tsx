import React, { useEffect, useState } from "react";
import { variantApi } from "../../../services/VariantService";
import VariantForm from "./VariantForm";

const VariantPage: React.FC = () => {
  const [variants, setVariants] = useState<any[]>([]);
  const [deletedVariants, setDeletedVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVariant, setEditingVariant] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh Sách Biến Thể Sản Phẩm</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Biến thể đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Biến thể đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleAddNew}
          >
            Thêm mới
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
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Sản phẩm</th>
              <th className="border px-2 py-1">Màu</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Giới tính</th>
              <th className="border px-2 py-1">Size:Số lượng</th>
              <th className="border px-2 py-1">Trạng thái</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {(showDeleted ? deletedVariants : variants).map((v) => (
              <tr key={v._id}>
                <td className="border px-2 py-1">{v._id}</td>
                <td className="border px-2 py-1">
                  {v.product?.name || v.product}
                </td>
                <td className="border px-2 py-1">{v.color?.name || v.color}</td>
                <td className="border px-2 py-1">
                  {v.price?.toLocaleString()}đ
                </td>
                <td className="border px-2 py-1">{v.gender}</td>
                <td className="border px-2 py-1">
                  {v.sizes?.map((s: any) => (
                    <span
                      key={s.size?._id || s.size}
                      className="inline-block mr-2"
                    >
                      {s.size?.value || s.size}: {s.quantity}
                    </span>
                  ))}
                </td>
                <td className="border px-2 py-1">
                  {v.deletedAt ? (
                    <span className="text-red-500">Đã xóa</span>
                  ) : v.isActive ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-yellow-600">Ngừng hoạt động</span>
                  )}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  {!showDeleted && (
                    <>
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
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
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          onClick={() => handleDelete(v._id)}
                        >
                          Xóa
                        </button>
                      ) : null}
                    </>
                  )}
                  {showDeleted && (
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
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
      )}
    </div>
  );
};

export default VariantPage;
