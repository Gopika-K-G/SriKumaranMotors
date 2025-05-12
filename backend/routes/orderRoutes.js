const express = require('express');
const Order = require('../models/Order'); // Assuming you're using MongoDB with Mongoose
const router = express.Router();

// Route to create a new order
router.post('/create', async (req, res) => {
  const { userId, totalAmount, orderItems, paymentId, status, date } = req.body;

  try {
    const newOrder = new Order({
      userId,
      totalAmount,
      orderItems,
      paymentId,
      status,
      date
    });

    await newOrder.save();
    res.status(201).send('Order successfully saved');
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send('Error saving order');
  }
});

// Route to fetch an order by paymentId
router.get('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    const order = await Order.findOne({ paymentId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error retrieving order' });
  }
});

module.exports = router;
