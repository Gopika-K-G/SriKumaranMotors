const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add/update cart item
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existing = user.cart.find(item => item.productId.toString() === productId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ FIXED: Delete cart item
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
