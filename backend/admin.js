const express = require('express');
const router = express.Router();
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const { calculatePercentageChange } = require('./utils/helpers');

// Simple auth middleware for development
const auth = (req, res, next) => {
  // In production, you should verify the JWT token here
  // For development, we'll just check for a token in the header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  next();
};

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', auth, async (req, res) => {
  try {
    // Get current period (this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Get previous period (last month)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get counts for current period
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenueResult,
      lastMonthProducts,
      lastMonthOrders,
      lastMonthUsers,
      lastMonthRevenue
    ] = await Promise.all([
      Product.countDocuments({ createdAt: { $lte: endOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      User.countDocuments({ createdAt: { $lte: endOfMonth } }),
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Product.countDocuments({ createdAt: { $lte: endOfLastMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      User.countDocuments({ createdAt: { $lte: endOfLastMonth } }),
      Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ])
    ]);

    // Calculate revenue
    const currentRevenue = totalRevenueResult[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;

    // Calculate changes
    const salesChange = calculatePercentageChange(totalProducts, lastMonthProducts);
    const ordersChange = calculatePercentageChange(totalOrders, lastMonthOrders);
    const usersChange = calculatePercentageChange(totalUsers, lastMonthUsers);
    const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);

    res.json({
      totalSales: totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: currentRevenue,
      salesChange,
      ordersChange,
      usersChange,
      revenueChange
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/activities
// @desc    Get recent activities
// @access  Private/Admin
router.get('/activities', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Get recent orders and user signups
    const [recentOrders, recentUsers] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name email')
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email createdAt')
        .lean()
    ]);

    // Format activities
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        message: `New order #${order.orderNumber} received`,
        time: order.createdAt
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        message: `New user registered: ${user.email}`,
        time: user.createdAt
      }))
    ];

    // Sort by time and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, limit)
      .map(activity => ({
        ...activity,
        time: formatTimeAgo(activity.time)
      }));

    res.json(sortedActivities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
}

module.exports = router;
