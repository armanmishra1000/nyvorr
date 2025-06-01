// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  product_name: String,
  email: String,
  telegram: String,
  amount: Number,
  status: { type: String, default: "Pending" },
  payment_id: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);