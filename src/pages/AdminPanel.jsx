import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  // Add or update product
  const handleSubmit = (form) => {
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
      <ProductForm
        onSubmit={handleSubmit}
        initial={editing}
        onCancel={editing ? handleCancel : undefined}
      />
      <ProductList
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default AdminPanel;