// routes/admin.js
const express = require('express');
const router  = express.Router();
const verifyAdmin = require('../middlewares/adminMiddleware');
const User    = require('../models/User');
const Order   = require('../models/Order');
const Product = require('../models/Product');

// Protect all /api/admin routes
router.use(verifyAdmin);

// 0. Admin landing
router.get('/dashboard', async (req, res) => {
  const productCount = await Product.countDocuments();
  res.json({ message: 'Welcome, Admin', productCount });
});

router.get('/users', async (req, res) => {
  const users = await User.find({}, '-password'); // exclude password
  res.json(users);
});

// ✅ DELETE user by ID (admin only - already protected by verifyAdmin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PROMOTE user to admin (already protected by verifyAdmin)
router.put('/users/promote/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1. Users per month (group by createdAt)
router.get('/stats/users', async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year:  { $year:  '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        month: '$ _id.month',  // typo in your code; we’ll fix next line
        year:  '$_id.year',
        count: 1,
        _id:   0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ];

  // fix the typo:
  pipeline[1].$project.month = '$_id.month';

  const data = await User.aggregate(pipeline);
  res.json(data.map(d => ({
    month: `${d.month}/${d.year}`,
    count: d.count
  })));
});

// 2. Orders per month (`date` field)
router.get('/stats/orders', async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year:  { $year:  '$date' }
        },
        orders: { $sum: 1 }
      }
    },
    {
      $project: {
        month:  '$_id.month',
        year:   '$_id.year',
        orders: 1,
        _id:    0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ];
  const data = await Order.aggregate(pipeline);
  res.json(data.map(d => ({
    month:  `${d.month}/${d.year}`,
    orders: d.orders
  })));
});

// 3. Products per category
router.get('/stats/products/categories', async (req, res) => {
  const data = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  res.json(data.map(d => ({
    category: d._id,
    count:    d.count
  })));
});

// 4. Stock levels (all products)
router.get('/stats/products/stock', async (req, res) => {
  const prods = await Product.find({}, 'name stockQuantity').lean();
  res.json(prods.map(p => ({
    name: p.name,
    stockQuantity: p.stockQuantity
  })));
});

module.exports = router;
