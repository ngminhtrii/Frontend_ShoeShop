import { useState, useEffect } from "react";
import { discountApi } from "../../../services/DiscountService";
import AddDiscount from "./AddDiscount";

interface Discount {
  id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  maxDiscount?: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  currentUses: number;
  status: string;
  isPublic: boolean;
}

const initialForm: Omit<Discount, "id" | "currentUses" | "status"> = {
  code: "",
  description: "",
  type: "percent",
  value: 0,
  maxDiscount: 0,
  minOrderValue: 0,
  startDate: "",
  endDate: "",
  maxUses: 1,
  isPublic: true,
};

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await discountApi.getAllAdminCoupons();
      const coupons = res.data.coupons || res.data.data || [];
      setDiscounts(
        coupons.map((c: any) => ({
          id: c._id,
          code: c.code,
          description: c.description,
          type: c.type,
          value: c.value,
          maxDiscount: c.maxDiscount,
          minOrderValue: c.minOrderValue,
          startDate: c.startDate ? c.startDate.slice(0, 10) : "",
          endDate: c.endDate ? c.endDate.slice(0, 10) : "",
          maxUses: c.maxUses,
          currentUses: c.currentUses,
          status: c.status,
          isPublic: c.isPublic,
        }))
      );
    } catch {
      setDiscounts([]);
    }
  };

  // Sửa
  const handleEditDiscount = (discount: Discount) => {
    setEditDiscount(discount);
    setForm({
      code: discount.code,
      description: discount.description,
      type: discount.type,
      value: discount.value,
      maxDiscount: discount.maxDiscount || 0,
      minOrderValue: discount.minOrderValue,
      startDate: discount.startDate,
      endDate: discount.endDate,
      maxUses: discount.maxUses,
      isPublic: discount.isPublic,
    });
    setShowEdit(true);
  };

  const handleUpdateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDiscount) return;
    const data: any = {
      code: form.code,
      description: form.description,
      type: form.type,
      value: form.value,
      minOrderValue: form.minOrderValue,
      startDate: form.startDate,
      endDate: form.endDate,
      maxUses: form.maxUses,
      isPublic: form.isPublic,
    };
    if (form.type === "percent") {
      data.maxDiscount = form.maxDiscount;
    }
    try {
      await discountApi.updateAdminCoupon(editDiscount.id, data);
      setShowEdit(false);
      setEditDiscount(null);
      setForm(initialForm);
      fetchDiscounts();
    } catch {
      alert("Cập nhật coupon thất bại!");
    }
  };

  // Xóa
  const handleDeleteDiscount = async (discount: Discount) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa coupon này?")) return;
    try {
      await discountApi.deleteAdminCoupon(discount.id);
      fetchDiscounts();
    } catch {
      alert("Xóa coupon thất bại!");
    }
  };

  // Đổi trạng thái
  const handleUpdateStatus = async (discount: Discount, status: string) => {
    try {
      await discountApi.updateAdminCouponStatus(discount.id, status);
      fetchDiscounts();
    } catch {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  // Form change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (
      name === "value" ||
      name === "maxDiscount" ||
      name === "minOrderValue" ||
      name === "maxUses"
    ) {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý Coupon</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setShowAdd(true);
            setForm(initialForm);
          }}
        >
          Thêm coupon
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border text-center">#</th>
              <th className="py-2 px-4 border text-center">Mã</th>
              <th className="py-2 px-4 border text-center">Mô tả</th>
              <th className="py-2 px-4 border text-center">Loại</th>
              <th className="py-2 px-4 border text-center">Giá trị</th>
              <th className="py-2 px-4 border text-center">Giảm tối đa</th>
              <th className="py-2 px-4 border text-center">Đơn tối thiểu</th>
              <th className="py-2 px-4 border text-center">Ngày bắt đầu</th>
              <th className="py-2 px-4 border text-center">Ngày kết thúc</th>
              <th className="py-2 px-4 border text-center">Lượt dùng</th>
              <th className="py-2 px-4 border text-center">Tối đa</th>
              <th className="py-2 px-4 border text-center">Trạng thái</th>
              <th className="py-2 px-4 border text-center">Công khai</th>
              <th className="py-2 px-4 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount, idx) => (
              <tr key={discount.id}>
                <td className="py-2 px-4 border text-center">{idx + 1}</td>
                <td className="py-2 px-4 border text-center">
                  {discount.code}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.description}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.type === "percent" ? "Phần trăm" : "Cố định"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.type === "percent"
                    ? `${discount.value}%`
                    : `${discount.value.toLocaleString()}đ`}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.type === "percent"
                    ? discount.maxDiscount?.toLocaleString()
                    : "-"}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.minOrderValue.toLocaleString()}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.startDate}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.endDate}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.currentUses}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.maxUses}
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.status === "active" ? (
                    <span className="text-green-600">Đang hoạt động</span>
                  ) : (
                    <span className="text-gray-500">Ngừng</span>
                  )}
                  <br />
                  <button
                    className="text-xs px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white mt-1"
                    onClick={() =>
                      handleUpdateStatus(
                        discount,
                        discount.status === "active" ? "inactive" : "active"
                      )
                    }
                  >
                    {discount.status === "active" ? "Ngừng" : "Kích hoạt"}
                  </button>
                </td>
                <td className="py-2 px-4 border text-center">
                  {discount.isPublic ? "Có" : "Không"}
                </td>
                <td className="py-2 px-4 border text-center">
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => handleEditDiscount(discount)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm */}
      {showAdd && (
        <AddDiscount
          handleClose={() => {
            setShowAdd(false);
            fetchDiscounts();
          }}
        />
      )}

      {/* Modal Sửa */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-96"
            onSubmit={handleUpdateDiscount}
          >
            <h3 className="text-lg font-bold mb-4">Sửa Coupon</h3>
            <input
              className="w-full border px-2 py-1 mb-2"
              name="code"
              placeholder="Mã coupon"
              value={form.code}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full border px-2 py-1 mb-2"
              name="description"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
              required
            />
            <select
              className="w-full border px-2 py-1 mb-2"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định</option>
            </select>
            <input
              className="w-full border px-2 py-1 mb-2"
              name="value"
              type="number"
              placeholder={
                form.type === "percent" ? "Giá trị (%)" : "Số tiền giảm"
              }
              value={form.value}
              onChange={handleChange}
              required
              min={1}
            />
            {form.type === "percent" && (
              <input
                className="w-full border px-2 py-1 mb-2"
                name="maxDiscount"
                type="number"
                placeholder="Giảm tối đa (VND)"
                value={form.maxDiscount}
                onChange={handleChange}
                min={0}
              />
            )}
            <input
              className="w-full border px-2 py-1 mb-2"
              name="minOrderValue"
              type="number"
              placeholder="Đơn tối thiểu (VND)"
              value={form.minOrderValue}
              onChange={handleChange}
              min={0}
            />
            <input
              className="w-full border px-2 py-1 mb-2"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border px-2 py-1 mb-2"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border px-2 py-1 mb-2"
              name="maxUses"
              type="number"
              placeholder="Số lượt sử dụng tối đa"
              value={form.maxUses}
              onChange={handleChange}
              min={1}
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
                className="mr-2"
              />
              Công khai
            </label>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEdit(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
