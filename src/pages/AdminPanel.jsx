import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    status: "In Stock",
    image: "",
    description: ""
  });

  // Fetch products from backend API
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Add product - POST to backend
  const addProduct = async (e) => {
    e.preventDefault();
    let img = newProduct.image.trim();
    if (!img) img = "/images/no-image.png";
    else if (!img.startsWith("/") && !img.startsWith("http") && !img.startsWith("images/")) {
      img = "/images/" + img.replace(/^.*[\\/]/, "");
    } else if (img.startsWith("images/")) {
      img = "/" + img;
    }
    const productToAdd = {
      name: newProduct.name,
      price: newProduct.price,
      status: newProduct.status,
      image: img,
      description: newProduct.description,
    };
    // POST to backend API
    const res = await fetch("http://localhost:4000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productToAdd),
    });
    const data = await res.json();
    setProducts(products.concat(data.product));
    setNewProduct({
      name: "",
      price: "",
      status: "In Stock",
      image: "",
      description: ""
    });
  };

  // Delete product - DELETE from backend
  const removeProduct = async (id) => {
    await fetch(`http://localhost:4000/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Admin Panel</h1>
      <form onSubmit={addProduct} className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Product Name"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Price (e.g. $4.99)"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image path (e.g. /images/netflix.png)"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={newProduct.image}
          onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <select
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={newProduct.status}
          onChange={e => setNewProduct({ ...newProduct, status: e.target.value })}
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <textarea
          placeholder="Product Description"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold mt-2"
        >
          Add Product
        </button>
      </form>
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
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              onClick={() => removeProduct(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;