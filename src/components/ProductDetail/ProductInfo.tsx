const ProductInfo = ({ product, attributes }: any) => (
  <div>
    <h3 className="text-lg font-bold">Chi tiết sản phẩm</h3>
    <p className="text-gray-600">{product.description}</p>
    {attributes && (
      <div className="mt-4">
        <div className="mb-2">
          <b>Giới tính:</b>{" "}
          {attributes.genders?.map((g: any) => (
            <span key={g.id} className="inline-block mr-2">
              {g.name}
            </span>
          ))}
        </div>
        <div className="mb-2">
          <b>Khoảng giá:</b>{" "}
          {attributes.priceRange && (
            <span>
              {attributes.priceRange.min?.toLocaleString()} đ -{" "}
              {attributes.priceRange.max?.toLocaleString()} đ
            </span>
          )}
        </div>
        <div className="mb-2">
          <b>Danh mục:</b> {product.category?.name}
        </div>
        <div className="mb-2 flex items-center">
          <b>Thương hiệu:</b>
          {product.brand?.logo && (
            <img
              src={product.brand.logo}
              className="h-8 w-16 object-contain mx-2 inline-block"
            />
          )}
        </div>
      </div>
    )}
  </div>
);

export default ProductInfo;
