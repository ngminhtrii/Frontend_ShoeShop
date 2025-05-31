import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { brandApi } from "../../../services/BrandService";
import AddBrand from "./AddBrand";
import BrandLogoManager from "./BrandLogoManager";

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

const EditBrand: React.FC<{
  brand: Brand;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ brand, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: brand.name,
    description: brand.description,
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
      await brandApi.update(brand._id, formData);
      onSuccess();
      onClose();
    } catch {
      setError("Cập nhật thương hiệu thất bại!");
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
          Cập nhật Thương Hiệu
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-black">
              Tên Thương Hiệu
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

const ListBrandsPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deletedBrands, setDeletedBrands] = useState<Brand[]>([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showLogoManager, setShowLogoManager] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    try {
      const res = await brandApi.getAll();
      setBrands(res.data.data || []);
    } catch {
      setBrands([]);
    }
  };

  const fetchDeletedBrands = async () => {
    try {
      const res = await brandApi.getDeleted();
      setDeletedBrands(res.data.data || []);
    } catch {
      setDeletedBrands([]);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedBrands();
    } else {
      fetchBrands();
    }
  }, [showDeleted]);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredBrands = (showDeleted ? deletedBrands : brands).filter(
    (brand) => {
      return (
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteBrand = async (_id: string) => {
    try {
      await brandApi.delete(_id);
      if (showDeleted) {
        fetchDeletedBrands();
      } else {
        fetchBrands();
      }
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleRestoreBrand = async (_id: string) => {
    try {
      await brandApi.restore(_id);
      fetchDeletedBrands();
      fetchBrands();
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleUpdateStatus = async (_id: string, isActive: boolean) => {
    try {
      await brandApi.updateStatus(_id, { isActive });
      fetchBrands();
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
      {/* Toggle Deleted/Active Brands */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Thương hiệu đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Thương hiệu đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={() => setShowAddBrand(true)}
          >
            + Thêm Thương Hiệu
          </button>
        )}
      </div>
      {/* Add Brand Modal */}
      {showAddBrand && (
        <AddBrand
          handleClose={() => setShowAddBrand(false)}
          onSuccess={fetchBrands}
        />
      )}
      {/* Edit Brand Modal */}
      {editingBrand && (
        <EditBrand
          brand={editingBrand}
          onClose={() => setEditingBrand(null)}
          onSuccess={fetchBrands}
        />
      )}
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
                {brand.deletedAt ? (
                  <span className="text-red-500">Đã xóa</span>
                ) : brand.isActive ? (
                  <span className="text-green-600">Hoạt động</span>
                ) : (
                  <span className="text-yellow-600">Không hoạt động</span>
                )}
                {!showDeleted && (
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      brand.isActive
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                    onClick={() =>
                      handleUpdateStatus(brand._id, !brand.isActive)
                    }
                  >
                    {brand.isActive ? "Tắt hoạt động" : "Kích hoạt"}
                  </button>
                )}
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
                {!showDeleted && (
                  <>
                    <button
                      onClick={() => setEditingBrand(brand)}
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
                    <button
                      onClick={() => setShowLogoManager(brand)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md ml-2"
                    >
                      Quản lý logo
                    </button>
                  </>
                )}
                {showDeleted && (
                  <button
                    onClick={() => handleRestoreBrand(brand._id)}
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
      {/* Modal quản lý logo */}
      {showLogoManager && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowLogoManager(null)}
            >
              ×
            </button>
            <BrandLogoManager
              brandId={showLogoManager._id}
              logo={showLogoManager.logo}
              reloadBrand={fetchBrands}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBrandsPage;
