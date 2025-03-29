import React, { useState } from 'react';
import { LuScanEye } from 'react-icons/lu'; // Import the LuScanEye icon

interface Order {
    orderCode: string;
    customerName: string;
    address: string;
    phone: string;
    price: string;
    paymentStatus: string;
    orderStatus: string;
}

const ListOrderPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [paymentFilter, setPaymentFilter] = useState<string>(''); // Payment filter
    const [statusFilter, setStatusFilter] = useState<string>(''); // Order status filter

    const [orders] = useState<Order[]>([
        {
            orderCode: 'DM001',
            customerName: 'Nguyễn Văn A',
            address: '1 Vo Van Ngan',
            phone: '0123321012',
            price: '850.000(VND)',
            paymentStatus: 'Đã thanh toán',
            orderStatus: 'Đang giao hàng',
        },
        {
            orderCode: 'DM002',
            customerName: 'Nguyễn Văn B',
            address: '1 Vo Van Ngan',
            phone: '0123321012',
            price: '850.000(VND)',
            paymentStatus: 'Chưa thanh toán',
            orderStatus: 'Giao hàng thành công',
        },
    ]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Selected order for modal

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handlePaymentFilter = (status: string) => {
        setPaymentFilter(status);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    const filteredOrders = orders.filter((order) => {
        return (
            (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (paymentFilter ? order.paymentStatus === paymentFilter : true) &&
            (statusFilter ? order.orderStatus === statusFilter : true)
        );
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>

            {/* Search Bar */}
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tìm mã đơn hàng hoặc tên khách hàng"
                    className="px-4 py-2 w-1/3 border rounded-md"
                />
            </div>

            {/* Orders Table */}
            <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Mã đơn hàng</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Khách hàng</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Địa chỉ</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Số điện thoại</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Giá</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">
                            Thanh toán
                            <select
                                className="ml-2 py-1 px-2 border rounded-md"
                                onChange={(e) => handlePaymentFilter(e.target.value)}
                                value={paymentFilter}
                            >
                                <option value="">Tất cả</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                                <option value="Chưa thanh toán">Chưa thanh toán</option>
                            </select>
                        </th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">
                            Trạng thái
                            <select
                                className="ml-2 py-1 px-2 border rounded-md"
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                value={statusFilter}
                            >
                                <option value="">Tất cả</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Giao hàng thành công">Giao hàng thành công</option>
                            </select>
                        </th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.orderCode} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-sm">{order.orderCode}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.customerName}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.address}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.phone}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.price}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.paymentStatus}</td>
                            <td className="py-2 px-4 border-b text-sm">{order.orderStatus}</td>
                            <td className="py-2 px-4 border-b text-sm">
                                <LuScanEye
                                    className="inline-block mr-2 text-2xl hover:text-green-600 cursor-pointer transition duration-300 ease-in-out"
                                    onClick={() => handleViewDetails(order)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h3>
                        <p><strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}</p>
                        <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                        <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                        <p><strong>Giá:</strong> {selectedOrder.price}</p>
                        <p><strong>Thanh toán:</strong> {selectedOrder.paymentStatus}</p>
                        <p><strong>Trạng thái:</strong> {selectedOrder.orderStatus}</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOrderPage;
