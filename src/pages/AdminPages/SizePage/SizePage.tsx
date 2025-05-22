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

const SizePage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [showAddSize, setShowAddSize] = useState(false);

  const fetchSizes = async () => {
    try {
      const res = await sizeApi.getAll();
      setSizes(res.data.data || []);
    } catch {
      setSizes([]);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredSizes = sizes.filter((size) => {
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
      setSizes((prev) => prev.filter((size) => size._id !== _id));
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
      {/* Add Size Button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
        onClick={() => setShowAddSize(true)}
      >
        + Thêm Kích Thước
      </button>
      {/* Hiển thị modal thêm size */}
      {showAddSize && (
        <AddSize
          handleClose={() => setShowAddSize(false)}
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
                <button
                  onClick={() => alert("Edit functionality to be implemented")}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SizePage;
