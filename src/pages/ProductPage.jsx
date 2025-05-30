// src/pages/ProductPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the product with the matching id
  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4 text-red-400">Product Not Found</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-[#181e20] border border-[#22282c] rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
        {/* Wide image container for banners/logos */}
        <div className="w-40 h-28 mb-4 rounded-lg overflow-hidden border border-[#232a32] bg-[#20272a] shadow-sm flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-green-400 text-center">{product.name}</h1>
        <p className="text-lg font-semibold text-green-300 mb-2">{product.price}</p>
        <span className={`text-xs mb-4 px-3 py-1 rounded-full ${product.status === "In Stock" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
          {product.status}
        </span>
        {/* Placeholder for more info */}
        <p className="text-gray-300 text-center mb-4">Get instant access after payment. Please enter your contact details below to receive your order.</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-green-400 mt-2 underline hover:text-green-300"
        >
          ← Back to shop
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
