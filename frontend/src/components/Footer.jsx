import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Ensure styles are defined

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 Srikumaran Motors. All rights reserved.</p>
        <ul className="footer-links">
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
