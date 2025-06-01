import React from "react";

function ProductVariationSelector({ product, selectedVariation, setSelectedVariation }) {
  if (Array.isArray(product.variations) && product.variations.length > 0) {
    return (
      <div className="w-full mb-4">
        <label className="block mb-1 text-gray-300 font-medium">Select Plan:</label>
        <select
          className="w-full px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={selectedVariation?.label || ""}
          onChange={e =>
            setSelectedVariation(
              product.variations.find(v => v.label === e.target.value)
            )
          }
        >
          {product.variations.map((v) => (
            <option key={v.label} value={v.label}>
              {v.label} — {v.price}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <p className="text-lg font-semibold text-green-300 mb-2">
      {product.price}
    </p>
  );
}

export default ProductVariationSelector;