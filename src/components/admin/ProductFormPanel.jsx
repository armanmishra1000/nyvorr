import React from "react";
import VariationEditor from "../VariationEditor";

function ProductFormPanel({ form, setForm, onSubmit, editing, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Product Name"
        className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
      />
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
      <VariationEditor
        variations={form.variations}
        setVariations={vars => setForm(f => ({ ...f, variations: vars }))}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold"
        >
          {editing ? "Update" : "Add"} Product
        </button>
        {editing && (
          <button
            onClick={onCancel}
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductFormPanel;