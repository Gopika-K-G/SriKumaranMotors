import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Favourites.css';

const Favourites = () => {
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        // Step 1: Get favourite product IDs
        const res = await axios.get('/api/favourites', authHeader);
        const favIds = res.data.favorites; // still just array of IDs

        if (favIds.length === 0) {
          setFavouriteProducts([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch full product details (assuming backend has a product API that supports multiple IDs)
        const productsRes = await axios.post('/api/products/byIds', { ids: favIds }, authHeader);
        setFavouriteProducts(productsRes.data.products);
      } catch (err) {
        console.error('Error fetching favourites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const removeFromFavourites = async (productId) => {
    try {
      await axios.delete(`/api/favourites/${productId}`, authHeader);
      setFavouriteProducts(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  return (
    <div className="favourites-container">
      <h2>Your Favourites</h2>
      {loading ? (
        <p>Loading...</p>
      ) : favouriteProducts.length === 0 ? (
        <p>No favourites added yet.</p>
      ) : (
        favouriteProducts.map(item => (
          <div key={item._id} className="favourite-card">
            <img src={item.image} alt={item.name} />
            <div className="favourite-details">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <button onClick={() => removeFromFavourites(item._id)}>Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Favourites;
