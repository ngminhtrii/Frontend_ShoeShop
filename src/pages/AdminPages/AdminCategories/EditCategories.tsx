import React, { useState } from 'react';

const EditCategoryPage: React.FC = () => {
    const [categoryName, setCategoryName] = useState<string>('Laptop');
    const [categoryImage, setCategoryImage] = useState<string>('https://via.placeholder.com/150'); // Default image

    // Handle input change for category name
    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    };

    // Handle file input change for category image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setCategoryImage(reader.result as string); // Update the image preview
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle saving the category changes
        console.log('Category Name:', categoryName);
        console.log('Category Image:', categoryImage);
        // Reset the form after submission
        setCategoryName('');
        setCategoryImage('');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 w-full sm:w-1/3 md:w-1/2 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa danh mục</h2>

                <form onSubmit={handleSubmit}>
                    {/* Category Name */}
                    <div className="mb-4">
                        <label htmlFor="categoryName" className="block text-sm font-bold text-gray-600">Tên Danh mục</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                            placeholder="Nhập tên danh mục"
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Current Category Image Preview */}
                    <div className="mb-4">
                        <label htmlFor="categoryImage" className="block text-sm font-bold text-gray-600">Hình ảnh Danh mục</label>
                        <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 mb-4">
                            <img
                                src={categoryImage}
                                alt="Category Preview"
                                className="object-contain max-w-full max-h-full"
                            />
                        </div>
                    </div>

                    {/* Image File Input */}
                    <div className="mb-4">
                        <label htmlFor="categoryImage" className="block text-sm font-bold text-gray-600">Hình ảnh Danh mục</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-32 h-32 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start gap-4">
                        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-md">
                            Lưu
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCategoryName('');
                                setCategoryImage('');
                            }}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryPage;
