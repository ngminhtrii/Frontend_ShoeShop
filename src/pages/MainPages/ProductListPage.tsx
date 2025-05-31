import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";
import filterService, {
  ColorFilter,
  SizeFilter,
  CategoryFilter,
  BrandFilter,
} from "../../services/FilterService";
import {
  productPublicService,
  Product,
  ProductQueryParams,
} from "../../services/ProductServiceV2";
import { toast } from "react-toastify";

// Hàm để chuyển đổi từ chuỗi query params thành đối tượng
const parseQueryParams = (
  searchParams: URLSearchParams
): ProductQueryParams => {
  return {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    name: searchParams.get("name") || undefined,
    category: searchParams.get("category") || undefined,
    brand: searchParams.get("brand") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    gender: (searchParams.get("gender") as "male" | "female") || undefined,
    colors: searchParams.get("colors") || undefined,
    sizes: searchParams.get("sizes") || undefined,
    sort: searchParams.get("sort") || "newest",
  };
};

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [brands, setBrands] = useState<BrandFilter[]>([]);
  const [colors, setColors] = useState<ColorFilter[]>([]);
  const [sizes, setSizes] = useState<SizeFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Lấy thông tin bộ lọc từ URL
  const queryParams = parseQueryParams(searchParams);

  // Giá trị bộ lọc hiện tại (sử dụng useState để duy trì giữa các lần render)
  const [filters, setFilters] = useState<ProductQueryParams>(queryParams);

  // Lấy danh sách sản phẩm dựa trên bộ lọc
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = parseQueryParams(searchParams);
        console.log("Fetching products with params:", params);

        const response = await productPublicService.getProducts(params);
        console.log("API response:", response.data);

        if (response.data.success) {
          const productsData =
            response.data.data || response.data.products || [];
          setProducts(productsData);

          // Cập nhật pagination info
          setTotalPages(
            response.data.totalPages ||
              Math.ceil((response.data.total || 0) / (params.limit || 12))
          );
          setCurrentPage(response.data.currentPage || params.page || 1);
          setTotalItems(response.data.total || productsData.length);
        } else {
          console.error("API returned success: false");
          setProducts([]);
          setTotalPages(1);
          setCurrentPage(1);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalItems(0);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    // Cập nhật lại filters khi URL thay đổi
    setFilters(parseQueryParams(searchParams));
    fetchProducts();
  }, [searchParams]);

  // Lấy danh sách danh mục, thương hiệu, màu sắc và kích thước
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data } = await filterService.getFilterAttributes();
        if (data.success && data.filters) {
          const { categories, brands, colors, sizes } = data.filters;
          setCategories(categories);
          setBrands(brands);
          setColors(colors);
          setSizes(sizes);
          // Optionally initialize price filters:
          // setFilters(prev => ({
          //   ...prev,
          //   minPrice: priceRange.min,
          //   maxPrice: priceRange.max,
          // }));
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Áp dụng bộ lọc
  const applyFilters = () => {
    // Loại bỏ các filter undefined hoặc empty string
    const newParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    setSearchParams(newParams as Record<string, string>);
    setShowFilters(false);
  };

  // Reset bộ lọc
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort: "newest",
    });
    setSearchParams({});
  };

  // Xử lý khi chọn trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);

    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Kiểm tra xem có filter đang active không
  const hasActiveFilters = () => {
    return (
      filters.category ||
      filters.brand ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.gender ||
      filters.colors ||
      filters.sizes
    );
  };

  // Helper function để lấy ID hoặc slug sản phẩm
  const getProductIdentifier = (product: Product): string => {
    return product._id || product.slug || "";
  };

  // Chức năng lọc bằng checkbox cho danh mục, thương hiệu, size
  const handleCheckboxFilter = (
    type: "category" | "brand" | "sizes" | "colors",
    id: string
  ) => {
    // Lấy giá trị hiện tại
    const currentValue = filters[type];
    let newValue: string | undefined;

    if (!currentValue) {
      // Nếu chưa có giá trị, gán giá trị mới
      newValue = id;
    } else {
      // Nếu đã có, kiểm tra xem có tồn tại không
      const currentValueStr = Array.isArray(currentValue)
        ? currentValue.join(",")
        : currentValue;
      const values = currentValueStr.split(",");
      if (values.includes(id)) {
        // Nếu có, loại bỏ
        const newValues = values.filter((v: string) => v !== id);
        newValue = newValues.length > 0 ? newValues.join(",") : undefined;
      } else {
        // Nếu chưa có, thêm vào
        newValue = `${currentValueStr},${id}`;
      }
    }

    setFilters({
      ...filters,
      [type]: newValue,
      page: 1, // Reset về trang 1 khi thay đổi filter
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sản phẩm</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Hiển thị {products.length} / {totalItems} sản phẩm
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 md:hidden"
            >
              <FiFilter size={18} />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters - desktop */}
          <div className="w-full md:w-64 hidden md:block">
            <div className="sticky top-24 space-y-6">
              {/* Filters heading with reset button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Bộ lọc</h2>
                {hasActiveFilters() && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              {/* Sort filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Sắp xếp</h3>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* Gender filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Giới tính</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        gender: filters.gender === "male" ? undefined : "male",
                      })
                    }
                    className={`px-3 py-1 border rounded-md ${
                      filters.gender === "male"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300"
                    }`}
                  >
                    Nam
                  </button>
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        gender:
                          filters.gender === "female" ? undefined : "female",
                      })
                    }
                    className={`px-3 py-1 border rounded-md ${
                      filters.gender === "female"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300"
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              {/* Price filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Khoảng giá</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Category filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Danh mục</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        checked={
                          (filters.category &&
                            (Array.isArray(filters.category)
                              ? filters.category.join(",")
                              : filters.category
                            )
                              .split(",")
                              .includes(category._id)) ||
                          false
                        }
                        onChange={() =>
                          handleCheckboxFilter("category", category._id)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label
                        htmlFor={`category-${category._id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Thương hiệu</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand._id}`}
                        checked={
                          filters.brand?.split(",").includes(brand._id) || false
                        }
                        onChange={() =>
                          handleCheckboxFilter("brand", brand._id)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label
                        htmlFor={`brand-${brand._id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color._id}
                      onClick={() => handleCheckboxFilter("colors", color._id)}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
                        filters.colors &&
                        (Array.isArray(filters.colors)
                          ? filters.colors.join(",")
                          : filters.colors
                        )
                          .split(",")
                          .includes(color._id)
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      }`}
                      title={color.name}
                    >
                      {color.type === "solid" ? (
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.code }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-300 relative overflow-hidden">
                          <div
                            style={{
                              backgroundColor: color.colors?.[0] || "#fff",
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
                              backgroundColor: color.colors?.[1] || "#fff",
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Size filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Kích thước</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size._id}
                      onClick={() => handleCheckboxFilter("sizes", size._id)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                        filters.sizes &&
                        (Array.isArray(filters.sizes)
                          ? filters.sizes.join(",")
                          : filters.sizes
                        )
                          .split(",")
                          .includes(size._id)
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "border-gray-300"
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply filters button */}
              <button
                onClick={applyFilters}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
              <div className="h-full w-80 max-w-full bg-white p-4 ml-auto overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Bộ lọc</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <FiX size={24} />
                  </button>
                </div>

                {/* Filter content - same as sidebar but for mobile */}
                <div className="space-y-6">
                  {/* Sort filter */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Sắp xếp</h3>
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                      <option value="popular">Phổ biến nhất</option>
                      <option value="rating">Đánh giá cao</option>
                    </select>
                  </div>

                  {/* Gender filter */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Giới tính</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            gender:
                              filters.gender === "male" ? undefined : "male",
                          })
                        }
                        className={`px-3 py-1 border rounded-md ${
                          filters.gender === "male"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "border-gray-300"
                        }`}
                      >
                        Nam
                      </button>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            gender:
                              filters.gender === "female"
                                ? undefined
                                : "female",
                          })
                        }
                        className={`px-3 py-1 border rounded-md ${
                          filters.gender === "female"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "border-gray-300"
                        }`}
                      >
                        Nữ
                      </button>
                    </div>
                  </div>

                  {/* Price filter */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Khoảng giá</h3>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filters.minPrice || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filters.maxPrice || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Other filters same as desktop */}
                  {/* ... */}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-2 border border-gray-300 rounded-md"
                    >
                      Đặt lại
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-xl text-gray-500 mb-4">
                  Không tìm thấy sản phẩm nào
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={getProductIdentifier(product)}
                      product={product}
                      onClick={() =>
                        navigate(`/product/${getProductIdentifier(product)}`)
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col items-center space-y-4">
                    {/* Page info */}
                    <div className="text-sm text-gray-600">
                      Trang {currentPage} / {totalPages} - Tổng {totalItems} sản
                      phẩm
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* First page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md text-sm ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        Đầu
                      </button>

                      {/* Previous page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md text-sm ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        Trước
                      </button>

                      {/* Page numbers */}
                      {(() => {
                        const pages = [];
                        const maxVisible = 5;
                        let startPage = Math.max(
                          1,
                          currentPage - Math.floor(maxVisible / 2)
                        );
                        const endPage = Math.min(
                          totalPages,
                          startPage + maxVisible - 1
                        );

                        if (endPage - startPage + 1 < maxVisible) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-3 py-2 rounded-md text-sm ${
                                currentPage === i
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Add ellipsis if needed
                        if (startPage > 1) {
                          pages.unshift(
                            <span
                              key="start-ellipsis"
                              className="px-2 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        if (endPage < totalPages) {
                          pages.push(
                            <span
                              key="end-ellipsis"
                              className="px-2 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md text-sm ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        Sau
                      </button>

                      {/* Last page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-md text-sm ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        Cuối
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
