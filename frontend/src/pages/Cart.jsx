import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css'; // Create your CSS file accordingly
import BASE_URL from '../api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/api/cart`, authHeader)
      .then(res => {
        setCartItems(res.data.cart);
        const initialQuantities = {};
        res.data.cart.forEach(item => {
          initialQuantities[item.productId._id] = item.quantity;
        });
        setQuantities(initialQuantities);
      })
      .catch(err => console.error(err));
  }, []);

  const handleQtyChange = (productId, e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantities(prev => ({ ...prev, [productId]: value }));
    }
  };

  const updateQuantity = (productId) => {
    const quantity = quantities[productId];
    axios.post(`${BASE_URL}/api/cart`, { productId, quantity }, authHeader)
      .then(() => alert('Cart updated!'))
      .catch(err => console.error('Update error:', err));
  };

  const removeFromCart = (productId) => {
    axios.delete(`${BASE_URL}/api/cart/${productId}`, authHeader)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.productId._id !== productId));
        const newQuantities = { ...quantities };
        delete newQuantities[productId];
        setQuantities(newQuantities);
      })
      .catch(err => console.error('Remove error:', err));
  };

  const handleCheckout = () => {
    navigate('/bill');
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div className="cart-card" key={item.productId._id}>
              <img src={item.productId.image} alt={item.productId.name} />
              <div className="cart-details">
                <h4>{item.productId.name}</h4>
                <p>Price: ₹{item.productId.price}</p>
                <input
                  type="number"
                  value={quantities[item.productId._id] || 1}
                  onChange={(e) => handleQtyChange(item.productId._id, e)}
                  min="1"
                />
                <button onClick={() => updateQuantity(item.productId._id)}>Update</button>
                <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
