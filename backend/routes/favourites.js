const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Get user favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const favoritesAsStrings = user.favorites.map(fav => fav.toString());
    res.json({ favorites: favoritesAsStrings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from favorites
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
