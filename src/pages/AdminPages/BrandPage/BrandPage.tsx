import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { brandApi } from "../../../services/BrandService";

// Định nghĩa lại interface cho đúng với dữ liệu backend trả về
interface Brand {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | { _id: string; name?: string } | null;
  createdAt: string;
  updatedAt: string;
}

const ListBrandsPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandApi.getAll();
        setBrands(res.data.data || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredBrands = brands.filter((brand) => {
    return (
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteBrand = async (_id: string) => {
    try {
      await brandApi.delete(_id);
      setBrands((prev) => prev.filter((brand) => brand._id !== _id));
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách thương hiệu</h2>

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
              placeholder="Nhập tên hoặc slug thương hiệu"
              className="px-4 py-2 w-full border rounded-md"
            />
          </div>
        )}
      </div>
      {/* Add Brand Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6">
        + Thêm Thương Hiệu
      </button>
      {/* Brands Table */}
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Tên Thương Hiệu
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Slug
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mô Tả
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Logo
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
          {filteredBrands.map((brand) => (
            <tr key={brand._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{brand._id}</td>
              <td className="py-2 px-4 border-b text-sm">{brand.name}</td>
              <td className="py-2 px-4 border-b text-sm">{brand.slug}</td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.description}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.logo?.url && (
                  <img
                    src={brand.logo.url}
                    alt={brand.name}
                    className="h-10 w-10 object-contain"
                  />
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.isActive ? "Hoạt động" : "Không hoạt động"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.deletedAt
                  ? `Đã xóa bởi ${
                      typeof brand.deletedBy === "object"
                        ? brand.deletedBy?.name || "N/A"
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
                  onClick={() => handleDeleteBrand(brand._id)}
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

export default ListBrandsPage;
