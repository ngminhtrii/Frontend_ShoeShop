import { useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: { url: string; public_id: string; isMain: boolean }[];
  category: string;
  brand: string;
  price: number;
  stockStatus: string;
  isActive: boolean;
  rating: number;
  numReviews: number;
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

  const products: Product[] = [
    {
      id: "P001",
      name: "Giày Thể Thao Nike Air Max",
      slug: "giay-the-thao-nike-air-max",
      description:
        "Giày thể thao Nike Air Max với thiết kế hiện đại và thoải mái.",
      images: [
        {
          url: "https://example.com/nike-air-max.jpg",
          public_id: "nike-air-max",
          isMain: true,
        },
      ],
      category: "Giày Thể Thao",
      brand: "Nike",
      price: 2500000,
      stockStatus: "in_stock",
      isActive: true,
      rating: 4.5,
      numReviews: 120,
    },
    {
      id: "P002",
      name: "Giày Cao Gót Gucci",
      slug: "giay-cao-got-gucci",
      description: "Giày cao gót Gucci sang trọng và đẳng cấp.",
      images: [
        {
          url: "https://example.com/gucci-heels.jpg",
          public_id: "gucci-heels",
          isMain: true,
        },
      ],
      category: "Giày Cao Gót",
      brand: "Gucci",
      price: 5000000,
      stockStatus: "low_stock",
      isActive: true,
      rating: 4.8,
      numReviews: 85,
    },
  ];

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
              <th className="py-2 px-4 border font-normal">Tên Sản Phẩm</th>
              <th className="py-2 px-4 border font-normal">Slug</th>
              <th className="py-2 px-4 border font-normal">Danh Mục</th>
              <th className="py-2 px-4 border font-normal">Thương Hiệu</th>
              <th className="py-2 px-4 border font-normal">Giá</th>
              <th className="py-2 px-4 border font-normal">Trạng Thái</th>
              <th className="py-2 px-4 border font-normal">Hình Ảnh</th>
              <th className="py-2 px-4 border font-normal">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border">{product.id}</td>
                <td className="py-2 px-4 border">{product.name}</td>
                <td className="py-2 px-4 border">{product.slug}</td>
                <td className="py-2 px-4 border">{product.category}</td>
                <td className="py-2 px-4 border">{product.brand}</td>
                <td className="py-2 px-4 border">
                  {product.price.toLocaleString()} VND
                </td>
                <td className="py-2 px-4 border">
                  {product.stockStatus === "in_stock"
                    ? "Còn hàng"
                    : product.stockStatus === "low_stock"
                    ? "Sắp hết hàng"
                    : "Hết hàng"}
                </td>
                <td className="py-2 px-4 border text-center">
                  <img
                    src={product.images.find((img) => img.isMain)?.url || ""}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="py-2 px-4 border text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPage;
