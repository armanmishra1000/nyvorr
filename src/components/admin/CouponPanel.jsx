import React, { useState, useEffect } from "react";

function CouponPanel({ products }) {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    maxUses: "",
    productIds: ""
  });

  // Fetch coupons on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/coupons")
      .then(res => res.json())
      .then(setCoupons);
  }, []);

  // Add coupon
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const { code, discountType, discountValue, maxUses, productIds } = form;
    if (!code || !discountType || !discountValue) return alert("All fields required.");
    fetch("http://localhost:4000/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType,
        discountValue: Number(discountValue),
        maxUses: maxUses ? Number(maxUses) : undefined,
        productIds: productIds
          ? productIds.split(",").map(id => Number(id.trim())).filter(Boolean)
          : [],
      }),
    })
      .then(res => res.json())
      .then(() => {
        setForm({ code: "", discountType: "flat", discountValue: "", maxUses: "", productIds: "" });
        fetch("http://localhost:4000/api/coupons")
          .then(res => res.json())
          .then(setCoupons);
      });
  };

  // Delete coupon
  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/coupons/${id}`, { method: "DELETE" })
      .then(() => setCoupons(coupons.filter(c => c.id !== id)));
  };

  return (
    <div className="bg-[#181e20] border border-[#22282c] rounded-xl p-6 mt-10">
      <h2 className="text-lg font-bold text-yellow-300 mb-3">Coupon Management</h2>
      <form className="flex flex-wrap items-end gap-2 mb-4" onSubmit={handleCreateCoupon}>
        <input
          className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs"
          placeholder="Coupon Code"
          value={form.code}
          onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
        />
        <select
          className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs"
          value={form.discountType}
          onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
        >
          <option value="flat">Flat ($)</option>
          <option value="percent">Percent (%)</option>
        </select>
        <input
          className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs w-16"
          placeholder="Value"
          type="number"
          value={form.discountValue}
          onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
        />
        <input
          className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs w-16"
          placeholder="Max U"
          type="number"
          value={form.maxUses}
          onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
        />
        <input
          className="px-2 py-1 rounded bg-[#22282c] border border-[#232a32] text-white text-xs w-28"
          placeholder="Product IDs (comma)"
          value={form.productIds}
          onChange={e => setForm(f => ({ ...f, productIds: e.target.value }))}
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-1 rounded text-xs"
        >
          Create Coupon
        </button>
      </form>
      <div className="text-xs">
        {coupons.map(coupon => (
          <div key={coupon.id} className="flex items-center gap-2 border-b border-[#232a32] py-1">
            <span className="font-mono text-yellow-300">{coupon.code}</span>
            <span className="ml-2 text-gray-400">
              — {coupon.discountType === "flat" ? `$${coupon.discountValue}` : `${coupon.discountValue}%`} off
            </span>
            <span className="ml-2 text-gray-400">
              ({coupon.used || 0}/{coupon.maxUses || "∞"} used)
            </span>
            {coupon.productIds && coupon.productIds.length > 0 && (
              <span className="ml-2 text-green-400">Product IDs: [{coupon.productIds.join(", ")}]</span>
            )}
            <button
              className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded text-xs"
              onClick={() => handleDelete(coupon.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouponPanel;