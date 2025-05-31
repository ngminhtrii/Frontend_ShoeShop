import { useState, useEffect } from "react";
import { productApi } from "../../../services/ProductService";
import { brandApi } from "../../../services/BrandService";
import { categoryApi } from "../../../services/CategoryService";
import { Product } from "../../../model/Product";
import AddProduct from "./AddProduct";
import ProductDetail from "./ProductDetail";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  // State cho form sửa
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Danh sách brand/category cho modal sửa
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Lấy danh sách sản phẩm (hoạt động hoặc đã xóa)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = showDeleted
        ? await productApi.getDeleted()
        : await productApi.getAll();
      setProducts(res.data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [showDeleted]);

  // Lấy brand/category cho modal sửa
  useEffect(() => {
    if (showEdit) {
      brandApi.getAll().then((res) => setBrands(res.data.data || []));
      categoryApi.getAll().then((res) => setCategories(res.data.data || []));
    }
  }, [showEdit]);

  // Thêm mới
  const handleAddSuccess = () => {
    setShowAdd(false);
    fetchProducts();
  };

  // Sửa
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      category:
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "",
      brand:
        typeof product.brand === "string"
          ? product.brand
          : product.brand?._id || "",
    });
    setEditError(null);
    setShowEdit(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await productApi.update(selectedProduct._id, editForm);
      setShowEdit(false);
      fetchProducts();
    } catch {
      setEditError("Cập nhật sản phẩm thất bại!");
    } finally {
      setEditLoading(false);
    }
  };

  // Xóa mềm
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDelete(true);
  };
  const handleDelete = async () => {
    if (!selectedProduct) return;
    await productApi.delete(selectedProduct._id);
    setShowDelete(false);
    fetchProducts();
  };

  // Khôi phục
  const handleRestore = async (id: string) => {
    await productApi.restore(id);
    fetchProducts();
  };

  // Cập nhật trạng thái active
  const handleUpdateStatus = async (product: Product, isActive: boolean) => {
    await productApi.updateStatus(product._id, { isActive, cascade: true });
    fetchProducts();
  };

  // Cập nhật trạng thái tồn kho
  const handleUpdateStockStatus = async (product: Product) => {
    await productApi.updateStockStatus(product._id);
    fetchProducts();
  };

  // Modal
  const openModal = (type: string, product?: Product) => {
    if (product) setSelectedProduct(product);
    switch (type) {
      case "add":
        setShowAdd(true);
        break;
      case "edit":
        openEditModal(product!);
        break;
      case "delete":
        openDeleteModal(product!);
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh Sách Sản Phẩm</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            !showDeleted ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Sản phẩm đang hoạt động
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showDeleted ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Sản phẩm đã xóa
        </button>
        {!showDeleted && (
          <button
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => openModal("add")}
          >
            Thêm mới
          </button>
        )}
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Tên Sản Phẩm</th>
              <th className="border px-2 py-1">Danh Mục</th>
              <th className="border px-2 py-1">Thương Hiệu</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Trạng Thái</th>
              <th className="border px-2 py-1">Active</th>
              <th className="border px-2 py-1">Tồn Kho</th>
              <th className="border px-2 py-1">Hành động</th>
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
                isActive,
              } = product;
              const priceRange = variantSummary?.priceRange;
              return (
                <tr key={_id}>
                  <td className="border px-2 py-1">{_id}</td>
                  <td className="border px-2 py-1">{name}</td>
                  <td className="border px-2 py-1">
                    {typeof category === "string" ? category : category?.name}
                  </td>
                  <td className="border px-2 py-1">
                    {typeof brand === "string" ? brand : brand?.name}
                  </td>
                  <td className="border px-2 py-1">
                    {priceRange?.min && priceRange?.max
                      ? `${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()} VND`
                      : "0 VND"}
                  </td>
                  <td className="border px-2 py-1">
                    {
                      {
                        in_stock: "Còn hàng",
                        low_stock: "Sắp hết hàng",
                        out_of_stock: "Hết hàng",
                      }[stockStatus || "out_of_stock"]
                    }
                  </td>
                  <td className="border px-2 py-1">
                    {!showDeleted && (
                      <button
                        className={`px-2 py-1 rounded text-white ${
                          isActive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        onClick={() => handleUpdateStatus(product, !isActive)}
                      >
                        {isActive ? "Đang bán" : "Ẩn"}
                      </button>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {!showDeleted && (
                      <button
                        className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={() => handleUpdateStockStatus(product)}
                      >
                        Cập nhật
                      </button>
                    )}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    {!showDeleted ? (
                      <>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                          onClick={() => openModal("edit", product)}
                        >
                          Sửa
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          onClick={() => openModal("delete", product)}
                        >
                          Xóa
                        </button>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          onClick={() => openModal("detail", product)}
                        >
                          Chi tiết
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        onClick={() => handleRestore(product._id)}
                      >
                        Khôi phục
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal Thêm */}
      {showAdd && <AddProduct handleClose={handleAddSuccess} />}

      {/* Modal Sửa */}
      {showEdit && selectedProduct && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-auto relative text-black">
            <button
              type="button"
              onClick={() => closeModal("edit")}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-8 text-center">Sửa Sản Phẩm</h2>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Tên Sản Phẩm
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Mô Tả
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Danh Mục
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat._id} - {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Thương Hiệu
                </label>
                <select
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand._id} - {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {editLoading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {showDelete && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4">Xóa sản phẩm</h2>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => closeModal("delete")}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết */}
      {showDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          handleClose={() => closeModal("detail")}
        />
      )}
    </div>
  );
};

export default ProductPage;
