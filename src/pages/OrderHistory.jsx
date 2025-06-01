// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function OrderHistory() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://localhost:4000/api/order/my-orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [token]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-400 font-bold">You need to login to view your orders.</div>
        <Link to="/login" className="text-green-400 underline mt-4">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">My Orders</h2>
      {loading ? (
        <div className="text-green-300 text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 text-center">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#232a32] bg-[#181e20] rounded-xl">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left">Order ID</th>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id || order.order_id}>
                  <td className="px-3 py-2 font-mono text-xs">{order.order_id}</td>
                  <td className="px-3 py-2">{order.product_name}</td>
                  <td className="px-3 py-2">${order.amount}</td>
                  <td className={`px-3 py-2 font-semibold ${order.status === "Paid" ? "text-green-400" : order.status === "Pending" ? "text-yellow-400" : "text-red-400"}`}>
                    {order.status}
                  </td>
                  <td className="px-3 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;