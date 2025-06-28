const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose'); 

// ==== MongoDB connection (add this block) ====
mongoose.connect(
  process.env.MONGODB_URI,
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  }
)
.then(() => console.log("MongoDB connected!"))
.catch(err => console.error("MongoDB connection error:", err));
// ==== END ====

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// ===== Orders Status Endpoint =====
app.get('/api/order-status/:order_id', (req, res) => {
  const orderId = req.params.order_id;
  try {
    const ordersFile = path.join(__dirname, 'orders.json');
    if (!fs.existsSync(ordersFile)) return res.json({ status: "Unknown" });

    const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    const order = orders.find(o => o.order_id === orderId);
    if (!order) return res.json({ status: "Unknown" });
    return res.json({ status: order.status });
  } catch (err) {
    return res.status(500).json({ status: "Error" });
  }
});

// Import routes
const products = require('./products');
const order = require('./order');
const auth = require('./auth');
const coupons = require('./coupons');
const admin = require('./admin');

// Use routes
app.use('/api/products', products);
app.use('/api/order', order);
app.use('/api/auth', auth);
app.use('/api/coupons', coupons);
app.use('/api/admin', admin);

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));