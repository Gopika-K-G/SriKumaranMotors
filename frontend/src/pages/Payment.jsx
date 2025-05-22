import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { grandTotal, orderItems } = location.state;

  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`${BASE_URL}/api/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, [userId]);

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
        orderItems: simplifiedOrderItems,
        paymentId: paymentId,
        status: 'paid',
        date: new Date(),
      };

      await axios.post(`${BASE_URL}/api/orders/create`, orderData);
    } catch (error) {
      console.error('Error storing order details:', error);
    }
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // Create order on server
      const razorpayOrder = await axios.post(`${BASE_URL}/api/payment/create-razorpay-order`, {
        amount: grandTotal,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay public key
        amount: razorpayOrder.data.amount,
        currency: 'INR',
        name: 'Sri Kumaran Motors',
        description: 'Product Purchase',
        order_id: razorpayOrder.data.id,
        handler: async (response) => {
          const paymentId = response.razorpay_payment_id;
          await storeOrderDetails(paymentId);
          navigate('/payment-success', { state: { paymentId } });
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
          email: user?.email || 'guest@example.com',
          contact: user?.phone || '',
        },
        theme: {
          color: '#28a745',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error in Razorpay payment:", err);
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

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={handleRazorpayPayment}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
