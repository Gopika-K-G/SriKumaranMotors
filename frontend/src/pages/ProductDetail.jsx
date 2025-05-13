import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error loading product:', err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <p>Stock: {product.stockQuantity}</p>
      <p>{product.description}</p>
      <p>Rating: {product.rating} ⭐</p>
    </div>
  );
};

export default ProductDetail;
