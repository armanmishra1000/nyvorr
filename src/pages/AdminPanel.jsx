import React, { useState } from "react";
import ProductFormPanel from "../components/admin/ProductFormPanel";
import ProductListPanel from "../components/admin/ProductListPanel";
import CouponPanel from "../components/admin/CouponPanel";
import UserListPanel from "../components/admin/UserListPanel";
import OrderListPanel from "../components/admin/OrderListPanel";
import Dashboard from "../components/admin/Dashboard";

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "coupons", label: "Coupons", icon: "🎟️" },
  { key: "orders", label: "Orders", icon: "📝" },
  { key: "users", label: "Users", icon: "👥" }
];

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Product state
  const [products, setProducts] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({
    name: "",
    status: "In Stock",
    image: "",
    description: "",
    variations: [],
  });

  React.useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  React.useEffect(() => {
    if (editing) setForm(editing);
    else setForm({
      name: "",
      status: "In Stock",
      image: "",
      description: "",
      variations: [],
    });
  }, [editing]);

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

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/products/${id}`, { method: "DELETE" })
      .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  const handleEdit = (product) => setEditing(product);
  const handleCancel = () => setEditing(null);

  function renderSection() {
    if (activeSection === "dashboard") {
      return <Dashboard />;
    }
    if (activeSection === "products") {
      return (
        <>
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
        </>
      );
    }
    if (activeSection === "coupons") {
      return <CouponPanel products={products} />;
    }
    if (activeSection === "orders") {
      return <OrderListPanel />; // Show orders
    }
    if (activeSection === "users") {
      return <UserListPanel />;
    }
    return null;
  }

  return (
    <div className="flex min-h-[80vh] w-full">
      {/* Sidebar */}
      <aside className="w-56 bg-[#171e21] border-r border-[#232a32] flex flex-col p-0 min-h-screen">
        <div className="p-6 border-b border-[#232a32]">
          <h2 className="text-xl font-bold text-green-400">Admin Panel</h2>
          <p className="text-xs text-gray-400">Welcome back, Admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center px-6 py-3 w-full text-sm transition-colors ${
                activeSection === s.key
                  ? "bg-[#232a32] text-green-400 border-r-4 border-green-500 font-medium"
                  : "text-gray-300 hover:bg-[#20272a]"
              }`}
            >
              <span className="mr-3 text-lg">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">
          {SECTIONS.find(s => s.key === activeSection)?.label} Management
        </h1>
        <div>{renderSection()}</div>
      </main>
    </div>
  );
}

export default AdminPanel;