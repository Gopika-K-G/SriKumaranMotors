// server/controllers/stripeController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body; // Amount in rupees

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paisa
      currency: 'inr',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createPaymentIntent };
