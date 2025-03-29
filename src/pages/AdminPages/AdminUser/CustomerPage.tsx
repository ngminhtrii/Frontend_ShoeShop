import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

// Define the data type for customers
interface Customer {
    id: string;
    customerCode: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ListCustomerPage: React.FC = () => {
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [customers] = useState<Customer[]>([
        {
            id: 'KH001',
            customerCode: 'KH001',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            phone: '0123321012',
            address: '905 D. Kha Van Cân, Linh Chiều, Thủ Đức, Hồ Chí Minh',
        },
        {
            id: 'KH002',
            customerCode: 'KH002',
            name: 'Nguyễn Văn B',
            email: 'nguyenvanb@gmail.com',
            phone: '0123321012',
            address: '905 D. Kha Van Cân, Linh Chiều, Thủ Đức, Hồ Chí Minh',
        }
    ]);

    const filteredCustomers = customers.filter((customer) => {
        return (
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleSearchVisibility = () => {
        setIsSearchVisible(true);
    };

    const handleBack = () => {
        setIsSearchVisible(false);
        setSearchQuery(''); // Optional: reset the search query when going back
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Danh sách khách hàng</h2>

            {/* Search button */}
            {!isSearchVisible && (
                <button
                    onClick={toggleSearchVisibility}
                    className="bg-sky-600/60 text-white px-3 py-2 rounded-md mb-4 hover:bg-sky-600"
                >
                    <IoIosSearch className="inline-block mr-2" />
                    Tìm kiếm
                </button>
            )}

            {/* Conditionally render the search bar with the Back icon */}
            {isSearchVisible && (
                <div className="mb-4 flex items-center rounded-md">
                    <IoIosSearch
                        onClick={handleBack}
                        className="text-gray-400 cursor-pointer mr-2"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Tìm theo tên hoặc email"
                        className="px-4 py-2 w-1/3 "
                    />
                </div>
            )}

            <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">ID</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Mã Khách Hàng</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Tên Khách Hàng</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Email</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Số Điện Thoại</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Địa Chỉ</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-bold">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-sm">{customer.id}</td>
                            <td className="py-2 px-4 border-b text-sm">{customer.customerCode}</td>
                            <td className="py-2 px-4 border-b text-sm">{customer.name}</td>
                            <td className="py-2 px-4 border-b text-sm">{customer.email}</td>
                            <td className="py-2 px-4 border-b text-sm">{customer.phone}</td>
                            <td className="py-2 px-4 border-b text-sm">{customer.address}</td>
                            <td className="py-2 px-4 border-b text-sm">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mr-2">
                                    Sửa
                                </button>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md">
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListCustomerPage;
