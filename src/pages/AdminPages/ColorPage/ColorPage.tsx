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

const ColorPage: React.FC = () => {
  const [showAddColor, setShowAddColor] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await colorApi.getAll();
        setColors(res.data.data || []);
      } catch {
        setColors([]);
      }
    };
    fetchColors();
  }, []);

  const handleBack = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const filteredColors = colors.filter((color) => {
    return color.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(true);
  };

  const handleDeleteColor = async (_id: string) => {
    try {
      await colorApi.delete(_id);
      setColors((prev) => prev.filter((color) => color._id !== _id));
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
      {/* Add Color Button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
        onClick={() => setShowAddColor(true)}
      >
        + Thêm Màu
      </button>
      {showAddColor && (
        <AddColor
          handleClose={() => setShowAddColor(false)}
          onSuccess={() => {
            setShowAddColor(false);
            // reload danh sách màu
            colorApi.getAll().then((res) => setColors(res.data.data || []));
          }}
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
                <button
                  onClick={() => alert("Edit functionality to be implemented")}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColorPage;
