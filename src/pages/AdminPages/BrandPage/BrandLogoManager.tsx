import { useState, useEffect } from "react";
import {
  uploadBrandLogo,
  removeBrandLogo,
} from "../../../services/ImageService";
import { brandApi } from "../../../services/BrandService";

const BrandLogoManager = ({ brandId, reloadBrand }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logo, setLogo] = useState<any>(null);

  const fetchBrandLogo = async () => {
    const res = await brandApi.getById(brandId);
    setLogo(res.data.brand.logo); // Sửa ở đây: lấy logo từ res.data.brand.logo
  };

  useEffect(() => {
    fetchBrandLogo();
  }, [brandId]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn một ảnh!");
      return;
    }
    const formData = new FormData();
    formData.append("logo", selectedFile);
    await uploadBrandLogo(brandId, formData);
    setSelectedFile(null);
    await fetchBrandLogo();
    reloadBrand();
  };

  const handleRemove = async () => {
    await removeBrandLogo(brandId);
    await fetchBrandLogo();
    reloadBrand();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        name="logo"
        onChange={(e) =>
          setSelectedFile(e.target.files ? e.target.files[0] : null)
        }
      />
      <button onClick={handleUpload}>Tải logo lên</button>
      {logo?.url && (
        <div className="mt-2">
          <img src={logo.url} alt="logo" className="h-20 border rounded" />
          <button onClick={handleRemove}>Xóa logo</button>
        </div>
      )}
    </div>
  );
};

export default BrandLogoManager;
