import React from "react";

// Sample product data
const products = [
  { id: 1, name: "Yoga Mat", price: "$20", description: "Comfortable and non-slip yoga mat." },
  { id: 2, name: "Dumbbells (Set of 2)", price: "$35", description: "Adjustable weight dumbbells." },
  { id: 3, name: "Fitness Tracker Watch", price: "$50", description: "Tracks your steps, heart rate, and calories." },
  { id: 4, name: "Resistance Bands", price: "$15", description: "Set of 5 bands with different resistance levels." },
];

const Products = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Our Products</h1>
      <div style={styles.productList}>
        {products.map((product) => (
          <div key={product.id} style={styles.productCard}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p style={styles.price}>{product.price}</p>
            <button style={styles.button}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  productList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  productCard: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  price: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#007bff",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default Products;
