const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const COUPONS_FILE = path.join(__dirname, 'coupons.json');

// Helpers
function readCoupons() {
  try {
    const data = fs.readFileSync(COUPONS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}
function writeCoupons(coupons) {
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

// List all coupons
router.get('/', (req, res) => {
  res.json(readCoupons());
});

// Add a new coupon
router.post('/', (req, res) => {
  const { code, discountType, discountValue, maxUses, productIds } = req.body;
  if (!code || !discountType || !discountValue) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const coupons = readCoupons();
  coupons.push({
    id: Date.now(),
    code,
    discountType, // "flat" or "percent"
    discountValue, // Number (eg. 5 or 10)
    maxUses: maxUses || null, // null = unlimited
    used: 0,
    productIds: productIds || [], // [] = all products
  });
  writeCoupons(coupons);
  res.json({ success: true });
});

// Delete coupon
router.delete('/:id', (req, res) => {
  let coupons = readCoupons();
  const id = Number(req.params.id);
  coupons = coupons.filter(c => c.id !== id);
  writeCoupons(coupons);
  res.json({ success: true });
});

// Validate and apply coupon
router.post('/validate', (req, res) => {
  const { code, productId } = req.body;
  const coupons = readCoupons();
  const coupon = coupons.find(c =>
    c.code === code &&
    (!c.productIds.length || c.productIds.includes(productId))
  );
  if (!coupon) return res.json({ ok: false, error: "Invalid coupon" });
  if (coupon.maxUses && coupon.used >= coupon.maxUses)
    return res.json({ ok: false, error: "Coupon expired" });
  res.json({ ok: true, coupon });
});

// (Optional) Mark coupon as used (call this after successful order)
router.post('/use', (req, res) => {
  const { code } = req.body;
  const coupons = readCoupons();
  const idx = coupons.findIndex(c => c.code === code);
  if (idx === -1) return res.json({ success: false });
  coupons[idx].used = (coupons[idx].used || 0) + 1;
  writeCoupons(coupons);
  res.json({ success: true });
});

module.exports = router;