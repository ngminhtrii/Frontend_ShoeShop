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

const ListCategoriesPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredCategories = categories.filter((category) => {
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
      setCategories((prev) => prev.filter((category) => category._id !== id));
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
      {/* Add Category Button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
        onClick={() => setShowAddCategory(true)}
      >
        + Thêm Danh Mục
      </button>
      {/* Hiển thị modal thêm danh mục */}
      {showAddCategory && (
        <AddCategoryPage
          handleClose={() => setShowAddCategory(false)}
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
                {category.isActive ? "Hoạt động" : "Không hoạt động"}
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
                <button
                  onClick={() => alert("Edit functionality to be implemented")}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCategoriesPage;
