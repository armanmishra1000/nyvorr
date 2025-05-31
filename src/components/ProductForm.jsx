import React, { useState, useEffect } from "react";

function ProductForm({ onSubmit, initial, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: "", price: "", status: "In Stock", image: "", description: "" }
  );

  // If "initial" changes (editing a new product), update form state
  useEffect(() => {
    setForm(initial || { name: "", price: "", status: "In Stock", image: "", description: "" });
  }, [initial]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
        setForm({ name: "", price: "", status: "In Stock", image: "", description: "" });
      }}
      className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3"
    >
      <input
        name="name"
        type="text"
        placeholder="Product Name"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="text"
        placeholder="Price (e.g. $4.99)"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="image"
        type="text"
        placeholder="Image path (e.g. /images/netflix.png)"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.image}
        onChange={handleChange}
      />
      <select
        name="status"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.status}
        onChange={handleChange}
      >
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <textarea
        name="description"
        placeholder="Product Description"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.description}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold mt-2"
        >
          {initial ? "Update Product" : "Add Product"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold mt-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;