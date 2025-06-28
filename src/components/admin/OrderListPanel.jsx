import React, { useEffect, useState } from "react";
import { adminApi } from '../../services/adminApi';

function OrderListPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/order/orders");
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        
        // Transform the data to match the expected format
        const formattedOrders = data.map(order => ({
          ...order,
          // If items array doesn't exist, create it from the direct fields
          items: order.items || [{
            name: order.product_name || 'Unknown Product',
            quantity: 1,
            price: order.amount || 0,
            variation: ''
          }]
        }));
        
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-400';
      case 'Processing':
      case 'Shipped':
        return 'text-blue-400';
      case 'Cancelled':
      case 'Failed':
        return 'text-red-400';
      case 'Pending':
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-[#181e20] border border-[#22282c] rounded-xl p-6 overflow-x-auto">
      <h2 className="text-lg font-bold text-green-300 mb-4">Order History</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-yellow-400">Loading orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-gray-400 p-4 text-center">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-green-400 border-b border-[#232a32]">
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2 text-right">Total</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order._id || order.orderNumber}
                  className="border-b border-[#22282c] hover:bg-[#1e2529] transition-colors"
                >
                  <td className="py-3 px-2 font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={`${order._id}-item-${idx}`} className="text-sm">
                          {item.quantity}x {item.name}
                          {item.variation && ` (${item.variation})`}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-sm">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    ${order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderListPanel;