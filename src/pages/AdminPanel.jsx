import React, { useEffect, useState } from "react";
import VariationEditor from "../components/VariationEditor";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    status: "In Stock",
    image: "",
    description: "",
    variations: [],
  });

  // COUPON STATE
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    maxUses: "",
    productIds: "",
  });

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Fetch coupons
  useEffect(() => {
    fetch("http://localhost:4000/api/coupons")
      .then(res => res.json())
      .then(setCoupons);
  }, []);

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({
      name: "",
      status: "In Stock",
      image: "",
      description: "",
      variations: [],
    });
  }, [editing]);

  // Add or update product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || form.variations.length === 0) {
      alert("Name & at least 1 variation required");
      return;
    }
    if (editing) {
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
      fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => setProducts([...products, data.product]));
    }
    setForm({
      name: "",
      status: "In Stock",
      image: "",
      description: "",
      variations: [],
    });
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

  // ---- COUPON LOGIC ----
  const handleCouponSubmit = (e) => {
    e.preventDefault();
    const ids = couponForm.productIds
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(Number);

    fetch("http://localhost:4000/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: couponForm.code.trim(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
        productIds: ids,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setCouponForm({
          code: "",
          discountType: "flat",
          discountValue: "",
          maxUses: "",
          productIds: "",
        });
        // Reload coupons list
        fetch("http://localhost:4000/api/coupons")
          .then(res => res.json())
          .then(setCoupons);
      });
  };

  const handleDeleteCoupon = (id) => {
    fetch(`http://localhost:4000/api/coupons/${id}`, { method: "DELETE" })
      .then(() => {
        setCoupons(coupons.filter(c => c.id !== id));
      });
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Admin Panel</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#181e20] border border-[#22282c] p-5 rounded-xl mb-8 flex flex-col gap-3"
      >
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

        {/* Variations */}
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
              onClick={handleCancel}
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
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

      {/* ---- Coupon Management Section ---- */}
      <hr className="my-8 border-gray-700" />
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Coupon Management</h2>
      <form
        onSubmit={handleCouponSubmit}
        className="bg-[#181e20] border border-[#22282c] p-4 rounded-xl mb-6 flex flex-col gap-2"
      >
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Coupon Code"
            className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white w-32"
            value={couponForm.code}
            onChange={e => setCouponForm(f => ({ ...f, code: e.target.value }))}
            required
          />
          <select
            className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white w-28"
            value={couponForm.discountType}
            onChange={e => setCouponForm(f => ({ ...f, discountType: e.target.value }))}
          >
            <option value="flat">Flat ($)</option>
            <option value="percent">Percent (%)</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white w-24"
            value={couponForm.discountValue}
            onChange={e => setCouponForm(f => ({ ...f, discountValue: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Max Uses"
            className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white w-20"
            value={couponForm.maxUses}
            onChange={e => setCouponForm(f => ({ ...f, maxUses: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Product IDs (comma, blank=all)"
            className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white w-44"
            value={couponForm.productIds}
            onChange={e => setCouponForm(f => ({ ...f, productIds: e.target.value }))}
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1 rounded font-semibold"
          >
            Create Coupon
          </button>
        </div>
      </form>

      {/* List coupons */}
      <div className="space-y-2">
        {coupons.length === 0 && <div className="text-gray-400">No coupons yet.</div>}
        {coupons.map(c => (
          <div
            key={c.id}
            className="flex items-center justify-between bg-[#20272a] border border-[#22282c] rounded p-2"
          >
            <div>
              <span className="font-mono text-yellow-400">{c.code}</span>
              {" — "}
              {c.discountType === "flat"
                ? <>${c.discountValue} off</>
                : <>{c.discountValue}% off</>}
              {c.maxUses && (
                <span className="ml-2 text-xs text-gray-400">({c.used || 0}/{c.maxUses} used)</span>
              )}
              {c.productIds && c.productIds.length > 0 && (
                <span className="ml-2 text-xs text-green-400">Product IDs: [{c.productIds.join(", ")}]</span>
              )}
            </div>
            <button
              onClick={() => handleDeleteCoupon(c.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {/* ---- End coupon section ---- */}
    </div>
  );
}

export default AdminPanel;