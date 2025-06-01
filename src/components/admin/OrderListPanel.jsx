import React, { useEffect, useState } from "react";

function OrderListPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/order/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#181e20] border border-[#22282c] rounded-xl p-6 overflow-x-auto">
      <h2 className="text-lg font-bold text-green-300 mb-4">Order History</h2>
      {loading ? (
        <div className="text-yellow-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400">No orders found.</div>
      ) : (
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-green-400 border-b border-[#232a32]">
              <th className="py-2 pr-2">Order ID</th>
              <th className="py-2 pr-2">Product</th>
              <th className="py-2 pr-2">Email</th>
              <th className="py-2 pr-2">Telegram</th>
              <th className="py-2 pr-2">Amount</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2 pr-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id} className="border-b border-[#22282c] hover:bg-[#23272c]">
                <td className="py-1 pr-2 font-mono">{order.order_id}</td>
                <td className="py-1 pr-2">{order.product_name}</td>
                <td className="py-1 pr-2">{order.email}</td>
                <td className="py-1 pr-2">{order.telegram}</td>
                <td className="py-1 pr-2 font-mono">${order.amount}</td>
                <td className="py-1 pr-2">
                  <span className={
                    order.status === "Paid"
                      ? "text-green-400 font-bold"
                      : order.status === "Failed"
                      ? "text-red-400 font-bold"
                      : "text-yellow-400"
                  }>
                    {order.status}
                  </span>
                </td>
                <td className="py-1 pr-2">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderListPanel;