// src/components/VariationEditor.jsx
import React, { useState } from "react";

function VariationEditor({ variations, setVariations }) {
  const [newLabel, setNewLabel] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addVariation = (e) => {
    e.preventDefault();
    if (!newLabel || !newPrice) return;
    setVariations([...variations, { label: newLabel, price: newPrice }]);
    setNewLabel("");
    setNewPrice("");
  };

  const removeVariation = (idx) => {
    setVariations(variations.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block font-semibold mb-1 text-green-300">Product Variations</label>
      {variations.map((v, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <input value={v.label} readOnly className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-36"/>
          <input value={v.price} readOnly className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-24"/>
          <button className="bg-red-500 text-white px-2 rounded" onClick={() => removeVariation(i)}>Delete</button>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Label (e.g. 1 Month)"
          className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-36"
        />
        <input
          value={newPrice}
          onChange={e => setNewPrice(e.target.value)}
          placeholder="Price (e.g. $4.99)"
          className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-24"
        />
        <button
          type="button"
          className="bg-green-600 text-white px-3 rounded"
          onClick={addVariation}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default VariationEditor;