import { useState, useEffect } from "react";
import {
  uploadProductImages,
  removeProductImages,
  setProductMainImage,
  reorderProductImages,
} from "../../../services/ImageService";

const ProductImagesManager = ({ productId, images, reloadImages }: any) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [localImages, setLocalImages] = useState(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Vui lòng chọn ít nhất một ảnh!");
      return;
    }
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });
    await uploadProductImages(productId, formData);
    setSelectedFiles(null);
    reloadImages();
  };

  const handleRemove = async (imageId: string) => {
    await removeProductImages(productId, [imageId]);
    reloadImages();
  };

  const handleSetMain = async (imageId: string) => {
    await setProductMainImage(productId, imageId);
    reloadImages();
  };

  // Đổi vị trí ảnh trong localImages
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= localImages.length) return;
    const updated = [...localImages];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLocalImages(updated);
  };

  // Gửi thứ tự mới lên server
  const handleReorder = async () => {
    const imageOrders = localImages.map((img: any, idx: number) => ({
      _id: img._id,
      displayOrder: idx,
    }));
    await reorderProductImages(productId, imageOrders);
    reloadImages();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        name="images"
        multiple
        onChange={(e) => setSelectedFiles(e.target.files)}
      />
      <button onClick={handleUpload}>Tải ảnh lên</button>
      <div className="flex gap-2 mt-2 flex-wrap">
        {localImages.map((img: any, idx: number) => (
          <div key={img._id} className="relative flex flex-col items-center">
            <img src={img.url} alt="" className="h-20 border rounded" />
            <div className="flex gap-1 mt-1">
              <button
                disabled={idx === 0}
                className="px-1 py-0.5 bg-gray-200 rounded text-xs"
                onClick={() => moveImage(idx, idx - 1)}
                title="Lên"
              >
                ↑
              </button>
              <button
                disabled={idx === localImages.length - 1}
                className="px-1 py-0.5 bg-gray-200 rounded text-xs"
                onClick={() => moveImage(idx, idx + 1)}
                title="Xuống"
              >
                ↓
              </button>
            </div>
            <button onClick={() => handleRemove(img._id)}>Xóa</button>
            {!img.isMain && (
              <button onClick={() => handleSetMain(img._id)}>
                Đặt làm chính
              </button>
            )}
            {img.isMain && <span className="text-green-600">Main</span>}
          </div>
        ))}
      </div>
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={handleReorder}
        disabled={localImages.length < 2}
      >
        Lưu thứ tự ảnh
      </button>
    </div>
  );
};

export default ProductImagesManager;
