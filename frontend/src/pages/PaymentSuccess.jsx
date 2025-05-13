// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import '../styles//PaymentSuccess.css';
import BASE_URL from '../api';

export default function PaymentSuccess() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const { paymentId } = location.state || {};
  const receiptRef = useRef();

  useEffect(() => {
    if (paymentId) {
      axios.get(`${BASE_URL}/api/orders/${paymentId}`)
        .then(res => {
          setOrderDetails(res.data);
          return axios.get(`${BASE_URL}/api/users/${res.data.userId}`);
        })
        .then(res => setUserDetails(res.data))
        .catch(err => console.error('Error:', err));
    }
  }, [paymentId]);

  const formatDate = dateStr =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const handleDownload = () => {
    html2pdf().from(receiptRef.current).save('receipt.pdf');
  };

  if (!orderDetails || !userDetails) {
    return <p className="loading">Loading...</p>;
  }

  const productTotal = orderDetails.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gstAmount = +(productTotal * 0.18).toFixed(2);

  return (
    <div className="ps-container">
      <div ref={receiptRef} className="ps-card">
        <div className="ps-header">
          <h1 className="ps-company">Sri Kumaran Motors</h1>
          <h2 className="ps-title">Payment Successful</h2>
          <p className="ps-subtitle">Thank you for your purchase</p>
        </div>

        <div className="ps-section">
          <div className="ps-grid">
            <div>
              <h3 className="ps-issued">Issued To:</h3>
              <p>{userDetails.firstName + ' ' + userDetails.lastName}</p>
              <p>{userDetails.email}</p>
              <p>{userDetails.phone}</p>
            </div>
            <div className="ps-meta">
              <p><strong>Order ID:</strong> {orderDetails._id}</p>
              <p><strong>Payment ID:</strong> {orderDetails.paymentId}</p>
              <p><strong>Date:</strong> {formatDate(orderDetails.date)}</p>
            </div>
          </div>
        </div>

        <div className="ps-table-container">
          <table className="ps-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="right">Unit Price</th>
                <th className="right">Qty</th>
                <th className="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td className="right">₹{item.price}</td>
                  <td className="right">{item.quantity}</td>
                  <td className="right">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ps-totals">
          <p><strong>Product Total:</strong> ₹{productTotal.toFixed(2)}</p>
          <p><strong>GST (18%):</strong> ₹{gstAmount}</p>
          <p><strong>Grand Total:</strong> ₹{orderDetails.totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> <span className="green">{orderDetails.status}</span></p>
        </div>
      </div>

      <button onClick={handleDownload} className="ps-button">
        Download Receipt
      </button>
    </div>
  );
}
