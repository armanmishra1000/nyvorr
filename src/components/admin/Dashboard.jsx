import React, { useState, useEffect } from 'react';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign, FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import { adminApi } from '../../services/adminApi';

const StatCard = ({ title, value, change, icon: Icon, isPositive }) => (
  <div className="bg-[#1e272e] rounded-lg p-6 shadow-md border border-[#232a32]">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          <span>{change}% from last month</span>
        </div>
      </div>
      <div className="p-3 rounded-full bg-[#2a3a3a] text-green-400">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-[#1e272e] rounded-lg p-6 shadow-md border border-[#232a32] mt-6">
    <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start pb-4 border-b border-[#2a3a3a] last:border-0 last:pb-0">
          <div className={`p-2 rounded-full ${activity.type === 'order' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
            {activity.type === 'order' ? <FaShoppingCart /> : <FaUsers />}
          </div>
          <div className="ml-4">
            <p className="text-sm text-white">{activity.message}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    salesChange: 0,
    ordersChange: 0,
    usersChange: 0,
    revenueChange: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch real data from API
      const [statsResponse, activitiesResponse] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentActivities(5)
      ]);
      
      setStats({
        totalSales: statsResponse.totalSales || 0,
        totalOrders: statsResponse.totalOrders || 0,
        totalUsers: statsResponse.totalUsers || 0,
        totalRevenue: statsResponse.totalRevenue || 0,
        salesChange: statsResponse.salesChange || 0,
        ordersChange: statsResponse.ordersChange || 0,
        usersChange: statsResponse.usersChange || 0,
        revenueChange: statsResponse.revenueChange || 0
      });
      
      setRecentActivities(activitiesResponse || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error in fetchDashboardData:', err);
      setError('Failed to load dashboard data. Using sample data for demonstration.');
      
      // Fallback to mock data
      setStats({
        totalSales: 1245,
        totalOrders: 89,
        totalUsers: 342,
        totalRevenue: 12560.75,
        salesChange: 12.5,
        ordersChange: 8.3,
        usersChange: 5.2,
        revenueChange: 18.7
      });
      
      setRecentActivities([
        { type: 'order', message: 'New order #ORD-1234 received', time: '2 minutes ago' },
        { type: 'user', message: 'New user registered: test@example.com', time: '1 hour ago' },
        { type: 'order', message: 'Order #ORD-1233 marked as completed', time: '3 hours ago' },
        { type: 'user', message: 'Password reset requested', time: '5 hours ago' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#1e272e] rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-[#1e272e] rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2a1a1a] border border-red-900 text-red-200 p-6 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
          <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
        </div>
        <p className="mt-2">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-md text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales.toLocaleString()}
          change={stats.salesChange}
          icon={FaBox}
          isPositive={stats.salesChange >= 0}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersChange}
          icon={FaShoppingCart}
          isPositive={stats.ordersChange >= 0}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={stats.usersChange}
          icon={FaUsers}
          isPositive={stats.usersChange >= 0}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={stats.revenueChange}
          icon={FaDollarSign}
          isPositive={stats.revenueChange >= 0}
        />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
