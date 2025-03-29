
const EditCustomerPage = () => {

    return (
        <div className="w-full mx-auto bg-white p-6 shadow-lg rounded-lg ml-0">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Chỉnh sửa thông tin khách hàng</h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-bold text-gray-600">Họ và tên</label>
                <input
                    type="text"
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập họ và tên"

                />
            </div>

            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-bold text-gray-600">Số điện thoại</label>
                <input
                    type="text"
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập số điện thoại"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-bold text-gray-600">Địa chỉ</label>
                <input
                    type="text"
                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập địa chỉ"
                />
            </div>

            <div className="flex justify-end gap-4">
                <button
                    className="bg-purple-600 text-white px-6 py-2 rounded-md"
                >
                    Lưu
                </button>
                <button
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
                >
                    Hủy
                </button>
            </div>
        </div>
    );
};

export default EditCustomerPage;
