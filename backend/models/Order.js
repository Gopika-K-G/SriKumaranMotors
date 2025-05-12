const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderItems: [{
    name: String,
    quantity: Number,
    price: Number,
  }],
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tracking: {
    confirmed: { type: Boolean, default: false },
    packed:    { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
  }
},{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
