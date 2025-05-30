import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { colorApi } from "../../../services/ColorService";
import AddColor from "./AddColor";

interface Color {
  _id: string;
  name: string;
  code: string | null;
  colors: string[];
  type: "solid" | "half";
  deletedAt: string | null;
  deletedBy: string | { _id: string; name?: string } | null;
  createdAt: string;
  updatedAt: string;
}

const EditColorModal: React.FC<{
  color: Color;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ color, onClose, onSuccess }) => {
  const [name, setName] = useState(color.name);
  const [type, setType] = useState<"solid" | "half">(color.type);
  const [code, setCode] = useState(color.code || "");
  const [color1, setColor1] = useState(color.colors[0] || "");
  const [color2, setColor2] = useState(color.colors[1] || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (type === "solid") {
        await colorApi.update(color._id, { name, code, type });
      } else {
        await colorApi.update(color._id, {
          name,
          colors: [color1, color2],
          type,
        });
      }
      onSuccess();
      onClose();
    } catch {
      setError("Cập nhật màu thất bại!");
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
        <h2 className="text-xl font-bold mb-6 text-center">Cập nhật Màu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600">
              Tên Màu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên màu"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600">
              Loại màu
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "solid" | "half")}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="solid">Solid</option>
              <option value="half">Half</option>
            </select>
          </div>
          {type === "solid" ? (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-600">
                Mã màu (HEX)
              </label>
              <input
                type="color"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 w-16 h-10 border border-gray-300 rounded"
                required
              />
              <span className="ml-2">{code}</span>
            </div>
          ) : (
            <div className="mb-4 flex gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Màu 1 (HEX)
                </label>
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="mt-2 w-16 h-10 border border-gray-300 rounded"
                  required
                />
                <span className="ml-2">{color1}</span>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600">
                  Màu 2 (HEX)
                </label>
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="mt-2 w-16 h-10 border border-gray-300 rounded"
                  required
                />
                <span className="ml-2">{color2}</span>
              </div>
            </div>
          )}
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

const ColorPage: React.FC = () => {
  const [showAddColor, setShowAddColor] = useState(false);
  const [showEditColor, setShowEditColor] = useState<Color | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [colors, setColors] = useState<Color[]>([]);
  const [deletedColors, setDeletedColors] = useState<Color[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchColors = async () => {
    try {
      const res = await colorApi.getAll();
      setColors(res.data.data || []);
    } catch {
      setColors([]);
    }
  };

  const fetchDeletedColors = async () => {
    try {
      const res = await colorApi.getDeleted();
      setDeletedColors(res.data.data || []);
    } catch {
      setDeletedColors([]);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedColors();
    } else {
      fetchColors();
    }
  }, [showDeleted]);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredColors = (showDeleted ? deletedColors : colors).filter(
    (color) => {
      return color.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteColor = async (_id: string) => {
    try {
      await colorApi.delete(_id);
      if (showDeleted) {
        fetchDeletedColors();
      } else {
        fetchColors();
      }
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  const handleRestoreColor = async (_id: string) => {
    try {
      await colorApi.restore(_id);
      fetchDeletedColors();
      fetchColors();
    } catch {
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Danh sách màu sắc</h2>

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
              placeholder="Nhập tên màu"
              className="px-4 py-2 w-full border rounded-md"
            />
          </div>
        )}
      </div>
      {/* Toggle Deleted/Active Colors */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Màu đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Màu đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={() => setShowAddColor(true)}
          >
            + Thêm Màu
          </button>
        )}
      </div>
      {/* Add Color Modal */}
      {showAddColor && (
        <AddColor
          handleClose={() => setShowAddColor(false)}
          onSuccess={() => {
            setShowAddColor(false);
            fetchColors();
          }}
        />
      )}
      {/* Edit Color Modal */}
      {showEditColor && (
        <EditColorModal
          color={showEditColor}
          onClose={() => setShowEditColor(null)}
          onSuccess={fetchColors}
        />
      )}
      {/* Colors Table */}
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              ID
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Tên Màu
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Mã Màu
            </th>
            <th className="py-2 px-4 border-b text-left text-sm font-medium">
              Loại
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
          {filteredColors.map((color) => (
            <tr key={color._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{color._id}</td>
              <td className="py-2 px-4 border-b text-sm">{color.name}</td>
              <td className="py-2 px-4 border-b text-sm">
                {color.type === "solid" ? (
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.code || "#FFFFFF" }}
                  ></div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full border relative overflow-hidden flex-shrink-0"
                    style={{ minWidth: 24, minHeight: 24 }}
                  >
                    <div
                      style={{
                        backgroundColor: color.colors[0] || "#fff",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        clipPath: "inset(0 50% 0 0)",
                      }}
                    />
                    <div
                      style={{
                        backgroundColor: color.colors[1] || "#fff",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        clipPath: "inset(0 0 0 50%)",
                      }}
                    />
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {color.type === "solid" ? "Solid" : "Half"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {color.deletedAt
                  ? `Đã xóa bởi ${
                      typeof color.deletedBy === "object"
                        ? color.deletedBy?.name || "N/A"
                        : "N/A"
                    }`
                  : "Hoạt động"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {!showDeleted && (
                  <>
                    <button
                      onClick={() => setShowEditColor(color)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteColor(color._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                    >
                      Xoá
                    </button>
                  </>
                )}
                {showDeleted && (
                  <button
                    onClick={() => handleRestoreColor(color._id)}
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

export default ColorPage;
