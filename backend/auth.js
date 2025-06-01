// backend/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Signup route (register)
router.post('/signup', async (req, res) => {
  const { username, email, password, telegram } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Username, email and password required." });

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ error: "User already exists." });

    const hash = await bcrypt.hash(password, 10);
    user = await User.create({
      username,
      email,
      password: hash,
      telegram,
      isAdmin: false // never allow user to set isAdmin
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        telegram: user.telegram,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed." });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        telegram: user.telegram,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// Get current user info with token
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// === AdminPanel Users List ===
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// === Update user profile (telegram/email) ===
router.put('/profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const update = {};
    if (req.body.telegram !== undefined) update.telegram = req.body.telegram;
    if (req.body.email !== undefined) update.email = req.body.email;
    // Do NOT allow updating isAdmin or password here!
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: update },
      { new: true, select: "-password" }
    );
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: "Profile update failed." });
  }
});

// === Change user password ===
router.put('/change-password', async (req, res) => {
  const auth = req.headers.authorization;
  const { oldPassword, newPassword } = req.body;
  if (!auth) return res.status(401).json({ error: "No token" });
  if (!oldPassword || !newPassword) return res.status(400).json({ error: "Both passwords required." });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: "Old password is incorrect." });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Password change failed." });
  }
});

module.exports = router;