// backend/products.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const IMAGES_DIR = path.join(__dirname, '../public/images');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// ==== IMAGE UPLOAD API ====
// POST /api/products/upload-image
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: `/images/${req.file.filename}` });
});

// --- Helpers: Safe read/write ---
function readProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}
function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// --- GET all products ---
router.get('/', (req, res) => {
  res.json(readProducts());
});

// --- ADD new product ---
router.post('/', (req, res) => {
  const products = readProducts();
  const { name, status, image, description, variations } = req.body;
  const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id, name, status, image, description, variations: variations || [] };
  products.push(newProduct);
  writeProducts(products);
  res.json({ success: true, product: newProduct });
});

// --- DELETE by id ---
router.delete('/:id', (req, res) => {
  let products = readProducts();
  const id = Number(req.params.id);
  if (!products.some(p => p.id === id))
    return res.status(404).json({ error: "Product not found" });
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  res.json({ success: true });
});

// --- EDIT/UPDATE by id ---
router.put('/:id', (req, res) => {
  let products = readProducts();
  const id = Number(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1)
    return res.status(404).json({ error: "Product not found" });

  products[idx] = { ...products[idx], ...req.body, id };
  writeProducts(products);
  res.json({ success: true, product: products[idx] });
});

module.exports = router;