// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [userStats, setUserStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [stockStats, setStockStats] = useState([]);

  useEffect(() => {
    // don’t run until we have a token
      console.log("Token:", token); // 👈 Add this

    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

   // 1️⃣ User growth (users per month)
    axios.get('/api/admin/stats/users', { headers })
      .then(res => {
        console.log('User stats:', res.data);  // ✅ now it will print
        setUserStats(res.data);
      })
      .catch(console.error);

    // 2️⃣ Monthly sales (orders per month)
    axios.get('/api/admin/stats/orders', { headers })
      .then(res => {
        console.log('Order stats:', res.data);  // ✅ now it will print
        setOrderStats(res.data);
      })
      .catch(console.error);

    // 3️⃣ Category distribution (number of products per category)
    axios.get('/api/admin/stats/products/categories', { headers })
      .then(res => setCategoryStats(res.data))
      .catch(console.error);

    // 4️⃣ Stock levels (products low / out of stock)
    axios.get('/api/admin/stats/products/stock', { headers })
      .then(res => setStockStats(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
        {/* User Growth LineChart */}
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h3>User Growth (Monthly)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales BarChart */}
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h3>Sales This Year (Monthly Orders)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution PieChart */}
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h3>Product Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {categoryStats.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels BarChart */}
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h3>Stock Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stockQuantity" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
