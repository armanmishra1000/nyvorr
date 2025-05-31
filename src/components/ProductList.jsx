import React from "react";

function ProductList({ products, onDelete, onEdit }) {
  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div key={p.id} className="bg-[#20272a] border border-[#22282c] rounded-xl flex items-center p-4 gap-4">
          <img src={p.image} alt={p.name} className="w-16 h-16 object-contain rounded" />
          <div className="flex-1">
            <div className="font-bold text-lg text-green-400">{p.name}</div>
            <div className="text-gray-300">{p.price} | {p.status}</div>
            {p.description && (
              <div className="text-gray-500 text-sm mt-1">{p.description}</div>
            )}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
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

export default ProductList;