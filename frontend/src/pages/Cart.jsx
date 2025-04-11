import React, { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Yoga Mat", price: 20, quantity: 1 },
    { id: 2, name: "Dumbbells", price: 35, quantity: 1 },
  ]);

  // Function to calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
          <h2 style={styles.total}>Total: ${getTotalPrice()}</h2>
          <button style={styles.checkoutButton}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  cartItem: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  total: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "20px",
  },
  checkoutButton: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Cart;
