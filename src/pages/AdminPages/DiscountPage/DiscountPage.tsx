import { useState } from "react";

interface Discount {
  id: string;
  code: string;
  name: string;
  value: number;
  startDate: string;
  endDate: string;
  image: string;
}

import AddDiscount from "./AddDiscount";
import EditDiscount from "./EditDiscount";
import DeleteDiscount from "./DeleteDiscount";

const DiscountPage = () => {
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [showEditDiscount, setShowEditDiscount] = useState(false);
  const [showDeleteDiscount, setShowDeleteDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );

  const handleAddDiscount = () => {
    setShowAddDiscount(true);
  };

  const handleCloseAddDiscount = () => {
    setShowAddDiscount(false);
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowEditDiscount(true);
  };

  const handleCloseEditDiscount = () => {
    setShowEditDiscount(false);
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setShowDeleteDiscount(true);
  };

  const handleCloseDeleteDiscount = () => {
    setShowDeleteDiscount(false);
    setSelectedDiscount(null);
  };

  const handleConfirmDeleteDiscount = () => {
    // Handle delete discount logic here
    setShowDeleteDiscount(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh Sách Phiếu Giảm Giá</h1>
        <button
          onClick={handleAddDiscount}
          className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 font-bold hover:bg-gray-200 transition duration-300"
        >
          + Phiếu Giảm Giá
        </button>
      </div>
      {showAddDiscount && <AddDiscount handleClose={handleCloseAddDiscount} />}
      {showEditDiscount && selectedDiscount && (
        <EditDiscount
          handleClose={handleCloseEditDiscount}
          discount={selectedDiscount}
        />
      )}
      {showDeleteDiscount && selectedDiscount && (
        <DeleteDiscount
          handleClose={handleCloseDeleteDiscount}
          handleDelete={handleConfirmDeleteDiscount}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border font-normal">ID</th>
              <th className="py-2 px-4 border font-normal">Mã Phiếu Giảm</th>
              <th className="py-2 px-4 border font-normal">Tên Phiếu Giảm</th>
              <th className="py-2 px-4 border font-normal">Giá Trị</th>
              <th className="py-2 px-4 border font-normal">Ngày Phát Hành</th>
              <th className="py-2 px-4 border font-normal">Ngày Kết Thúc</th>
              <th className="py-2 px-4 border font-normal">Hình Ảnh</th>
              <th className="py-2 px-4 border font-normal">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border text-center">1</td>
              <td className="py-2 px-4 border text-center">DC001</td>
              <td className="py-2 px-4 border text-center">Noel</td>
              <td className="py-2 px-4 border text-center">30%</td>
              <td className="py-2 px-4 border text-center">2025-12-20</td>
              <td className="py-2 px-4 border text-center">2025-12-25</td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center items-center">
                  <img
                    src="/image/ImgProduct.png"
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="w-16 h-16 object-cover"
                  />
                </div>
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() =>
                      handleEditDiscount({
                        id: "1",
                        code: "DC001",
                        name: "Noel",
                        value: 30,
                        startDate: "2025-12-20",
                        endDate: "2025-12-25",
                        image: "/image/ImgProduct.png",
                      })
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteDiscount({
                        id: "1",
                        code: "DC001",
                        name: "Noel",
                        value: 30,
                        startDate: "2025-12-20",
                        endDate: "2025-12-25",
                        image: "/image/ImgProduct.png",
                      })
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border text-center">2</td>
              <td className="py-2 px-4 border text-center">DC002</td>
              <td className="py-2 px-4 border text-center">Valentine</td>
              <td className="py-2 px-4 border text-center">50%</td>
              <td className="py-2 px-4 border text-center">2025-02-09</td>
              <td className="py-2 px-4 border text-center">2025-02-14</td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center items-center">
                  <img
                    src="/image/ImgProduct.png"
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="w-16 h-16 object-cover"
                  />
                </div>
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() =>
                      handleEditDiscount({
                        id: "2",
                        code: "DC002",
                        name: "Valentine",
                        value: 50,
                        startDate: "2025-02-09",
                        endDate: "2025-02-14",
                        image: "/image/ImgProduct.png",
                      })
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteDiscount({
                        id: "2",
                        code: "DC002",
                        name: "Valentine",
                        value: 50,
                        startDate: "2025-02-09",
                        endDate: "2025-02-14",
                        image: "/image/ImgProduct.png",
                      })
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
            {/* Thêm các hàng khác */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountPage;
