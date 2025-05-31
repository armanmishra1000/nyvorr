const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./products'));
app.use('/api', require('./order'));
app.use('/api/products', require('./products'));
app.use('/api/order', require('./order'));

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
