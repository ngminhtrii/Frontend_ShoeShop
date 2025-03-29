import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

// Define the data type for categories
interface Category {
    id: string;
    code: string;
    name: string;
    image: string;
}

const ListCategoriesPage: React.FC = () => {
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([
        {
            id: 'CM001',
            code: 'DM001',
            name: 'Laptop',
            image: 'https://via.placeholder.com/50',
        },
        {
            id: 'CM002',
            code: 'DM002',
            name: 'Màn hình',
            image: 'https://via.placeholder.com/50',
        },
    ]);


    const handleBack = () => {
        setIsSearchVisible(false);
        setSearchQuery('');
    };

    const filteredCategories = categories.filter((category) => {
        return (
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const toggleSearchVisibility = () => {
        setIsSearchVisible(true);
    };

    const handleDeleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((category) => category.id !== id));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Danh sách danh mục</h2>

            {/* Search Bar */}
            <div className="mb-4 flex items-center">
                {!isSearchVisible && (
                    <button
                        onClick={toggleSearchVisibility}
                        className="bg-sky-600/60 text-white px-3 py-2 rounded-md hover:bg-sky-600"
                    >
                        <IoIosSearch className="inline-block mr-2" />
                        Tìm kiếm
                    </button>
                )}
                {isSearchVisible && (
                    <div className="mb-4 flex items-center w-1/3">
                        <IoIosSearch
                            onClick={handleBack}
                            className="text-gray-400 cursor-pointer mr-2"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Nhập tên hoặc mã danh mục"
                            className="px-4 py-2 w-full border rounded-md"
                        />
                    </div>

                )}
            </div>
            {/* Add Category Button */}
            <button
                className="bg-green-500 hover:bg-green-600  text-white px-4 py-2 rounded-md mb-6"
            >
                + Thêm Danh Mục
            </button>
            {/* Categories Table */}
            <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">ID</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Mã Danh Mục</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Tên Danh Mục</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Hình Ảnh</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-sm">{category.id}</td>
                            <td className="py-2 px-4 border-b text-sm">{category.code}</td>
                            <td className="py-2 px-4 border-b text-sm">{category.name}</td>
                            <td className="py-2 px-4 border-b text-sm">
                                <img
                                    src={category.image}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            </td>
                            <td className="py-2 px-4 border-b text-sm">
                                <button
                                    onClick={() => alert('Edit functionality to be implemented')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                                >
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

export default ListCategoriesPage;
