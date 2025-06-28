// backend/order.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const Order = require('./models/Order');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY;
const CRYPTOMUS_MERCHANT_UUID = process.env.CRYPTOMUS_MERCHANT_UUID;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// -- Cryptomus sign
function createSign(body, apiKey) {
  const bodyStr = JSON.stringify(body);
  const base64Body = Buffer.from(bodyStr).toString('base64');
  const md5 = crypto.createHash('md5');
  md5.update(base64Body + apiKey);
  return md5.digest('hex');
}

// -- Create payment & store order in MongoDB
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency, order_id, email, telegram, product_name, url_return } = req.body;
    const cryptomusBody = {
      amount,
      currency,
      order_id,
      url_return: url_return || "http://localhost:5173/payment-success",
      url_callback: "http://localhost:4000/api/payment-webhook",
      to_email: email,
      comment: `Order for ${product_name} | Telegram: ${telegram}`,
    };
    const sign = createSign(cryptomusBody, CRYPTOMUS_API_KEY);

    const response = await axios.post(
      'https://api.cryptomus.com/v1/payment',
      cryptomusBody,
      {
        headers: {
          merchant: CRYPTOMUS_MERCHANT_UUID,
          sign: sign,
          'Content-Type': 'application/json',
        },
      }
    );

    // Get user ID from auth token if available
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log('Invalid token, proceeding without user ID');
      }
    }

    // Save order in MongoDB
    const orderData = {
      order_id,
      product_name,
      email,
      telegram,
      amount,
      status: "Pending",
      payment_id: response.data.result.payment_id || "",
    };

    // Add user reference if available
    if (userId) {
      orderData.user = userId;
    }

    await Order.create(orderData);

    res.json({ pay_url: response.data.result.url });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// -- Payment webhook: update status in MongoDB
router.post('/payment-webhook', async (req, res) => {
  const { order_id, status } = req.body;
  console.log('Webhook received:', req.body);
  try {
    let newStatus = "Pending";
    if (status === "paid" || status === "completed") newStatus = "Paid";
    if (status === "cancel" || status === "fail" || status === "error") newStatus = "Failed";
    await Order.findOneAndUpdate(
      { order_id },
      { status: newStatus },
      { new: true }
    );
    console.log(`Order ${order_id} status updated to: ${newStatus}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update order in MongoDB:", err.message || err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// -- Order status check endpoint
router.get('/order-status/:order_id', async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.order_id });
    if (!order) return res.json({ status: "Unknown" });
    res.json({ status: order.status });
  } catch (err) {
    res.status(500).json({ status: "Error" });
  }
});

// --- List all orders (admin) ---
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'email name') // Populate user details
      .lean();
      
    // Format the response to match the frontend expectations
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.order_id,
      status: order.status,
      total: order.amount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user ? {
        email: order.user.email,
        name: order.user.name
      } : { email: order.email || 'N/A' },
      // Include the original fields for backward compatibility
      ...order
    }));
    
    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// --- "My Orders" endpoint for logged in users ---
router.get('/my-orders', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);

    // Use user ID from token to find email
    let user;
    if (decoded.id) {
      const User = require('./models/User');
      user = await User.findById(decoded.id);
    }
    if (!user) return res.status(401).json({ error: "User not found" });

    const orders = await Order.find({ email: user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;