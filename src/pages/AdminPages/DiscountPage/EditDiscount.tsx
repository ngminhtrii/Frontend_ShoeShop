import React, { useState } from "react";

interface EditDiscountProps {
  handleClose: () => void;
  discount: {
    id: string;
    code: string;
    name: string;
    value: number;
    startDate: string;
    endDate: string;
    image: string;
  };
}

const EditDiscount: React.FC<EditDiscountProps> = ({
  handleClose,
  discount,
}) => {
  const [formData, setFormData] = useState(discount);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center">
      <div className="bg-[#f2f2f1] pt-8 pr-16 pb-8 pl-16 rounded-2xl shadow-lg w-auto relative text-black">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-8 text-center">
          Chỉnh Sửa Phiếu Giảm Giá
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-x-36 gap-y-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black pl-2">
                Mã Phiếu Giảm
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#f2f2f1] text-black"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black pl-2">
                Tên Phiếu Giảm
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#f2f2f1] text-black"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black pl-2">
                Giá Trị
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#f2f2f1] text-black"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black pl-2">
                Ngày Phát Hành
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#f2f2f1] text-black"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-black pl-2">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-[#f2f2f1] text-black"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-black pl-2">
                Hình Ảnh
              </label>
              <div className="mt-1 border border-black p-2 rounded-lg w-36 h-36 flex items-center justify-center bg-[#f2f2f1]">
                <img
                  src={formData.image}
                  alt="Discount"
                  className="w-32 h-32 object-cover"
                />
              </div>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-black file:text-sm file:font-semibold file:bg-[#f2f2f1] file:text-black hover:file:bg-gray-200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#f2f2f1] text-black font-bold px-4 py-2 border border-black rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiscount;
