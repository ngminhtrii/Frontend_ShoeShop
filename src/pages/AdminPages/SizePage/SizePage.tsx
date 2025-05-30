import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { sizeApi } from "../../../services/Size";
import AddSize from "./AddSixe";

interface Size {
  _id: string;
  value: number;
  description: string;
  deletedAt: string | null;
  deletedBy: string | { _id: string; name?: string } | null;
  createdAt: string;
  updatedAt: string;
}

const EditSizeModal: React.FC<{
  size: Size;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ size, onClose, onSuccess }) => {
  const [value, setValue] = useState<number>(size.value);
  const [description, setDescription] = useState(size.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sizeApi.update(size._id, { value, description });
      onSuccess();
      onClose();
    } catch {
      setError("Cập nhật size thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative text-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">Cập nhật Size</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600">
              Giá trị size
            </label>
            <input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="Nhập giá trị size (VD: 41.5)"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600">
              Mô tả
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SizePage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [deletedSizes, setDeletedSizes] = useState<Size[]>([]);
  const [showAddSize, setShowAddSize] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const fetchSizes = async () => {
    try {
      const res = await sizeApi.getAll();
      setSizes(res.data.data || []);
    } catch {
      setSizes([]);
    }
  };

  const fetchDeletedSizes = async () => {
    try {
      const res = await sizeApi.getDeleted();
      setDeletedSizes(res.data.data || []);
    } catch {
      setDeletedSizes([]);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedSizes();
    } else {
      fetchSizes();
    }
  }, [showDeleted]);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredSizes = (showDeleted ? deletedSizes : sizes).filter((size) => {
    return (
      size.value.toString().includes(searchQuery) ||
      size.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteSize = async (_id: string) => {
    try {
      await sizeApi.delete(_id);
      if (showDeleted) {
        fetchDeletedSizes();
      } else {
        fetchSizes();
      }
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleRestoreSize = async (_id: string) => {
    try {
      await sizeApi.restore(_id);
      fetchDeletedSizes();
      fetchSizes();
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách kích thước</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        {!isSearchVisible && (
          <button
            onClick={toggleSearchVisibility}
            className="bg-sky-600/60 text-white px-3 py-2 rounded-md hover:bg-sky-600"
          >
            <IoIosSearch className="inline-block mr-2" />
            Tìm kiếm
          </button>
        )}
        {isSearchVisible && (
          <div className="mb-4 flex items-center w-1/3">
            <IoIosSearch
              onClick={handleBack}
              className="text-gray-400 cursor-pointer mr-2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Nhập kích thước hoặc mô tả"
              className="px-4 py-2 w-full border rounded-md"
            />
          </div>
        )}
      </div>
      {/* Toggle Deleted/Active Sizes */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Size đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Size đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={() => setShowAddSize(true)}
          >
            + Thêm Kích Thước
          </button>
        )}
      </div>
      {/* Hiển thị modal thêm size */}
      {showAddSize && (
        <AddSize
          handleClose={() => setShowAddSize(false)}
          onSuccess={fetchSizes}
        />
      )}
      {/* Hiển thị modal sửa size */}
      {editingSize && (
        <EditSizeModal
          size={editingSize}
          onClose={() => setEditingSize(null)}
          onSuccess={fetchSizes}
        />
      )}
      {/* Sizes Table */}
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Giá Trị
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mô Tả
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Trạng Thái
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSizes.map((size) => (
            <tr key={size._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{size._id}</td>
              <td className="py-2 px-4 border-b text-sm">{size.value}</td>
              <td className="py-2 px-4 border-b text-sm">{size.description}</td>
              <td className="py-2 px-4 border-b text-sm">
                {size.deletedAt
                  ? `Đã xóa bởi ${
                      typeof size.deletedBy === "object"
                        ? size.deletedBy?.name || "N/A"
                        : "N/A"
                    }`
                  : "Hoạt động"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {!showDeleted && (
                  <>
                    <button
                      onClick={() => setEditingSize(size)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteSize(size._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                    >
                      Xoá
                    </button>
                  </>
                )}
                {showDeleted && (
                  <button
                    onClick={() => handleRestoreSize(size._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
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
  );
};

export default SizePage;
