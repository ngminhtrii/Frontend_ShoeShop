import { useEffect, useState } from "react";
import CustomSwipper from "../../../components/Custom/CustomSwipper";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../services/ProductService";

interface Product {
  id: string;
  name: string;
  price: number;
  mainImage?: string;
  images: { url: string }[];
  variantSummary?: {
    colors: {
      type: "solid" | "half";
      code: string | null;
      colors: string[];
    }[];
  };
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Lấy sản phẩm mới
    const fetchNewProducts = async () => {
      try {
        const res = await productApi.getAllProductNew();
        setNewProducts(res.data.products || []);
      } catch {
        setNewProducts([]);
      }
    };
    // Lấy tất cả sản phẩm
    const fetchAllProducts = async () => {
      try {
        const res = await productApi.getAllProductUser();
        setProducts(res.data.data || []);
      } catch {
        setProducts([]);
      }
    };
    fetchNewProducts();
    fetchAllProducts();
  }, []);

  // Hàm render màu sắc
  const renderColors = (variantSummary?: Product["variantSummary"]) => {
    if (!variantSummary || !variantSummary.colors) return null;
    return (
      <div className="flex justify-center items-center mt-2 gap-2">
        {variantSummary.colors.map((color, idx) =>
          color.type === "solid" ? (
            <div
              key={idx}
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: color.code || "#fff" }}
            ></div>
          ) : (
            <div
              key={idx}
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
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <CustomSwipper
        images={[
          {
            url: "https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc.jpg?alt=media&token=30fda9a4-0580-4f0a-8804-90bc66c92946",
          },
          {
            url: "https://firebasestorage.googleapis.com/v0/b/refreshing-well-408704.appspot.com/o/mwc%20(1).jpg?alt=media&token=8d01ac71-bcf4-4a81-8a03-2e41dba04e6e",
          },
        ]}
        height={500}
        width="w-full"
        autoPlay={true}
        interval={3000}
        showPagination={true}
        showNavigation={true}
      />

      {/* SẢN PHẨM MỚI */}
      <div className="flex flex-col items-center justify-center w-full p-10 mt-10">
        <h1 className="text-2xl ">SẢN PHẨM MỚI</h1>
        <div className="w-full mt-5 flex flex-wrap justify-center gap-10">
          {newProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
              onClick={() => navigate(`/product-detail/${product.id}`)}
            >
              <img
                src={product.mainImage || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-60 object-cover rounded-lg"
              />
              <h1
                className="text-xs mt-2 truncate"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </h1>
              <p className="text-xl font-bold text-center mt-2">
                {product.price?.toLocaleString()} đ
              </p>
              {renderColors(product.variantSummary)}
            </div>
          ))}
        </div>
      </div>

      {/* TẤT CẢ SẢN PHẨM */}
      <div className="flex flex-col items-center justify-center w-full p-10 mt-10">
        <h1 className="text-2xl ">TẤT CẢ SẢN PHẨM</h1>
        <div className="w-full mt-5 flex flex-wrap justify-center gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition w-80"
              onClick={() => navigate(`/product-detail/${product.id}`)}
            >
              <img
                src={product.mainImage || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-60 object-cover rounded-lg"
              />
              <h1
                className="text-xs mt-2 truncate"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </h1>
              <p className="text-xl font-bold text-center mt-2">
                {product.price?.toLocaleString()} đ
              </p>
              {renderColors(product.variantSummary)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
