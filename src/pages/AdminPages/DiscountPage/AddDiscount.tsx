import { useState } from "react";
import { discountApi } from "../../../services/DiscountService";

interface AddDiscountProps {
  handleClose: () => void;
}

const initialForm = {
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

const AddDiscount: React.FC<AddDiscountProps> = ({ handleClose }) => {
  const [form, setForm] = useState(initialForm);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      await discountApi.createAdminCoupon(data);
      handleClose();
    } catch (err) {
      alert("Thêm phiếu giảm giá thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded shadow-lg w-96"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-bold mb-4">Thêm Coupon</h3>
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
          placeholder={form.type === "percent" ? "Giá trị (%)" : "Số tiền giảm"}
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
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiscount;
