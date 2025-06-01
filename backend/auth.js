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

// (Optional) Get current user info with token
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

module.exports = router;