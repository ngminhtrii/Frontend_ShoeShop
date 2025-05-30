import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { categoryApi } from "../../../services/CategoryService";
import AddCategoryPage from "./AddCategories";

// Định nghĩa lại interface cho đúng với dữ liệu backend trả về
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | { _id: string; name?: string } | null;
  createdAt: string;
  updatedAt: string;
}

const EditCategoryModal: React.FC<{
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await categoryApi.update(category._id, formData);
      onSuccess();
      onClose();
    } catch {
      setError("Cập nhật danh mục thất bại!");
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
        <h2 className="text-xl font-bold mb-6 text-center">
          Cập nhật Danh Mục
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-black">
              Tên Danh Mục
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Mô Tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListCategoriesPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  };

  const fetchDeletedCategories = async () => {
    try {
      const res = await categoryApi.getDeleted();
      setDeletedCategories(res.data.data || []);
    } catch {
      setDeletedCategories([]);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedCategories();
    } else {
      fetchCategories();
    }
  }, [showDeleted]);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredCategories = (
    showDeleted ? deletedCategories : categories
  ).filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      if (showDeleted) {
        fetchDeletedCategories();
      } else {
        fetchCategories();
      }
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleRestoreCategory = async (id: string) => {
    try {
      await categoryApi.restore(id);
      fetchDeletedCategories();
      fetchCategories();
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleUpdateStatus = async (id: string, isActive: boolean) => {
    try {
      await categoryApi.updateStatus(id, { isActive });
      fetchCategories();
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách danh mục</h2>

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
              placeholder="Nhập tên hoặc slug danh mục"
              className="px-4 py-2 w-full border rounded-md"
            />
          </div>
        )}
      </div>
      {/* Toggle Deleted/Active Categories */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Danh mục đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Danh mục đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={() => setShowAddCategory(true)}
          >
            + Thêm Danh Mục
          </button>
        )}
      </div>
      {/* Add Category Modal */}
      {showAddCategory && (
        <AddCategoryPage
          handleClose={() => setShowAddCategory(false)}
          onSuccess={fetchCategories}
        />
      )}
      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={fetchCategories}
        />
      )}
      {/* Categories Table */}
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Tên Danh Mục
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Slug
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mô Tả
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Trạng Thái
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Đã Xóa
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{category._id}</td>
              <td className="py-2 px-4 border-b text-sm">{category.name}</td>
              <td className="py-2 px-4 border-b text-sm">{category.slug}</td>
              <td className="py-2 px-4 border-b text-sm">
                {category.description}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {category.deletedAt ? (
                  <span className="text-red-500">Đã xóa</span>
                ) : category.isActive ? (
                  <span className="text-green-600">Hoạt động</span>
                ) : (
                  <span className="text-yellow-600">Không hoạt động</span>
                )}
                {!showDeleted && (
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      category.isActive
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                    onClick={() =>
                      handleUpdateStatus(category._id, !category.isActive)
                    }
                  >
                    {category.isActive ? "Tắt hoạt động" : "Kích hoạt"}
                  </button>
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {category.deletedAt
                  ? `Đã xóa bởi ${
                      typeof category.deletedBy === "object"
                        ? category.deletedBy?.name || "N/A"
                        : "N/A"
                    }`
                  : "Chưa xóa"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {!showDeleted && (
                  <>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                    >
                      Xoá
                    </button>
                  </>
                )}
                {showDeleted && (
                  <button
                    onClick={() => handleRestoreCategory(category._id)}
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

export default ListCategoriesPage;
