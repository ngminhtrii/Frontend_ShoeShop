import { useState, useEffect } from "react";
import { productApi } from "../../../services/ProductService";
import { Product } from "../../../model/Product";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import ProductDetail from "./ProductDetail";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (type: string, product?: Product) => {
    if (product) setSelectedProduct(product);
    switch (type) {
      case "add":
        setShowAdd(true);
        break;
      case "edit":
        setShowEdit(true);
        break;
      case "delete":
        setShowDelete(true);
        break;
      case "detail":
        setShowDetail(true);
        break;
    }
  };

  const closeModal = (type: string) => {
    switch (type) {
      case "add":
        setShowAdd(false);
        break;
      case "edit":
        setShowEdit(false);
        break;
      case "delete":
        setShowDelete(false);
        break;
      case "detail":
        setShowDetail(false);
        break;
    }
    setSelectedProduct(null);
  };

  const confirmDelete = () => {
    // Call API to delete if needed
    closeModal("delete");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh Sách Sản Phẩm</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-white text-black px-4 py-2 rounded-lg border border-gray-600 font-bold hover:bg-gray-200 transition duration-300"
        >
          + Sản Phẩm
        </button>
      </div>

      {showAdd && <AddProduct handleClose={() => closeModal("add")} />}
      {showEdit && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          handleClose={() => closeModal("edit")}
        />
      )}
      {showDelete && selectedProduct && (
        <DeleteProduct
          handleDelete={confirmDelete}
          handleClose={() => closeModal("delete")}
        />
      )}
      {showDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          handleClose={() => closeModal("detail")}
        />
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div>Đang tải sản phẩm...</div>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Tên Sản Phẩm</th>
                <th className="py-2 px-4 border">Danh Mục</th>
                <th className="py-2 px-4 border">Thương Hiệu</th>
                <th className="py-2 px-4 border">Giá</th>
                <th className="py-2 px-4 border">Trạng Thái</th>
                <th className="py-2 px-4 border">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const {
                  _id,
                  name,
                  category,
                  brand,
                  variantSummary,
                  stockStatus,
                } = product;
                const priceRange = variantSummary?.priceRange;

                return (
                  <tr key={_id}>
                    <td className="py-2 px-4 border">{_id}</td>
                    <td className="py-2 px-4 border">{name}</td>
                    <td className="py-2 px-4 border">
                      {typeof category === "string" ? category : category?.name}
                    </td>
                    <td className="py-2 px-4 border">
                      {typeof brand === "string" ? brand : brand?.name}
                    </td>
                    <td className="py-2 px-4 border">
                      {priceRange?.min && priceRange?.max
                        ? `${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()} VND`
                        : "0 VND"}
                    </td>
                    <td className="py-2 px-4 border">
                      {
                        {
                          in_stock: "Còn hàng",
                          low_stock: "Sắp hết hàng",
                          out_of_stock: "Hết hàng",
                        }[stockStatus || "out_of_stock"]
                      }
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal("edit", product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => openModal("delete", product)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => openModal("detail", product)}
                          className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
