import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

interface Color {
  id: string;
  name: string;
  code: string | null; // Mã màu hex
  colors: string[]; // Mảng chứa 2 màu nếu là half
  type: "solid" | "half"; // solid hoặc half
  deletedAt: string | null;
  deletedBy: string | null;
}

const ColorPage: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [colors, setColors] = useState<Color[]>([
    {
      id: "C001",
      name: "Đỏ",
      code: "#FF0000",
      colors: [],
      type: "solid",
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: "C002",
      name: "Xanh Lá",
      code: "#00FF00",
      colors: [],
      type: "solid",
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: "C003",
      name: "Half Đỏ-Xanh",
      code: null,
      colors: ["#FF0000", "#0000FF"],
      type: "half",
      deletedAt: "2025-04-01T10:00:00Z",
      deletedBy: "Admin",
    },
  ]);

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

  const handleDeleteColor = (id: string) => {
    setColors((prev) => prev.filter((color) => color.id !== id));
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
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6">
        + Thêm Màu
      </button>
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
            <tr key={color.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-sm">{color.id}</td>
              <td className="py-2 px-4 border-b text-sm">{color.name}</td>
              <td className="py-2 px-4 border-b text-sm">
                {color.type === "solid" ? (
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.code || "#FFFFFF" }}
                  ></div>
                ) : (
                  <div className="flex gap-1">
                    {color.colors.map((c, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: c }}
                      ></div>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {color.type === "solid" ? "Solid" : "Half"}
              </td>
              <td className="py-2 px-4 border-b text-sm">
                {color.deletedAt
                  ? `Đã xóa bởi ${color.deletedBy || "N/A"}`
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
                  onClick={() => handleDeleteColor(color.id)}
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
