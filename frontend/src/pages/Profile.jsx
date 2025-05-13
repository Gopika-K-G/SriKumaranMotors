import React, { useState, useEffect } from 'react';
import Timeline from '../components/Timeline';
import axios from 'axios';
import '../styles/Profile.css';
import BASE_URL from '../api';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch user details
    axios.get(`${BASE_URL}/api/auth/me`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    // Fetch user orders
    axios.get(`${BASE_URL}/api/orders?userId=${localStorage.getItem('userId')}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const currentOrder = orders.find(o => !o.tracking.delivered);
  const pastOrders   = orders.filter(o => o.tracking.delivered);

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <button
          className={activeTab === 'personal' ? 'active' : ''}
          onClick={() => setActiveTab('personal')}
        >
          Personal Details
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </aside>

      <main className="content">
        {activeTab === 'personal' && user && (
          <div className="personal-details">
            <h2>Personal Details</h2>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Current Order Tracking</h2>
            {currentOrder ? (
              <Timeline tracking={currentOrder.tracking} />
            ) : (
              <p>No active orders.</p>
            )}

            <h2>Past Orders</h2>
            <ul className="past-orders">
              {pastOrders.map(o => (
                <li key={o._id}>
                  Order #{o._id} — Delivered on {new Date(o.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
