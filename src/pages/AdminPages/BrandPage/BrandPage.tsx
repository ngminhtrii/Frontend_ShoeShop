import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

// Define the data type for brands
interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}

const ListBrandsPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: "BR001",
      name: "Nike",
      slug: "nike",
      description: "Thương hiệu giày thể thao nổi tiếng toàn cầu",
      logo: {
        url: "https://example.com/nike-logo.png",
        public_id: "nike-logo",
      },
      isActive: true,
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: "BR002",
      name: "Adidas",
      slug: "adidas",
      description: "Thương hiệu giày thể thao và thời trang nổi tiếng",
      logo: {
        url: "https://example.com/adidas-logo.png",
        public_id: "adidas-logo",
      },
      isActive: true,
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: "BR003",
      name: "Puma",
      slug: "puma",
      description: "Thương hiệu giày thể thao với thiết kế năng động",
      logo: {
        url: "https://example.com/puma-logo.png",
        public_id: "puma-logo",
      },
      isActive: false,
      deletedAt: "2025-04-01T10:00:00Z",
      deletedBy: "Admin",
    },
  ]);

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

  const handleDeleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
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
            <tr key={brand.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{brand.id}</td>
              <td className="py-2 px-4 border-b text-sm">{brand.name}</td>
              <td className="py-2 px-4 border-b text-sm">{brand.slug}</td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.description}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                <img
                  src={brand.logo.url}
                  alt={brand.name}
                  className="h-10 w-10 object-contain"
                />
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.isActive ? "Hoạt động" : "Không hoạt động"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {brand.deletedAt
                  ? `Đã xóa bởi ${brand.deletedBy || "N/A"}`
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
                  onClick={() => handleDeleteBrand(brand.id)}
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
