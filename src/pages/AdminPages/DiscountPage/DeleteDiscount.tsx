import React from "react";

interface DeleteDiscountProps {
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteDiscount: React.FC<DeleteDiscountProps> = ({
  handleClose,
  handleDelete,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center">
      <div className="bg-[#ff6b6b] pt-8 pr-16 pb-8 pl-16 rounded-2xl shadow-lg w-auto relative text-white">
        <p className="mb-8 text-center">
          Bạn chắc chắn muốn xóa dữ liệu. <br />
          Sau khi xóa, dữ liệu sẽ không thể khôi phục.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-800 transition duration-300"
          >
            Xóa
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-700 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscount;
