const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middlewares/auth');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/byIds', auth, async (req, res) => {
  try {
    const { ids } = req.body; // array of product IDs
    const products = await Product.find({ _id: { $in: ids } });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;
