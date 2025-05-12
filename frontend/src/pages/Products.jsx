import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/products.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // Fetch all products
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    if (isLoggedIn) {
      // Fetch user's favorites
      axios.get('/api/favourites', authHeader)
        .then(res => setFavorites(res.data.favorites))
        .catch(err => console.error(err));

      // Fetch user's cart
      axios.get('/api/cart', authHeader)
        .then(res => {
          setCartItems(res.data.cart);
          const initialQuantities = {};
          res.data.cart.forEach(item => {
            initialQuantities[item.product] = item.quantity;
          });
          setQuantities(initialQuantities);
        })
        .catch(err => console.error(err));
    }
  }, [isLoggedIn]);

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product === productId);
    return item ? item.quantity : 0;
  };

  const toggleFavorite = (productId) => {
    if (!isLoggedIn) {
      alert("Please log in to manage favorites.");
      return navigate('/login');
    }

    const isFav = favorites.includes(productId);
    const request = isFav
      ? axios.delete(`/api/favourites/${productId}`, authHeader)
      : axios.post('/api/favourites', { productId }, authHeader);

    request
      .then(() => {
        setFavorites((prev) =>
          isFav ? prev.filter(id => id !== productId) : [...prev, productId]
        );
      })
      .catch(err => console.error("Favorite toggle error:", err));
  };

  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      alert("Please log in to add to cart.");
      return navigate('/login');
    }

    const quantity = quantities[productId] || 1;

    axios.post('/api/cart', { productId, quantity }, authHeader)
      .then(() => {
        const isExisting = isInCart(productId);
        if (!isExisting) {
          setCartItems(prev => [...prev, { product: productId, quantity }]);
        } else {
          // update quantity
          setCartItems(prev =>
            prev.map(item =>
              item.product === productId ? { ...item, quantity } : item
            )
          );
        }
        alert(isExisting ? "Cart updated!" : "Added to cart!");
      })
      .catch(err => console.error("Add/update cart error:", err));
  };

  const handleQtyChange = (productId, e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantities(prev => ({ ...prev, [productId]: value }));
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => {
        const isFav = favorites.includes(product._id);
        const isCarted = isInCart(product._id);
        const currentQty = quantities[product._id] || 1;
        const cartQty = getCartItemQuantity(product._id);
        const isQtyChanged = currentQty !== cartQty;

        return (
          <div className="product-card" key={product._id}>
            <div className="image-wrapper">
              <img src={product.image} alt={product.name} />
              <div
                className="fav-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product._id);
                }}
              >
                {isFav ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
              </div>
            </div>

            <h3>{product.name}</h3>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p style={{ color: product.stockQuantity > 0 ? 'green' : 'red' }}>
              {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <p>{product.description.slice(0, 60)}...</p>

            <p><strong>Quantity:</strong></p>
            <input
              type="number"
              min="1"
              value={currentQty}
              onChange={(e) => handleQtyChange(product._id, e)}
            />

            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={product.stockQuantity === 0}
            >
              {isCarted
                ? (isQtyChanged ? 'Update Cart' : 'Added to Cart')
                : 'Add to Cart'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
