// src/components/Products.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";

function Products() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto mt-8 sm:mt-12 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#181e20] border border-[#22282c] rounded-xl shadow-md p-4 flex flex-col items-center transition hover:scale-[1.03] hover:border-green-400"
          >
            {/* BIG PRODUCT IMAGE, FULL WIDTH */}
            <div className="w-full h-40 mb-4 rounded-xl overflow-hidden border border-[#232a32] bg-[#20272a] shadow-sm flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition hover:scale-105"
                draggable={false}
              />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-1 text-center">{product.name}</h3>
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-green-400 font-bold">{product.price}</span>
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  product.status === "In Stock"
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {product.status}
              </span>
            </div>
            <button
              className={`w-full py-2 mt-auto rounded-lg font-semibold text-sm transition ${
                product.status === "In Stock"
                  ? "bg-green-500 hover:bg-green-600 text-black"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
              disabled={product.status !== "In Stock"}
              onClick={() => {
                if (product.status === "In Stock") {
                  navigate(`/product/${product.id}`);
                }
              }}
            >
              {product.status === "In Stock" ? "Buy Now" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
