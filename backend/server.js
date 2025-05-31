const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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

// ====== (Your old routes; don't remove) ======
app.use('/api', require('./products'));
app.use('/api', require('./order'));
app.use('/api/products', require('./products'));
app.use('/api/order', require('./order'));

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));