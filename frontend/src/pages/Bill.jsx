import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const BillPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  
  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch cart items
    axios.get('/api/cart', authHeader)
      .then(res => setCartItems(res.data.cart))
      .catch(err => console.error('Error fetching cart:', err));

    // Fetch user details
    axios.get('/api/auth/user', authHeader)
      .then(res => setUser(res.data))
      .catch(err => console.error('Error fetching user:', err));
  }, []);

  const calculateTotals = (items) => {
    const subtotal = items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    const tax = subtotal * 0.18; // Assuming 18% GST
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals(cartItems);

  const handleConfirmOrder = () => {
    // Proceed to payment page with the total amount
    navigate('/payment', { state: { grandTotal: total.toFixed(2), orderItems: cartItems } });

  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', paddingTop: '100px' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        {/* Header Section */}
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', color: '#333' }}>Order Summary</h1>

        {/* Product Details */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Products</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>#</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Product</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.productId.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{item.productId.price}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{item.productId.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ textAlign: 'right', fontSize: '14px' }}>
          <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          <p><strong>Tax (18%):</strong> ₹{tax.toFixed(2)}</p>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center', // Center the buttons horizontally
          alignItems: 'center', // Center the buttons vertically
          marginTop: '20px', // Add some space from the content above
          marginBottom: '20px' // Optional: add space at the bottom
        }}>
          {/* Confirm Order Button */}
          <button
            onClick={handleConfirmOrder}
            style={{
              padding: '12px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
