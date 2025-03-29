import { useState } from "react";

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  brand: string;
  price: number;
  warranty: string;
  description: string;
  image: string;
}
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

const ProductPage = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleCloseAddProduct = () => {
    setShowAddProduct(false);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleCloseEditProduct = () => {
    setShowEditProduct(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteProduct(true);
  };

  const handleCloseDeleteProduct = () => {
    setShowDeleteProduct(false);
    setSelectedProduct(null);
  };

  const handleConfirmDeleteProduct = () => {
    // Handle delete product logic here
    setShowDeleteProduct(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh Sách Sản Phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 font-bold hover:bg-gray-200 transition duration-300"
        >
          + Sản Phẩm
        </button>
      </div>
      {showAddProduct && <AddProduct handleClose={handleCloseAddProduct} />}
      {showEditProduct && selectedProduct && (
        <EditProduct
          handleClose={handleCloseEditProduct}
          product={selectedProduct}
        />
      )}
      {showDeleteProduct && selectedProduct && (
        <DeleteProduct
          handleClose={handleCloseDeleteProduct}
          handleDelete={handleConfirmDeleteProduct}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border font-normal">ID</th>
              <th className="py-2 px-4 border font-normal">Mã Sản Phẩm</th>
              <th className="py-2 px-4 border font-normal">Tên Sản Phẩm</th>
              <th className="py-2 px-4 border font-normal">Loại Sản Phẩm</th>
              <th className="py-2 px-4 border font-normal">Thương Hiệu</th>
              <th className="py-2 px-4 border font-normal">Giá</th>
              <th className="py-2 px-4 border font-normal">Giới Thiệu</th>
              <th className="py-2 px-4 border font-normal">Hình Ảnh</th>
              <th className="py-2 px-4 border font-normal">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">1</td>
              <td className="py-2 px-4 border">SP001</td>
              <td className="py-2 px-4 border">RAM</td>
              <td className="py-2 px-4 border">DDR4</td>
              <td className="py-2 px-4 border">Kingston</td>
              <td className="py-2 px-4 border">850.000 VND</td>
              <td className="py-2 px-4 border">
                Ram Laptop Kingsdom 8GB Bus 3200
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center items-center">
                  <img
                    src="/image/ddr4.jpg"
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="w-16 h-16 object-cover"
                  />
                </div>
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() =>
                      handleEditProduct({
                        id: "1",
                        name: "RAM",
                        code: "SP001",
                        category: "DDR4",
                        brand: "Kingston",
                        price: 850000,
                        warranty: "2 năm",
                        description: "Ram Laptop Kingsdom 8GB Bus 3200",
                        image: "/image/ddr4.jpg",
                      })
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProduct({
                        id: "1",
                        name: "RAM",
                        code: "SP001",
                        category: "DDR4",
                        brand: "Kingston",
                        price: 850000,
                        warranty: "2 năm",
                        description: "Ram Laptop Kingsdom 8GB Bus 3200",
                        image: "/image/ddr4.jpg",
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
              <td className="py-2 px-4 border">2</td>
              <td className="py-2 px-4 border">SP002</td>
              <td className="py-2 px-4 border">RAM</td>
              <td className="py-2 px-4 border">DDR5</td>
              <td className="py-2 px-4 border">Kingston</td>
              <td className="py-2 px-4 border">1.960.000 VND</td>
              <td className="py-2 px-4 border">
                Ram Laptop Kingsdom 16GB Bus 3200
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center items-center">
                  <img
                    src="/image/ddr5.jpg"
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="w-16 h-16 object-cover"
                  />
                </div>
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() =>
                      handleEditProduct({
                        id: "2",
                        name: "RAM",
                        code: "SP002",
                        category: "DDR5",
                        brand: "Kingston",
                        price: 1960000,
                        warranty: "2 năm",
                        description: "Ram Laptop Kingsdom 16GB Bus 3200",
                        image: "/image/ddr5.jpg",
                      })
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct({
                        id: "2",
                        name: "SSD",
                        code: "SP002",
                        category: "NVMe",
                        brand: "Samsung",
                        price: 1200000,
                        warranty: "5 năm",
                        description: "SSD Samsung 970 EVO Plus 500GB NVMe",
                        image: "/image/ssd.jpg",
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

export default ProductPage;
