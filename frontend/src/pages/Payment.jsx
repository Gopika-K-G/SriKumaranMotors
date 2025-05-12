import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import QRCode from 'react-qr-code';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { grandTotal, orderItems } = location.state;  // Assuming orderItems is passed from the previous page
  console.log('OrderItems in PaymentPage:', orderItems);

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [user, setUser] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [upiTransactionCompleted, setUpiTransactionCompleted] = useState(false);

  const userId = localStorage.getItem('userId');
  console.log("userId being used:", userId);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      axios.get(`/api/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, [userId]);

  // Create payment intent
  useEffect(() => {
    if (grandTotal) {
      axios.post('/api/payment/create-payment-intent', { amount: grandTotal })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error('Stripe Payment Intent Error:', err));
    }
  }, [grandTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !clientSecret) return;

    const billing_details = {
      name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
      email: user?.email || 'guest@example.com',
      phone: user?.phone || '',
    };

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details,
      },
    });

    if (error) {
      console.error('Card Payment error:', error);
      alert(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Card Payment successful:', paymentIntent);
      await storeOrderDetails(paymentIntent.id);  // Call to store order details
      // Passing paymentId to PaymentSuccess page
      navigate('/payment-success', { state: { paymentId: paymentIntent.id } });
    }
  };

  const handleUPIPayment = () => {
    // Show QR code when UPI option is selected
    setShowQR(true);
  };

  const handleMarkAsPaid = async () => {
    // Simulate the payment being marked as complete with a mock UPI transaction ID
    const mockTransactionId = `upi-transaction-${Date.now()}`;
    setUpiTransactionCompleted(true);
    await storeOrderDetails(mockTransactionId);  // Store the mock transaction ID
    navigate('/payment-success', { state: { paymentId: mockTransactionId } });  // Passing the mock payment ID
  };

  // Function to store order details in the database
  const storeOrderDetails = async (paymentId) => {
    try {
      const simplifiedOrderItems = orderItems.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      }));

      const orderData = {
        userId: userId,
        totalAmount: grandTotal,
        orderItems: simplifiedOrderItems,  // ✅ Fixed structure
        paymentId: paymentId,
        status: 'paid',
        date: new Date(),
      };

      await axios.post('/api/orders/create', orderData);
    } catch (error) {
      console.error('Error storing order details:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', paddingTop: '100px' }}>
      <div style={{
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment Details</h2>
        <h3>Total Amount: ₹{grandTotal}</h3>

        <div style={{ margin: '20px 0' }}>
          <button
            onClick={handleUPIPayment}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Pay via UPI
          </button>
        </div>

        {/* Show UPI QR Code when UPI option is selected */}
        {showQR && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <QRCode value={`upi://pay?pa=merchant@upi&pn=Merchant%20Name&mc=123456&tid=mock-transaction-id-12345`} />
            </div>
            <button
              onClick={handleMarkAsPaid}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Mark as Paid
            </button>
          </div>
        )}

        {/* Form for card payment */}
        {!showQR && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <CardElement options={CARD_OPTIONS} />
            <button
              type="submit"
              disabled={!stripe}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Pay ₹{grandTotal}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
