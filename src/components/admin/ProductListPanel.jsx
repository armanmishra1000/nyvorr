import React from "react";
import "./../../index.css"; // <-- Make sure your CSS file is imported if not global

function ProductListPanel({ products, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-[#20272a] border border-[#22282c] rounded-xl flex items-center p-4 gap-4"
        >
          <img
            src={p.image}
            alt={p.name}
            className="product-img-square"
            onError={e => { e.target.src = "/images/netflix.png"; }}
          />
          <div className="flex-1">
            <div className="font-bold text-lg text-green-400">{p.name}</div>
            <div className="text-gray-300">{p.status}</div>
            <div className="text-gray-300 text-sm">
              {p.variations?.map(v => (
                <div key={v.label}>{v.label}: <span className="font-semibold">{v.price}</span></div>
              ))}
            </div>
            {p.description && (
              <div className="text-gray-500 text-sm mt-1">{p.description}</div>
            )}
          </div>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
            onClick={() => onEdit(p)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            onClick={() => onDelete(p.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductListPanel;