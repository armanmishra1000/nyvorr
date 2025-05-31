import React, { useEffect, useState } from "react";

function VariationEditor({ variations, setVariations }) {
  const [newLabel, setNewLabel] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addVariation = e => {
    e.preventDefault();
    if (!newLabel || !newPrice) return;
    setVariations([...variations, { label: newLabel, price: newPrice }]);
    setNewLabel("");
    setNewPrice("");
  };

  const removeVariation = idx => {
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
      <form className="flex gap-2 mt-2" onSubmit={addVariation}>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (e.g. 1 Month)" className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-36"/>
        <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price (e.g. $4.99)" className="bg-[#22282c] border border-[#232a32] text-white px-2 py-1 rounded w-24"/>
        <button type="submit" className="bg-green-600 text-white px-3 rounded">Add</button>
      </form>
    </div>
  );
}

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", status: "In Stock", image: "", description: "", variations: [] });

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({ name: "", status: "In Stock", image: "", description: "", variations: [] });
  }, [editing]);

  // Add or update product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || form.variations.length === 0) return alert("Name & at least 1 variation required");
    if (editing) {
      // Edit
      fetch(`http://localhost:4000/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => {
          setProducts(products.map(p => (p.id === editing.id ? data.product : p)));
          setEditing(null);
        });
    } else {
      // Add
      fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => setProducts([...products, data.product]));
    }
    setForm({ name: "", status: "In Stock", image: "", description: "", variations: [] });
  };

  // Delete product
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/products/${id}`, { method: "DELETE" })
      .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  // Edit button click
  const handleEdit = (product) => setEditing(product);

  // Cancel editing
  const handleCancel = () => setEditing(null);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Product Name"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image path (e.g. /images/netflix.png)"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
        />
        <select
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <textarea
          placeholder="Product Description"
          className="px-3 py-2 rounded bg-[#22282c] border border-[#232a32] text-white"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <VariationEditor
          variations={form.variations}
          setVariations={vars => setForm(f => ({ ...f, variations: vars }))}
        />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold">{editing ? "Update" : "Add"} Product</button>
          {editing && (
            <button onClick={handleCancel} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>

      {/* Products List */}
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-[#20272a] border border-[#22282c] rounded-xl flex items-center p-4 gap-4">
            <img src={p.image} alt={p.name} className="w-16 h-16 object-contain rounded" />
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
              onClick={() => handleEdit(p)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              onClick={() => handleDelete(p.id)}
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