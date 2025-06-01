import React, { useEffect, useState } from "react";
import ProductFormPanel from "../components/admin/ProductFormPanel";
import ProductListPanel from "../components/admin/ProductListPanel";
import CouponPanel from "../components/admin/CouponPanel";

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

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
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

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">Admin Panel</h1>
      <ProductFormPanel
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editing={editing}
        onCancel={handleCancel}
      />
      <ProductListPanel
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CouponPanel products={products} />
    </div>
  );
}

export default AdminPanel;