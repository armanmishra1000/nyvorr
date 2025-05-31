const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Helper: read/write
function readProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// GET all products
router.get('/', (req, res) => {
  res.json(readProducts());
});

// ADD new product (now with description support)
router.post('/', (req, res) => {
  const products = readProducts();
  const { name, price, status, image, description } = req.body;
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id, name, price, status, image, description: description || "" };
  products.push(newProduct);
  writeProducts(products);
  res.json({ success: true, product: newProduct });
});

// DELETE by id
router.delete('/:id', (req, res) => {
  let products = readProducts();
  const id = Number(req.params.id);
  if (!products.some(p => p.id === id))
    return res.status(404).json({ error: "Product not found" });
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  res.json({ success: true });
});

module.exports = router;
