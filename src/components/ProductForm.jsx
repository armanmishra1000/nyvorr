import React, { useState, useEffect } from "react";

const defaultVariation = { label: "", price: "", status: "In Stock" };

function ProductForm({ onSubmit, initial, onCancel }) {
  // If editing, pre-fill, else start empty
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name || "",
          price: initial.price || "",
          status: initial.status || "In Stock",
          image: initial.image || "",
          description: initial.description || "",
          variations: initial.variations ? [...initial.variations] : [],
        }
      : {
          name: "",
          price: "",
          status: "In Stock",
          image: "",
          description: "",
          variations: [],
        }
  );

  // Sync changes if editing a new product
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        price: initial.price || "",
        status: initial.status || "In Stock",
        image: initial.image || "",
        description: initial.description || "",
        variations: initial.variations ? [...initial.variations] : [],
      });
    }
  }, [initial]);

  // --- VARIATIONS LOGIC ---
  const addVariation = () => {
    setForm((f) => ({
      ...f,
      variations: [...(f.variations || []), { ...defaultVariation }],
    }));
  };

  const updateVariation = (idx, field, value) => {
    setForm((f) => {
      const updated = f.variations.map((v, i) =>
        i === idx ? { ...v, [field]: value } : v
      );
      return { ...f, variations: updated };
    });
  };

  const removeVariation = (idx) => {
    setForm((f) => ({
      ...f,
      variations: f.variations.filter((_, i) => i !== idx),
    }));
  };

  // --- SUBMIT ---
  function handleSubmit(e) {
    e.preventDefault();
    // Fallback: If there are variations, ignore base price
    const data = {
      ...form,
      price: form.variations?.length
        ? ""
        : form.price,
      variations: (form.variations || []).filter(v => v.label && v.price),
    };
    onSubmit(data);
    // If adding, reset form
    if (!initial) {
      setForm({
        name: "",
        price: "",
        status: "In Stock",
        image: "",
        description: "",
        variations: [],
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Product Name"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
      />
      {/* Only allow price if no variations */}
      {(form.variations || []).length === 0 && (
        <input
          type="text"
          placeholder="Price (e.g. $4.99)"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          required
        />
      )}
      <input
        type="text"
        placeholder="Image path (e.g. /images/netflix.png)"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.image}
        onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
      />
      <select
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.status}
        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
      >
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <textarea
        placeholder="Product Description"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
      />

      {/* --- VARIATIONS EDITOR (NO NESTED FORM!) --- */}
      <div className="bg-[#20272a] border border-[#232a32] rounded-lg p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-green-400">Product Variations</span>
          <button
            type="button"
            onClick={addVariation}
            className="bg-green-500 hover:bg-green-600 text-black px-2 py-1 rounded text-xs"
          >
            + Add Variation
          </button>
        </div>
        {(form.variations || []).length === 0 && (
          <div className="text-gray-400 text-xs mb-2">
            No variations yet. Click "+ Add Variation" to add.
          </div>
        )}
        {(form.variations || []).map((v, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Label (e.g. 1 Month, 6 Months)"
              className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs w-32"
              value={v.label}
              onChange={e => updateVariation(idx, "label", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Price (e.g. $3.99)"
              className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs w-24"
              value={v.price}
              onChange={e => updateVariation(idx, "price", e.target.value)}
              required
            />
            <select
              className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs"
              value={v.status}
              onChange={e => updateVariation(idx, "status", e.target.value)}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <button
              type="button"
              onClick={() => removeVariation(idx)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
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
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold mt-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;